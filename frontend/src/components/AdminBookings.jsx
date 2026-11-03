import React, { useState, useEffect } from 'react';
import { 
  X, Database, RefreshCw, CheckCircle, AlertTriangle, 
  Trash2, Sliders, Calendar, ExternalLink, Code, 
  Eye, Check, MapPin, Phone, Mail, User, ShieldCheck, 
  ChevronDown, ChevronUp, Copy, Sparkles, DollarSign, Briefcase, Award,
  Building, Compass, Car, Plus, PlusCircle, Gauge, Zap, Tag, Image, Layers
} from 'lucide-react';
import { 
  fetchHealth, 
  fetchAllBookings, 
  reseedDatabase, 
  deleteUnifiedBooking, 
  updateUnifiedBookingStatus,
  fetchLoanApplications,
  deleteLoanApplication,
  updateLoanStatus,
  fetchCars,
  createCar,
  deleteCar
} from '../utils/api';

const BMW_PRESETS = [
  {
    name: 'BMW M3 CS',
    series: 'M Series',
    category: 'Sedan',
    base_price: 118700,
    year: 2025,
    horsepower: 543,
    acceleration_0_100: 3.2,
    top_speed_kmh: 302,
    fuel_type: 'Gasoline',
    drivetrain: 'M xDrive Intelligent All-Wheel Drive',
    engine: '3.0L BMW M TwinPower Turbo Inline 6-Cylinder',
    tagline: 'Pure track adrenaline engineered for everyday dominance.',
    description: 'The BMW M3 CS brings heightened output, bespoke chassis tuning, and intelligent lightweight design with carbon-fiber reinforced components.',
    hero_image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1600&q=80',
    badge: 'CS Track Edition',
    featured: true
  },
  {
    name: 'BMW iX M60 Electric',
    series: 'i Series',
    category: 'SUV',
    base_price: 111500,
    year: 2025,
    horsepower: 610,
    acceleration_0_100: 3.6,
    top_speed_kmh: 250,
    fuel_type: 'Electric',
    drivetrain: 'Dual Motor Electric xDrive AWD',
    engine: 'Dual BMW eDrive 5th Generation Electric Motors',
    tagline: 'Pioneering electric performance with executive lounge luxury.',
    description: 'The BMW iX M60 combines all-electric innovation, lounge-like interior ambience, and extraordinary M engineering for a thrilling yet serene journey.',
    hero_image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1600&q=80',
    badge: 'Electric Flagship',
    featured: true
  },
  {
    name: 'BMW Z4 M40i Roadster',
    series: 'Z Series',
    category: 'Convertible',
    base_price: 66300,
    year: 2025,
    horsepower: 382,
    acceleration_0_100: 3.9,
    top_speed_kmh: 250,
    fuel_type: 'Gasoline',
    drivetrain: 'sDrive Rear-Wheel Drive',
    engine: '3.0L BMW M TwinPower Turbo 6-Cylinder',
    tagline: 'Pure open-top driving freedom with classic roadster proportions.',
    description: 'With its classic soft-top roof, low center of gravity, and athletic rear-wheel drive chassis, the Z4 delivers an unforgettable roadster experience.',
    hero_image: 'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&w=1600&q=80',
    badge: 'Roadster Edition',
    featured: false
  },
  {
    name: 'BMW M5 Hybrid 2025',
    series: 'M Series',
    category: 'Sedan',
    base_price: 119500,
    year: 2025,
    horsepower: 717,
    acceleration_0_100: 3.4,
    top_speed_kmh: 305,
    fuel_type: 'Plug-in Hybrid',
    drivetrain: 'M xDrive Intelligent All-Wheel Drive',
    engine: '4.4L BMW M TwinPower Turbo V8 + M Hybrid Electric Motor',
    tagline: 'Electrified high-performance touring icon.',
    description: 'The all-new BMW M5 pairs a high-revving 4.4L TwinPower V8 with an electric motor for a monstrous combined output of 717 horsepower.',
    hero_image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=1600&q=80',
    badge: 'New Hybrid M',
    featured: true
  }
];

const BMW_PHOTO_OPTIONS = [
  { label: 'Frozen Dark Grey M8', url: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=1600&q=80' },
  { label: 'Isle of Man Green M3/M4', url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1600&q=80' },
  { label: 'Electric Blue i7/iX', url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1600&q=80' },
  { label: 'Alpine White X5/X7', url: 'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&w=1600&q=80' },
  { label: 'Black Sapphire Coupe', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=80' }
];

export default function AdminBookings({ onClose, onFleetChange }) {
  const [activeTab, setActiveTab] = useState('fleet'); // 'fleet' | 'bookings' | 'loans'
  const [health, setHealth] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loans, setLoans] = useState([]);
  const [fleetCars, setFleetCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState('');
  const [showRawJsonId, setShowRawJsonId] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const [copiedId, setCopiedId] = useState(null);

  // Dynamic Car Creator Form State
  const [isAddingCar, setIsAddingCar] = useState(false);
  const [carSubmitting, setCarSubmitting] = useState(false);
  const [carSuccessMsg, setCarSuccessMsg] = useState('');
  
  const [carName, setCarName] = useState('BMW M3 CS');
  const [carSeries, setCarSeries] = useState('M Series');
  const [carCategory, setCarCategory] = useState('Sedan');
  const [carPrice, setCarPrice] = useState(118700);
  const [carYear, setCarYear] = useState(2025);
  const [carHorsepower, setCarHorsepower] = useState(543);
  const [carAcceleration, setCarAcceleration] = useState(3.2);
  const [carTopSpeed, setCarTopSpeed] = useState(302);
  const [carFuelType, setCarFuelType] = useState('Gasoline');
  const [carDrivetrain, setCarDrivetrain] = useState('M xDrive Intelligent All-Wheel Drive');
  const [carTagline, setCarTagline] = useState('Pure track adrenaline engineered for everyday dominance.');
  const [carDescription, setCarDescription] = useState('The BMW M3 CS brings heightened output, bespoke chassis tuning, and intelligent lightweight design.');
  const [carImage, setCarImage] = useState('https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1600&q=80');
  const [carBadge, setCarBadge] = useState('CS Track Edition');
  const [carFeatured, setCarFeatured] = useState(true);

  const applyPreset = (preset) => {
    setCarName(preset.name);
    setCarSeries(preset.series);
    setCarCategory(preset.category);
    setCarPrice(preset.base_price);
    setCarYear(preset.year);
    setCarHorsepower(preset.horsepower);
    setCarAcceleration(preset.acceleration_0_100);
    setCarTopSpeed(preset.top_speed_kmh);
    setCarFuelType(preset.fuel_type);
    setCarDrivetrain(preset.drivetrain);
    setCarTagline(preset.tagline);
    setCarDescription(preset.description);
    setCarImage(preset.hero_image);
    setCarBadge(preset.badge);
    setCarFeatured(preset.featured);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [healthData, bookingsData, loansData, carsData] = await Promise.all([
        fetchHealth(),
        fetchAllBookings(),
        fetchLoanApplications(),
        fetchCars()
      ]);
      setHealth(healthData);
      setBookings(bookingsData);
      setLoans(loansData);
      setFleetCars(carsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSeed = async () => {
    if (!window.confirm('Do you want to reseed the BMW database collections in MongoDB?')) return;
    setSeeding(true);
    setSeedMessage('');
    try {
      const res = await reseedDatabase();
      setSeedMessage(res.message || 'Seeded successfully!');
      await loadData();
      if (onFleetChange) onFleetChange();
    } catch (err) {
      setSeedMessage('Error seeding: ' + err.message);
    } finally {
      setSeeding(false);
    }
  };

  // Dynamic Car Creation (Stores dynamically into MongoDB collection 'cars')
  const handleCreateCar = async (e) => {
    e.preventDefault();
    if (!carName.trim()) {
      alert('Please enter a BMW model name.');
      return;
    }
    setCarSubmitting(true);
    setCarSuccessMsg('');
    try {
      const payload = {
        name: carName.trim(),
        series: carSeries,
        category: carCategory,
        base_price: Number(carPrice) || 85000,
        year: Number(carYear) || 2025,
        hero_image: carImage || 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=1600&q=80',
        badge: carBadge || 'New Arrival',
        featured: Boolean(carFeatured),
        tagline: carTagline || `The exhilarating ${carName}.`,
        description: carDescription || `Experience the ultimate driving precision and luxury of the ${carName}.`,
        specs: {
          horsepower: Number(carHorsepower) || 450,
          acceleration_0_100: Number(carAcceleration) || 3.8,
          top_speed_kmh: Number(carTopSpeed) || 280,
          fuel_type: carFuelType,
          drivetrain: carDrivetrain,
          engine: carFuelType === 'Electric' ? 'Dual BMW eDrive Electric Motors' : '3.0L BMW M TwinPower Turbo Inline-6',
          torque: '440 lb-ft',
          transmission: '8-Speed M Steptronic with Drivelogic'
        }
      };

      const created = await createCar(payload);
      setCarSuccessMsg(`✓ Successfully added "${created.name}" to MongoDB collection 'cars'!`);
      setFleetCars(prev => [created, ...prev.filter(c => c.id !== created.id)]);
      setIsAddingCar(false);
      if (onFleetChange) {
        onFleetChange();
      }
      setTimeout(() => setCarSuccessMsg(''), 4000);
    } catch (err) {
      alert(`Failed to add BMW model: ${err.message}`);
    } finally {
      setCarSubmitting(false);
    }
  };

  // Dynamic Car Deletion (Removes from MongoDB collection 'cars')
  const handleDeleteCar = async (carId, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from MongoDB collection 'cars'?`)) return;
    try {
      await deleteCar(carId);
      setFleetCars(prev => prev.filter(c => c.id !== carId));
      if (onFleetChange) {
        onFleetChange();
      }
    } catch (err) {
      alert(`Failed to delete car: ${err.message}`);
    }
  };

  // Unified Booking actions (Stores to collection 'bookings' in MongoDB)
  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm(`Delete reservation ${bookingId} from MongoDB collection 'bookings'?`)) return;
    try {
      await deleteUnifiedBooking(bookingId);
      setBookings(bookings.filter(b => b.id !== bookingId));
    } catch (err) {
      alert('Failed to delete booking: ' + err.message);
    }
  };

  const handleBookingStatusChange = async (bookingId, newStatus) => {
    try {
      await updateUnifiedBookingStatus(bookingId, newStatus);
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  // Loan Application actions
  const handleDeleteLoan = async (loanId) => {
    if (!window.confirm(`Delete loan application ${loanId} from MongoDB?`)) return;
    try {
      await deleteLoanApplication(loanId);
      setLoans(loans.filter(l => l.id !== loanId));
    } catch (err) {
      alert('Failed to delete loan: ' + err.message);
    }
  };

  const handleLoanStatusChange = async (loanId, newStatus) => {
    try {
      await updateLoanStatus(loanId, newStatus);
      setLoans(loans.map(l => l.id === loanId ? { ...l, status: newStatus } : l));
    } catch (err) {
      alert('Failed to update loan status: ' + err.message);
    }
  };

  const handleCopyJson = (item) => {
    navigator.clipboard.writeText(JSON.stringify(item, null, 2));
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      
      <div className="relative w-full max-w-5xl bg-[#0c0e14] border border-white/15 rounded-3xl shadow-2xl overflow-hidden text-gray-200">
        
        {/* Accent bar */}
        <div className="h-1.5 w-full m-stripe" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2 rounded-full bg-black/60 hover:bg-black text-gray-400 hover:text-white border border-white/10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-blue-400 uppercase tracking-widest font-bold">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>MongoDB Live Console // All Stored Data</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white uppercase font-sans mt-1">
                Database Records & Live Collections
              </h2>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={loadData}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-mono flex items-center space-x-2 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh Live</span>
              </button>
            </div>
          </div>

          {/* Connection Status Banner */}
          <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            health?.connected
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
              : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
          }`}>
            <div className="flex items-start space-x-3">
              {health?.connected ? (
                <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="text-sm font-bold uppercase font-mono">
                  {health?.connected ? `Connected to MongoDB: ${health.database_name}` : 'Local Fallback Mode'}
                </h4>
                <p className="text-xs text-gray-300 mt-1">
                  {health?.connected
                    ? `Active Database: "${health.database_name}" on ${health.target}. All test drives, customer builds, and loan applications persist in real-time.`
                    : 'Backend running in local mode. Ensure your MongoDB connection is configured in backend/.env.'}
                </p>
                {health?.collections && health.collections.length > 0 && (
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-[10px] uppercase font-mono text-gray-400">Collections in DB:</span>
                    {health.collections.map(c => (
                      <span key={c} className="px-2 py-0.5 text-[10px] font-mono bg-black/60 rounded border border-white/10 text-emerald-400 font-bold">
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end text-xs font-mono gap-4 sm:gap-1">
              <span className="text-gray-400">Cars in MongoDB: <strong className="text-blue-400 font-bold">{fleetCars.length}</strong></span>
              <span className="text-gray-400">All Bookings: <strong className="text-emerald-400 font-bold">{bookings.length}</strong></span>
              <span className="text-gray-400">Loan Apps: <strong className="text-blue-400 font-bold">{loans.length}</strong></span>
            </div>
          </div>

          {/* Tab Navigation: Fleet vs Bookings vs Loans */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab('fleet')}
                className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition-all flex items-center space-x-2 cursor-pointer border ${
                  activeTab === 'fleet'
                    ? 'bg-blue-600 border-blue-400 text-white shadow-lg'
                    : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <Car className="w-3.5 h-3.5 text-blue-300" />
                <span>BMW Dynamic Fleet ({fleetCars.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition-all flex items-center space-x-2 cursor-pointer border ${
                  activeTab === 'bookings'
                    ? 'bg-blue-600 border-blue-400 text-white shadow-lg'
                    : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>All Reservations & Bookings ({bookings.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('loans')}
                className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition-all flex items-center space-x-2 cursor-pointer border ${
                  activeTab === 'loans'
                    ? 'bg-blue-600 border-blue-400 text-white shadow-lg'
                    : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Loan Applications ({loans.length})</span>
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 bg-black/60 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1 rounded-lg text-xs font-mono uppercase font-bold transition-all ${
                  viewMode === 'cards' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-lg text-xs font-mono uppercase font-bold transition-all ${
                  viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Table
              </button>
            </div>
          </div>

          {/* TAB 1: ALL BOOKINGS (VIP TEST DRIVES + SHOWROOM VISITS) */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              {bookings.length > 0 ? (
                viewMode === 'cards' ? (
                  <div className="space-y-4">
                    {bookings.map((b) => {
                      const isJsonOpen = showRawJsonId === b.id;
                      const isShowroom = b.booking_type === 'Showroom Visit' || b.id?.startsWith('BK-');

                      return (
                        <div key={b.id} className="glass-card rounded-2xl p-5 border border-white/10 space-y-4 hover:border-blue-500/40 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                              <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-blue-950 text-blue-300 border border-blue-800">
                                {b.id}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border flex items-center space-x-1 ${
                                isShowroom
                                  ? 'bg-purple-950/80 border-purple-500 text-purple-300'
                                  : 'bg-blue-950/80 border-blue-500 text-blue-300'
                              }`}>
                                {isShowroom ? <Building className="w-3 h-3 mr-1" /> : <Car className="w-3 h-3 mr-1" />}
                                <span>{isShowroom ? 'Showroom Visit' : 'VIP Test Drive'}</span>
                              </span>
                              <span className="text-xs font-mono text-gray-400">
                                Booked: {new Date(b.created_at).toLocaleString()}
                              </span>
                            </div>

                            <div className="flex items-center space-x-2 self-end sm:self-auto">
                              <select
                                value={b.status || 'Confirmed'}
                                onChange={(e) => handleBookingStatusChange(b.id, e.target.value)}
                                className="bg-black/70 border border-white/15 text-xs rounded-lg px-2.5 py-1 font-mono text-emerald-400 focus:outline-none"
                              >
                                <option value="Confirmed">Confirmed</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                              <button
                                onClick={() => handleCopyJson(b)}
                                title="Copy JSON"
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-gray-300"
                              >
                                {copiedId === b.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                onClick={() => handleDeleteBooking(b.id)}
                                title="Delete from MongoDB"
                                className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900 border border-red-500/40 text-red-300"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Detail Grid */}
                          {isShowroom ? (
                            /* Showroom Visit Card View */
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                              <div className="p-3.5 rounded-xl bg-black/50 border border-white/5 space-y-1.5">
                                <span className="text-[10px] uppercase font-bold text-gray-500 flex items-center space-x-1">
                                  <User className="w-3 h-3 text-purple-400" />
                                  <span>VIP Guest Profile</span>
                                </span>
                                <div className="font-bold text-white text-sm">{b.name}</div>
                                <div className="text-gray-400">{b.email}</div>
                                <div className="text-gray-400">{b.phone}</div>
                                <div className="text-purple-300 text-[11px] pt-1">
                                  Party: <strong>{b.num_guests || 1} Guest{b.num_guests > 1 ? 's' : ''}</strong> {b.city ? `(${b.city})` : ''}
                                </div>
                              </div>

                              <div className="p-3.5 rounded-xl bg-black/50 border border-white/5 space-y-1.5">
                                <span className="text-[10px] uppercase font-bold text-gray-500 flex items-center space-x-1">
                                  <Building className="w-3 h-3 text-purple-400" />
                                  <span>Showroom Center</span>
                                </span>
                                <div className="font-bold text-white text-sm">{b.dealership_name || b.dealership}</div>
                                <div className="text-gray-400 text-[11px]">{b.dealership_address}</div>
                                {b.dealership_phone && <div className="text-gray-400">{b.dealership_phone}</div>}
                                <div className="text-purple-400 font-bold pt-1">{b.visit_type || 'VIP Private Tour'}</div>
                              </div>

                              <div className="p-3.5 rounded-xl bg-black/50 border border-white/5 space-y-1.5">
                                <span className="text-[10px] uppercase font-bold text-gray-500 flex items-center space-x-1">
                                  <Calendar className="w-3 h-3 text-purple-400" />
                                  <span>Appointment & Interest</span>
                                </span>
                                <div className="font-bold text-white">{b.preferred_date} @ {b.preferred_time}</div>
                                <div className="text-blue-300 font-semibold">{b.vehicle_interest || 'All Flagship Models'}</div>
                                {b.special_requests && (
                                  <div className="text-gray-400 text-[11px] italic">"{b.special_requests}"</div>
                                )}
                              </div>
                            </div>
                          ) : (
                            /* Test Drive Card View */
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                              <div className="p-3.5 rounded-xl bg-black/50 border border-white/5 space-y-1.5">
                                <span className="text-[10px] uppercase font-bold text-gray-500 flex items-center space-x-1">
                                  <User className="w-3 h-3 text-blue-400" />
                                  <span>Customer Profile</span>
                                </span>
                                <div className="font-bold text-white text-sm">{b.name}</div>
                                <div className="text-gray-400">{b.email}</div>
                                <div className="text-gray-400">{b.phone}</div>
                                {b.customer_city && <div className="text-gray-400">{b.customer_city}</div>}
                              </div>

                              <div className="p-3.5 rounded-xl bg-black/50 border border-white/5 space-y-1.5">
                                <span className="text-[10px] uppercase font-bold text-gray-500 flex items-center space-x-1">
                                  <Sliders className="w-3 h-3 text-blue-400" />
                                  <span>Vehicle & Spec</span>
                                </span>
                                <div className="font-bold text-white text-sm">{b.car_name}</div>
                                <div className="text-gray-400">Total Price: <strong className="text-white">${(b.total_price || b.base_price || 0).toLocaleString()}</strong></div>
                                {b.selected_color && (
                                  <div className="flex items-center space-x-1.5">
                                    <span style={{ backgroundColor: b.selected_color.hex }} className="w-3 h-3 rounded-full border border-white/30" />
                                    <span className="text-gray-300">{b.selected_color.name}</span>
                                  </div>
                                )}
                                {b.selected_wheel && <div className="text-gray-400">{b.selected_wheel.name}</div>}
                                {b.selected_interior && <div className="text-gray-400">{b.selected_interior.name}</div>}
                              </div>

                              <div className="p-3.5 rounded-xl bg-black/50 border border-white/5 space-y-1.5">
                                <span className="text-[10px] uppercase font-bold text-gray-500 flex items-center space-x-1">
                                  <Calendar className="w-3 h-3 text-blue-400" />
                                  <span>Schedule</span>
                                </span>
                                <div className="font-bold text-white">{b.preferred_date} @ {b.preferred_time}</div>
                                <div className="text-blue-300">{b.experience_type || 'VIP Experience'}</div>
                                <div className="text-gray-400">{b.dealership}</div>
                                {b.financing_preference && <div className="text-emerald-400">Plan: {b.financing_preference}</div>}
                              </div>
                            </div>
                          )}

                          <div className="border-t border-white/5 pt-2 flex items-center justify-between">
                            <button
                              onClick={() => setShowRawJsonId(isJsonOpen ? null : b.id)}
                              className="text-[11px] font-mono text-gray-400 hover:text-white flex items-center space-x-1"
                            >
                              <Code className="w-3.5 h-3.5 text-blue-400" />
                              <span>{isJsonOpen ? 'Close JSON' : 'View Stored MongoDB JSON Document'}</span>
                              {isJsonOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                          </div>

                          {isJsonOpen && (
                            <pre className="p-4 rounded-xl bg-black border border-white/10 text-emerald-400 text-[11px] overflow-x-auto max-h-56 font-mono">
                              {JSON.stringify(b, null, 2)}
                            </pre>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="border border-white/10 rounded-xl overflow-x-auto bg-black/40">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-white/5 text-gray-400 border-b border-white/10 text-[10px] uppercase">
                        <tr>
                          <th className="p-3">ID</th>
                          <th className="p-3">Type</th>
                          <th className="p-3">Customer</th>
                          <th className="p-3">Vehicle / Center</th>
                          <th className="p-3">Date & Time</th>
                          <th className="p-3">Details</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-gray-300">
                        {bookings.map((b) => {
                          const isShowroom = b.booking_type === 'Showroom Visit' || b.id?.startsWith('BK-');
                          return (
                            <tr key={b.id} className="hover:bg-white/5">
                              <td className="p-3 text-blue-400 font-bold">{b.id}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                  isShowroom
                                    ? 'bg-purple-950/70 border-purple-500 text-purple-300'
                                    : 'bg-blue-950/70 border-blue-500 text-blue-300'
                                }`}>
                                  {isShowroom ? 'Showroom' : 'Test Drive'}
                                </span>
                              </td>
                              <td className="p-3">
                                <div className="font-bold text-white">{b.name}</div>
                                <div className="text-[10px] text-gray-400">{b.phone || b.email}</div>
                              </td>
                              <td className="p-3">
                                <div className="font-bold text-white">
                                  {isShowroom ? (b.dealership_name || b.dealership) : b.car_name}
                                </div>
                                <div className="text-[10px] text-gray-400">
                                  {isShowroom ? (b.vehicle_interest || 'VIP Tour') : (b.dealership || 'Center')}
                                </div>
                              </td>
                              <td className="p-3 whitespace-nowrap">
                                <div>{b.preferred_date}</div>
                                <div className="text-[10px] text-gray-400">{b.preferred_time}</div>
                              </td>
                              <td className="p-3">
                                {isShowroom ? (
                                  <span className="text-purple-300">{b.visit_type || 'VIP Tour'} ({b.num_guests || 1} guests)</span>
                                ) : (
                                  <span className="text-white font-bold">${(b.total_price || b.base_price || 0).toLocaleString()}</span>
                                )}
                              </td>
                              <td className="p-3">
                                <select
                                  value={b.status || 'Confirmed'}
                                  onChange={(e) => handleBookingStatusChange(b.id, e.target.value)}
                                  className="bg-black/60 border border-white/10 text-[10px] rounded px-1.5 py-0.5 text-emerald-400"
                                >
                                  <option value="Confirmed">Confirmed</option>
                                  <option value="In Progress">In Progress</option>
                                  <option value="Completed">Completed</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </td>
                              <td className="p-3">
                                <button onClick={() => handleDeleteBooking(b.id)} className="text-gray-400 hover:text-red-400 p-1">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )
              ) : (
                <div className="text-center py-12 rounded-xl border border-white/10 bg-black/30 text-gray-500 font-mono text-xs">
                  No reservations or showroom bookings recorded yet.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LOAN & FINANCE APPLICATIONS */}
          {activeTab === 'loans' && (
            <div className="space-y-4">
              {loans.length > 0 ? (
                viewMode === 'cards' ? (
                  <div className="space-y-4">
                    {loans.map((l) => {
                      const isJsonOpen = showRawJsonId === l.id;
                      return (
                        <div key={l.id} className="glass-card rounded-2xl p-5 border border-white/10 space-y-4 hover:border-emerald-500/40 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                            <div className="flex items-center space-x-3">
                              <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                                {l.id}
                              </span>
                              <span className="text-xs font-mono text-gray-400">
                                Applied: {new Date(l.created_at).toLocaleString()}
                              </span>
                            </div>

                            <div className="flex items-center space-x-2 self-end sm:self-auto">
                              <select
                                value={l.status || 'Pre-Approved'}
                                onChange={(e) => handleLoanStatusChange(l.id, e.target.value)}
                                className="bg-black/70 border border-white/15 text-xs rounded-lg px-2.5 py-1 font-mono text-blue-300 focus:outline-none"
                              >
                                <option value="Pre-Approved">Pre-Approved</option>
                                <option value="Under Review">Under Review</option>
                                <option value="Approved">Approved</option>
                                <option value="Funded">Funded</option>
                                <option value="Declined">Declined</option>
                              </select>
                              <button
                                onClick={() => handleCopyJson(l)}
                                title="Copy JSON"
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-gray-300"
                              >
                                {copiedId === l.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                onClick={() => handleDeleteLoan(l.id)}
                                title="Delete from MongoDB"
                                className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900 border border-red-500/40 text-red-300"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                            {/* Applicant */}
                            <div className="p-3.5 rounded-xl bg-black/50 border border-white/5 space-y-1.5">
                              <span className="text-[10px] uppercase font-bold text-gray-500 flex items-center space-x-1">
                                <User className="w-3 h-3 text-emerald-400" />
                                <span>Applicant Profile</span>
                              </span>
                              <div className="font-bold text-white text-sm">{l.name}</div>
                              <div className="text-gray-400">{l.email}</div>
                              <div className="text-gray-400">{l.phone}</div>
                              {l.city && <div className="text-gray-400">{l.city}</div>}
                              <div className="text-emerald-400 text-[11px] pt-1">
                                {l.credit_score_tier} | {l.annual_income}
                              </div>
                            </div>

                            {/* Vehicle */}
                            <div className="p-3.5 rounded-xl bg-black/50 border border-white/5 space-y-1.5">
                              <span className="text-[10px] uppercase font-bold text-gray-500 flex items-center space-x-1">
                                <DollarSign className="w-3 h-3 text-emerald-400" />
                                <span>Vehicle & Selling Price</span>
                              </span>
                              <div className="font-bold text-white text-sm">{l.car_name}</div>
                              <div className="text-gray-400">MSRP: <strong className="text-white">${l.vehicle_price?.toLocaleString()}</strong></div>
                              <div className="text-blue-400 font-bold">{l.plan_type}</div>
                              <div className="text-gray-400">Term: {l.term_months} Months @ {l.interest_rate_apr}% APR</div>
                            </div>

                            {/* Financing Terms */}
                            <div className="p-3.5 rounded-xl bg-black/50 border border-white/5 space-y-1.5">
                              <span className="text-[10px] uppercase font-bold text-gray-500 flex items-center space-x-1">
                                <Award className="w-3 h-3 text-emerald-400" />
                                <span>Financial Terms</span>
                              </span>
                              <div className="text-2xl font-bold text-white font-mono">
                                ${l.estimated_monthly_payment?.toLocaleString()}<span className="text-xs text-gray-400 font-normal">/mo</span>
                              </div>
                              <div className="text-gray-400">Down Payment: <strong className="text-white">${l.down_payment?.toLocaleString()}</strong> ({l.down_payment_percent}%)</div>
                              <div className="text-gray-400">Principal: ${l.total_financed_principal?.toLocaleString()}</div>
                              <div className="text-gray-400">Est. Total Interest: ${l.total_estimated_interest?.toLocaleString()}</div>
                            </div>
                          </div>

                          <div className="border-t border-white/5 pt-2 flex items-center justify-between">
                            <button
                              onClick={() => setShowRawJsonId(isJsonOpen ? null : l.id)}
                              className="text-[11px] font-mono text-gray-400 hover:text-white flex items-center space-x-1"
                            >
                              <Code className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{isJsonOpen ? 'Close JSON' : 'View Stored MongoDB Loan Document (JSON)'}</span>
                              {isJsonOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                          </div>

                          {isJsonOpen && (
                            <pre className="p-4 rounded-xl bg-black border border-white/10 text-emerald-400 text-[11px] overflow-x-auto max-h-56 font-mono">
                              {JSON.stringify(l, null, 2)}
                            </pre>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="border border-white/10 rounded-xl overflow-x-auto bg-black/40">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-white/5 text-gray-400 border-b border-white/10 text-[10px] uppercase">
                        <tr>
                          <th className="p-3">ID</th>
                          <th className="p-3">Applicant</th>
                          <th className="p-3">Vehicle</th>
                          <th className="p-3">Plan</th>
                          <th className="p-3">Monthly</th>
                          <th className="p-3">Down</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-gray-300">
                        {loans.map((l) => (
                          <tr key={l.id} className="hover:bg-white/5">
                            <td className="p-3 text-emerald-400 font-bold">{l.id}</td>
                            <td className="p-3">
                              <div className="font-bold text-white">{l.name}</div>
                              <div className="text-[10px] text-gray-400">{l.phone}</div>
                            </td>
                            <td className="p-3 text-white font-bold">{l.car_name}</td>
                            <td className="p-3">{l.plan_type}</td>
                            <td className="p-3 text-white font-bold">${l.estimated_monthly_payment}/mo</td>
                            <td className="p-3">${l.down_payment?.toLocaleString()}</td>
                            <td className="p-3">
                              <select
                                value={l.status || 'Pre-Approved'}
                                onChange={(e) => handleLoanStatusChange(l.id, e.target.value)}
                                className="bg-black/60 border border-white/10 text-[10px] rounded px-1.5 py-0.5 text-blue-300"
                              >
                                <option value="Pre-Approved">Pre-Approved</option>
                                <option value="Under Review">Under Review</option>
                                <option value="Approved">Approved</option>
                                <option value="Funded">Funded</option>
                                <option value="Declined">Declined</option>
                              </select>
                            </td>
                            <td className="p-3">
                              <button onClick={() => handleDeleteLoan(l.id)} className="text-gray-400 hover:text-red-400 p-1">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              ) : (
                <div className="text-center py-12 rounded-xl border border-white/10 bg-black/30 text-gray-500 font-mono text-xs">
                  No loan applications submitted yet. Use the finance calculator to submit one!
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DYNAMIC BMW FLEET (CRUD on MongoDB 'cars' collection) */}
          {activeTab === 'fleet' && (
            <div className="space-y-6">
              {/* Fleet Control Header */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2 text-xs font-mono text-blue-400 uppercase font-bold">
                    <Layers className="w-4 h-4 text-blue-400" />
                    <span>MongoDB Collection: cars // Live Showroom Inventory</span>
                  </div>
                  <h3 className="text-xl font-bold text-white uppercase mt-0.5">
                    Dynamic Fleet Management
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-xl">
                    Add, customize, and delete BMW vehicles in real time. Changes persist directly into MongoDB and immediately update the showroom showcase, vehicle configurator, and reservation modals.
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setIsAddingCar(!isAddingCar)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-2 cursor-pointer shadow-lg shadow-blue-500/20"
                  >
                    {isAddingCar ? <X className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                    <span>{isAddingCar ? 'Close Creator' : '+ Add BMW Model (Dynamic)'}</span>
                  </button>
                </div>
              </div>

              {/* Success Notification */}
              {carSuccessMsg && (
                <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center space-x-2 animate-fadeIn">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{carSuccessMsg}</span>
                </div>
              )}

              {/* Dynamic Vehicle Creation Form */}
              {isAddingCar && (
                <form onSubmit={handleCreateCar} className="p-6 rounded-2xl bg-gradient-to-b from-[#141824] to-[#0c0e14] border border-blue-500/30 space-y-5 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase font-mono flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        <span>Dynamic BMW Vehicle Creator</span>
                      </h4>
                      <p className="text-xs text-gray-400 mt-0.5">Configure engineering specifications & save directly to MongoDB.</p>
                    </div>

                    {/* Quick Presets */}
                    <div className="flex items-center flex-wrap gap-1.5">
                      <span className="text-[10px] font-mono text-gray-400 uppercase mr-1">1-Click Presets:</span>
                      {BMW_PRESETS.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => applyPreset(preset)}
                          className="px-2.5 py-1 rounded bg-black/50 hover:bg-blue-900/40 border border-white/15 text-[10px] font-mono text-blue-300 hover:text-white transition-colors cursor-pointer"
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Name */}
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[11px] font-mono uppercase text-gray-400">Model Name</label>
                      <input
                        type="text"
                        value={carName}
                        onChange={(e) => setCarName(e.target.value)}
                        placeholder="e.g. BMW M3 CS"
                        required
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-400 outline-none"
                      />
                    </div>

                    {/* Series */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono uppercase text-gray-400">BMW Series</label>
                      <select
                        value={carSeries}
                        onChange={(e) => setCarSeries(e.target.value)}
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-400 outline-none"
                      >
                        <option value="M Series">M Series (Motorsport)</option>
                        <option value="i Series">i Series (Electric)</option>
                        <option value="X Series">X Series (SAV/SUV)</option>
                        <option value="Z Series">Z Series (Roadster)</option>
                        <option value="7 Series">7 Series (Flagship)</option>
                        <option value="8 Series">8 Series (Gran Coupe)</option>
                        <option value="5 Series">5 Series (Executive)</option>
                        <option value="4 Series">4 Series (Coupe)</option>
                        <option value="3 Series">3 Series (Sport)</option>
                      </select>
                    </div>

                    {/* Category */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono uppercase text-gray-400">Body Category</label>
                      <select
                        value={carCategory}
                        onChange={(e) => setCarCategory(e.target.value)}
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-400 outline-none"
                      >
                        <option value="Sedan">Sedan</option>
                        <option value="Coupe">Coupe</option>
                        <option value="SUV">SUV / SAV</option>
                        <option value="Convertible">Convertible / Roadster</option>
                        <option value="Electric">All-Electric</option>
                      </select>
                    </div>

                    {/* Base Price */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono uppercase text-gray-400">Base Price (USD)</label>
                      <input
                        type="number"
                        value={carPrice}
                        onChange={(e) => setCarPrice(e.target.value)}
                        required
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-400 outline-none"
                      />
                    </div>

                    {/* Year */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono uppercase text-gray-400">Year</label>
                      <input
                        type="number"
                        value={carYear}
                        onChange={(e) => setCarYear(e.target.value)}
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-400 outline-none"
                      />
                    </div>

                    {/* Horsepower */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono uppercase text-gray-400">Horsepower (HP)</label>
                      <input
                        type="number"
                        value={carHorsepower}
                        onChange={(e) => setCarHorsepower(e.target.value)}
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-400 outline-none"
                      />
                    </div>

                    {/* 0-60 mph / 0-100 km/h */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono uppercase text-gray-400">0-60 mph (sec)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={carAcceleration}
                        onChange={(e) => setCarAcceleration(e.target.value)}
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-400 outline-none"
                      />
                    </div>

                    {/* Top Speed */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono uppercase text-gray-400">Top Speed (km/h)</label>
                      <input
                        type="number"
                        value={carTopSpeed}
                        onChange={(e) => setCarTopSpeed(e.target.value)}
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-400 outline-none"
                      />
                    </div>

                    {/* Fuel Type */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono uppercase text-gray-400">Fuel Type</label>
                      <select
                        value={carFuelType}
                        onChange={(e) => setCarFuelType(e.target.value)}
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-400 outline-none"
                      >
                        <option value="Gasoline">Gasoline / TwinPower Turbo</option>
                        <option value="Electric">100% Electric (BMW i)</option>
                        <option value="Plug-in Hybrid">Plug-in Hybrid (eDrive)</option>
                      </select>
                    </div>

                    {/* Drivetrain */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono uppercase text-gray-400">Drivetrain</label>
                      <input
                        type="text"
                        value={carDrivetrain}
                        onChange={(e) => setCarDrivetrain(e.target.value)}
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-400 outline-none"
                      />
                    </div>

                    {/* Badge */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono uppercase text-gray-400">Badge / Tag</label>
                      <input
                        type="text"
                        value={carBadge}
                        onChange={(e) => setCarBadge(e.target.value)}
                        placeholder="e.g. CS Track Edition"
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-400 outline-none"
                      />
                    </div>
                  </div>

                  {/* Tagline */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-gray-400">Tagline</label>
                    <input
                      type="text"
                      value={carTagline}
                      onChange={(e) => setCarTagline(e.target.value)}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-400 outline-none"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-gray-400">Description</label>
                    <textarea
                      rows={2}
                      value={carDescription}
                      onChange={(e) => setCarDescription(e.target.value)}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-400 outline-none"
                    />
                  </div>

                  {/* Photo Selection */}
                  <div className="space-y-2 border-t border-white/10 pt-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-mono uppercase text-gray-400 flex items-center space-x-1.5">
                        <Image className="w-3.5 h-3.5 text-blue-400" />
                        <span>Vehicle Photo (Select authentic BMW preset or enter URL)</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {BMW_PHOTO_OPTIONS.map((photo) => (
                        <div
                          key={photo.label}
                          onClick={() => setCarImage(photo.url)}
                          className={`relative h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                            carImage === photo.url ? 'border-blue-500 scale-[1.02] shadow-lg' : 'border-white/10 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={photo.url} alt={photo.label} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                            <span className="text-[9px] font-mono text-white leading-tight">{photo.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center space-x-3 pt-1">
                      <input
                        type="url"
                        value={carImage}
                        onChange={(e) => setCarImage(e.target.value)}
                        placeholder="Or enter custom image URL"
                        className="flex-1 bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-400 outline-none font-mono"
                      />
                      <label className="flex items-center space-x-2 text-xs font-mono text-gray-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={carFeatured}
                          onChange={(e) => setCarFeatured(e.target.checked)}
                          className="rounded text-blue-600 focus:ring-0"
                        />
                        <span>Featured on Homepage</span>
                      </label>
                    </div>
                  </div>

                  {/* Submit actions */}
                  <div className="flex items-center justify-end space-x-3 border-t border-white/10 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsAddingCar(false)}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono uppercase text-gray-300 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={carSubmitting}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-2 cursor-pointer disabled:opacity-50 shadow-lg shadow-blue-600/30"
                    >
                      {carSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Saving to MongoDB...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Save BMW Model to Database</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Fleet List / Cards */}
              <div className="space-y-4">
                {fleetCars.length > 0 ? (
                  viewMode === 'cards' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {fleetCars.map((car) => {
                        const isJsonOpen = showRawJsonId === car.id;
                        return (
                          <div
                            key={car.id}
                            className="glass-card rounded-2xl border border-white/10 overflow-hidden hover:border-blue-500/40 transition-colors flex flex-col justify-between"
                          >
                            <div>
                              {/* Hero Image */}
                              <div className="relative h-44 w-full bg-black/60 overflow-hidden">
                                <img
                                  src={car.hero_image}
                                  alt={car.name}
                                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e14] via-transparent to-black/40" />
                                
                                <div className="absolute top-3 left-3">
                                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-blue-600/90 text-white backdrop-blur-md border border-blue-400/30">
                                    {car.badge || car.series}
                                  </span>
                                </div>

                                <div className="absolute top-3 right-3">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-black/70 text-gray-300 border border-white/10">
                                    {car.category}
                                  </span>
                                </div>

                                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                                  <div>
                                    <h4 className="text-lg font-bold text-white tracking-wide">{car.name}</h4>
                                    <p className="text-[11px] text-gray-300 font-mono">{car.year} • {car.series}</p>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-[10px] font-mono text-gray-400 block uppercase">Starting at</span>
                                    <span className="text-base font-extrabold text-white font-mono">
                                      ${car.base_price?.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Specs Bar */}
                              <div className="p-4 space-y-3">
                                <p className="text-xs text-gray-400 italic line-clamp-2">
                                  "{car.tagline || car.description}"
                                </p>

                                <div className="grid grid-cols-4 gap-2 pt-1 border-t border-white/5 text-center">
                                  <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                                    <span className="text-[9px] text-gray-500 font-mono uppercase block">Power</span>
                                    <span className="text-xs font-bold text-white font-mono">{car.specs?.horsepower || 400} HP</span>
                                  </div>
                                  <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                                    <span className="text-[9px] text-gray-500 font-mono uppercase block">0-60 mph</span>
                                    <span className="text-xs font-bold text-blue-400 font-mono">{car.specs?.acceleration_0_100 || 3.8}s</span>
                                  </div>
                                  <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                                    <span className="text-[9px] text-gray-500 font-mono uppercase block">Top Speed</span>
                                    <span className="text-xs font-bold text-white font-mono">{car.specs?.top_speed_kmh || 250} km/h</span>
                                  </div>
                                  <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                                    <span className="text-[9px] text-gray-500 font-mono uppercase block">Fuel</span>
                                    <span className="text-xs font-bold text-emerald-400 font-mono truncate block">
                                      {car.specs?.fuel_type || 'Gasoline'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Card Footer Actions */}
                            <div className="p-4 pt-0 border-t border-white/5 flex items-center justify-between gap-2 mt-2">
                              <button
                                onClick={() => setShowRawJsonId(isJsonOpen ? null : car.id)}
                                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-[11px] font-mono flex items-center space-x-1.5 cursor-pointer border border-white/10"
                              >
                                <Code className="w-3.5 h-3.5 text-blue-400" />
                                <span>{isJsonOpen ? 'Hide JSON' : 'MongoDB Record'}</span>
                              </button>

                              <button
                                onClick={() => handleDeleteCar(car.id, car.name)}
                                className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-200 text-[11px] font-mono flex items-center space-x-1.5 cursor-pointer border border-red-500/30 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete Model</span>
                              </button>
                            </div>

                            {/* Raw JSON viewer */}
                            {isJsonOpen && (
                              <div className="p-4 bg-black/90 border-t border-white/10 font-mono text-[10px] text-emerald-400 overflow-x-auto max-h-60">
                                <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                                  <span className="text-gray-400">collection: bmw_showroom.cars</span>
                                  <button
                                    onClick={() => handleCopyJson(car)}
                                    className="text-gray-400 hover:text-white flex items-center space-x-1"
                                  >
                                    {copiedId === car.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                    <span>{copiedId === car.id ? 'Copied' : 'Copy JSON'}</span>
                                  </button>
                                </div>
                                <pre>{JSON.stringify(car, null, 2)}</pre>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/40">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="bg-white/5 border-b border-white/10 text-gray-400 uppercase text-[10px]">
                          <tr>
                            <th className="p-3">Model</th>
                            <th className="p-3">Series</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Price</th>
                            <th className="p-3">Horsepower</th>
                            <th className="p-3">0-60</th>
                            <th className="p-3">Fuel</th>
                            <th className="p-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-gray-300">
                          {fleetCars.map((car) => (
                            <tr key={car.id} className="hover:bg-white/[0.02]">
                              <td className="p-3">
                                <div className="flex items-center space-x-3">
                                  <img src={car.hero_image} alt={car.name} className="w-10 h-7 object-cover rounded border border-white/10" />
                                  <span className="font-bold text-white">{car.name}</span>
                                </div>
                              </td>
                              <td className="p-3">{car.series}</td>
                              <td className="p-3">{car.category}</td>
                              <td className="p-3 text-white font-bold">${car.base_price?.toLocaleString()}</td>
                              <td className="p-3">{car.specs?.horsepower || 400} HP</td>
                              <td className="p-3 text-blue-400">{car.specs?.acceleration_0_100 || 3.8}s</td>
                              <td className="p-3">{car.specs?.fuel_type || 'Gasoline'}</td>
                              <td className="p-3">
                                <button
                                  onClick={() => handleDeleteCar(car.id, car.name)}
                                  className="text-gray-400 hover:text-red-400 p-1 cursor-pointer"
                                  title="Delete vehicle"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                ) : (
                  <div className="text-center py-12 rounded-xl border border-white/10 bg-black/30 text-gray-500 font-mono text-xs">
                    No BMW models currently found in MongoDB. Click "+ Add BMW Model" or "Reseed Database" below!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reseed Button */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/10">
            <div>
              <h4 className="text-xs font-bold text-white uppercase font-mono">Sync & Reseed All MongoDB Collections</h4>
              <p className="text-[11px] text-gray-400">Refreshes cars, dealerships, test_drives, and loan_applications in MongoDB.</p>
            </div>
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs uppercase font-mono font-bold rounded-lg disabled:opacity-50 cursor-pointer"
            >
              {seeding ? 'Seeding...' : 'Reseed Database'}
            </button>
          </div>
          {seedMessage && (
            <div className="text-xs font-mono text-emerald-400 px-2">{seedMessage}</div>
          )}

        </div>

      </div>

    </div>
  );
}
