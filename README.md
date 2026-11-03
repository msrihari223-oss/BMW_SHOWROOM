# 🏎️ BMW Luxury Showroom Web Application

A cutting-edge, high-performance luxury car showroom web application inspired by **BMW (Bayerische Motoren Werke AG)**.

Built with **React.js** on the frontend, **Python FastAPI** on the backend, and integrated with **MongoDB Atlas** for persistent storage of vehicle fleet data, VIP test drive reservations, and financial pre-approval inquiries.

---

## ✨ Features

- **Dynamic Hero Showcase**:
  - Highlights BMW flagship models (*M8 Competition Gran Coupé*, *i7 xDrive60*, *M4 Competition*, *XM Label Red*).
  - Real-time performance telemetry display (0–100 km/h acceleration, Horsepower, Top Speed, Drivetrain).
  - **Native Web Audio Engine Sound**: Real-time simulated twin-turbo V8 roar and electric whistle synthesizer.
- **Filterable Virtual Fleet Gallery**:
  - Filter across BMW categories: *M Motorsport*, *BMW i Electric*, *X Series SAV*, *Coupés*, and *All Models*.
  - Instant search across model names, engine types, and features.
  - Sorting by Horsepower, Acceleration, or MSRP.
- **Interactive Customizer / Configurator Studio**:
  - Toggle authentic BMW Individual exterior paints (*Isle of Man Green*, *Frozen Marina Bay Blue*, *Dravit Grey*, *Toronto Red*, etc.) with live preview styling.
  - Choose forged M-sport alloy wheels and Merino leather upholstery.
  - Real-time calculation of total configured price.
  - Direct *"Order / Test Drive with this Spec"* transfer.
- **Side-by-Side Comparison Matrix**:
  - Compare up to 3 BMW vehicles simultaneously across acceleration, power, top speed, range, and dimensions.
- **BMW Financial Services Calculator**:
  - Estimate monthly payments for **BMW Select Loan** or **BMW Executive Lease**.
  - Interactive sliders for Down Payment, Loan Term (24–72 months), and APR interest rate.
  - Built-in Pre-Approval application form.
- **VIP Test Drive Reservation**:
  - Select preferred date, time slot, showroom location, and driving experience type (*M Performance Track*, *Highway*, or *VIP City Tour*).
  - Persists directly to **MongoDB Atlas** with a unique confirmation code and celebratory confetti.
- **Database & Operations Console**:
  - Real-time MongoDB Atlas connectivity indicator.
  - Live inspection table of all scheduled test drives stored in MongoDB Atlas.
  - One-click fleet reseed button to initialize or refresh collections.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide Icons, Canvas Confetti, Web Audio API |
| **Backend** | Python 3.13, FastAPI, Uvicorn, Pydantic, Python-Dotenv |
| **Database** | MongoDB Atlas (via `pymongo` with DNS SRV support and local fallback) |

---

## 🚀 Quick Start Guide

### 1. Configure MongoDB Atlas (Optional but Recommended)

1. Sign up or log into [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free cluster (e.g., `Cluster0`).
3. Under **Database Access**, create a database user and password.
4. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere) or your current IP.
5. Click **Connect** > **Drivers** > **Python** and copy your connection string:
   ```text
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
   ```
6. Open `backend/.env` and paste your connection string:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
   DATABASE_NAME=bmw_showroom
   PORT=8000
   HOST=127.0.0.1
   ```

> 💡 **Notice**: If `MONGODB_URI` is left blank, the application automatically runs in **Local In-Memory Mode** so everything works immediately out of the box without errors.

---

### 2. Start the Python Backend

In a terminal:

```bash
cd backend
python -m pip install -r requirements.txt
python run.py
```

The backend server starts on:
- API Server: `http://127.0.0.1:8000`
- Interactive Swagger Documentation: `http://127.0.0.1:8000/docs`

---

### 3. Start the React Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open your browser at:
`http://localhost:5173`

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Check MongoDB Atlas connection status and stats |
| `GET` | `/api/cars` | Get all BMW vehicles (supports `category`, `series`, `search` queries) |
| `GET` | `/api/cars/{id}` | Get detailed technical specs for a specific model |
| `POST` | `/api/test-drives` | Reserve a VIP Test Drive (stored in MongoDB Atlas) |
| `GET` | `/api/test-drives` | Fetch all booked test drives |
| `POST` | `/api/inquiries` | Submit financial pre-approval or consultation request |
| `GET` | `/api/dealerships` | Get flagship BMW showroom centers |
| `POST` | `/api/seed` | Reseed BMW showroom fleet into MongoDB Atlas |

---

## 📁 Project Structure

```text
project/
├── backend/
│   ├── .env.example        # Atlas template configuration
│   ├── .env                # Local active environment variables
│   ├── requirements.txt    # Python dependencies
│   ├── database.py         # MongoDB Atlas client & fallback manager
│   ├── models.py           # Pydantic data schemas
│   ├── seed_data.py        # BMW flagship fleet & showroom centers
│   ├── main.py             # FastAPI REST application
│   └── run.py              # Server starter script
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Luxury header with M tricolor & DB pill
│   │   │   ├── Hero.jsx             # Flagship vehicle switcher & engine rev
│   │   │   ├── ModelShowcase.jsx    # Filterable catalog with search & sort
│   │   │   ├── CarCard.jsx          # Interactive vehicle card
│   │   │   ├── CarConfigurator.jsx  # Paint, wheels & interior customizer
│   │   │   ├── VehicleModal.jsx     # Comprehensive technical specs modal
│   │   │   ├── CompareModal.jsx     # Side-by-side vehicle comparison
│   │   │   ├── FinanceCalculator.jsx# BMW Financial Services estimator
│   │   │   ├── TestDriveModal.jsx   # VIP reservation connected to Atlas
│   │   │   ├── Dealerships.jsx      # Global flagship experience centers
│   │   │   ├── Heritage.jsx         # BMW brand history & innovation
│   │   │   ├── AdminBookings.jsx    # MongoDB Atlas live inspector modal
│   │   │   └── Footer.jsx           # Premium brand footer
│   │   ├── utils/
│   │   │   ├── sound.js             # Web Audio API engine sound generator
│   │   │   └── api.js               # REST client connecting to backend
│   │   ├── App.jsx                  # Main application state orchestrator
│   │   ├── main.jsx                 # React root mount
│   │   └── index.css                # Custom BMW styling & glassmorphism
│   ├── package.json
│   └── vite.config.js               # Vite config with Tailwind & API proxy
├── start_backend.bat                # 1-click backend launcher
├── start_frontend.bat               # 1-click frontend launcher
└── README.md
```

---

*BMW — Sheer Driving Pleasure.*

