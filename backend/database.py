import os
import sys
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from dotenv import load_dotenv
import pymongo
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from seed_data import DEFAULT_CARS, DEFAULT_DEALERSHIPS

# Ensure utf-8 stdout on Windows
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Load environment variables from backend/.env or root .env
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_env = os.path.join(current_dir, ".env")
root_env = os.path.join(os.path.dirname(current_dir), ".env")
load_dotenv(dotenv_path=backend_env)
load_dotenv(dotenv_path=root_env)
load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "").strip()
DATABASE_NAME = os.getenv("DATABASE_NAME", "bmw_showroom").strip()

SAMPLE_TEST_DRIVES = [
    {
        "id": "TD-BMWM8-9842",
        "name": "M Sri Hari Sai Eswar",
        "email": "vu.cse.241fa04677@gmail.com",
        "phone": "+91 6304677919",
        "customer_city": "Visakhapatnam",
        "customer_country": "India",
        "has_valid_license": True,
        "car_id": "bmw-m8-competition-gran-coupe",
        "car_name": "BMW M8 Competition Gran Coupé",
        "car_series": "M Series",
        "car_category": "M-Performance",
        "car_image": "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1600&q=80",
        "base_price": 138800,
        "total_price": 140750,
        "selected_color": {"name": "Frozen Marina Bay Blue", "hex": "#123e7a", "price": 1950},
        "selected_wheel": {"name": "20\" M Star-Spoke Bi-Color Style 813M", "size": "20 inch", "price": 0},
        "selected_interior": {"name": "Sakhir Orange Full Merino Leather", "material": "Full Merino Leather", "color": "Sakhir Orange", "hex": "#9c3321", "price": 0},
        "car_specs": {
            "engine": "4.4-liter BMW M TwinPower Turbo V8",
            "horsepower": 617,
            "torque": "553 lb-ft @ 1,800-5,690 rpm",
            "acceleration_0_100": 3.0,
            "top_speed_kmh": 305,
            "drivetrain": "M xDrive All-Wheel Drive",
            "transmission": "8-speed M Steptronic with Drivelogic",
            "fuel_type": "Petrol"
        },
        "preferred_date": "2026-11-04",
        "preferred_time": "11:30 AM",
        "dealership": "BMW of Manhattan Flagship",
        "dealership_address": "555 W 57th St, New York, NY 10019",
        "dealership_phone": "+1 (212) 586-2269",
        "experience_type": "M Performance Track Experience",
        "financing_preference": "BMW Select Financing",
        "status": "Confirmed",
        "notes": "Interested in track handling, launch control, and carbon ceramic brakes.",
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": "TD-BMWX5-4519",
        "name": "Alexander Vance",
        "email": "alex.vance@executive.com",
        "phone": "+1 (310) 459-8800",
        "customer_city": "Los Angeles, CA",
        "customer_country": "United States",
        "has_valid_license": True,
        "car_id": "bmw-x5-m-competition",
        "car_name": "BMW X5 M Competition",
        "car_series": "X Series",
        "car_category": "SUV",
        "car_image": "https://images.unsplash.com/photo-1602830362211-67fc80844342?auto=format&fit=crop&w=1600&q=80",
        "base_price": 124800,
        "total_price": 125450,
        "selected_color": {"name": "Isle of Man Green Metallic", "hex": "#1b4d3e", "price": 0},
        "selected_wheel": {"name": "21\"/22\" M Light Alloy Black Style 818M", "size": "21F / 22R inch", "price": 650},
        "selected_interior": {"name": "Adelaide Grey / Sakhir Orange Full Merino", "material": "Merino Leather", "color": "Orange / Grey", "hex": "#9c3321", "price": 0},
        "car_specs": {
            "engine": "4.4-liter BMW M TwinPower Turbo V8",
            "horsepower": 617,
            "torque": "553 lb-ft",
            "acceleration_0_100": 3.7,
            "top_speed_kmh": 285,
            "drivetrain": "M xDrive",
            "transmission": "8-speed M Steptronic",
            "fuel_type": "Petrol"
        },
        "preferred_date": "2026-11-06",
        "preferred_time": "02:00 PM",
        "dealership": "BMW Beverly Hills VIP Center",
        "dealership_address": "5070 Wilshire Blvd, Los Angeles, CA 90036",
        "dealership_phone": "+1 (323) 656-9269",
        "experience_type": "Standard Road Test",
        "financing_preference": "BMW Executive Lease",
        "status": "In Progress",
        "notes": "Testing sports differential on canyon roads.",
        "created_at": datetime.utcnow().isoformat()
    }
]

SAMPLE_SHOWROOM_VISITS = [
    {
        "id": "BK-SHOWROOM-101",
        "booking_type": "Showroom Visit",
        "name": "M Sri Hari Sai Eswar",
        "email": "vu.cse.241fa04677@gmail.com",
        "phone": "+91 6304677919",
        "city": "Visakhapatnam",
        "num_guests": 2,
        "dealership_name": "BMW of Manhattan Flagship",
        "dealership_address": "555 W 57th St, New York, NY 10019",
        "dealership_phone": "+1 (212) 586-2269",
        "visit_type": "Private VIP Showroom Tour",
        "preferred_date": "2026-11-05",
        "preferred_time": "10:30 AM",
        "vehicle_interest": "BMW M8 Competition Gran Coupé & XM Label Red",
        "special_requests": "Requesting Product Genius private consultation in M Lounge.",
        "status": "Confirmed",
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": "BK-SHOWROOM-102",
        "booking_type": "Showroom Visit",
        "name": "Elena Rostova",
        "email": "elena.rostova@vip.com",
        "phone": "+44 20 7514 8700",
        "city": "London",
        "num_guests": 1,
        "dealership_name": "BMW Park Lane Mayfair",
        "dealership_address": "70 Park Ln, Mayfair, London W1K 7TT",
        "dealership_phone": "+44 20 7514 8700",
        "visit_type": "Vehicle Handover & Handcrafted Delivery",
        "preferred_date": "2026-11-07",
        "preferred_time": "02:00 PM",
        "vehicle_interest": "BMW i7 xDrive60 All-Electric",
        "special_requests": "Pre-delivery champagne reception.",
        "status": "Confirmed",
        "created_at": datetime.utcnow().isoformat()
    }
]

SAMPLE_LOAN_APPLICATIONS = [
    {
        "id": "LOAN-BMW-8812",
        "name": "M Sri Hari Sai Eswar",
        "email": "vu.cse.241fa04677@gmail.com",
        "phone": "+91 6304677919",
        "city": "Visakhapatnam",
        "annual_income": "$150,000+",
        "credit_score_tier": "Excellent (750+)",
        "employment_status": "Executive / Business Owner",
        "car_id": "bmw-m8-competition-gran-coupe",
        "car_name": "BMW M8 Competition Gran Coupé",
        "vehicle_price": 138800,
        "plan_type": "BMW Select Loan",
        "down_payment": 27760,
        "down_payment_percent": 20,
        "term_months": 60,
        "interest_rate_apr": 4.99,
        "estimated_monthly_payment": 2098,
        "total_financed_principal": 111040,
        "total_estimated_interest": 14840,
        "total_cost": 153640,
        "status": "Pre-Approved",
        "notes": "Fast-track VIP pre-approval with BMW Financial Services.",
        "created_at": datetime.utcnow().isoformat()
    }
]

class DatabaseManager:
    def __init__(self):
        self.client: Optional[pymongo.MongoClient] = None
        self.db = None
        self.is_connected = False
        self.connection_error = None
        
        # Local in-memory fallback stores
        self._local_cars: List[Dict[str, Any]] = [dict(c) for c in DEFAULT_CARS]
        self._local_test_drives: List[Dict[str, Any]] = [dict(t) for t in SAMPLE_TEST_DRIVES]
        self._local_bookings: List[Dict[str, Any]] = [dict(t) for t in SAMPLE_TEST_DRIVES] + [dict(s) for s in SAMPLE_SHOWROOM_VISITS]
        self._local_loan_applications: List[Dict[str, Any]] = [dict(l) for l in SAMPLE_LOAN_APPLICATIONS]
        self._local_inquiries: List[Dict[str, Any]] = []
        self._local_dealerships: List[Dict[str, Any]] = [dict(d) for d in DEFAULT_DEALERSHIPS]
        
        self.init_connection()

    def init_connection(self):
        if not MONGODB_URI:
            self.is_connected = False
            self.connection_error = "MONGODB_URI is not set in backend/.env"
            print("[Database] NOTICE: MONGODB_URI not configured. Running in Fallback Local Mode.")
            return

        try:
            # Connect with short timeout
            self.client = pymongo.MongoClient(MONGODB_URI, serverSelectionTimeoutMS=4000)
            self.client.admin.command('ping')
            self.db = self.client[DATABASE_NAME]
            self.is_connected = True
            self.connection_error = None
            target_label = "MongoDB Atlas (Cloud)" if ("mongodb.net" in MONGODB_URI or "mongodb+srv" in MONGODB_URI) else "Local MongoDB (localhost:27017)"
            print(f"[Database] SUCCESS: Connected to {target_label} database: {DATABASE_NAME}")
            
            # Auto-seed all collections
            self._auto_seed()
        except (ConnectionFailure, ServerSelectionTimeoutError, Exception) as e:
            self.is_connected = False
            self.connection_error = str(e)
            print(f"[Database] WARNING: Could not connect to MongoDB: {e}")
            print("[Database] Falling back to Local In-Memory Mode.")

    def _auto_seed(self):
        if not self.is_connected or self.db is None:
            return
        try:
            # 1. Cars
            cars_count = self.db.cars.count_documents({})
            if cars_count == 0:
                print("[Database] Seeding cars into MongoDB...")
                self.db.cars.insert_many([dict(c) for c in DEFAULT_CARS])
                print(f"[Database] Seeded {len(DEFAULT_CARS)} BMW models.")

            # 2. Dealerships
            dealers_count = self.db.dealerships.count_documents({})
            if dealers_count == 0:
                print("[Database] Seeding dealerships into MongoDB...")
                self.db.dealerships.insert_many([dict(d) for d in DEFAULT_DEALERSHIPS])
                print(f"[Database] Seeded {len(DEFAULT_DEALERSHIPS)} Dealerships.")

            # 3. Bookings Collection (Stores ALL reservations, test drives & showroom visits!)
            bookings_count = self.db.bookings.count_documents({})
            if bookings_count == 0:
                print("[Database] Initializing 'bookings' collection in MongoDB...")
                all_initial = [dict(t) for t in SAMPLE_TEST_DRIVES] + [dict(s) for s in SAMPLE_SHOWROOM_VISITS]
                self.db.bookings.insert_many(all_initial)
                print(f"[Database] Initialized 'bookings' collection with {len(all_initial)} records.")

            # 4. Test Drives Collection (Ensure it exists in Atlas UI immediately!)
            td_count = self.db.test_drives.count_documents({})
            if td_count == 0:
                print("[Database] Initializing 'test_drives' collection in MongoDB...")
                self.db.test_drives.insert_many([dict(t) for t in SAMPLE_TEST_DRIVES])
                print(f"[Database] Initialized 'test_drives' collection with {len(SAMPLE_TEST_DRIVES)} reservations.")

            # 4. Loan & Finance Applications Collection (Ensure it exists in Atlas UI!)
            loan_count = self.db.loan_applications.count_documents({})
            if loan_count == 0:
                print("[Database] Initializing 'loan_applications' collection in MongoDB...")
                self.db.loan_applications.insert_many([dict(l) for l in SAMPLE_LOAN_APPLICATIONS])
                print(f"[Database] Initialized 'loan_applications' collection with {len(SAMPLE_LOAN_APPLICATIONS)} applications.")

            # 5. Inquiries Collection (Ensure it exists in Atlas UI immediately!)
            inq_count = self.db.inquiries.count_documents({})
            if inq_count == 0:
                print("[Database] Initializing 'inquiries' collection in MongoDB...")
                self.db.inquiries.insert_one({
                    "id": "INQ-SAMPLE-01",
                    "name": "M Sri Hari Sai Eswar",
                    "email": "vu.cse.241fa04677@gmail.com",
                    "phone": "+91 6304677919",
                    "subject": "Pre-Approval for BMW M8 Gran Coupé",
                    "message": "Interested in 48-month BMW Select Financing @ 4.99% APR with $20,000 down payment.",
                    "car_id": "bmw-m8-competition-gran-coupe",
                    "car_name": "BMW M8 Competition Gran Coupé",
                    "financing_plan": "BMW Select Financing",
                    "estimated_monthly": 2450,
                    "created_at": datetime.utcnow().isoformat()
                })
                print("[Database] Initialized 'inquiries' collection.")

        except Exception as e:
            print(f"[Database] Auto-seed warning: {e}")

    def get_status(self) -> Dict[str, Any]:
        is_atlas = "mongodb.net" in MONGODB_URI or "mongodb+srv" in MONGODB_URI
        collections = []
        if self.is_connected and self.db is not None:
            try:
                collections = self.db.list_collection_names()
            except Exception:
                pass

        return {
            "connected": self.is_connected,
            "mode": "MongoDB Atlas (Cloud)" if is_atlas else ("Local MongoDB (localhost)" if self.is_connected else "Local In-Memory Mode"),
            "target": "Atlas Cloud Cluster" if is_atlas else ("Localhost:27017" if self.is_connected else "Offline"),
            "database_name": DATABASE_NAME if self.is_connected else None,
            "error": self.connection_error,
            "total_cars": self.get_cars_count(),
            "total_bookings": self.get_bookings_count(),
            "total_loans": self.get_loans_count(),
            "collections": collections
        }

    def get_cars_count(self) -> int:
        if self.is_connected and self.db is not None:
            try:
                return self.db.cars.count_documents({})
            except Exception:
                pass
        return len(self._local_cars)

    def get_bookings_count(self) -> int:
        if self.is_connected and self.db is not None:
            try:
                return self.db.bookings.count_documents({})
            except Exception:
                pass
        return len(self._local_bookings)

    def get_loans_count(self) -> int:
        if self.is_connected and self.db is not None:
            try:
                return self.db.loan_applications.count_documents({})
            except Exception:
                pass
        return len(self._local_loan_applications)

    def get_cars(self, category: Optional[str] = None, series: Optional[str] = None, search: Optional[str] = None) -> List[Dict[str, Any]]:
        cars = []
        if self.is_connected and self.db is not None:
            try:
                query = {}
                if category and category.lower() != "all":
                    query["category"] = {"$regex": f"^{category}$", "$options": "i"}
                if series and series.lower() != "all":
                    query["series"] = {"$regex": f"^{series}$", "$options": "i"}
                if search:
                    query["$or"] = [
                        {"name": {"$regex": search, "$options": "i"}},
                        {"tagline": {"$regex": search, "$options": "i"}},
                        {"description": {"$regex": search, "$options": "i"}},
                        {"series": {"$regex": search, "$options": "i"}}
                    ]
                cursor = self.db.cars.find(query, {"_id": 0})
                cars = list(cursor)
                if cars:
                    return cars
            except Exception as e:
                print(f"[Database] Error fetching from MongoDB: {e}")

        # Local fallback filter
        results = self._local_cars
        if category and category.lower() != "all":
            results = [c for c in results if c.get("category", "").lower() == category.lower()]
        if series and series.lower() != "all":
            results = [c for c in results if c.get("series", "").lower() == series.lower()]
        if search:
            s = search.lower()
            results = [c for c in results if s in c.get("name", "").lower() or s in c.get("tagline", "").lower() or s in c.get("series", "").lower()]
        return results

    def get_car_by_id(self, car_id: str) -> Optional[Dict[str, Any]]:
        if self.is_connected and self.db is not None:
            try:
                car = self.db.cars.find_one({"id": car_id}, {"_id": 0})
                if car:
                    return car
            except Exception as e:
                print(f"[Database] Error fetching car {car_id} from MongoDB: {e}")
        
        for c in self._local_cars:
            if c.get("id") == car_id:
                return c
        return None

    def create_car(self, car_data: Dict[str, Any]) -> Dict[str, Any]:
        """Dynamically add a new BMW car to MongoDB collection 'cars'."""
        car_id = car_data.get("id")
        if not car_id:
            import re
            base_slug = re.sub(r'[^a-zA-Z0-9]+', '-', car_data.get("name", "bmw-model").lower()).strip('-')
            car_id = base_slug or f"bmw-{uuid.uuid4().hex[:6]}"
        
        # Ensure default specs structure if incomplete
        specs = car_data.get("specs") or {}
        default_specs = {
            "engine": specs.get("engine", "3.0-liter BMW M TwinPower Turbo"),
            "horsepower": int(specs.get("horsepower", 450)),
            "torque": str(specs.get("torque", "406 lb-ft")),
            "acceleration_0_100": float(specs.get("acceleration_0_100", 3.8)),
            "top_speed_kmh": int(specs.get("top_speed_kmh", 280)),
            "transmission": specs.get("transmission", "8-speed M Steptronic with Drivelogic"),
            "drivetrain": specs.get("drivetrain", "M xDrive Intelligent All-Wheel Drive"),
            "fuel_type": specs.get("fuel_type", "Petrol"),
            "electric_range_km": specs.get("electric_range_km"),
            "fuel_economy": specs.get("fuel_economy", "18 / 25 mpg"),
            "cargo_capacity": specs.get("cargo_capacity", "15.0 cu.ft")
        }

        # Default authentic BMW colors if none provided
        colors = car_data.get("colors") or [
            {"name": "Frozen Marina Bay Blue", "hex": "#123e7a", "price": 1950},
            {"name": "Isle of Man Green", "hex": "#1a4731", "price": 0},
            {"name": "Black Sapphire Metallic", "hex": "#0a0a0b", "price": 0},
            {"name": "Alpine White", "hex": "#f5f5f7", "price": 0}
        ]

        # Default wheels if none provided
        wheels = car_data.get("wheels") or [
            {"name": "20\" M Star-Spoke Bi-Color Style", "size": "20 inch", "price": 0},
            {"name": "21\" M Performance Forged Ferric Grey", "size": "21 inch", "price": 1400}
        ]

        # Default interior if none provided
        interiors = car_data.get("interiors") or [
            {"name": "Black Full Merino Leather", "material": "Full Merino Leather", "color": "Black", "hex": "#19191b", "price": 0},
            {"name": "Sakhir Orange Full Merino Leather", "material": "Full Merino Leather", "color": "Orange", "hex": "#9c3321", "price": 0}
        ]

        hero_img = car_data.get("hero_image") or "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=1600&q=80"

        record = {
            **car_data,
            "id": car_id,
            "hero_image": hero_img,
            "specs": default_specs,
            "colors": colors,
            "wheels": wheels,
            "interiors": interiors,
            "gallery": car_data.get("gallery") or [hero_img],
            "tagline": car_data.get("tagline") or f"The breathtaking {car_data.get('name')}.",
            "description": car_data.get("description") or f"Experience the revolutionary performance and executive luxury of the {car_data.get('name')}.",
            "created_at": datetime.utcnow().isoformat()
        }

        if self.is_connected and self.db is not None:
            try:
                self.db.cars.delete_one({"id": car_id})
                self.db.cars.insert_one(dict(record))
                record.pop("_id", None)
                print(f"[Database] LIVE: DYNAMIC BMW CAR CREATED in MongoDB: {car_id} ({record.get('name')})")
                self._local_cars = [c for c in self._local_cars if c.get("id") != car_id]
                self._local_cars.insert(0, dict(record))
                return record
            except Exception as e:
                print(f"[Database] Error inserting dynamic car to MongoDB: {e}")

        # In-memory fallback
        self._local_cars = [c for c in self._local_cars if c.get("id") != car_id]
        self._local_cars.insert(0, record)
        return record

    def update_car(self, car_id: str, car_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Dynamically update a BMW car in MongoDB collection 'cars'."""
        cleaned_data = {k: v for k, v in car_data.items() if v is not None and k != "id"}
        if self.is_connected and self.db is not None:
            try:
                self.db.cars.update_one({"id": car_id}, {"$set": cleaned_data})
                updated = self.db.cars.find_one({"id": car_id}, {"_id": 0})
                if updated:
                    self._local_cars = [c if c.get("id") != car_id else updated for c in self._local_cars]
                    return updated
            except Exception as e:
                print(f"[Database] Error updating car in MongoDB: {e}")

        for i, c in enumerate(self._local_cars):
            if c.get("id") == car_id:
                self._local_cars[i].update(cleaned_data)
                return self._local_cars[i]
        return None

    def delete_car(self, car_id: str) -> bool:
        """Dynamically delete a BMW car from MongoDB collection 'cars'."""
        if self.is_connected and self.db is not None:
            try:
                res = self.db.cars.delete_one({"id": car_id})
                self._local_cars = [c for c in self._local_cars if c.get("id") != car_id]
                print(f"[Database] LIVE: DYNAMIC BMW CAR DELETED from MongoDB: {car_id}")
                return res.deleted_count > 0
            except Exception as e:
                print(f"[Database] Error deleting car from MongoDB: {e}")

        before_len = len(self._local_cars)
        self._local_cars = [c for c in self._local_cars if c.get("id") != car_id]
        return len(self._local_cars) < before_len

    def create_test_drive(self, booking_data: Dict[str, Any]) -> Dict[str, Any]:
        booking_id = f"TD-{uuid.uuid4().hex[:8].upper()}"
        record = {
            **booking_data,
            "id": booking_id,
            "booking_type": "VIP Test Drive",
            "status": "Confirmed",
            "created_at": datetime.utcnow().isoformat()
        }
        
        if self.is_connected and self.db is not None:
            try:
                # Save to both 'bookings' and 'test_drives' collections in MongoDB
                self.db.bookings.insert_one(dict(record))
                self.db.test_drives.insert_one(dict(record))
                record.pop("_id", None)
                print(f"[Database] LIVE: Stored in MongoDB collections 'bookings' & 'test_drives' -> {booking_id}")
                return record
            except Exception as e:
                print(f"[Database] Failed to write to MongoDB: {e}. Falling back to local storage.")
        
        self._local_test_drives.insert(0, record)
        self._local_bookings.insert(0, record)
        return record

    def create_showroom_visit(self, visit_data: Dict[str, Any]) -> Dict[str, Any]:
        booking_id = f"BK-{uuid.uuid4().hex[:8].upper()}"
        record = {
            **visit_data,
            "id": booking_id,
            "booking_type": "Showroom Visit",
            "status": "Confirmed",
            "created_at": datetime.utcnow().isoformat()
        }
        
        if self.is_connected and self.db is not None:
            try:
                self.db.bookings.insert_one(dict(record))
                record.pop("_id", None)
                print(f"[Database] LIVE: Stored Showroom Visit in MongoDB collection 'bookings' -> {booking_id}")
                return record
            except Exception as e:
                print(f"[Database] Failed to write showroom visit to MongoDB: {e}")
        
        self._local_bookings.insert(0, record)
        return record

    def get_bookings(self) -> List[Dict[str, Any]]:
        if self.is_connected and self.db is not None:
            try:
                cursor = self.db.bookings.find({}, {"_id": 0}).sort("created_at", -1)
                return list(cursor)
            except Exception as e:
                print(f"[Database] Error reading from 'bookings' collection: {e}")
        return self._local_bookings

    def delete_booking(self, booking_id: str) -> bool:
        if self.is_connected and self.db is not None:
            try:
                self.db.bookings.delete_one({"id": booking_id})
                self.db.test_drives.delete_one({"id": booking_id})
                return True
            except Exception as e:
                print(f"[Database] Error deleting booking from MongoDB: {e}")
        self._local_bookings = [b for b in self._local_bookings if b.get("id") != booking_id]
        self._local_test_drives = [b for b in self._local_test_drives if b.get("id") != booking_id]
        return True

    def update_booking_status(self, booking_id: str, new_status: str) -> Optional[Dict[str, Any]]:
        if self.is_connected and self.db is not None:
            try:
                self.db.bookings.update_one({"id": booking_id}, {"$set": {"status": new_status}})
                self.db.test_drives.update_one({"id": booking_id}, {"$set": {"status": new_status}})
                return self.db.bookings.find_one({"id": booking_id}, {"_id": 0})
            except Exception as e:
                print(f"[Database] Error updating booking status: {e}")
        for b in self._local_bookings:
            if b.get("id") == booking_id:
                b["status"] = new_status
                return b
        return None

    def get_test_drives(self) -> List[Dict[str, Any]]:
        if self.is_connected and self.db is not None:
            try:
                cursor = self.db.test_drives.find({}, {"_id": 0}).sort("created_at", -1)
                return list(cursor)
            except Exception as e:
                print(f"[Database] Error reading test drives from MongoDB: {e}")
        return self._local_test_drives

    def delete_test_drive(self, booking_id: str) -> bool:
        if self.is_connected and self.db is not None:
            try:
                res = self.db.test_drives.delete_one({"id": booking_id})
                return res.deleted_count > 0
            except Exception as e:
                print(f"[Database] Error deleting test drive from MongoDB: {e}")
        self._local_test_drives = [b for b in self._local_test_drives if b.get("id") != booking_id]
        return True

    def update_test_drive_status(self, booking_id: str, new_status: str) -> Optional[Dict[str, Any]]:
        if self.is_connected and self.db is not None:
            try:
                self.db.test_drives.update_one({"id": booking_id}, {"$set": {"status": new_status}})
                updated = self.db.test_drives.find_one({"id": booking_id}, {"_id": 0})
                return updated
            except Exception as e:
                print(f"[Database] Error updating test drive status: {e}")
        for b in self._local_test_drives:
            if b.get("id") == booking_id:
                b["status"] = new_status
                return b
        return None

    def create_loan_application(self, loan_data: Dict[str, Any]) -> Dict[str, Any]:
        loan_id = f"LOAN-{uuid.uuid4().hex[:8].upper()}"
        record = {
            **loan_data,
            "id": loan_id,
            "status": "Pre-Approved",
            "created_at": datetime.utcnow().isoformat()
        }
        
        if self.is_connected and self.db is not None:
            try:
                self.db.loan_applications.insert_one(dict(record))
                record.pop("_id", None)
                print(f"[Database] LIVE: Stored Loan Application {loan_id} in MongoDB collection 'loan_applications'!")
                return record
            except Exception as e:
                print(f"[Database] Failed to write loan to MongoDB: {e}")
        
        self._local_loan_applications.insert(0, record)
        return record

    def get_loan_applications(self) -> List[Dict[str, Any]]:
        if self.is_connected and self.db is not None:
            try:
                cursor = self.db.loan_applications.find({}, {"_id": 0}).sort("created_at", -1)
                return list(cursor)
            except Exception as e:
                print(f"[Database] Error reading loan applications from MongoDB: {e}")
        return self._local_loan_applications

    def delete_loan_application(self, loan_id: str) -> bool:
        if self.is_connected and self.db is not None:
            try:
                res = self.db.loan_applications.delete_one({"id": loan_id})
                return res.deleted_count > 0
            except Exception as e:
                print(f"[Database] Error deleting loan application: {e}")
        self._local_loan_applications = [l for l in self._local_loan_applications if l.get("id") != loan_id]
        return True

    def update_loan_application_status(self, loan_id: str, new_status: str) -> Optional[Dict[str, Any]]:
        if self.is_connected and self.db is not None:
            try:
                self.db.loan_applications.update_one({"id": loan_id}, {"$set": {"status": new_status}})
                return self.db.loan_applications.find_one({"id": loan_id}, {"_id": 0})
            except Exception as e:
                print(f"[Database] Error updating loan application: {e}")
        for l in self._local_loan_applications:
            if l.get("id") == loan_id:
                l["status"] = new_status
                return l
        return None

    def create_inquiry(self, inquiry_data: Dict[str, Any]) -> Dict[str, Any]:
        inquiry_id = f"INQ-{uuid.uuid4().hex[:8].upper()}"
        record = {
            **inquiry_data,
            "id": inquiry_id,
            "created_at": datetime.utcnow().isoformat()
        }
        
        if self.is_connected and self.db is not None:
            try:
                self.db.inquiries.insert_one(dict(record))
                record.pop("_id", None)
                print(f"[Database] LIVE: Stored Inquiry {inquiry_id} in MongoDB collection 'inquiries'")
                return record
            except Exception as e:
                print(f"[Database] Failed to write inquiry: {e}")
        
        self._local_inquiries.insert(0, record)
        return record

    def get_dealerships(self) -> List[Dict[str, Any]]:
        if self.is_connected and self.db is not None:
            try:
                dealers = list(self.db.dealerships.find({}, {"_id": 0}))
                if dealers:
                    return dealers
            except Exception as e:
                print(f"[Database] Error fetching dealerships from MongoDB: {e}")
        return self._local_dealerships

    def seed_data(self) -> Dict[str, Any]:
        """Manually trigger reseeding of cars, dealers, test drives, and inquiries"""
        if self.is_connected and self.db is not None:
            try:
                self.db.cars.delete_many({})
                self.db.cars.insert_many([dict(c) for c in DEFAULT_CARS])
                self.db.dealerships.delete_many({})
                self.db.dealerships.insert_many([dict(d) for d in DEFAULT_DEALERSHIPS])
                if self.db.bookings.count_documents({}) == 0:
                    all_initial = [dict(t) for t in SAMPLE_TEST_DRIVES] + [dict(s) for s in SAMPLE_SHOWROOM_VISITS]
                    self.db.bookings.insert_many(all_initial)
                if self.db.test_drives.count_documents({}) == 0:
                    self.db.test_drives.insert_many([dict(t) for t in SAMPLE_TEST_DRIVES])
                if self.db.loan_applications.count_documents({}) == 0:
                    self.db.loan_applications.insert_many([dict(l) for l in SAMPLE_LOAN_APPLICATIONS])
                return {
                    "success": True, 
                    "message": "MongoDB successfully seeded with cars, dealerships, bookings, test_drives, and loan_applications!",
                    "collections": self.db.list_collection_names()
                }
            except Exception as e:
                return {"success": False, "error": str(e)}
        
        self._local_cars = [dict(c) for c in DEFAULT_CARS]
        self._local_dealerships = [dict(d) for d in DEFAULT_DEALERSHIPS]
        self._local_bookings = [dict(t) for t in SAMPLE_TEST_DRIVES] + [dict(s) for s in SAMPLE_SHOWROOM_VISITS]
        self._local_test_drives = [dict(t) for t in SAMPLE_TEST_DRIVES]
        self._local_loan_applications = [dict(l) for l in SAMPLE_LOAN_APPLICATIONS]
        return {"success": True, "message": "Local database re-seeded successfully."}

# Singleton instance
db_manager = DatabaseManager()
