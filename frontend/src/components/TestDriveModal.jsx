import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, User, Mail, Phone, CheckCircle2, AlertCircle, Sparkles, Sliders, Shield, Code, ChevronDown, ChevronUp } from 'lucide-react';
import confetti from 'canvas-confetti';
import { bookTestDrive } from '../utils/api';

export default function TestDriveModal({ 
  car: initialCar, 
  allCars = [], 
  dealerships = [], 
  initialConfig = null,
  initialNotes = '', 
  onClose,
  onBookingSuccess 
}) {
  const [selectedCarId, setSelectedCarId] = useState(initialCar?.id || allCars[0]?.id || '');
  
  // Customer details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('United States');
  const [hasValidLicense, setHasValidLicense] = useState(true);

  // Vehicle configuration choices
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedWheelIdx, setSelectedWheelIdx] = useState(0);
  const [selectedInteriorIdx, setSelectedInteriorIdx] = useState(0);

  // Appointment details
  const [dealershipName, setDealershipName] = useState(dealerships[0]?.name || 'BMW of Manhattan Flagship');
  const [preferredDate, setPreferredDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [preferredTime, setPreferredTime] = useState('11:00 AM');
  const [experienceType, setExperienceType] = useState('Standard Road Test');
  const [financingPreference, setFinancingPreference] = useState('BMW Select Financing');
  const [notes, setNotes] = useState(initialNotes || '');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [showJsonRaw, setShowJsonRaw] = useState(false);

  const selectedCar = allCars.find(c => c.id === selectedCarId) || initialCar || allCars[0];

  // Set initial configuration if passed from configurator
  useEffect(() => {
    if (initialConfig && selectedCar) {
      if (initialConfig.colorIdx !== undefined) setSelectedColorIdx(initialConfig.colorIdx);
      if (initialConfig.wheelIdx !== undefined) setSelectedWheelIdx(initialConfig.wheelIdx);
      if (initialConfig.interiorIdx !== undefined) setSelectedInteriorIdx(initialConfig.interiorIdx);
    }
  }, [initialConfig, selectedCar]);

  if (!selectedCar) return null;

  const currentColor = selectedCar.colors?.[selectedColorIdx] || selectedCar.colors?.[0] || { name: 'Alpine White', hex: '#ffffff', price: 0 };
  const currentWheel = selectedCar.wheels?.[selectedWheelIdx] || selectedCar.wheels?.[0] || { name: 'Standard Wheels', size: '20 inch', price: 0 };
  const currentInterior = selectedCar.interiors?.[selectedInteriorIdx] || selectedCar.interiors?.[0] || { name: 'Merino Leather', color: 'Black', hex: '#111', price: 0 };

  const optionsTotal = (currentColor.price || 0) + (currentWheel.price || 0) + (currentInterior.price || 0);
  const totalPrice = (selectedCar.starting_price || 0) + optionsTotal;

  const currentDealerObj = dealerships.find(d => d.name === dealershipName) || dealerships[0] || {
    address: '555 W 57th St',
    city: 'New York, NY 10019',
    phone: '+1 (212) 586-2269'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Complete comprehensive dataset stored directly in MongoDB
      const payload = {
        // Driver Details
        name,
        email,
        phone,
        customer_city: city || 'Not specified',
        customer_country: country,
        has_valid_license: hasValidLicense,

        // Complete Vehicle Identity
        car_id: selectedCar.id,
        car_name: selectedCar.name,
        car_series: selectedCar.series,
        car_category: selectedCar.category,
        car_image: selectedCar.hero_image,
        base_price: selectedCar.starting_price,
        total_price: totalPrice,

        // Exact Selected Customizations
        selected_color: {
          name: currentColor.name,
          hex: currentColor.hex,
          price: currentColor.price || 0
        },
        selected_wheel: {
          name: currentWheel.name,
          size: currentWheel.size,
          price: currentWheel.price || 0
        },
        selected_interior: {
          name: currentInterior.name,
          color: currentInterior.color,
          material: currentInterior.material,
          hex: currentInterior.hex,
          price: currentInterior.price || 0
        },

        // Full Performance Specs
        car_specs: {
          engine: selectedCar.specs?.engine,
          horsepower: selectedCar.specs?.horsepower,
          torque: selectedCar.specs?.torque,
          acceleration_0_100: selectedCar.specs?.acceleration_0_100,
          top_speed_kmh: selectedCar.specs?.top_speed_kmh,
          drivetrain: selectedCar.specs?.drivetrain,
          transmission: selectedCar.specs?.transmission,
          fuel_type: selectedCar.specs?.fuel_type,
          electric_range_km: selectedCar.specs?.electric_range_km
        },

        // Reservation Scheduling
        preferred_date: preferredDate,
        preferred_time: preferredTime,
        dealership: dealershipName,
        dealership_address: currentDealerObj.address,
        dealership_phone: currentDealerObj.phone,
        experience_type: experienceType,

        // Financial & Ownership intent
        financing_preference: financingPreference,
        notes: notes || 'None'
      };

      const res = await bookTestDrive(payload);
      
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (cErr) {
        // ignore
      }

      setConfirmedBooking(res.booking);
      if (onBookingSuccess) onBookingSuccess(res.booking);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to submit test drive request. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      
      <div className="relative w-full max-w-4xl bg-[#0c0e14] border border-white/15 rounded-3xl shadow-2xl overflow-hidden text-gray-200">
        
        {/* Top M-Stripe */}
        <div className="h-1.5 w-full m-stripe" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2 rounded-full bg-black/60 hover:bg-black text-gray-400 hover:text-white border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
          
          {confirmedBooking ? (
            /* Confirmation Screen with Complete Data Verification */
            <div className="space-y-6">
              
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <span className="text-xs font-mono uppercase text-emerald-400 tracking-widest font-bold block">
                  VIP Reservation Confirmed
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white uppercase font-sans">
                  Booking Reference Created
                </h3>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  Your customized vehicle configuration, specs, driver credentials, and schedule have been registered with your selected center.
                </p>
              </div>

              {/* Complete Booking Card */}
              <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-5">
                
                {/* Vehicle Header with Image */}
                <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-white/10 pb-4">
                  <img
                    src={confirmedBooking.car_image || selectedCar.hero_image}
                    alt={confirmedBooking.car_name}
                    className="w-28 h-20 rounded-xl object-cover border border-white/10"
                  />
                  <div className="text-center sm:text-left flex-1">
                    <span className="text-[10px] uppercase font-mono text-blue-400 font-bold">
                      {confirmedBooking.car_series} // {confirmedBooking.id}
                    </span>
                    <h4 className="text-xl font-bold text-white uppercase">{confirmedBooking.car_name}</h4>
                    <span className="text-xs font-mono text-gray-400">
                      Total Configured Price: <strong className="text-white">${confirmedBooking.total_price?.toLocaleString()}</strong>
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                    {confirmedBooking.status || 'Confirmed'}
                  </span>
                </div>

                {/* 3-Column Detailed Data Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                  
                  {/* Column 1: Customer Profile */}
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                    <span className="text-[10px] uppercase text-gray-500 font-bold block border-b border-white/5 pb-1">Driver Profile</span>
                    <div><span className="text-gray-400">Name:</span> <strong className="text-white">{confirmedBooking.name}</strong></div>
                    <div><span className="text-gray-400">Email:</span> <span className="text-blue-300">{confirmedBooking.email}</span></div>
                    <div><span className="text-gray-400">Phone:</span> <span className="text-white">{confirmedBooking.phone}</span></div>
                    <div><span className="text-gray-400">City:</span> <span className="text-white">{confirmedBooking.customer_city || 'N/A'}</span></div>
                    <div><span className="text-gray-400">License:</span> <span className="text-emerald-400">Verified (Active)</span></div>
                  </div>

                  {/* Column 2: Exact Customization Options */}
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                    <span className="text-[10px] uppercase text-gray-500 font-bold block border-b border-white/5 pb-1">Configured Options</span>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-gray-400">Paint:</span>
                      <span 
                        style={{ backgroundColor: confirmedBooking.selected_color?.hex }} 
                        className="w-3 h-3 rounded-full border border-white/40"
                      />
                      <strong className="text-white truncate">{confirmedBooking.selected_color?.name}</strong>
                    </div>
                    <div><span className="text-gray-400">Wheels:</span> <span className="text-white truncate">{confirmedBooking.selected_wheel?.name}</span></div>
                    <div><span className="text-gray-400">Interior:</span> <span className="text-white truncate">{confirmedBooking.selected_interior?.name}</span></div>
                    <div><span className="text-gray-400">Financing:</span> <span className="text-blue-400">{confirmedBooking.financing_preference}</span></div>
                  </div>

                  {/* Column 3: Appointment & Dealership */}
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                    <span className="text-[10px] uppercase text-gray-500 font-bold block border-b border-white/5 pb-1">Schedule & Center</span>
                    <div><span className="text-gray-400">Date:</span> <strong className="text-white">{confirmedBooking.preferred_date}</strong></div>
                    <div><span className="text-gray-400">Time:</span> <strong className="text-white">{confirmedBooking.preferred_time}</strong></div>
                    <div><span className="text-gray-400">Center:</span> <span className="text-white">{confirmedBooking.dealership}</span></div>
                    <div><span className="text-gray-400">Experience:</span> <span className="text-blue-300">{confirmedBooking.experience_type}</span></div>
                  </div>

                </div>

                {/* Optional Raw JSON Inspector */}
                <div className="pt-2">
                  <button
                    onClick={() => setShowJsonRaw(!showJsonRaw)}
                    className="text-[11px] font-mono text-gray-400 hover:text-white flex items-center space-x-1"
                  >
                    <Code className="w-3.5 h-3.5 text-blue-400" />
                    <span>{showJsonRaw ? 'Hide Reservation Summary' : 'View Reservation Summary (JSON)'}</span>
                    {showJsonRaw ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {showJsonRaw && (
                    <pre className="mt-3 p-4 rounded-xl bg-black border border-white/10 text-emerald-400 text-[10px] overflow-x-auto max-h-48 font-mono">
                      {JSON.stringify(confirmedBooking, null, 2)}
                    </pre>
                  )}
                </div>

              </div>

              <div className="flex justify-center">
                <button
                  onClick={onClose}
                  className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs uppercase font-bold tracking-widest cursor-pointer shadow-lg shadow-blue-900/40"
                >
                  Return to Showroom
                </button>
              </div>

            </div>
          ) : (
            /* Comprehensive Booking Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Header */}
              <div>
                <span className="text-blue-400 font-mono text-xs uppercase tracking-widest font-bold">
                  BMW Concierge Services // VIP Booking
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white uppercase font-sans mt-1">
                  VIP Reservation & Custom Build
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">
                  Your customized vehicle configuration, specifications, driver details, and preferred schedule will be registered with your authorized center.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-950/60 border border-red-500 text-red-200 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* 1. Vehicle Selection & Live Preview */}
              <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <label className="text-xs uppercase font-mono text-gray-400 block">1. Select Vehicle</label>
                    <select
                      value={selectedCarId}
                      onChange={(e) => {
                        setSelectedCarId(e.target.value);
                        setSelectedColorIdx(0);
                        setSelectedWheelIdx(0);
                        setSelectedInteriorIdx(0);
                      }}
                      className="mt-1 bg-black/70 border border-white/15 text-white text-sm rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      {allCars.map((c) => (
                        <option key={c.id} value={c.id}>{c.name} — ${c.starting_price.toLocaleString()}</option>
                      ))}
                    </select>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-[10px] uppercase text-gray-400 block">Total Configured Price</span>
                    <span className="text-2xl font-bold text-white">${totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* Configuration Options (Color, Wheels, Interior) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/10 font-mono text-xs">
                  
                  {/* Color */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 uppercase">Exterior Paint</label>
                    <select
                      value={selectedColorIdx}
                      onChange={(e) => setSelectedColorIdx(Number(e.target.value))}
                      className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-2 text-white text-xs"
                    >
                      {selectedCar.colors?.map((col, idx) => (
                        <option key={idx} value={idx}>{col.name} ({col.price ? `+$${col.price}` : 'Incl.'})</option>
                      ))}
                    </select>
                  </div>

                  {/* Wheels */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 uppercase">Wheels</label>
                    <select
                      value={selectedWheelIdx}
                      onChange={(e) => setSelectedWheelIdx(Number(e.target.value))}
                      className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-2 text-white text-xs"
                    >
                      {selectedCar.wheels?.map((wh, idx) => (
                        <option key={idx} value={idx}>{wh.name} ({wh.price ? `+$${wh.price}` : 'Incl.'})</option>
                      ))}
                    </select>
                  </div>

                  {/* Interior */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 uppercase">Interior Upholstery</label>
                    <select
                      value={selectedInteriorIdx}
                      onChange={(e) => setSelectedInteriorIdx(Number(e.target.value))}
                      className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-2 text-white text-xs"
                    >
                      {selectedCar.interiors?.map((it, idx) => (
                        <option key={idx} value={idx}>{it.name} ({it.price ? `+$${it.price}` : 'Incl.'})</option>
                      ))}
                    </select>
                  </div>

                </div>
              </div>

              {/* 2. Driver Personal Details */}
              <div className="space-y-3">
                <label className="text-xs uppercase font-mono text-gray-400 block font-bold">
                  2. Driver Contact & Credentials
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      required
                      placeholder="Full Legal Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-white/15 text-white text-xs rounded-xl font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-white/15 text-white text-xs rounded-xl font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="tel"
                      required
                      placeholder="Phone Number (e.g. 6304677919)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-white/15 text-white text-xs rounded-xl font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="City / Region"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-white/15 text-white text-xs rounded-xl font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="validLicense"
                    checked={hasValidLicense}
                    onChange={(e) => setHasValidLicense(e.target.checked)}
                    className="accent-blue-600 rounded"
                  />
                  <label htmlFor="validLicense" className="text-xs font-mono text-gray-300">
                    I hold a valid driver's license and confirm age 21+ for high-performance track sessions.
                  </label>
                </div>
              </div>

              {/* 3. Dealership, Date, Time & Experience */}
              <div className="space-y-3">
                <label className="text-xs uppercase font-mono text-gray-400 block font-bold">
                  3. Showroom Location & Schedule
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 uppercase font-mono">Flagship Showroom</span>
                    <select
                      value={dealershipName}
                      onChange={(e) => setDealershipName(e.target.value)}
                      className="w-full bg-black/60 border border-white/15 text-white text-xs rounded-xl px-3 py-2.5 font-mono focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      {dealerships.length > 0 ? (
                        dealerships.map((d) => (
                          <option key={d.id} value={d.name}>{d.name} ({d.city})</option>
                        ))
                      ) : (
                        <option value="BMW of Manhattan Flagship">BMW of Manhattan Flagship</option>
                      )}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 uppercase font-mono">Driving Session</span>
                    <select
                      value={experienceType}
                      onChange={(e) => setExperienceType(e.target.value)}
                      className="w-full bg-black/60 border border-white/15 text-white text-xs rounded-xl px-3 py-2.5 font-mono focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="Standard Road Test">Standard Road Test (30 Min)</option>
                      <option value="M Performance Track Experience">M Performance Track Experience (60 Min)</option>
                      <option value="VIP Executive Chauffeur & Tour">VIP Executive Chauffeur & Tour</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 uppercase font-mono">Date</span>
                    <input
                      type="date"
                      required
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full bg-black/60 border border-white/15 text-white text-xs rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 uppercase font-mono">Time Slot</span>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full bg-black/60 border border-white/15 text-white text-xs rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:30 AM">11:30 AM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="03:30 PM">03:30 PM</option>
                      <option value="05:00 PM">05:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 4. Financing Intent & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-mono">Purchase / Financing Intent</span>
                  <select
                    value={financingPreference}
                    onChange={(e) => setFinancingPreference(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 text-white text-xs rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="BMW Select Financing">BMW Select Financing</option>
                    <option value="BMW Executive Lease">BMW Executive Lease</option>
                    <option value="Outright Cash Purchase">Outright Cash Purchase</option>
                    <option value="Corporate Fleet / Commercial">Corporate Fleet / Commercial</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-mono">Special Requests / Notes</span>
                  <input
                    type="text"
                    placeholder="e.g. Interested in carbon brakes, sound test..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 text-white text-xs rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-[#0066b1] hover:bg-[#00528e] text-white text-xs uppercase tracking-widest font-bold transition-all shadow-xl shadow-blue-900/50 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{loading ? 'Processing VIP Reservation...' : 'Confirm VIP Reservation'}</span>
                </button>
                <span className="text-[10px] text-gray-400 text-center block mt-2 font-mono">
                  A BMW Product Genius will confirm your vehicle reservation and appointment within 24 hours.
                </span>
              </div>

            </form>
          )}

        </div>

      </div>

    </div>
  );
}
