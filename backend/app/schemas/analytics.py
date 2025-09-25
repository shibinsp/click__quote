from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from datetime import datetime

class AnalyticsOverview(BaseModel):
    total_quotations: int
    total_revenue: float
    conversion_rate: float
    avg_quote_value: float
    trends: Dict[str, str]

class ConversionData(BaseModel):
    month: str
    submitted: int
    accepted: int
    conversion: float

class RevenueData(BaseModel):
    month: str
    revenue: float
    target: float

class GeographicalData(BaseModel):
    location: str
    quotations: int
    revenue: float
    conversion_rate: float

class ReportBase(BaseModel):
    name: str
    type: str  # Summary, Geographical, Template Analysis, Performance
    format: Optional[str] = "PDF"
    filters: Optional[Dict[str, Any]] = None

class ReportCreate(ReportBase):
    pass

class ReportUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    format: Optional[str] = None
    status: Optional[str] = None
    file_path: Optional[str] = None
    filters: Optional[Dict[str, Any]] = None

class ReportInDBBase(ReportBase):
    id: int
    status: str
    file_path: Optional[str] = None
    generated_by: int
    created_at: datetime

    class Config:
        from_attributes = True

class Report(ReportInDBBase):
    pass

class ReportWithDetails(Report):
    generated_by_user: Optional[Dict[str, Any]] = None

class AnalyticsFilter(BaseModel):
    date_range: Optional[str] = "30days"  # 7days, 30days, 90days, 1year
    zipcode: Optional[str] = "all"
    status: Optional[str] = "all"
    template: Optional[str] = "all"
    user_id: Optional[int] = None

class DashboardMetrics(BaseModel):
    total_quotations: Dict[str, Any]
    submitted_quotations: Dict[str, Any]
    total_revenue: Dict[str, Any]
    recent_quotations: List[Dict[str, Any]]
    activities: List[Dict[str, Any]]