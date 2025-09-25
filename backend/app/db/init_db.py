from sqlalchemy.orm import Session
from app.db import models
from app.core.security import get_password_hash


def init_db(db: Session) -> None:
    """
    Initialize database with sample data
    """
    # Create admin user if not exists
    admin_user = db.query(models.User).filter(models.User.email == "admin@clickquote.com").first()
    if not admin_user:
        admin_user = models.User(
            name="Admin User",
            email="admin@clickquote.com",
            hashed_password=get_password_hash("admin123"),
            role="admin"
        )
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
    
    # Create sample user if not exists
    sample_user = db.query(models.User).filter(models.User.email == "user@clickquote.com").first()
    if not sample_user:
        sample_user = models.User(
            name="Sample User",
            email="user@clickquote.com",
            hashed_password=get_password_hash("user123"),
            role="user"
        )
        db.add(sample_user)
        db.commit()
        db.refresh(sample_user)
    
    # Create sample templates if not exists
    if db.query(models.Template).count() == 0:
        # Basic Service Template
        service_template = models.Template(
            name="Basic Service Quote",
            description="Template for basic service quotations",
            type="service",
            category="general",
            created_by=admin_user.id,
            fields=[
                {
                    "name": "Service Description",
                    "field_type": "textarea",
                    "is_required": True
                },
                {
                    "name": "Hours Required",
                    "field_type": "number",
                    "is_required": True
                },
                {
                    "name": "Hourly Rate",
                    "field_type": "number",
                    "is_required": True
                }
            ]
        )
        db.add(service_template)
        db.commit()
        db.refresh(service_template)
        
        # Product Template
        product_template = models.Template(
            name="Product Quote",
            description="Template for product quotations",
            type="product",
            category="general",
            created_by=admin_user.id,
            fields=[
                {
                    "name": "Product Name",
                    "field_type": "text",
                    "is_required": True
                },
                {
                    "name": "Quantity",
                    "field_type": "number",
                    "is_required": True
                },
                {
                    "name": "Unit Price",
                    "field_type": "number",
                    "is_required": True
                }
            ]
        )
        db.add(product_template)
        db.commit()
        db.refresh(product_template)
        
        db.commit()
    
    # Create sample quotations if not exists
    if db.query(models.Quotation).count() == 0:
        sample_quotations = [
            {
                "service_order_quotation_id": "SOQ-001",
                "description": "Website development project",
                "customer_name": "John Doe",
                "customer_email": "john@example.com",
                "customer_phone": "+1234567890",
                "site_address": "123 Main St, City, State 12345",
                "template_id": service_template.id,
                "total_amount": 1500.00,
                "status": "approved",
                "created_by": sample_user.id
            },
            {
                "service_order_quotation_id": "SOQ-002",
                "description": "Mobile app development",
                "customer_name": "Jane Smith",
                "customer_email": "jane@example.com",
                "customer_phone": "+1234567891",
                "site_address": "456 Oak Ave, City, State 12345",
                "template_id": product_template.id,
                "total_amount": 2500.00,
                "status": "pending",
                "created_by": sample_user.id
            },
            {
                "service_order_quotation_id": "SOQ-003",
                "description": "Logo design project",
                "customer_name": "Bob Johnson",
                "customer_email": "bob@example.com",
                "customer_phone": "+1234567892",
                "site_address": "789 Pine St, City, State 12345",
                "template_id": service_template.id,
                "total_amount": 800.00,
                "status": "draft",
                "created_by": sample_user.id
            }
        ]
        
        for quotation_data in sample_quotations:
            quotation = models.Quotation(**quotation_data)
            db.add(quotation)
        
        db.commit()
        
        # Add sample quotation items
        sample_items = [
            # Items for first quotation
            {
                "name": "Frontend Development",
                "description": "Frontend Development",
                "quantity": 40,
                "unit_price": 25.00,
                "total": 1000.00,
                "quotation_id": 1
            },
            {
                "name": "Backend Development",
                "description": "Backend Development",
                "quantity": 20,
                "unit_price": 25.00,
                "total": 500.00,
                "quotation_id": 1
            },
            # Items for second quotation
            {
                "name": "Mobile App Development",
                "description": "Mobile App Development",
                "quantity": 100,
                "unit_price": 25.00,
                "total": 2500.00,
                "quotation_id": 2
            },
            # Items for third quotation
            {
                "name": "Logo Design",
                "description": "Logo Design",
                "quantity": 1,
                "unit_price": 800.00,
                "total": 800.00,
                "quotation_id": 3
            }
        ]
        
        for item_data in sample_items:
            item = models.QuotationItem(**item_data)
            db.add(item)
        
        db.commit()
    
    print("Database initialized successfully!")