from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from datetime import datetime

class QuotationItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    quantity: int
    unit_price: float
    total: float

class QuotationItemCreate(QuotationItemBase):
    pass

class QuotationItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    quantity: Optional[int] = None
    unit_price: Optional[float] = None
    total: Optional[float] = None

class QuotationItem(QuotationItemBase):
    id: int
    quotation_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class QuotationBase(BaseModel):
    description: str
    customer_name: str
    customer_email: str
    customer_phone: Optional[str] = None
    sold_to_party: Optional[str] = None
    site_address: Optional[str] = None
    external_reference: Optional[str] = None
    status: Optional[str] = "draft"
    template_type: Optional[str] = "standard"
    total_amount: Optional[float] = 0.0
    quotation_valid_from: Optional[datetime] = None
    quotation_valid_to: Optional[datetime] = None
    location_data: Optional[Dict[str, Any]] = None

class QuotationCreate(QuotationBase):
    template_id: Optional[int] = None
    items: List[QuotationItemCreate] = []

class QuotationUpdate(BaseModel):
    description: Optional[str] = None
    customer_name: Optional[str] = None
    customer_email: Optional[str] = None
    customer_phone: Optional[str] = None
    sold_to_party: Optional[str] = None
    site_address: Optional[str] = None
    external_reference: Optional[str] = None
    status: Optional[str] = None
    template_id: Optional[int] = None
    template_type: Optional[str] = None
    total_amount: Optional[float] = None
    quotation_valid_from: Optional[datetime] = None
    quotation_valid_to: Optional[datetime] = None
    location_data: Optional[Dict[str, Any]] = None

class QuotationInDBBase(QuotationBase):
    id: int
    service_order_quotation_id: str
    template_id: Optional[int] = None
    created_by: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Quotation(QuotationInDBBase):
    items: List[QuotationItem] = []

class QuotationWithDetails(Quotation):
    created_by_user: Optional[Dict[str, Any]] = None
    template: Optional[Dict[str, Any]] = None

class QuotationFilter(BaseModel):
    status: Optional[str] = None
    template_type: Optional[str] = None
    user: Optional[str] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    search: Optional[str] = None
    sort_by: Optional[str] = "created_at"
    sort_order: Optional[str] = "desc"
    limit: Optional[int] = 50
    offset: Optional[int] = 0