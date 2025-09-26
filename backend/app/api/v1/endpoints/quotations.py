from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_

from app.db.database import get_db
from app.db import models
from app.schemas import quotation as quotation_schemas
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()


@router.get("/", response_model=List[quotation_schemas.Quotation])
def read_quotations(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = Query(None),
    customer_name: Optional[str] = Query(None),
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
    current_user: models.User = Depends(get_current_user),
) -> Any:
    """
    Retrieve quotations with optional filtering
    """
    query = db.query(models.Quotation)
    
    # Filter by user if not admin
    if current_user.role != "admin":
        query = query.filter(models.Quotation.created_by == current_user.id)
    
    # Apply filters
    if status:
        query = query.filter(models.Quotation.status == status)
    if customer_name:
        query = query.filter(models.Quotation.customer_name.ilike(f"%{customer_name}%"))
    if date_from:
        query = query.filter(models.Quotation.created_at >= date_from)
    if date_to:
        query = query.filter(models.Quotation.created_at <= date_to)
    
    quotations = query.offset(skip).limit(limit).all()
    return quotations


@router.get("/public", response_model=List[quotation_schemas.Quotation])
def read_quotations_public(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve all quotations without authentication (for map view)
    """
    quotations = db.query(models.Quotation).offset(skip).limit(limit).all()
    return quotations


@router.post("/", response_model=quotation_schemas.Quotation)
def create_quotation(
    *,
    db: Session = Depends(get_db),
    quotation_in: quotation_schemas.QuotationCreate,
    current_user: models.User = Depends(get_current_user),
) -> Any:
    """
    Create new quotation
    """
    quotation = models.Quotation(
        **quotation_in.dict(exclude={"items"}),
        created_by=current_user.id
    )
    db.add(quotation)
    db.commit()
    db.refresh(quotation)
    
    # Add quotation items
    if quotation_in.items:
        for item_data in quotation_in.items:
            item = models.QuotationItem(
                **item_data.dict(),
                quotation_id=quotation.id
            )
            db.add(item)
        db.commit()
        db.refresh(quotation)
    
    return quotation


@router.get("/{quotation_id}", response_model=quotation_schemas.QuotationWithDetails)
def read_quotation(
    *,
    db: Session = Depends(get_db),
    quotation_id: int,
    current_user: models.User = Depends(get_current_user),
) -> Any:
    """
    Get quotation by ID
    """
    quotation = db.query(models.Quotation).filter(models.Quotation.id == quotation_id).first()
    if not quotation:
        raise HTTPException(status_code=404, detail="Quotation not found")
    
    # Check permissions
    if current_user.role != "admin" and quotation.created_by != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions"
        )
    
    return quotation


@router.put("/{quotation_id}", response_model=quotation_schemas.Quotation)
def update_quotation(
    *,
    db: Session = Depends(get_db),
    quotation_id: int,
    quotation_in: quotation_schemas.QuotationUpdate,
    current_user: models.User = Depends(get_current_user),
) -> Any:
    """
    Update a quotation
    """
    quotation = db.query(models.Quotation).filter(models.Quotation.id == quotation_id).first()
    if not quotation:
        raise HTTPException(status_code=404, detail="Quotation not found")
    
    # Check permissions
    if current_user.role != "admin" and quotation.created_by != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions"
        )
    
    update_data = quotation_in.dict(exclude_unset=True, exclude={"items"})
    for field, value in update_data.items():
        setattr(quotation, field, value)
    
    # Update items if provided
    if quotation_in.items is not None:
        # Delete existing items
        db.query(models.QuotationItem).filter(
            models.QuotationItem.quotation_id == quotation_id
        ).delete()
        
        # Add new items
        for item_data in quotation_in.items:
            item = models.QuotationItem(
                **item_data.dict(),
                quotation_id=quotation.id
            )
            db.add(item)
    
    db.add(quotation)
    db.commit()
    db.refresh(quotation)
    return quotation


@router.delete("/{quotation_id}")
def delete_quotation(
    *,
    db: Session = Depends(get_db),
    quotation_id: int,
    current_user: models.User = Depends(get_current_user),
) -> Any:
    """
    Delete a quotation
    """
    quotation = db.query(models.Quotation).filter(models.Quotation.id == quotation_id).first()
    if not quotation:
        raise HTTPException(status_code=404, detail="Quotation not found")
    
    # Check permissions
    if current_user.role != "admin" and quotation.created_by != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions"
        )
    
    db.delete(quotation)
    db.commit()
    return {"message": "Quotation deleted successfully"}


@router.post("/{quotation_id}/duplicate", response_model=quotation_schemas.Quotation)
def duplicate_quotation(
    *,
    db: Session = Depends(get_db),
    quotation_id: int,
    current_user: models.User = Depends(get_current_user),
) -> Any:
    """
    Duplicate a quotation
    """
    original = db.query(models.Quotation).filter(models.Quotation.id == quotation_id).first()
    if not original:
        raise HTTPException(status_code=404, detail="Quotation not found")
    
    # Check permissions
    if current_user.role != "admin" and original.created_by != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions"
        )
    
    # Create duplicate
    quotation_data = {
        "customer_name": original.customer_name,
        "customer_email": original.customer_email,
        "customer_phone": original.customer_phone,
        "customer_address": original.customer_address,
        "template_id": original.template_id,
        "total_amount": original.total_amount,
        "status": "draft",
        "notes": original.notes,
        "created_by": current_user.id
    }
    
    new_quotation = models.Quotation(**quotation_data)
    db.add(new_quotation)
    db.commit()
    db.refresh(new_quotation)
    
    # Duplicate items
    for item in original.items:
        new_item = models.QuotationItem(
            description=item.description,
            quantity=item.quantity,
            unit_price=item.unit_price,
            total_price=item.total_price,
            quotation_id=new_quotation.id
        )
        db.add(new_item)
    
    db.commit()
    db.refresh(new_quotation)
    return new_quotation


@router.get("/stats/overview")
def get_quotation_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
) -> Any:
    """
    Get quotation statistics overview
    """
    query = db.query(models.Quotation)
    
    # Filter by user if not admin
    if current_user.role != "admin":
        query = query.filter(models.Quotation.created_by == current_user.id)
    
    total_quotations = query.count()
    pending_quotations = query.filter(models.Quotation.status == "pending").count()
    approved_quotations = query.filter(models.Quotation.status == "approved").count()
    rejected_quotations = query.filter(models.Quotation.status == "rejected").count()
    
    # Calculate Total Quotation Value from approved quotations
    total_revenue = db.query(models.Quotation.total_amount).filter(
        and_(
            models.Quotation.status == "approved",
            models.Quotation.created_by == current_user.id if current_user.role != "admin" else True
        )
    ).all()
    
    total_revenue_amount = sum([amount[0] or 0 for amount in total_revenue])
    
    return {
        "total_quotations": total_quotations,
        "pending_quotations": pending_quotations,
        "approved_quotations": approved_quotations,
        "rejected_quotations": rejected_quotations,
        "total_revenue": total_revenue_amount
    }