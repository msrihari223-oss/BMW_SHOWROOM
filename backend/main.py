import os
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from database import db_manager
from models import (
    Car,
    CarCreate,
    CarUpdate,
    TestDriveBookingCreate,
    TestDriveBooking,
    BookingStatusUpdate,
    ShowroomVisitCreate,
    ShowroomVisit,
    LoanApplicationCreate,
    LoanApplication,
    LoanStatusUpdate,
    InquiryCreate,
    Inquiry,
    Dealership
)

app = FastAPI(
    title="BMW Luxury Showroom API",
    description="Backend API powering the BMW Showroom Experience, connecting to MongoDB Atlas.",
    version="1.0.0"
)

# Enable CORS for React frontend (Vite default port 5173, 3000, and all localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static frontend mount if built
dist_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend", "dist")
assets_path = os.path.join(dist_path, "assets")
if os.path.exists(assets_path):
    app.mount("/assets", StaticFiles(directory=assets_path), name="assets")

@app.get("/")
def read_root():
    index_file = os.path.join(dist_path, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {
        "brand": "BMW",
        "name": "Bayerische Motoren Werke AG",
        "tagline": "The Ultimate Driving Machine - Sheer Driving Pleasure",
        "api_docs": "/docs",
        "database": db_manager.get_status()
    }

@app.get("/api")
def api_info():
    return {
        "brand": "BMW",
        "name": "Bayerische Motoren Werke AG",
        "tagline": "The Ultimate Driving Machine - Sheer Driving Pleasure",
        "api_docs": "/docs",
        "database": db_manager.get_status()
    }

@app.get("/favicon.svg")
def get_favicon():
    fav = os.path.join(dist_path, "favicon.svg")
    if os.path.exists(fav):
        return FileResponse(fav)
    raise HTTPException(status_code=404)

@app.get("/api/health")
def get_health():
    """Return backend status and MongoDB Atlas connection details."""
    return db_manager.get_status()

@app.get("/api/cars")
def get_cars(
    category: Optional[str] = Query(None, description="Filter by category (e.g. Electric, Coupe, SUV, M-Performance)"),
    series: Optional[str] = Query(None, description="Filter by series (e.g. M Series, BMW i, X Series)"),
    search: Optional[str] = Query(None, description="Search term for model name or description")
):
    """Retrieve all BMW showroom models with optional filtering."""
    cars = db_manager.get_cars(category=category, series=series, search=search)
    return {"count": len(cars), "cars": cars}

@app.get("/api/cars/{car_id}")
def get_car(car_id: str):
    """Retrieve detailed specifications for a specific vehicle by ID."""
    car = db_manager.get_car_by_id(car_id)
    if not car:
        raise HTTPException(status_code=404, detail=f"BMW Model '{car_id}' not found.")
    return car

@app.post("/api/cars", status_code=201)
def add_car(car: CarCreate):
    """Dynamically add a new BMW model into MongoDB collection 'cars'."""
    created = db_manager.create_car(car.model_dump())
    return {
        "success": True,
        "message": f"BMW Model '{created.get('name')}' successfully added dynamically to MongoDB!",
        "car": created
    }

@app.put("/api/cars/{car_id}")
def update_car(car_id: str, car: CarUpdate):
    """Dynamically update an existing BMW model in MongoDB collection 'cars'."""
    updated = db_manager.update_car(car_id, car.model_dump())
    if not updated:
        raise HTTPException(status_code=404, detail=f"BMW Model '{car_id}' not found.")
    return {
        "success": True,
        "message": f"BMW Model '{car_id}' updated successfully!",
        "car": updated
    }

@app.delete("/api/cars/{car_id}")
def delete_car(car_id: str):
    """Dynamically delete a BMW model from MongoDB collection 'cars'."""
    success = db_manager.delete_car(car_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"BMW Model '{car_id}' not found.")
    return {
        "success": True,
        "message": f"BMW Model '{car_id}' deleted from MongoDB collection 'cars'."
    }

@app.post("/api/test-drives", status_code=201)
def book_test_drive(booking: TestDriveBookingCreate):
    """Book a VIP Test Drive session and persist it to MongoDB Atlas."""
    # Verify vehicle exists
    car = db_manager.get_car_by_id(booking.car_id)
    if not car:
        raise HTTPException(status_code=404, detail=f"Selected BMW model '{booking.car_id}' not found.")
    
    created = db_manager.create_test_drive(booking.model_dump())
    return {
        "success": True,
        "message": f"Test drive for {booking.car_name} successfully reserved at {booking.dealership}!",
        "booking": created
    }

@app.get("/api/test-drives")
def list_test_drives():
    """List all scheduled test drives (stored in MongoDB Atlas)."""
    bookings = db_manager.get_test_drives()
    return {"count": len(bookings), "bookings": bookings}

@app.delete("/api/test-drives/{booking_id}")
def delete_test_drive(booking_id: str):
    """Delete a test drive reservation from MongoDB Atlas."""
    success = db_manager.delete_test_drive(booking_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Booking '{booking_id}' not found.")
    return {"success": True, "message": f"Booking '{booking_id}' has been removed from MongoDB."}

@app.patch("/api/test-drives/{booking_id}")
def update_test_drive_status(booking_id: str, status_update: BookingStatusUpdate):
    """Update status of a reservation in MongoDB Atlas."""
    updated = db_manager.update_test_drive_status(booking_id, status_update.status)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Booking '{booking_id}' not found.")
    return {"success": True, "booking": updated}

# --- UNIFIED BOOKINGS & SHOWROOM VISITS (Stored in collection 'bookings' in MongoDB) ---

@app.post("/api/dealership-visits", status_code=201)
def book_showroom_visit(visit: ShowroomVisitCreate):
    """Book a Showroom Visit / VIP Consultation and persist directly to MongoDB collection 'bookings'."""
    created = db_manager.create_showroom_visit(visit.model_dump())
    return {
        "success": True,
        "message": f"Showroom Visit to {visit.dealership_name} successfully recorded in MongoDB collection 'bookings'!",
        "booking": created
    }

@app.get("/api/bookings")
def list_all_bookings():
    """List all reservations (Test Drives + Showroom Visits) stored in MongoDB collection 'bookings'."""
    bookings = db_manager.get_bookings()
    return {"count": len(bookings), "bookings": bookings}

@app.delete("/api/bookings/{booking_id}")
def delete_booking(booking_id: str):
    """Delete a booking from MongoDB collection 'bookings'."""
    db_manager.delete_booking(booking_id)
    return {"success": True, "message": f"Booking '{booking_id}' deleted from MongoDB."}

@app.patch("/api/bookings/{booking_id}")
def update_booking(booking_id: str, status_update: BookingStatusUpdate):
    """Update booking status in MongoDB collection 'bookings'."""
    updated = db_manager.update_booking_status(booking_id, status_update.status)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Booking '{booking_id}' not found.")
    return {"success": True, "booking": updated}

# --- BMW FINANCIAL SERVICES / LOAN APPLICATIONS ---

@app.post("/api/loans", status_code=201)
def submit_loan_application(loan: LoanApplicationCreate):
    """Submit an official BMW financing / loan application and store in MongoDB."""
    created = db_manager.create_loan_application(loan.model_dump())
    return {
        "success": True,
        "message": f"Loan application for {loan.car_name} ({loan.plan_type}) successfully recorded in MongoDB!",
        "application": created
    }

@app.get("/api/loans")
def list_loan_applications():
    """List all BMW financial loan applications stored in MongoDB."""
    applications = db_manager.get_loan_applications()
    return {"count": len(applications), "applications": applications}

@app.delete("/api/loans/{loan_id}")
def delete_loan_application(loan_id: str):
    """Delete a loan application from MongoDB."""
    success = db_manager.delete_loan_application(loan_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Loan application '{loan_id}' not found.")
    return {"success": True, "message": f"Loan application '{loan_id}' deleted from MongoDB."}

@app.patch("/api/loans/{loan_id}")
def update_loan_status(loan_id: str, status_update: LoanStatusUpdate):
    """Update status of a loan application in MongoDB."""
    updated = db_manager.update_loan_application_status(loan_id, status_update.status)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Loan application '{loan_id}' not found.")
    return {"success": True, "application": updated}

@app.post("/api/inquiries", status_code=201)
def submit_inquiry(inquiry: InquiryCreate):
    """Submit a VIP consultation or financing inquiry to MongoDB Atlas."""
    created = db_manager.create_inquiry(inquiry.model_dump())
    return {
        "success": True,
        "message": "Your inquiry has been received by BMW Client Services.",
        "inquiry": created
    }

@app.get("/api/dealerships")
def list_dealerships():
    """List official BMW flagship showroom centers."""
    dealerships = db_manager.get_dealerships()
    return {"count": len(dealerships), "dealerships": dealerships}

@app.post("/api/seed")
def seed_database():
    """Force reseed BMW fleet and dealership collections in MongoDB Atlas."""
    result = db_manager.seed_data()
    return result

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "127.0.0.1")
    uvicorn.run("main:app", host=host, port=port, reload=True)

