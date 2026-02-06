"""
Grounds Router - List and manage cricket grounds
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models import Ground, Booking
from schemas import GroundResponse, GroundWithAvailability, AvailabilityRequest, AvailabilityResponse
from config import TIME_SLOTS

router = APIRouter(prefix="/grounds", tags=["Grounds"])


@router.get("", response_model=List[GroundResponse])
async def get_all_grounds(
    active_only: bool = Query(True, description="Only return active grounds"),
    db: Session = Depends(get_db)
):
    """
    Get all available cricket grounds
    
    - Returns list of all grounds
    - Can filter to show only active grounds
    """
    query = db.query(Ground)
    
    if active_only:
        query = query.filter(Ground.is_active == True)
    
    grounds = query.all()
    return [GroundResponse.model_validate(g) for g in grounds]


@router.get("/{ground_id}", response_model=GroundResponse)
async def get_ground_by_id(ground_id: int, db: Session = Depends(get_db)):
    """
    Get a specific ground by ID
    """
    ground = db.query(Ground).filter(Ground.id == ground_id).first()
    
    if not ground:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ground not found"
        )
    
    return GroundResponse.model_validate(ground)


@router.get("/{ground_id}/availability", response_model=AvailabilityResponse)
async def check_ground_availability(
    ground_id: int,
    date: str = Query(..., description="Date in YYYY-MM-DD format"),
    db: Session = Depends(get_db)
):
    """
    Check availability of a ground for a specific date
    
    - Returns available and booked time slots
    - Used for real-time availability check in booking UI
    """
    # Verify ground exists
    ground = db.query(Ground).filter(Ground.id == ground_id).first()
    if not ground:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ground not found"
        )
    
    # Get all confirmed bookings for this ground on this date
    booked = db.query(Booking).filter(
        Booking.ground_id == ground_id,
        Booking.date == date,
        Booking.status == "confirmed"
    ).all()
    
    booked_slots = [b.time_slot for b in booked]
    available_slots = [slot for slot in TIME_SLOTS if slot not in booked_slots]
    
    return AvailabilityResponse(
        ground_id=ground_id,
        date=date,
        available_slots=available_slots,
        booked_slots=booked_slots
    )


@router.get("/with-availability/{date}", response_model=List[GroundWithAvailability])
async def get_grounds_with_availability(
    date: str,
    db: Session = Depends(get_db)
):
    """
    Get all grounds with their availability for a specific date
    
    - Useful for showing available slots on each ground
    """
    grounds = db.query(Ground).filter(Ground.is_active == True).all()
    result = []
    
    for ground in grounds:
        # Get booked slots for this ground on this date
        booked = db.query(Booking).filter(
            Booking.ground_id == ground.id,
            Booking.date == date,
            Booking.status == "confirmed"
        ).all()
        
        booked_slots = [b.time_slot for b in booked]
        available_slots = [slot for slot in TIME_SLOTS if slot not in booked_slots]
        
        ground_data = GroundWithAvailability(
            id=ground.id,
            name=ground.name,
            location=ground.location,
            description=ground.description,
            price_per_hour=ground.price_per_hour,
            capacity=ground.capacity,
            image_url=ground.image_url,
            is_active=ground.is_active,
            created_at=ground.created_at,
            available_slots=available_slots,
            booked_slots=booked_slots
        )
        result.append(ground_data)
    
    return result
