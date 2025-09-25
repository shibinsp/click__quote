from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from datetime import datetime

class TemplateFieldBase(BaseModel):
    label: str
    type: str  # text, number, date, email, etc.
    required: bool = False
    max_length: Optional[int] = None
    data_type: Optional[str] = None
    technical_name: Optional[str] = None
    field_length: Optional[int] = None
    format: Optional[str] = None
    precision: Optional[int] = None

class TemplateField(TemplateFieldBase):
    id: int

class TemplateBase(BaseModel):
    name: str
    description: Optional[str] = None
    type: Optional[str] = "custom"  # default, custom
    category: Optional[str] = "standard"
    fields: List[Dict[str, Any]] = []

class TemplateCreate(TemplateBase):
    pass

class TemplateUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None
    category: Optional[str] = None
    fields: Optional[List[Dict[str, Any]]] = None
    is_active: Optional[bool] = None

class TemplateInDBBase(TemplateBase):
    id: int
    usage_count: int
    created_by: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Template(TemplateInDBBase):
    pass

class TemplateWithDetails(Template):
    created_by_user: Optional[Dict[str, Any]] = None

class TemplateFilter(BaseModel):
    search: Optional[str] = None
    type: Optional[str] = None  # all, default, custom
    category: Optional[str] = None  # all, standard, etc.
    sort_by: Optional[str] = "name"
    is_active: Optional[bool] = True
    limit: Optional[int] = 50
    offset: Optional[int] = 0