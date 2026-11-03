import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ModelShowcase from './components/ModelShowcase';
import CarConfigurator from './components/CarConfigurator';
import VehicleModal from './components/VehicleModal';
import CompareModal from './components/CompareModal';
import FinanceCalculator from './components/FinanceCalculator';
import TestDriveModal from './components/TestDriveModal';
import DealerVisitModal from './components/DealerVisitModal';
import Dealerships from './components/Dealerships';
import Heritage from './components/Heritage';
import AdminBookings from './components/AdminBookings';
import Footer from './components/Footer';

import { fetchCars, fetchHealth, fetchDealerships } from './utils/api';

export default function App() {
  const [cars, setCars] = useState([]);
  const [dealerships, setDealerships] = useState([]);
  const [dbStatus, setDbStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals & Active Selections
  const [selectedCarForModal, setSelectedCarForModal] = useState(null);
  const [selectedCarForConfig, setSelectedCarForConfig] = useState(null);
  const [isTestDriveOpen, setIsTestDriveOpen] = useState(false);
  const [testDriveCar, setTestDriveCar] = useState(null);
  const [testDriveNotes, setTestDriveNotes] = useState('');
  const [testDriveConfig, setTestDriveConfig] = useState(null);
  
  // Showroom Visit Modal
  const [isDealerVisitOpen, setIsDealerVisitOpen] = useState(false);
  const [selectedDealerForVisit, setSelectedDealerForVisit] = useState(null);
  
  // Comparison Tray
  const [comparedCars, setComparedCars] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Database / Admin Modal
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Initial Data Fetch
  const loadInitialData = async () => {
    try {
      const [carsData, healthData, dealersData] = await Promise.all([
        fetchCars(),
        fetchHealth(),
        fetchDealerships()
      ]);
      setCars(carsData);
      setDbStatus(healthData);
      setDealerships(dealersData);
      if (carsData.length > 0) {
        setSelectedCarForConfig(carsData[0]);
      }
    } catch (err) {
      console.error('Initialization error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Handlers
  const handleOpenTestDrive = (car = null, customNotes = '', config = null) => {
    setTestDriveCar(car || cars[0]);
    setTestDriveNotes(customNotes);
    setTestDriveConfig(config);
    setIsTestDriveOpen(true);
  };

  const handleOpenConfigurator = (car = null) => {
    if (car) setSelectedCarForConfig(car);
    const elem = document.getElementById('configurator');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  const handleExploreModels = () => {
    const elem = document.getElementById('models');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  const handleToggleCompare = (car) => {
    if (comparedCars.some(c => c.id === car.id)) {
      setComparedCars(comparedCars.filter(c => c.id !== car.id));
    } else {
      if (comparedCars.length >= 3) {
        alert('You can compare a maximum of 3 BMW models simultaneously.');
        return;
      }
      setComparedCars([...comparedCars, car]);
    }
  };

  const handleRemoveFromCompare = (car) => {
    setComparedCars(comparedCars.filter(c => c.id !== car.id));
  };

  const handleAddCarToCompare = (car) => {
    if (comparedCars.length < 3 && !comparedCars.some(c => c.id === car.id)) {
      setComparedCars([...comparedCars, car]);
    }
  };

  const handleBookAtDealer = (dealerNameOrObj) => {
    let dealer = null;
    if (typeof dealerNameOrObj === 'object') {
      dealer = dealerNameOrObj;
    } else {
      dealer = dealerships.find(d => d.name === dealerNameOrObj) || dealerships[0];
    }
    setSelectedDealerForVisit(dealer);
    setIsDealerVisitOpen(true);
  };

  // Flagship cars for the hero showcase
  const flagshipCars = cars.filter(c => c.featured) || cars.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#08090c] text-white flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* Navbar */}
      <Navbar
        onOpenTestDrive={handleOpenTestDrive}
        onOpenConfigurator={handleOpenConfigurator}
        onOpenAdmin={() => setIsAdminOpen(true)}
        dbStatus={dbStatus}
      />

      {/* Hero Section */}
      <Hero
        flagshipCars={flagshipCars.length > 0 ? flagshipCars : cars}
        onOpenConfigurator={handleOpenConfigurator}
        onOpenTestDrive={handleOpenTestDrive}
        onExploreModels={handleExploreModels}
      />

      {/* Main Showroom Fleet Gallery */}
      <ModelShowcase
        cars={cars}
        onSelectCar={(car) => setSelectedCarForModal(car)}
        onConfigure={handleOpenConfigurator}
        onBookTestDrive={handleOpenTestDrive}
        onOpenCompare={() => setIsCompareOpen(true)}
        comparedCars={comparedCars}
        onToggleCompare={handleToggleCompare}
      />

      {/* Interactive Customizer Studio */}
      <CarConfigurator
        cars={cars}
        selectedCar={selectedCarForConfig}
        onBookTestDrive={handleOpenTestDrive}
      />

      {/* Financial Services Calculator */}
      <FinanceCalculator cars={cars} />

      {/* Authorized Flagship Showrooms */}
      <Dealerships
        dealerships={dealerships}
        onBookAtDealer={handleBookAtDealer}
      />

      {/* Heritage & Brand Timeline */}
      <Heritage />

      {/* Footer */}
      <Footer />

      {/* --- MODALS --- */}

      {/* Vehicle Full Specs Modal */}
      {selectedCarForModal && (
        <VehicleModal
          car={selectedCarForModal}
          onClose={() => setSelectedCarForModal(null)}
          onConfigure={handleOpenConfigurator}
          onBookTestDrive={handleOpenTestDrive}
        />
      )}

      {/* Side-by-side Compare Modal */}
      {isCompareOpen && (
        <CompareModal
          comparedCars={comparedCars}
          allCars={cars}
          onClose={() => setIsCompareOpen(false)}
          onRemoveFromCompare={handleRemoveFromCompare}
          onAddCarToCompare={handleAddCarToCompare}
          onBookTestDrive={handleOpenTestDrive}
        />
      )}

      {/* VIP Test Drive Reservation Modal */}
      {isTestDriveOpen && (
        <TestDriveModal
          car={testDriveCar}
          allCars={cars}
          dealerships={dealerships}
          initialConfig={testDriveConfig}
          initialNotes={testDriveNotes}
          onClose={() => setIsTestDriveOpen(false)}
          onBookingSuccess={() => {
            // refresh db status
            fetchHealth().then(setDbStatus);
          }}
        />
      )}

      {/* Showroom Visit / Dealership VIP Reservation Modal */}
      {isDealerVisitOpen && (
        <DealerVisitModal
          dealership={selectedDealerForVisit}
          allDealerships={dealerships}
          cars={cars}
          onClose={() => setIsDealerVisitOpen(false)}
          onBookingSuccess={() => {
            fetchHealth().then(setDbStatus);
          }}
        />
      )}

      {/* MongoDB Atlas Administration & Bookings Inspector Modal */}
      {isAdminOpen && (
        <AdminBookings
          onClose={() => {
            setIsAdminOpen(false);
            fetchHealth().then(setDbStatus);
          }}
          onFleetChange={loadInitialData}
        />
      )}

    </div>
  );
}
