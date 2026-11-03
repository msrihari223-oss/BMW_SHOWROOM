from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime

class ColorOption(BaseModel):
    name: str
    hex: str
    price: int = 0
    image: Optional[str] = None

class WheelOption(BaseModel):
    name: str
    size: str
    price: int = 0

class InteriorOption(BaseModel):
    name: str
    material: str
    color: str
    hex: str
    price: int = 0

class CarSpecs(BaseModel):
    engine: str
    horsepower: int
    torque: str
    acceleration_0_100: float  # seconds
    top_speed_kmh: int
    transmission: str
    drivetrain: str
    fuel_type: str  # Petrol, Hybrid, Electric
    electric_range_km: Optional[int] = None
    fuel_economy: Optional[str] = None
    cargo_capacity: Optional[str] = None

class Car(BaseModel):
    id: str
    name: str
    tagline: str
    series: str  # e.g., "M Series", "BMW i", "X Series", "7 Series"
    category: str  # "Sedan", "Coupe", "SUV", "Electric", "M-Performance"
    year: int = 2025
    starting_price: int  # USD
    specs: CarSpecs
    description: str
    hero_image: str
    gallery: List[str] = []
    colors: List[ColorOption] = []
    wheels: List[WheelOption] = []
    interiors: List[InteriorOption] = []
    featured: bool = False
    badge: Optional[str] = None

class CarCreate(BaseModel):
    model_config = ConfigDict(extra="allow")

    id: Optional[str] = None
    name: str = Field(..., min_length=2)
    tagline: Optional[str] = "The Ultimate Driving Machine."
    series: str = Field(default="M Series", description="e.g. M Series, BMW i, X Series, Coupes")
    category: str = Field(default="M-Performance", description="e.g. M-Performance, Electric, SUV, Coupe, Sedan")
    year: int = 2025
    starting_price: int = Field(..., gt=0)
    specs: Optional[Dict[str, Any]] = None
    description: Optional[str] = None
    hero_image: str
    gallery: List[str] = []
    colors: List[Dict[str, Any]] = []
    wheels: List[Dict[str, Any]] = []
    interiors: List[Dict[str, Any]] = []
    featured: bool = False
    badge: Optional[str] = None

class CarUpdate(BaseModel):
    model_config = ConfigDict(extra="allow")

    name: Optional[str] = None
    tagline: Optional[str] = None
    series: Optional[str] = None
    category: Optional[str] = None
    year: Optional[int] = None
    starting_price: Optional[int] = None
    specs: Optional[Dict[str, Any]] = None
    description: Optional[str] = None
    hero_image: Optional[str] = None
    gallery: Optional[List[str]] = None
    colors: Optional[List[Dict[str, Any]]] = None
    wheels: Optional[List[Dict[str, Any]]] = None
    interiors: Optional[List[Dict[str, Any]]] = None
    featured: Optional[bool] = None
    badge: Optional[str] = None

class TestDriveBookingCreate(BaseModel):
    model_config = ConfigDict(extra="allow")

    # Customer Personal Details
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=7, max_length=25)
    customer_city: Optional[str] = None
    customer_address: Optional[str] = None
    customer_country: Optional[str] = "United States"
    has_valid_license: Optional[bool] = True

    # Vehicle Information
    car_id: str
    car_name: str
    car_series: Optional[str] = None
    car_category: Optional[str] = None
    car_image: Optional[str] = None
    base_price: Optional[int] = None
    total_price: Optional[int] = None

    # Configured Specifications (Color, Wheels, Interior)
    selected_color: Optional[Dict[str, Any]] = None
    selected_wheel: Optional[Dict[str, Any]] = None
    selected_interior: Optional[Dict[str, Any]] = None
    car_specs: Optional[Dict[str, Any]] = None

    # Appointment Details
    preferred_date: str
    preferred_time: str
    dealership: str
    dealership_address: Optional[str] = None
    dealership_phone: Optional[str] = None
    experience_type: Optional[str] = "Standard Road Test"

    # Financing / Payment Preference
    financing_preference: Optional[str] = "Undecided / Discussion with Specialist"
    down_payment: Optional[int] = None
    estimated_monthly_payment: Optional[int] = None

    # Special requests / notes
    notes: Optional[str] = None

class TestDriveBooking(TestDriveBookingCreate):
    id: str
    status: str = "Confirmed"
    created_at: str

class BookingStatusUpdate(BaseModel):
    status: str

class InquiryCreate(BaseModel):
    model_config = ConfigDict(extra="allow")
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str
    car_id: Optional[str] = None
    car_name: Optional[str] = None
    financing_plan: Optional[str] = None
    estimated_monthly: Optional[int] = None

class Inquiry(InquiryCreate):
    id: str
    created_at: str

class LoanApplicationCreate(BaseModel):
    model_config = ConfigDict(extra="allow")

    # Applicant Details
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=7, max_length=25)
    city: Optional[str] = None
    annual_income: Optional[str] = "$100,000 - $150,000"
    credit_score_tier: Optional[str] = "Excellent (740+)"
    employment_status: Optional[str] = "Employed / Business Owner"

    # Vehicle Information
    car_id: str
    car_name: str
    vehicle_price: int

    # Loan Financial Terms
    plan_type: str = "BMW Select Loan"  # "BMW Select Loan" or "BMW Executive Lease"
    down_payment: int
    down_payment_percent: int
    term_months: int
    interest_rate_apr: float
    estimated_monthly_payment: int
    total_financed_principal: int
    total_estimated_interest: int
    total_cost: int

    notes: Optional[str] = None

class LoanApplication(LoanApplicationCreate):
    id: str
    status: str = "Pre-Approved"
    created_at: str

class LoanStatusUpdate(BaseModel):
    status: str

class ShowroomVisitCreate(BaseModel):
    model_config = ConfigDict(extra="allow")

    # Guest Profile
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=7, max_length=25)
    city: Optional[str] = None
    num_guests: Optional[int] = 1

    # Dealership & Schedule
    dealership_id: Optional[str] = None
    dealership_name: str
    dealership_address: Optional[str] = None
    dealership_phone: Optional[str] = None
    visit_type: str = "Private VIP Showroom Tour"
    preferred_date: str
    preferred_time: str
    vehicle_interest: Optional[str] = "BMW M & Electric Fleet"
    special_requests: Optional[str] = None
    booking_type: str = "Showroom Visit"

class ShowroomVisit(ShowroomVisitCreate):
    id: str
    status: str = "Confirmed"
    created_at: str

class Dealership(BaseModel):
    id: str
    name: str
    address: str
    city: str
    phone: str
    email: str
    hours: str
    image: str
