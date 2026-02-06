"""
Cricket Ground Booking API - Main Application Entry Point

A FastAPI application for booking cricket grounds with JWT authentication.
Features:
- User signup/login with JWT tokens
- Browse available cricket grounds
- Book grounds with date and time slot selection
- Prevent double bookings
- View booking history
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from models import User, Ground, Booking
from routers import auth, grounds, bookings
from config import ALLOWED_ORIGINS

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Cricket Ground Booking API",
    description="API for booking cricket grounds with authentication",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(grounds.router)
app.include_router(bookings.router)


@app.get("/", tags=["Health"])
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "message": "Cricket Ground Booking API is running",
        "version": "1.0.0"
    }


@app.get("/time-slots", tags=["Config"])
async def get_time_slots():
    """Get available time slots for booking"""
    from config import TIME_SLOTS
    return {"time_slots": TIME_SLOTS}


# Seed initial data on startup
@app.on_event("startup")
async def seed_initial_data():
    """
    Seed the database with initial cricket grounds if empty.
    This runs once when the server starts.
    """
    from database import SessionLocal
    
    db = SessionLocal()
    try:
        # Check if grounds already exist
        existing_grounds = db.query(Ground).count()
        
        if existing_grounds == 0:
            # Sample cricket grounds with Unsplash images
            sample_grounds = [
                Ground(
                    name="Eden Gardens",
                    location="Kolkata, West Bengal",
                    description="Historic cricket ground with world-class facilities. Known for its electrifying atmosphere and iconic matches.",
                    price_per_hour=2500.0,
                    capacity=30,
                    image_url="https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800",
                    is_active=True
                ),
                Ground(
                    name="Wankhede Stadium",
                    location="Mumbai, Maharashtra",
                    description="Premier cricket venue with modern amenities. Perfect for professional and amateur matches.",
                    price_per_hour=3000.0,
                    capacity=25,
                    image_url="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800",
                    is_active=True
                ),
                Ground(
                    name="MA Chidambaram Stadium",
                    location="Chennai, Tamil Nadu",
                    description="Iconic stadium with excellent pitch conditions and great facilities for all skill levels.",
                    price_per_hour=2200.0,
                    capacity=28,
                    image_url="https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=800",
                    is_active=True
                ),
                Ground(
                    name="Green Park Cricket Ground",
                    location="Delhi NCR",
                    description="Well-maintained turf ground with floodlights. Ideal for evening matches and tournaments.",
                    price_per_hour=1800.0,
                    capacity=22,
                    image_url="https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800",
                    is_active=True
                ),
                Ground(
                    name="Royal Cricket Academy",
                    location="Bangalore, Karnataka",
                    description="Professional training ground with coaching facilities. Great for practice sessions.",
                    price_per_hour=1500.0,
                    capacity=20,
                    image_url="https://images.unsplash.com/photo-1593766788306-28561086694e?w=800",
                    is_active=True
                ),
                Ground(
                    name="Champions Arena",
                    location="Hyderabad, Telangana",
                    description="State-of-the-art cricket facility with premium amenities and floodlit evening sessions.",
                    price_per_hour=2800.0,
                    capacity=26,
                    image_url="https://images.unsplash.com/photo-1589801258579-18e091f4ca26?w=800",
                    is_active=True
                ),
                Ground(
                    name="Sunset Cricket Club",
                    location="Pune, Maharashtra",
                    description="Beautiful ground with scenic surroundings. Perfect for weekend cricket with friends.",
                    price_per_hour=1200.0,
                    capacity=22,
                    image_url="https://images.unsplash.com/photo-1594470117722-de4b9a02ebed?w=800",
                    is_active=True
                ),
                Ground(
                    name="Victory Sports Complex",
                    location="Ahmedabad, Gujarat",
                    description="Multi-purpose sports complex with dedicated cricket facilities and equipment rental.",
                    price_per_hour=1600.0,
                    capacity=24,
                    image_url="https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=800",
                    is_active=True
                ),
            ]
            
            for ground in sample_grounds:
                db.add(ground)
            
            db.commit()
            print("✓ Seeded 8 cricket grounds into database")
    finally:
        db.close()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
