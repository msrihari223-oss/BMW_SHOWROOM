import React, { useState, useEffect } from 'react';
import { Menu, X, Database, ShieldCheck, Car, Calendar, Sliders, MapPin } from 'lucide-react';

export default function Navbar({ 
  onOpenTestDrive, 
  onOpenConfigurator, 
  onOpenAdmin,
  dbStatus,
  activeSection 
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Showroom', href: '#models' },
    { name: 'Configurator', href: '#configurator', action: onOpenConfigurator },
    { name: 'Finance Calculator', href: '#finance' },
    { name: 'Dealerships', href: '#dealers' },
    { name: 'Heritage', href: '#heritage' }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#08090cd9] backdrop-blur-xl border-b border-white/10 shadow-2xl py-3' 
        : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5'
    }`}>
      {/* BMW M signature tricolor top accent stripe */}
      <div className="absolute top-0 left-0 right-0 h-[3px] m-stripe" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo & Brand Identity */}
          <a href="#" className="flex items-center space-x-3 group">
            {/* SVG BMW Roundel Emblem */}
            <div className="relative w-11 h-11 rounded-full p-[2px] bg-gradient-to-tr from-gray-700 via-gray-400 to-white shadow-lg transition-transform duration-300 group-hover:scale-105">
              <svg viewBox="0 0 100 100" className="w-full h-full rounded-full bg-black">
                {/* Outer Ring */}
                <circle cx="50" cy="50" r="48" fill="#000" stroke="#888" strokeWidth="2" />
                <circle cx="50" cy="50" r="34" fill="#000" stroke="#bbb" strokeWidth="1.5" />
                {/* Quarters */}
                <path d="M 50 16 A 34 34 0 0 1 84 50 L 50 50 Z" fill="#0066b1" />
                <path d="M 50 50 L 84 50 A 34 34 0 0 1 50 84 Z" fill="#ffffff" />
                <path d="M 16 50 A 34 34 0 0 1 50 16 L 50 50 Z" fill="#ffffff" />
                <path d="M 50 50 L 50 84 A 34 34 0 0 1 16 50 Z" fill="#0066b1" />
                {/* Silver letters BMW */}
                <text x="50" y="11" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold" letterSpacing="3">BMW</text>
              </svg>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-bold tracking-widest text-white uppercase font-sans">
                  BMW
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-extrabold tracking-wider bg-white/10 border border-white/20 text-gray-200 rounded">
                  SHOWROOM
                </span>
              </div>
              <span className="text-[10px] text-gray-400 tracking-wider font-mono uppercase">
                Sheer Driving Pleasure
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  if (link.action) {
                    e.preventDefault();
                    link.action();
                  }
                }}
                className="text-xs uppercase tracking-widest text-gray-300 hover:text-white transition-colors duration-200 font-medium hover:underline underline-offset-8 decoration-[#0066b1] decoration-2 whitespace-nowrap"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Database Atlas Status Indicator Pill */}
            <button
              onClick={onOpenAdmin}
              title="Click to view MongoDB Atlas status & stored bookings"
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-mono transition-all border ${
                dbStatus?.connected
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                  : 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-900/60'
              }`}
            >
              <span className={`w-2 h-2 rounded-full animate-pulse ${
                dbStatus?.connected ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
              }`} />
              <Database className="w-3.5 h-3.5 opacity-80" />
              <span>{dbStatus?.connected ? 'MongoDB Atlas' : 'Local DB'}</span>
            </button>

            {/* Test Drive Button */}
            <button
              onClick={() => onOpenTestDrive()}
              className="relative group overflow-hidden px-5 py-2.5 rounded-md bg-[#0066b1] hover:bg-[#00528e] text-white text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-lg shadow-blue-900/30 flex items-center space-x-2 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-blue-200" />
              <span>Book VIP Drive</span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={onOpenAdmin}
              className="p-2 text-xs font-mono text-emerald-400 bg-white/5 rounded-md border border-white/10"
            >
              <Database className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0c0e14] border-b border-white/10 px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  if (link.action) {
                    e.preventDefault();
                    link.action();
                  }
                }}
                className="text-sm uppercase tracking-wider text-gray-300 hover:text-white py-2 border-b border-white/5"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-2 flex flex-col space-y-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTestDrive();
              }}
              className="w-full py-3 bg-[#0066b1] hover:bg-[#00528e] text-white text-xs uppercase tracking-widest font-bold rounded-md flex items-center justify-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book VIP Test Drive</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs tracking-wider rounded-md flex items-center justify-center space-x-2"
            >
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Database Connection Status</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

