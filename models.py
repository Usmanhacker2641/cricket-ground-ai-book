"""
SQLAlchemy ORM Models for Cricket Ground Booking
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class User(Base):
    """User model for authentication and booking ownership"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    password_hash = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship to bookings
    bookings = relationship("Booking", back_populates="user")


class Ground(Base):
    """Cricket ground model with details and pricing"""
    __tablename__ = "grounds"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    location = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    price_per_hour = Column(Float, nullable=False)
    capacity = Column(Integer, default=22)  # Standard cricket team size
    image_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship to bookings
    bookings = relationship("Booking", back_populates="ground")


class Booking(Base):
    """Booking model linking users to grounds with date/time"""
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    ground_id = Column(Integer, ForeignKey("grounds.id"), nullable=False)
    date = Column(String(10), nullable=False)  # Format: YYYY-MM-DD
    time_slot = Column(String(20), nullable=False)  # e.g., "06:00 - 08:00"
    status = Column(String(20), default="confirmed")  # confirmed, cancelled, completed
    total_price = Column(Float, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="bookings")
    ground = relationship("Ground", back_populates="bookings")
