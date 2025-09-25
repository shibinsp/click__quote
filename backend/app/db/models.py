from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(20))
    company = Column(String(100))
    department = Column(String(100))
    job_title = Column(String(100))
    address = Column(String(255))
    city = Column(String(100))
    county = Column(String(100))
    postcode = Column(String(20))
    role = Column(String(50), default="User")  # Admin, User, Manager
    avatar = Column(String(500))
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    join_date = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    quotations = relationship("Quotation", back_populates="created_by_user")
    templates = relationship("Template", back_populates="created_by_user")

class Template(Base):
    __tablename__ = "templates"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    type = Column(String(50), default="custom")  # default, custom
    category = Column(String(100), default="standard")
    usage_count = Column(Integer, default=0)
    fields = Column(JSON)  # Store template fields as JSON
    created_by = Column(Integer, ForeignKey("users.id"))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    created_by_user = relationship("User", back_populates="templates")
    quotations = relationship("Quotation", back_populates="template")

class Quotation(Base):
    __tablename__ = "quotations"
    
    id = Column(Integer, primary_key=True, index=True)
    service_order_quotation_id = Column(String(50), unique=True, index=True)
    description = Column(Text, nullable=False)
    customer_name = Column(String(255), nullable=False)
    customer_email = Column(String(255), nullable=False)
    customer_phone = Column(String(20))
    sold_to_party = Column(String(255))
    site_address = Column(Text)
    external_reference = Column(String(100))
    status = Column(String(50), default="draft")  # draft, submitted, approved, rejected, under_review, accepted
    template_id = Column(Integer, ForeignKey("templates.id"))
    template_type = Column(String(100), default="standard")
    created_by = Column(Integer, ForeignKey("users.id"))
    total_amount = Column(Float, default=0.0)
    quotation_valid_from = Column(DateTime(timezone=True))
    quotation_valid_to = Column(DateTime(timezone=True))
    location_data = Column(JSON)  # Store location coordinates and details
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    template = relationship("Template", back_populates="quotations")
    created_by_user = relationship("User", back_populates="quotations")
    items = relationship("QuotationItem", back_populates="quotation", cascade="all, delete-orphan")
    activities = relationship("ActivityLog", back_populates="quotation")

class QuotationItem(Base):
    __tablename__ = "quotation_items"
    
    id = Column(Integer, primary_key=True, index=True)
    quotation_id = Column(Integer, ForeignKey("quotations.id"))
    name = Column(String(255), nullable=False)
    description = Column(Text)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    total = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    quotation = relationship("Quotation", back_populates="items")

class ActivityLog(Base):
    __tablename__ = "activity_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    quotation_id = Column(Integer, ForeignKey("quotations.id"), nullable=True)
    action = Column(String(100), nullable=False)
    description = Column(Text)
    activity_metadata = Column(JSON)  # Additional data about the activity
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User")
    quotation = relationship("Quotation", back_populates="activities")

class Report(Base):
    __tablename__ = "reports"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    type = Column(String(100), nullable=False)  # Summary, Geographical, Template Analysis, Performance
    format = Column(String(20), default="PDF")  # PDF, CSV, Excel
    status = Column(String(50), default="processing")  # processing, completed, failed
    file_path = Column(String(500))
    generated_by = Column(Integer, ForeignKey("users.id"))
    filters = Column(JSON)  # Store report filters
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    generated_by_user = relationship("User")