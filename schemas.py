"""
Pydantic Schemas for request/response validation
"""
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# ==================== User Schemas ====================

class UserCreate(BaseModel):
    """Schema for user registration"""
    email: EmailStr
    name: str
    password: str
    phone: Optional[str] = None


class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """Schema for user response (excludes password)"""
    id: int
    email: str
    name: str
    phone: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    """JWT Token response"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ==================== Ground Schemas ====================

class GroundBase(BaseModel):
    """Base schema for ground"""
    name: str
    location: str
    description: Optional[str] = None
    price_per_hour: float
    capacity: int = 22
    image_url: Optional[str] = None


class GroundCreate(GroundBase):
    """Schema for creating a ground"""
    pass


class GroundResponse(GroundBase):
    """Schema for ground response"""
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class GroundWithAvailability(GroundResponse):
    """Ground with availability info for a specific date"""
    available_slots: List[str] = []
    booked_slots: List[str] = []


# ==================== Booking Schemas ====================

class BookingCreate(BaseModel):
    """Schema for creating a booking"""
    ground_id: int
    date: str  # Format: YYYY-MM-DD
    time_slot: str
    notes: Optional[str] = None


class BookingResponse(BaseModel):
    """Schema for booking response"""
    id: int
    ground_id: int
    date: str
    time_slot: str
    status: str
    total_price: float
    notes: Optional[str] = None
    created_at: datetime
    ground: GroundResponse
    user: UserResponse

    class Config:
        from_attributes = True


class BookingListResponse(BaseModel):
    """Schema for list of bookings"""
    bookings: List[BookingResponse]
    total: int


# ==================== Availability Schema ====================

class AvailabilityRequest(BaseModel):
    """Schema for checking availability"""
    ground_id: int
    date: str  # Format: YYYY-MM-DD


class AvailabilityResponse(BaseModel):
    """Schema for availability response"""
    ground_id: int
    date: str
    available_slots: List[str]
    booked_slots: List[str]


# ==================== Message Schema ====================

class MessageResponse(BaseModel):
    """Generic message response"""
    message: str
    success: bool = True
