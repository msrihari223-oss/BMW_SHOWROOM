import React from 'react';
import { Gauge, Zap, Wind, Sliders, Calendar, Info, Check } from 'lucide-react';

export default function CarCard({ 
  car, 
  onSelectCar, 
  onConfigure, 
  onBookTestDrive,
  onToggleCompare,
  isCompared = false 
}) {
  const isElectric = car.specs?.fuel_type === 'Electric';
  const isHybrid = car.specs?.fuel_type === 'Hybrid';

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col group relative">
      
      {/* Top badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
        <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-white rounded border border-white/10">
          {car.series}
        </span>
        {car.badge && (
          <span className={`px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider rounded border ${
            isElectric 
              ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40' 
              : 'bg-red-950/80 text-red-300 border-red-500/40'
          }`}>
            {car.badge}
          </span>
        )}
      </div>

      {/* Compare check button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => onToggleCompare(car)}
          title={isCompared ? "Remove from comparison" : "Add to comparison"}
          className={`p-2 rounded-full backdrop-blur-md border text-xs transition-all ${
            isCompared
              ? 'bg-[#0066b1] text-white border-blue-400 shadow-md shadow-blue-900/50'
              : 'bg-black/60 text-gray-300 border-white/10 hover:border-white/30'
          }`}
        >
          {isCompared ? <Check className="w-3.5 h-3.5" /> : <span className="text-[10px] font-mono font-bold px-1">VS</span>}
        </button>
      </div>

      {/* Car Image Preview */}
      <div 
        className="relative h-56 overflow-hidden bg-gradient-to-b from-gray-900/40 to-black/60 cursor-pointer"
        onClick={() => onSelectCar(car)}
      >
        <img
          src={car.hero_image}
          alt={car.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e14] via-transparent to-transparent opacity-80" />
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Title and Tagline */}
        <div>
          <h3 
            onClick={() => onSelectCar(car)}
            className="text-lg font-bold text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors cursor-pointer"
          >
            {car.name}
          </h3>
          <p className="text-xs text-gray-400 line-clamp-1 mt-1 font-light">
            {car.tagline}
          </p>
        </div>

        {/* Color Palette Previews */}
        {car.colors && car.colors.length > 0 && (
          <div className="flex items-center space-x-1.5 pt-1">
            <span className="text-[10px] uppercase font-mono text-gray-500 mr-1">Colors:</span>
            {car.colors.slice(0, 5).map((color, cIdx) => (
              <span
                key={cIdx}
                title={color.name}
                style={{ backgroundColor: color.hex }}
                className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
              />
            ))}
            {car.colors.length > 5 && (
              <span className="text-[10px] text-gray-500 font-mono">+{car.colors.length - 5}</span>
            )}
          </div>
        )}

        {/* Key 3 Specs Grid */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/10 text-center font-mono">
          <div className="p-1.5 rounded bg-black/40">
            <div className="text-[10px] text-gray-400 flex items-center justify-center">
              <Zap className="w-3 h-3 mr-0.5 text-blue-400" /> 0-100
            </div>
            <div className="text-xs font-bold text-white mt-0.5">
              {car.specs?.acceleration_0_100}s
            </div>
          </div>

          <div className="p-1.5 rounded bg-black/40">
            <div className="text-[10px] text-gray-400 flex items-center justify-center">
              <Gauge className="w-3 h-3 mr-0.5 text-red-400" /> POWER
            </div>
            <div className="text-xs font-bold text-white mt-0.5">
              {car.specs?.horsepower} HP
            </div>
          </div>

          <div className="p-1.5 rounded bg-black/40">
            <div className="text-[10px] text-gray-400 flex items-center justify-center">
              <Wind className="w-3 h-3 mr-0.5 text-emerald-400" />
              {car.specs?.electric_range_km ? 'RANGE' : 'TOP'}
            </div>
            <div className="text-xs font-bold text-white mt-0.5">
              {car.specs?.electric_range_km ? `${car.specs.electric_range_km}km` : `${car.specs?.top_speed_kmh}km/h`}
            </div>
          </div>
        </div>

        {/* Price and Action Buttons */}
        <div className="pt-1">
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-[10px] uppercase font-mono text-gray-400">Starting MSRP</span>
            <span className="text-lg font-bold text-white font-mono">
              ${car.starting_price.toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onConfigure(car)}
              className="py-2.5 px-3 rounded-md bg-white/10 hover:bg-white/20 border border-white/15 text-white text-[11px] uppercase tracking-wider font-semibold transition-all flex items-center justify-center space-x-1 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-400" />
              <span>Configure</span>
            </button>

            <button
              onClick={() => onBookTestDrive(car)}
              className="py-2.5 px-3 rounded-md bg-[#0066b1] hover:bg-[#00528e] text-white text-[11px] uppercase tracking-wider font-semibold transition-all flex items-center justify-center space-x-1 shadow-md shadow-blue-950 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Test Drive</span>
            </button>
          </div>

          <button
            onClick={() => onSelectCar(car)}
            className="w-full mt-2 py-1.5 text-[11px] text-gray-400 hover:text-white flex items-center justify-center space-x-1 transition-colors"
          >
            <Info className="w-3 h-3" />
            <span>Full Technical Details</span>
          </button>
        </div>

      </div>

    </div>
  );
}

