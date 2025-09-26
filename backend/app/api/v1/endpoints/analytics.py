from typing import Any, List, Optional
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, extract

from app.db.database import get_db
from app.db import models
from app.schemas import analytics as analytics_schemas
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()


@router.get("/Dashboard", response_model=analytics_schemas.DashboardMetrics)
def get_Dashboard_metrics(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
) -> Any:
    """
    Get Dashboard metrics and overview
    """
    # Base query filter
    base_filter = models.Quotation.user_id == current_user.id if current_user.role != "admin" else True
    
    # Total quotations
    total_quotations = db.query(models.Quotation).filter(base_filter).count()
    
    # Quotations by status
    pending_quotations = db.query(models.Quotation).filter(
        and_(base_filter, models.Quotation.status == "pending")
    ).count()
    
    approved_quotations = db.query(models.Quotation).filter(
        and_(base_filter, models.Quotation.status == "approved")
    ).count()
    
    # Revenue calculations
    total_revenue = db.query(func.sum(models.Quotation.total_amount)).filter(
        and_(base_filter, models.Quotation.status == "approved")
    ).scalar() or 0
    
    # This month's revenue
    current_month = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    monthly_revenue = db.query(func.sum(models.Quotation.total_amount)).filter(
        and_(
            base_filter,
            models.Quotation.status == "approved",
            models.Quotation.created_at >= current_month
        )
    ).scalar() or 0
    
    # Conversion rate
    conversion_rate = (approved_quotations / total_quotations * 100) if total_quotations > 0 else 0
    
    # Recent activity (last 10 quotations)
    recent_quotations = db.query(models.Quotation).filter(base_filter).order_by(
        models.Quotation.created_at.desc()
    ).limit(10).all()
    
    return {
        "total_quotations": total_quotations,
        "pending_quotations": pending_quotations,
        "approved_quotations": approved_quotations,
        "total_revenue": total_revenue,
        "monthly_revenue": monthly_revenue,
        "conversion_rate": round(conversion_rate, 2),
        "recent_activity": [
            {
                "id": q.id,
                "customer_name": q.customer_name,
                "status": q.status,
                "total_amount": q.total_amount,
                "created_at": q.created_at
            }
            for q in recent_quotations
        ]
    }


@router.get("/overview", response_model=analytics_schemas.AnalyticsOverview)
def get_analytics_overview(
    db: Session = Depends(get_db),
    days: int = Query(30, description="Number of days to analyze"),
    current_user: models.User = Depends(get_current_user),
) -> Any:
    """
    Get analytics overview for specified period
    """
    # Date range
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    
    base_filter = and_(
        models.Quotation.created_at >= start_date,
        models.Quotation.created_at <= end_date,
        models.Quotation.user_id == current_user.id if current_user.role != "admin" else True
    )
    
    # Total metrics
    total_quotations = db.query(models.Quotation).filter(base_filter).count()
    total_revenue = db.query(func.sum(models.Quotation.total_amount)).filter(
        and_(base_filter, models.Quotation.status == "approved")
    ).scalar() or 0
    
    # Average quotation value
    avg_quotation_value = db.query(func.avg(models.Quotation.total_amount)).filter(
        base_filter
    ).scalar() or 0
    
    # Status distribution
    status_counts = db.query(
        models.Quotation.status,
        func.count(models.Quotation.id)
    ).filter(base_filter).group_by(models.Quotation.status).all()
    
    status_distribution = {status: count for status, count in status_counts}
    
    return {
        "period_days": days,
        "total_quotations": total_quotations,
        "total_revenue": total_revenue,
        "average_quotation_value": round(avg_quotation_value, 2),
        "status_distribution": status_distribution,
        "start_date": start_date,
        "end_date": end_date
    }


@router.get("/revenue-trend")
def get_revenue_trend(
    db: Session = Depends(get_db),
    days: int = Query(30, description="Number of days to analyze"),
    current_user: models.User = Depends(get_current_user),
) -> Any:
    """
    Get revenue trend data
    """
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    
    base_filter = and_(
        models.Quotation.created_at >= start_date,
        models.Quotation.created_at <= end_date,
        models.Quotation.status == "approved",
        models.Quotation.user_id == current_user.id if current_user.role != "admin" else True
    )
    
    # Daily revenue
    daily_revenue = db.query(
        func.date(models.Quotation.created_at).label('date'),
        func.sum(models.Quotation.total_amount).label('revenue')
    ).filter(base_filter).group_by(
        func.date(models.Quotation.created_at)
    ).order_by('date').all()
    
    return {
        "revenue_data": [
            {
                "date": str(date),
                "revenue": float(revenue or 0)
            }
            for date, revenue in daily_revenue
        ]
    }


@router.get("/conversion-funnel")
def get_conversion_funnel(
    db: Session = Depends(get_db),
    days: int = Query(30, description="Number of days to analyze"),
    current_user: models.User = Depends(get_current_user),
) -> Any:
    """
    Get conversion funnel data
    """
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    
    base_filter = and_(
        models.Quotation.created_at >= start_date,
        models.Quotation.created_at <= end_date,
        models.Quotation.user_id == current_user.id if current_user.role != "admin" else True
    )
    
    # Count by status
    status_counts = db.query(
        models.Quotation.status,
        func.count(models.Quotation.id)
    ).filter(base_filter).group_by(models.Quotation.status).all()
    
    status_dict = {status: count for status, count in status_counts}
    
    total = sum(status_dict.values())
    draft = status_dict.get("draft", 0)
    pending = status_dict.get("pending", 0)
    approved = status_dict.get("approved", 0)
    rejected = status_dict.get("rejected", 0)
    
    return {
        "funnel_data": [
            {"stage": "Created", "count": total, "percentage": 100},
            {"stage": "Draft", "count": draft, "percentage": round(draft/total*100, 2) if total > 0 else 0},
            {"stage": "Pending", "count": pending, "percentage": round(pending/total*100, 2) if total > 0 else 0},
            {"stage": "Approved", "count": approved, "percentage": round(approved/total*100, 2) if total > 0 else 0},
            {"stage": "Rejected", "count": rejected, "percentage": round(rejected/total*100, 2) if total > 0 else 0},
        ]
    }


@router.get("/reports", response_model=List[analytics_schemas.Report])
def get_reports(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    report_type: Optional[str] = Query(None),
    current_user: models.User = Depends(get_current_user),
) -> Any:
    """
    Get user reports
    """
    query = db.query(models.Report)
    
    # Filter by user if not admin
    if current_user.role != "admin":
        query = query.filter(models.Report.user_id == current_user.id)
    
    if report_type:
        query = query.filter(models.Report.report_type == report_type)
    
    reports = query.order_by(models.Report.created_at.desc()).offset(skip).limit(limit).all()
    return reports


@router.post("/reports", response_model=analytics_schemas.Report)
def create_report(
    *,
    db: Session = Depends(get_db),
    report_in: analytics_schemas.ReportCreate,
    current_user: models.User = Depends(get_current_user),
) -> Any:
    """
    Create a new report
    """
    report = models.Report(
        **report_in.dict(),
        user_id=current_user.id
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


@router.get("/reports/{report_id}", response_model=analytics_schemas.ReportWithDetails)
def get_report(
    *,
    db: Session = Depends(get_db),
    report_id: int,
    current_user: models.User = Depends(get_current_user),
) -> Any:
    """
    Get report by ID
    """
    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    # Check permissions
    if current_user.role != "admin" and report.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions"
        )
    
    return report


@router.delete("/reports/{report_id}")
def delete_report(
    *,
    db: Session = Depends(get_db),
    report_id: int,
    current_user: models.User = Depends(get_current_user),
) -> Any:
    """
    Delete a report
    """
    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    # Check permissions
    if current_user.role != "admin" and report.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions"
        )
    
    db.delete(report)
    db.commit()
    return {"message": "Report deleted successfully"}