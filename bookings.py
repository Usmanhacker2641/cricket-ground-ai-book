"""
Bookings Router - Create bookings and view booking history
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import User, Ground, Booking
from schemas import BookingCreate, BookingResponse, BookingListResponse, MessageResponse
from auth import get_current_user
from config import TIME_SLOTS

router = APIRouter(tags=["Bookings"])


@router.post("/book-ground", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def create_booking(
    booking_data: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new ground booking
    
    - Validates ground exists
    - Validates time slot is valid
    - Prevents double booking (same ground, date, time slot)
    - Calculates total price based on ground's hourly rate
    """
    # Validate ground exists
    ground = db.query(Ground).filter(Ground.id == booking_data.ground_id).first()
    if not ground:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ground not found"
        )
    
    # Validate time slot
    if booking_data.time_slot not in TIME_SLOTS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid time slot. Available slots: {TIME_SLOTS}"
        )
    
    # Check for double booking - CRITICAL: Prevent same ground, date, time slot
    existing_booking = db.query(Booking).filter(
        Booking.ground_id == booking_data.ground_id,
        Booking.date == booking_data.date,
        Booking.time_slot == booking_data.time_slot,
        Booking.status == "confirmed"
    ).first()
    
    if existing_booking:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This time slot is already booked. Please select another slot."
        )
    
    # Calculate total price (2 hours per slot)
    total_price = ground.price_per_hour * 2
    
    # Create booking
    new_booking = Booking(
        user_id=current_user.id,
        ground_id=booking_data.ground_id,
        date=booking_data.date,
        time_slot=booking_data.time_slot,
        total_price=total_price,
        notes=booking_data.notes,
        status="confirmed"
    )
    
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    
    # Load relationships for response
    new_booking.ground = ground
    new_booking.user = current_user
    
    return BookingResponse.model_validate(new_booking)


@router.get("/my-bookings", response_model=BookingListResponse)
async def get_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all bookings for the current authenticated user
    
    - Returns bookings sorted by date (newest first)
    - Includes ground and user details
    """
    bookings = db.query(Booking).filter(
        Booking.user_id == current_user.id
    ).order_by(Booking.date.desc(), Booking.created_at.desc()).all()
    
    return BookingListResponse(
        bookings=[BookingResponse.model_validate(b) for b in bookings],
        total=len(bookings)
    )


@router.get("/bookings/{booking_id}", response_model=BookingResponse)
async def get_booking_by_id(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific booking by ID (must belong to current user)
    """
    booking = db.query(Booking).filter(
        Booking.id == booking_id,
        Booking.user_id == current_user.id
    ).first()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    return BookingResponse.model_validate(booking)


@router.delete("/bookings/{booking_id}", response_model=MessageResponse)
async def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Cancel a booking (set status to cancelled)
    """
    booking = db.query(Booking).filter(
        Booking.id == booking_id,
        Booking.user_id == current_user.id
    ).first()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    if booking.status == "cancelled":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Booking is already cancelled"
        )
    
    booking.status = "cancelled"
    db.commit()
    
    return MessageResponse(message="Booking cancelled successfully")
