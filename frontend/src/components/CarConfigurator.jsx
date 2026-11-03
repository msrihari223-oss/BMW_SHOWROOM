import React, { useState, useEffect } from 'react';
import { Volume2, Check, Sparkles, Sliders, Calendar, ArrowRight, RotateCcw } from 'lucide-react';
import { soundEngine } from '../utils/sound';

export default function CarConfigurator({ 
  cars = [], 
  selectedCar: initialCar, 
  onBookTestDrive 
}) {
  const [activeCarId, setActiveCarId] = useState(initialCar?.id || cars[0]?.id || 'bmw-m8-competition-gran-coupe');
  const [activeColorIdx, setActiveColorIdx] = useState(0);
  const [activeWheelIdx, setActiveWheelIdx] = useState(0);
  const [activeInteriorIdx, setActiveInteriorIdx] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    if (initialCar?.id) {
      setActiveCarId(initialCar.id);
      setActiveColorIdx(0);
      setActiveWheelIdx(0);
      setActiveInteriorIdx(0);
    }
  }, [initialCar]);

  const car = cars.find(c => c.id === activeCarId) || cars[0] || initialCar;

  if (!car) return null;

  const currentColor = car.colors?.[activeColorIdx] || car.colors?.[0] || { name: 'Alpine White', hex: '#ffffff', price: 0 };
  const currentWheel = car.wheels?.[activeWheelIdx] || car.wheels?.[0] || { name: 'Standard M Wheels', size: '20 inch', price: 0 };
  const currentInterior = car.interiors?.[activeInteriorIdx] || car.interiors?.[0] || { name: 'Merino Leather', material: 'Leather', hex: '#111', price: 0 };

  const totalPrice = car.starting_price + (currentColor.price || 0) + (currentWheel.price || 0) + (currentInterior.price || 0);

  const handleRevEngine = () => {
    setIsPlayingAudio(true);
    soundEngine.playEngineRev(car.specs?.fuel_type === 'Electric');
    setTimeout(() => setIsPlayingAudio(false), 2200);
  };

  const handleBookWithSpec = () => {
    const configData = {
      colorIdx: activeColorIdx,
      wheelIdx: activeWheelIdx,
      interiorIdx: activeInteriorIdx,
      totalPrice: totalPrice,
      color: currentColor,
      wheel: currentWheel,
      interior: currentInterior
    };
    onBookTestDrive(car, `Custom Studio Build: ${currentColor.name} paint, ${currentWheel.name}, ${currentInterior.name}. Estimated MSRP: $${totalPrice.toLocaleString()}`, configData);
  };

  return (
    <section id="configurator" className="py-24 bg-gradient-to-b from-[#08090c] via-[#0e1017] to-[#08090c] relative">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 text-blue-400 font-mono text-xs uppercase tracking-widest mb-2 font-semibold">
            <Sliders className="w-3.5 h-3.5" />
            <span>BMW Custom Design Studio</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-tight font-sans">
            Build & Personalize Your BMW
          </h2>
          <p className="text-gray-400 text-sm mt-3">
            Select authentic BMW Individual exterior paints, forged motorsport alloy wheels, and hand-crafted Merino leather interiors.
          </p>
        </div>

        {/* Model Selector Bar */}
        <div className="flex items-center justify-center space-x-3 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {cars.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setActiveCarId(c.id);
                setActiveColorIdx(0);
                setActiveWheelIdx(0);
                setActiveInteriorIdx(0);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer border ${
                activeCarId === c.id
                  ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/50 scale-105'
                  : 'bg-black/50 border-white/10 text-gray-400 hover:text-white hover:border-white/30'
              }`}
            >
              {c.name.replace('BMW ', '')}
            </button>
          ))}
        </div>

        {/* Studio Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Canvas Preview (Car Viewport with Color Accent Glow) */}
          <div className="lg:col-span-7 relative">
            <div className="relative rounded-3xl overflow-hidden glass-panel p-4 border border-white/10 shadow-2xl bg-gradient-to-b from-gray-900/40 via-black to-black">
              
              {/* Dynamic Aura Glow matched to chosen paint color */}
              <div 
                className="absolute inset-0 opacity-20 blur-3xl pointer-events-none transition-colors duration-700"
                style={{ backgroundColor: currentColor.hex }}
              />

              {/* Main Vehicle Image */}
              <div className="relative h-72 sm:h-96 w-full flex items-center justify-center overflow-hidden rounded-2xl">
                <img
                  src={car.hero_image}
                  alt={car.name}
                  className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                />
                
                {/* Visual paint reflection tint overlay */}
                <div 
                  className="absolute inset-0 mix-blend-color opacity-25 pointer-events-none transition-colors duration-500"
                  style={{ backgroundColor: currentColor.hex }}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                {/* Engine sound trigger button on canvas */}
                <button
                  onClick={handleRevEngine}
                  className="absolute bottom-4 left-4 z-20 px-3.5 py-2 rounded-lg bg-black/70 hover:bg-black text-white text-xs font-mono uppercase tracking-wider backdrop-blur-md border border-white/20 flex items-center space-x-2 transition-all cursor-pointer shadow-lg"
                >
                  <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'text-red-400 animate-bounce' : 'text-blue-400'}`} />
                  <span>{isPlayingAudio ? 'Acoustic Test Active...' : 'Hear Exhaust'}</span>
                </button>
              </div>

              {/* Live Spec Badges under car */}
              <div className="grid grid-cols-4 gap-2 pt-4 text-center font-mono text-[11px] border-t border-white/10 mt-2">
                <div className="p-2 rounded bg-black/50">
                  <span className="text-gray-400 block text-[9px] uppercase">0-100 KM/H</span>
                  <span className="font-bold text-white text-sm">{car.specs?.acceleration_0_100}s</span>
                </div>
                <div className="p-2 rounded bg-black/50">
                  <span className="text-gray-400 block text-[9px] uppercase">OUTPUT</span>
                  <span className="font-bold text-white text-sm">{car.specs?.horsepower} HP</span>
                </div>
                <div className="p-2 rounded bg-black/50">
                  <span className="text-gray-400 block text-[9px] uppercase">DRIVETRAIN</span>
                  <span className="font-bold text-white text-sm truncate">{car.specs?.drivetrain?.split(' ')[0] || 'xDrive'}</span>
                </div>
                <div className="p-2 rounded bg-black/50">
                  <span className="text-gray-400 block text-[9px] uppercase">TRANSMISSION</span>
                  <span className="font-bold text-white text-sm truncate">{car.specs?.transmission?.split(' ')[0]}</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Configuration Controls */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Header info */}
            <div>
              <span className="text-xs uppercase font-mono text-blue-400 font-bold tracking-wider">
                {car.series} // {car.category}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white uppercase font-sans mt-1">
                {car.name}
              </h3>
            </div>

            {/* 1. Exterior Color Customizer */}
            <div className="space-y-3 bg-black/40 p-4 rounded-xl border border-white/10">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-gray-300 uppercase tracking-wider font-semibold">
                  1. Exterior Paint: <span className="text-white font-bold">{currentColor.name}</span>
                </span>
                <span className="text-blue-400 font-bold">
                  {currentColor.price === 0 ? 'Included' : `+$${currentColor.price.toLocaleString()}`}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {car.colors?.map((col, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveColorIdx(idx)}
                    title={`${col.name} (${col.price ? `+$${col.price}` : 'Standard'})`}
                    style={{ backgroundColor: col.hex }}
                    className={`w-9 h-9 rounded-full border-2 transition-all relative flex items-center justify-center cursor-pointer shadow-md ${
                      activeColorIdx === idx
                        ? 'border-white scale-110 shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                        : 'border-white/20 hover:border-white/60'
                    }`}
                  >
                    {activeColorIdx === idx && (
                      <Check className={`w-4 h-4 ${col.hex === '#f5f5f7' || col.hex === '#ffffff' ? 'text-black' : 'text-white'}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Alloy Wheels Customizer */}
            <div className="space-y-3 bg-black/40 p-4 rounded-xl border border-white/10">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-gray-300 uppercase tracking-wider font-semibold">
                  2. Wheel Style: <span className="text-white font-bold">{currentWheel.size}</span>
                </span>
                <span className="text-blue-400 font-bold">
                  {currentWheel.price === 0 ? 'Included' : `+$${currentWheel.price.toLocaleString()}`}
                </span>
              </div>

              <div className="space-y-2">
                {car.wheels?.map((wh, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveWheelIdx(idx)}
                    className={`w-full p-2.5 rounded-lg text-left text-xs font-mono flex items-center justify-between transition-all cursor-pointer border ${
                      activeWheelIdx === idx
                        ? 'bg-white/15 border-blue-500 text-white'
                        : 'bg-black/30 border-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    <span>{wh.name}</span>
                    <span className="text-gray-400">{wh.price > 0 ? `+$${wh.price}` : 'Standard'}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Interior Leather Customizer */}
            <div className="space-y-3 bg-black/40 p-4 rounded-xl border border-white/10">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-gray-300 uppercase tracking-wider font-semibold">
                  3. Interior Upholstery: <span className="text-white font-bold">{currentInterior.color}</span>
                </span>
                <span className="text-blue-400 font-bold">
                  {currentInterior.price === 0 ? 'Included' : `+$${currentInterior.price.toLocaleString()}`}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {car.interiors?.map((it, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveInteriorIdx(idx)}
                    className={`p-2.5 rounded-lg text-left text-xs font-mono flex items-center space-x-2 transition-all cursor-pointer border ${
                      activeInteriorIdx === idx
                        ? 'bg-white/15 border-blue-500 text-white'
                        : 'bg-black/30 border-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    <span 
                      style={{ backgroundColor: it.hex }} 
                      className="w-4 h-4 rounded-full border border-white/30 flex-shrink-0"
                    />
                    <span className="truncate">{it.color}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Pricing Summary Box */}
            <div className="glass-panel p-5 rounded-xl border border-blue-500/30">
              <div className="space-y-1 text-xs font-mono text-gray-400 border-b border-white/10 pb-3">
                <div className="flex justify-between">
                  <span>Base MSRP:</span>
                  <span className="text-white">${car.starting_price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Selected Options:</span>
                  <span className="text-blue-400">+${((currentColor.price || 0) + (currentWheel.price || 0) + (currentInterior.price || 0)).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-baseline justify-between pt-3">
                <div>
                  <span className="text-[10px] uppercase font-mono text-gray-400 block">Total Configured Price</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                    ${totalPrice.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={handleBookWithSpec}
                  className="px-6 py-3 rounded-md bg-[#0066b1] hover:bg-[#00528e] text-white text-xs uppercase tracking-widest font-bold transition-all shadow-lg shadow-blue-900/50 flex items-center space-x-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Order / Test Drive</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

