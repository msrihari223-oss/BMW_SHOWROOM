import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, Layers, SlidersHorizontal, Sparkles } from 'lucide-react';
import CarCard from './CarCard';

export default function ModelShowcase({ 
  cars = [], 
  onSelectCar, 
  onConfigure, 
  onBookTestDrive,
  onOpenCompare,
  comparedCars = [],
  onToggleCompare 
}) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  const categories = [
    { id: 'All', label: 'All Models' },
    { id: 'M-Performance', label: 'BMW M Motorsport' },
    { id: 'Electric', label: 'BMW i Electric' },
    { id: 'SUV', label: 'X Series (SAV)' },
    { id: 'Coupe', label: 'Coupés' }
  ];

  const filteredCars = useMemo(() => {
    let result = [...cars];

    // Category filter
    if (activeCategory !== 'All') {
      result = result.filter(c => c.category === activeCategory);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(q) ||
        c.series.toLowerCase().includes(q) ||
        c.tagline.toLowerCase().includes(q) ||
        c.specs?.engine?.toLowerCase().includes(q) ||
        c.specs?.fuel_type?.toLowerCase().includes(q)
      );
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.starting_price - b.starting_price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.starting_price - a.starting_price);
        break;
      case 'power-desc':
        result.sort((a, b) => (b.specs?.horsepower || 0) - (a.specs?.horsepower || 0));
        break;
      case 'accel-asc':
        result.sort((a, b) => (a.specs?.acceleration_0_100 || 99) - (b.specs?.acceleration_0_100 || 99));
        break;
      default:
        // featured first
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  }, [cars, activeCategory, searchQuery, sortBy]);

  return (
    <section id="models" className="pt-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-blue-400 font-mono text-xs uppercase tracking-widest mb-2 font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            <span>BMW Virtual Showroom Fleet</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-tight font-sans">
            Explore All Models
          </h2>
          <p className="text-gray-400 text-sm mt-2 max-w-xl">
            From precision track-bred M vehicles to cutting-edge all-electric mobility. Every vehicle engineered for pure dynamic supremacy.
          </p>
        </div>

        {/* Counter */}
        <div className="mt-4 md:mt-0 text-right font-mono">
          <span className="text-3xl font-extrabold text-white">{filteredCars.length}</span>
          <span className="text-xs uppercase text-gray-500 block">Available Vehicles</span>
        </div>
      </div>

      {/* Filter and Search Controls Toolbar */}
      <div className="space-y-4 mb-10">
        
        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-white text-black shadow-lg shadow-white/10'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Sort Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by model, V8, TwinPower, electric, M-Series..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2">
            <ArrowUpDown className="w-4 h-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-black/50 border border-white/10 text-gray-300 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500 font-mono cursor-pointer"
            >
              <option value="featured">Sort: Featured First</option>
              <option value="power-desc">Horsepower: High to Low</option>
              <option value="accel-asc">Acceleration: 0-100 km/h (Fastest)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

        </div>

      </div>

      {/* Grid of Cars */}
      {filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCars.map(car => (
            <CarCard
              key={car.id}
              car={car}
              onSelectCar={onSelectCar}
              onConfigure={onConfigure}
              onBookTestDrive={onBookTestDrive}
              onToggleCompare={onToggleCompare}
              isCompared={comparedCars.some(c => c.id === car.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-white/10 rounded-2xl bg-white/[0.02]">
          <SlidersHorizontal className="w-12 h-12 text-gray-500 mx-auto mb-3 opacity-60" />
          <h3 className="text-lg font-bold text-white uppercase font-sans">No BMW Models Match Your Filter</h3>
          <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto">
            Try clearing your search criteria or switching categories to explore the rest of the fleet.
          </p>
          <button
            onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs uppercase tracking-wider font-bold rounded-md"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Sticky Bottom Comparison Floating Tray */}
      {comparedCars.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#0c0e14]/90 backdrop-blur-xl border border-blue-500/50 shadow-2xl rounded-2xl p-4 flex items-center space-x-4 max-w-xl w-[90%] sm:w-auto">
          <div className="flex -space-x-3 overflow-hidden">
            {comparedCars.map(car => (
              <img
                key={car.id}
                src={car.hero_image}
                alt={car.name}
                title={car.name}
                className="w-10 h-10 rounded-full border-2 border-black object-cover"
              />
            ))}
          </div>

          <div className="text-left font-mono">
            <div className="text-xs font-bold text-white">
              {comparedCars.length} / 3 Models In Comparison
            </div>
            <div className="text-[10px] text-gray-400">
              Side-by-side performance & specs
            </div>
          </div>

          <button
            onClick={onOpenCompare}
            className="ml-auto px-4 py-2 bg-[#0066b1] hover:bg-[#00528e] text-white text-xs uppercase font-bold rounded-md tracking-wider flex items-center space-x-1 shadow-lg"
          >
            <span>Compare Now</span>
          </button>
        </div>
      )}

    </section>
  );
}

