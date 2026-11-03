import React, { useState } from 'react';
import { Volume2, ChevronRight, Gauge, Zap, Wind, Sliders, Calendar } from 'lucide-react';
import { soundEngine } from '../utils/sound';

export default function Hero({ flagshipCars = [], onOpenConfigurator, onOpenTestDrive, onExploreModels }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  // Fallback defaults if list is loading
  const currentCar = flagshipCars[selectedIdx] || {
    id: 'bmw-m8-competition-gran-coupe',
    name: 'BMW M8 Competition Gran Coupé',
    tagline: 'Unrivaled luxury meets ferocious motorsport performance.',
    series: 'M Series',
    starting_price: 138800,
    specs: {
      horsepower: 617,
      acceleration_0_100: 3.0,
      top_speed_kmh: 305,
      fuel_type: 'Petrol',
      drivetrain: 'M xDrive'
    },
    hero_image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1600&q=80'
  };

  const handleSoundTest = () => {
    setIsPlayingSound(true);
    const isElectric = currentCar.specs?.fuel_type === 'Electric';
    soundEngine.playEngineRev(isElectric);
    setTimeout(() => setIsPlayingSound(false), 2200);
  };

  return (
    <section className="relative overflow-hidden pt-24 pb-8">
      
      {/* Background Cinematic Image with Luxury Gradient Vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src={currentCar.hero_image}
          alt={currentCar.name}
          className="w-full h-full object-cover object-center scale-105 transition-all duration-1000 brightness-75 filter"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090c] via-[#08090c]/70 to-[#08090c]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08090c] via-[#08090c]/80 to-transparent" />
      </div>

      {/* Main Hero Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          
          {/* Left Column: Headline, Description & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Tagline & Badge */}
            <div className="inline-flex items-center space-x-3">
              <span className="h-6 w-1 m-stripe-vertical rounded-full" />
              <span className="text-xs uppercase font-mono tracking-widest text-blue-400 font-semibold">
                BMW FLAGSHIP FLEET // {currentCar.year || 2025}
              </span>
              {currentCar.badge && (
                <span className="px-2.5 py-0.5 text-[11px] font-bold tracking-wider uppercase bg-white/10 text-white rounded-full border border-white/20">
                  {currentCar.badge}
                </span>
              )}
            </div>

            {/* Model Name */}
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold text-white tracking-tight uppercase leading-none font-sans drop-shadow-md">
              {currentCar.name}
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-gray-300 max-w-xl font-light leading-relaxed">
              {currentCar.tagline}
            </p>

            {/* Price tag */}
            <div className="flex items-baseline space-x-2">
              <span className="text-xs uppercase text-gray-400 font-mono tracking-wider">Starting MSRP</span>
              <span className="text-2xl sm:text-3xl font-bold text-white font-mono">
                ${(currentCar.starting_price || 0).toLocaleString()}
              </span>
            </div>

            {/* Call To Action Buttons */}
            <div className="pt-2 flex flex-wrap gap-4 items-center">
              <button
                onClick={() => onOpenTestDrive(currentCar)}
                className="px-7 py-3.5 rounded-md bg-[#0066b1] hover:bg-[#00528e] text-white text-xs uppercase tracking-widest font-bold transition-all duration-300 shadow-xl shadow-blue-900/40 flex items-center space-x-2 cursor-pointer group"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve Test Drive</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => onOpenConfigurator(currentCar)}
                className="px-6 py-3.5 rounded-md bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs uppercase tracking-widest font-semibold transition-all backdrop-blur-md flex items-center space-x-2 cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-gray-300" />
                <span>Custom Configurator</span>
              </button>

              {/* Sound Engine Test Button */}
              <button
                onClick={handleSoundTest}
                title="Hear the authentic engine roar"
                className={`px-4 py-3.5 rounded-md border text-xs uppercase font-mono tracking-wider transition-all flex items-center space-x-2 cursor-pointer ${
                  isPlayingSound
                    ? 'bg-red-900/40 border-red-500 text-red-300 animate-pulse'
                    : 'bg-black/50 border-white/20 text-gray-300 hover:text-white hover:border-white/40'
                }`}
              >
                <Volume2 className={`w-4 h-4 ${isPlayingSound ? 'text-red-400' : 'text-blue-400'}`} />
                <span>{isPlayingSound ? 'Revving...' : 'Engine Sound'}</span>
              </button>
            </div>

          </div>

          {/* Right Column: Live Performance Telemetry Card */}
          <div className="lg:col-span-5">
            <div className="glass-panel p-6 sm:p-8 rounded-2xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl" />
              
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="text-xs uppercase tracking-wider font-mono text-gray-400">
                  Performance Telemetry
                </span>
                <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/50">
                  {currentCar.specs?.drivetrain || 'xDrive'}
                </span>
              </div>

              {/* Key Specs Grid */}
              <div className="grid grid-cols-3 gap-4 my-6">
                
                {/* 0-100 / 0-60 acceleration */}
                <div className="text-center p-3 rounded-lg bg-black/40 border border-white/5">
                  <div className="flex items-center justify-center text-blue-400 mb-1">
                    <Zap className="w-4 h-4 mr-1" />
                    <span className="text-[10px] uppercase font-mono text-gray-400">0-100 KM/H</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                    {currentCar.specs?.acceleration_0_100 || 3.0}s
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono">Instant Launch</div>
                </div>

                {/* Horsepower */}
                <div className="text-center p-3 rounded-lg bg-black/40 border border-white/5">
                  <div className="flex items-center justify-center text-red-400 mb-1">
                    <Gauge className="w-4 h-4 mr-1" />
                    <span className="text-[10px] uppercase font-mono text-gray-400">POWER</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                    {currentCar.specs?.horsepower || 617}
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono">Horsepower</div>
                </div>

                {/* Top Speed / Range */}
                <div className="text-center p-3 rounded-lg bg-black/40 border border-white/5">
                  <div className="flex items-center justify-center text-emerald-400 mb-1">
                    <Wind className="w-4 h-4 mr-1" />
                    <span className="text-[10px] uppercase font-mono text-gray-400">
                      {currentCar.specs?.electric_range_km ? 'RANGE' : 'TOP SPEED'}
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                    {currentCar.specs?.electric_range_km 
                      ? `${currentCar.specs.electric_range_km}km` 
                      : `${currentCar.specs?.top_speed_kmh || 305}km/h`}
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono">
                    {currentCar.specs?.electric_range_km ? 'EPA Est.' : 'M Driver Limit'}
                  </div>
                </div>

              </div>

              {/* Engine specs details bar */}
              <div className="text-xs text-gray-400 font-mono pt-2 border-t border-white/10 flex justify-between items-center">
                <span className="truncate pr-2">{currentCar.specs?.engine}</span>
                <span className="text-gray-500 uppercase">{currentCar.specs?.fuel_type}</span>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Model Selector Tabs */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase font-mono tracking-widest text-gray-400">
              Select Flagship Showcase:
            </span>
            <button
              onClick={onExploreModels}
              className="text-xs uppercase tracking-wider text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-1"
            >
              <span>View All 8+ Models</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {flagshipCars.slice(0, 4).map((car, idx) => (
              <button
                key={car.id}
                onClick={() => setSelectedIdx(idx)}
                className={`p-3 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                  selectedIdx === idx
                    ? 'bg-white/15 border-blue-500 shadow-lg shadow-blue-950/50'
                    : 'bg-black/40 border-white/5 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono uppercase text-blue-400 font-bold">
                    {car.series}
                  </span>
                  <span className="text-[10px] font-mono text-gray-400">
                    {car.specs?.horsepower} HP
                  </span>
                </div>
                <div className="text-xs font-bold text-white truncate uppercase font-sans">
                  {car.name.replace('BMW ', '')}
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

