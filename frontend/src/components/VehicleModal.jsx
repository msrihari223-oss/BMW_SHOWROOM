import React, { useState } from 'react';
import { X, Zap, Gauge, Wind, Fuel, Shield, Sliders, Calendar, ChevronRight } from 'lucide-react';

export default function VehicleModal({ car, onClose, onConfigure, onBookTestDrive }) {
  if (!car) return null;

  const [activeImage, setActiveImage] = useState(car.hero_image);

  const images = [car.hero_image, ...(car.gallery || [])];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      
      {/* Modal Dialog Container */}
      <div className="relative w-full max-w-5xl bg-[#0d0f16] border border-white/15 rounded-3xl shadow-2xl overflow-hidden text-gray-200">
        
        {/* Top M Stripe accent */}
        <div className="h-1 w-full m-stripe" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2 rounded-full bg-black/60 hover:bg-black text-gray-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
          
          {/* Header Info */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-blue-400 font-mono text-xs uppercase tracking-widest">
              <span>{car.series}</span>
              <span>//</span>
              <span>{car.year} Model Year</span>
              {car.badge && (
                <span className="ml-2 px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold">
                  {car.badge}
                </span>
              )}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tight font-sans mt-1">
              {car.name}
            </h2>
            <p className="text-gray-400 text-sm mt-1">{car.tagline}</p>
          </div>

          {/* Photo Gallery & Thumbnail Switcher */}
          <div className="space-y-3 mb-8">
            <div className="h-72 sm:h-96 w-full rounded-2xl overflow-hidden bg-black relative">
              <img
                src={activeImage}
                alt={car.name}
                className="w-full h-full object-cover object-center transition-all duration-300"
              />
            </div>

            {images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`h-16 w-24 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                      activeImage === img ? 'border-blue-500 scale-105' : 'border-white/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-xs uppercase font-mono tracking-wider text-gray-400 mb-2">Vehicle Overview</h3>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-light">
              {car.description}
            </p>
          </div>

          {/* Technical Specifications Grid */}
          <div className="mb-8">
            <h3 className="text-xs uppercase font-mono tracking-wider text-gray-400 mb-4">
              Comprehensive Technical Specifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
              
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-gray-500 block text-[10px] uppercase">Engine</span>
                <span className="text-white font-bold">{car.specs?.engine}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-gray-500 block text-[10px] uppercase">Horsepower</span>
                <span className="text-white font-bold">{car.specs?.horsepower} HP</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-gray-500 block text-[10px] uppercase">Torque</span>
                <span className="text-white font-bold">{car.specs?.torque}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-gray-500 block text-[10px] uppercase">Acceleration (0-100 km/h)</span>
                <span className="text-white font-bold">{car.specs?.acceleration_0_100} seconds</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-gray-500 block text-[10px] uppercase">Top Track Speed</span>
                <span className="text-white font-bold">{car.specs?.top_speed_kmh} km/h</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-gray-500 block text-[10px] uppercase">Drivetrain</span>
                <span className="text-white font-bold">{car.specs?.drivetrain}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-gray-500 block text-[10px] uppercase">Transmission</span>
                <span className="text-white font-bold">{car.specs?.transmission}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-gray-500 block text-[10px] uppercase">Fuel / Energy Type</span>
                <span className="text-white font-bold">{car.specs?.fuel_type}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-gray-500 block text-[10px] uppercase">
                  {car.specs?.electric_range_km ? 'Electric Range' : 'Fuel Economy'}
                </span>
                <span className="text-white font-bold">
                  {car.specs?.electric_range_km ? `${car.specs.electric_range_km} km` : car.specs?.fuel_economy || '18 mpg comb.'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-gray-500 block text-[10px] uppercase">Cargo Volume</span>
                <span className="text-white font-bold">{car.specs?.cargo_capacity || '15 cu.ft'}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-gray-500 block text-[10px] uppercase">Starting MSRP</span>
                <span className="text-blue-400 font-bold">${car.starting_price.toLocaleString()}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-gray-500 block text-[10px] uppercase">Warranty</span>
                <span className="text-white font-bold">4 yr / 50,000 miles BMW Ultimate Care</span>
              </div>

            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-mono text-gray-400 block">Base Starting Price</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                ${car.starting_price.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                onClick={() => {
                  onClose();
                  onConfigure(car);
                }}
                className="flex-1 sm:flex-initial px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center space-x-2"
              >
                <Sliders className="w-4 h-4 text-blue-400" />
                <span>Open Configurator</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onBookTestDrive(car);
                }}
                className="flex-1 sm:flex-initial px-7 py-3 rounded-lg bg-[#0066b1] hover:bg-[#00528e] text-white text-xs uppercase tracking-wider font-bold transition-all shadow-lg shadow-blue-900/40 flex items-center justify-center space-x-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book VIP Test Drive</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

