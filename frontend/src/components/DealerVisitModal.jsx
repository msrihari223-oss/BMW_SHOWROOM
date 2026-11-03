import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Phone, Mail, User, CheckCircle2, AlertCircle, Code, ChevronDown, ChevronUp, Users, Building, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { bookShowroomVisit } from '../utils/api';

export default function DealerVisitModal({ 
  dealership, 
  allDealerships = [], 
  cars = [], 
  onClose, 
  onBookingSuccess 
}) {
  const [selectedDealerId, setSelectedDealerId] = useState(dealership?.id || allDealerships[0]?.id || '');
  
  // Guest Details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [numGuests, setNumGuests] = useState(1);

  // Visit Details
  const [visitType, setVisitType] = useState('Private VIP Showroom Tour');
  const [vehicleInterest, setVehicleInterest] = useState('BMW M8 Competition Gran Coupé & XM');
  const [preferredDate, setPreferredDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [preferredTime, setPreferredTime] = useState('11:00 AM');
  const [specialRequests, setSpecialRequests] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [showJsonRaw, setShowJsonRaw] = useState(false);

  const activeDealer = allDealerships.find(d => d.id === selectedDealerId) || dealership || allDealerships[0] || {
    name: 'BMW of Manhattan Flagship',
    address: '555 W 57th St',
    city: 'New York, NY 10019',
    phone: '+1 (212) 586-2269',
    hours: 'Mon-Sat: 9:00 AM - 7:00 PM',
    image: 'https://images.unsplash.com/photo-1616591938203-9b5630a01006?auto=format&fit=crop&w=800&q=80'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        name,
        email,
        phone,
        city: city || activeDealer.city.split(',')[0],
        num_guests: Number(numGuests),
        dealership_id: activeDealer.id,
        dealership_name: activeDealer.name,
        dealership_address: `${activeDealer.address}, ${activeDealer.city}`,
        dealership_phone: activeDealer.phone,
        visit_type: visitType,
        preferred_date: preferredDate,
        preferred_time: preferredTime,
        vehicle_interest: vehicleInterest,
        special_requests: specialRequests || 'VIP Concierge Reception',
        booking_type: 'Showroom Visit'
      };

      const res = await bookShowroomVisit(payload);

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
      setError(err.message || 'Failed to submit showroom reservation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      
      <div className="relative w-full max-w-3xl bg-[#0c0e14] border border-white/15 rounded-3xl shadow-2xl overflow-hidden text-gray-200">
        
        {/* Top M-Stripe */}
        <div className="h-1.5 w-full m-stripe" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2 rounded-full bg-black/60 hover:bg-black text-gray-400 hover:text-white border border-white/10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
          
          {confirmedBooking ? (
            /* Confirmation Pass */
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-mono uppercase text-emerald-400 tracking-widest font-bold block">
                  VIP Showroom Reservation Confirmed
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white uppercase font-sans mt-1">
                  Private Consultation Reserved
                </h3>
                <p className="text-xs text-gray-400 max-w-md mx-auto mt-1">
                  Your appointment has been registered at {confirmedBooking.dealership_name}. A BMW Private Concierge will welcome you upon arrival.
                </p>
              </div>

              {/* VIP Pass Summary Card */}
              <div className="glass-card rounded-2xl p-6 border border-white/10 text-left space-y-4 max-w-lg mx-auto font-mono text-xs">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-gray-400">Reservation Pass:</span>
                  <span className="text-sm font-bold text-blue-400">{confirmedBooking.id}</span>
                </div>

                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="text-gray-400">Showroom Center:</span>
                  <strong className="text-white text-right">{confirmedBooking.dealership_name}</strong>
                </div>

                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="text-gray-400">Address:</span>
                  <span className="text-white text-right">{confirmedBooking.dealership_address}</span>
                </div>

                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="text-gray-400">Date & Time:</span>
                  <span className="text-white font-bold">{confirmedBooking.preferred_date} @ {confirmedBooking.preferred_time}</span>
                </div>

                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="text-gray-400">Experience:</span>
                  <span className="text-blue-300 font-bold">{confirmedBooking.visit_type}</span>
                </div>

                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="text-gray-400">Guest Name:</span>
                  <strong className="text-white">{confirmedBooking.name} ({confirmedBooking.num_guests} Guests)</strong>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Status:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-800">
                    {confirmedBooking.status || 'Confirmed'}
                  </span>
                </div>

                {/* Raw JSON Toggle */}
                <div className="pt-2">
                  <button
                    onClick={() => setShowJsonRaw(!showJsonRaw)}
                    className="text-[11px] text-gray-400 hover:text-white flex items-center space-x-1"
                  >
                    <Code className="w-3.5 h-3.5 text-blue-400" />
                    <span>{showJsonRaw ? 'Hide Reservation Details' : 'View Reservation Summary (JSON)'}</span>
                    {showJsonRaw ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {showJsonRaw && (
                    <pre className="mt-2 p-3 rounded-lg bg-black border border-white/10 text-emerald-400 text-[10px] overflow-x-auto max-h-48 font-mono">
                      {JSON.stringify(confirmedBooking, null, 2)}
                    </pre>
                  )}
                </div>
              </div>

              <button
                onClick={onClose}
                className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs uppercase font-bold tracking-widest cursor-pointer shadow-lg shadow-blue-900/40"
              >
                Done
              </button>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Header with Dealership Hero */}
              <div className="flex items-center space-x-4 border-b border-white/10 pb-4">
                <img
                  src={activeDealer.image}
                  alt={activeDealer.name}
                  className="w-24 h-16 rounded-xl object-cover border border-white/10"
                />
                <div>
                  <span className="text-xs uppercase font-mono text-blue-400 font-bold">
                    Official Showroom Reservation // VIP Concierge
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white uppercase font-sans">
                    {activeDealer.name}
                  </h3>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">
                    {activeDealer.address}, {activeDealer.city} • {activeDealer.phone}
                  </p>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-950/60 border border-red-500 text-red-200 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Dealership Switcher */}
              <div className="space-y-1">
                <label className="text-xs uppercase font-mono text-gray-400">Selected Showroom Center</label>
                <select
                  value={selectedDealerId}
                  onChange={(e) => setSelectedDealerId(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 text-white text-xs rounded-xl px-3 py-2.5 font-mono focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {allDealerships.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.city})
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience Type & Vehicle Interest */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs uppercase font-mono text-gray-400">Visit / Consultation Type</label>
                  <select
                    value={visitType}
                    onChange={(e) => setVisitType(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 text-white text-xs rounded-xl px-3 py-2.5 font-mono focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="Private VIP Showroom Tour">Private VIP Showroom Tour</option>
                    <option value="Product Genius 1-on-1 Consultation">Product Genius Consultation</option>
                    <option value="M Motorsport Studio Experience">M Motorsport Studio Experience</option>
                    <option value="Vehicle Delivery & Handover Ceremony">Vehicle Delivery Ceremony</option>
                    <option value="Corporate Fleet & Business Inquiry">Corporate Fleet Inquiry</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase font-mono text-gray-400">Primary Vehicle of Interest</label>
                  <select
                    value={vehicleInterest}
                    onChange={(e) => setVehicleInterest(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 text-white text-xs rounded-xl px-3 py-2.5 font-mono focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="All Flagship Models">All Flagship Models</option>
                    {cars.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date, Time & Number of Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs uppercase font-mono text-gray-400">Date</label>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 text-white text-xs rounded-xl px-3 py-2.5 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase font-mono text-gray-400">Time Slot</label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 text-white text-xs rounded-xl px-3 py-2.5 font-mono focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="09:30 AM">09:30 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="01:30 PM">01:30 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                    <option value="06:30 PM">06:30 PM</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase font-mono text-gray-400">Guests</label>
                  <select
                    value={numGuests}
                    onChange={(e) => setNumGuests(Number(e.target.value))}
                    className="w-full bg-black/60 border border-white/15 text-white text-xs rounded-xl px-3 py-2.5 font-mono focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="1">1 Guest (Solo)</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4+ VIP Party</option>
                  </select>
                </div>
              </div>

              {/* Guest Profile Details */}
              <div className="space-y-3 pt-1">
                <label className="text-xs uppercase font-mono text-gray-400 block font-bold">
                  Guest Contact Details
                </label>

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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      placeholder="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-white/15 text-white text-xs rounded-xl font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-gray-400">Special VIP Requests</label>
                  <input
                    type="text"
                    placeholder="e.g. Private lounge reservation, product handover, accessibility..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
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
                  <span>{loading ? 'Confirming Reservation...' : 'Confirm VIP Showroom Visit'}</span>
                </button>
                <span className="text-[10px] text-gray-500 text-center block mt-2 font-mono">
                  A BMW Private Concierge will prepare your itinerary and welcome you upon arrival.
                </span>
              </div>

            </form>
          )}

        </div>

      </div>

    </div>
  );
}

