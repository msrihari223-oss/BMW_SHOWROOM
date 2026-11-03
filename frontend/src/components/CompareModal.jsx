import React from 'react';
import { X, Trash2, Calendar, Zap, Gauge, Wind, Plus } from 'lucide-react';

export default function CompareModal({ 
  comparedCars = [], 
  onClose, 
  onRemoveFromCompare, 
  onBookTestDrive,
  allCars = [],
  onAddCarToCompare 
}) {
  if (comparedCars.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      
      <div className="relative w-full max-w-6xl bg-[#0c0e14] border border-white/15 rounded-3xl shadow-2xl overflow-hidden text-gray-200">
        
        {/* Top accent */}
        <div className="h-1 w-full m-stripe" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2 rounded-full bg-black/60 hover:bg-black text-gray-400 hover:text-white border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
          
          <div className="mb-6">
            <span className="text-blue-400 font-mono text-xs uppercase tracking-widest font-bold">
              BMW Comparative Engineering Matrix
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white uppercase font-sans mt-1">
              Side-By-Side Comparison ({comparedCars.length}/3 Models)
            </h2>
          </div>

          {/* Comparison Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {comparedCars.map((car) => (
              <div 
                key={car.id} 
                className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Remove button */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-mono uppercase text-blue-400 font-bold px-2 py-0.5 rounded bg-blue-950 border border-blue-800">
                      {car.series}
                    </span>
                    <button
                      onClick={() => onRemoveFromCompare(car)}
                      className="text-gray-400 hover:text-red-400 p-1"
                      title="Remove from comparison"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Car Image */}
                  <div className="h-40 rounded-xl overflow-hidden bg-black/50 mb-3">
                    <img src={car.hero_image} alt={car.name} className="w-full h-full object-cover" />
                  </div>

                  {/* Title & Price */}
                  <h3 className="text-lg font-bold text-white uppercase">{car.name}</h3>
                  <div className="text-xl font-extrabold text-white font-mono mt-1">
                    ${car.starting_price.toLocaleString()}
                  </div>
                </div>

                {/* Specs Table */}
                <div className="space-y-2 text-xs font-mono border-t border-white/10 pt-3">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-gray-400">0-100 KM/H</span>
                    <span className="font-bold text-white">{car.specs?.acceleration_0_100}s</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-gray-400">HORSEPOWER</span>
                    <span className="font-bold text-white">{car.specs?.horsepower} HP</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-gray-400">TORQUE</span>
                    <span className="font-bold text-white truncate max-w-[150px]">{car.specs?.torque}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-gray-400">TOP SPEED</span>
                    <span className="font-bold text-white">{car.specs?.top_speed_kmh} km/h</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-gray-400">POWERTRAIN</span>
                    <span className="font-bold text-white">{car.specs?.fuel_type}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-gray-400">DRIVETRAIN</span>
                    <span className="font-bold text-white">{car.specs?.drivetrain?.split(' ')[0]}</span>
                  </div>

                  {car.specs?.electric_range_km && (
                    <div className="flex justify-between py-1 border-b border-white/5 text-cyan-300">
                      <span>ELECTRIC RANGE</span>
                      <span className="font-bold">{car.specs.electric_range_km} km</span>
                    </div>
                  )}
                </div>

                {/* Book Drive Button */}
                <button
                  onClick={() => {
                    onClose();
                    onBookTestDrive(car);
                  }}
                  className="w-full py-2.5 rounded-lg bg-[#0066b1] hover:bg-[#00528e] text-white text-xs uppercase font-bold tracking-wider flex items-center justify-center space-x-2"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Test Drive This Car</span>
                </button>

              </div>
            ))}

            {/* Slot to add another car if less than 3 */}
            {comparedCars.length < 3 && (
              <div className="border-2 border-dashed border-white/15 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3 bg-white/[0.01]">
                <Plus className="w-8 h-8 text-gray-500" />
                <span className="text-xs font-mono uppercase text-gray-400">Add Another BMW To Compare</span>
                <select
                  onChange={(e) => {
                    const carToAdd = allCars.find(c => c.id === e.target.value);
                    if (carToAdd) onAddCarToCompare(carToAdd);
                  }}
                  defaultValue=""
                  className="bg-black/70 border border-white/20 text-xs rounded-lg px-3 py-2 text-white font-mono focus:outline-none"
                >
                  <option value="" disabled>Select vehicle...</option>
                  {allCars
                    .filter(c => !comparedCars.some(cc => cc.id === c.id))
                    .map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}

