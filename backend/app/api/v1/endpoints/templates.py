from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db import models
from app.schemas import template as template_schemas
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()


@router.get("/", response_model=List[template_schemas.Template])
def read_templates(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = Query(None),
    template_type: Optional[str] = Query(None),
    current_user: models.User = Depends(get_current_user),
) -> Any:
    """
    Retrieve templates with optional filtering
    """
    query = db.query(models.Template)
    
    # Filter by user if not admin (only show user's templates and public ones)
    if current_user.role != "admin":
        query = query.filter(
            models.Template.created_by == current_user.id
        )
    
    # Apply filters
    if category:
        query = query.filter(models.Template.category == category)
    if template_type:
        query = query.filter(models.Template.type == template_type)
    
    templates = query.offset(skip).limit(limit).all()
    return templates


@router.post("/", response_model=template_schemas.Template)
def create_template(
    *,
    db: Session = Depends(get_db),
    template_in: template_schemas.TemplateCreate,
    current_user: models.User = Depends(get_current_user),
) -> Any:
    """
    Create new template
    """
    template = models.Template(
        **template_in.dict(exclude={"fields"}),
        created_by=current_user.id
    )
    db.add(template)
    db.commit()
    db.refresh(template)
    
    # Add template fields
    # Note: Template fields are now stored as JSON in the fields column
    # No need to create separate TemplateField records
    
    return template


@router.get("/{template_id}", response_model=template_schemas.TemplateWithDetails)
def read_template(
    *,
    db: Session = Depends(get_db),
    template_id: int,
    current_user: models.User = Depends(get_current_user),
) -> Any:
    """
    Get template by ID
    """
    template = db.query(models.Template).filter(models.Template.id == template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    # Check permissions
    if current_user.role != "admin" and template.created_by != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions"
        )
    
    return template


@router.put("/{template_id}", response_model=template_schemas.Template)
def update_template(
    *,
    db: Session = Depends(get_db),
    template_id: int,
    template_in: template_schemas.TemplateUpdate,
    current_user: models.User = Depends(get_current_user),
) -> Any:
    """
    Update a template
    """
    template = db.query(models.Template).filter(models.Template.id == template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    # Check permissions
    if current_user.role != "admin" and template.created_by != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions"
        )
    
    update_data = template_in.dict(exclude_unset=True, exclude={"fields"})
    for field, value in update_data.items():
        setattr(template, field, value)
    
    # Update fields if provided
    if template_in.fields is not None:
        # Delete existing fields
        db.query(models.TemplateField).filter(
            models.TemplateField.template_id == template_id
        ).delete()
        
        # Add new fields
        for field_data in template_in.fields:
            field = models.TemplateField(
                **field_data.dict(),
                template_id=template.id
            )
            db.add(field)
    
    db.add(template)
    db.commit()
    db.refresh(template)
    return template


@router.delete("/{template_id}")
def delete_template(
    *,
    db: Session = Depends(get_db),
    template_id: int,
    current_user: models.User = Depends(get_current_user),
) -> Any:
    """
    Delete a template
    """
    template = db.query(models.Template).filter(models.Template.id == template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    # Check permissions
    if current_user.role != "admin" and template.created_by != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions"
        )
    
    # Check if template is being used by quotations
    quotations_using_template = db.query(models.Quotation).filter(
        models.Quotation.template_id == template_id
    ).count()
    
    if quotations_using_template > 0:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete template that is being used by quotations"
        )
    
    db.delete(template)
    db.commit()
    return {"message": "Template deleted successfully"}


@router.post("/{template_id}/duplicate", response_model=template_schemas.Template)
def duplicate_template(
    *,
    db: Session = Depends(get_db),
    template_id: int,
    current_user: models.User = Depends(get_current_user),
) -> Any:
    """
    Duplicate a template
    """
    original = db.query(models.Template).filter(models.Template.id == template_id).first()
    if not original:
        raise HTTPException(status_code=404, detail="Template not found")
    
    # Check permissions
    if current_user.role != "admin" and original.created_by != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions"
        )
    
    # Create duplicate
    template_data = {
        "name": f"{original.name} (Copy)",
        "description": original.description,
        "type": original.type,
        "category": original.category,
        "created_by": current_user.id
    }
    
    new_template = models.Template(**template_data)
    db.add(new_template)
    db.commit()
    db.refresh(new_template)
    
    # Duplicate fields
    for field in original.fields:
        new_field = models.TemplateField(
            name=field.name,
            field_type=field.field_type,
            is_required=field.is_required,
            default_value=field.default_value,
            options=field.options,
            validation_rules=field.validation_rules,
            template_id=new_template.id
        )
        db.add(new_field)
    
    db.commit()
    db.refresh(new_template)
    return new_template


@router.get("/categories/list")
def get_template_categories(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
) -> Any:
    """
    Get list of template categories
    """
    query = db.query(models.Template.category).distinct()
    
    # Filter by user if not admin
    if current_user.role != "admin":
        query = query.filter(
            (models.Template.user_id == current_user.id) | 
            (models.Template.is_public == True)
        )
    
    categories = [cat[0] for cat in query.all() if cat[0]]
    return {"categories": categories}


@router.get("/types/list")
def get_template_types(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
) -> Any:
    """
    Get list of template types
    """
    query = db.query(models.Template.type).distinct()
    
    # Filter by user if not admin
    if current_user.role != "admin":
        query = query.filter(
            (models.Template.user_id == current_user.id) | 
            (models.Template.is_public == True)
        )
    
    types = [type_[0] for type_ in query.all() if type_[0]]
    return {"types": types}