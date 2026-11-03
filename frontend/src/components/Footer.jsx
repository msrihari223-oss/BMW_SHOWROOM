import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#050608] border-t border-white/10 text-gray-400 relative">
      
      {/* Top M Stripe */}
      <div className="h-[2px] w-full m-stripe" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              {/* BMW SVG Emblem */}
              <div className="w-10 h-10 rounded-full p-[1.5px] bg-gradient-to-tr from-gray-600 via-gray-300 to-white shadow-md">
                <svg viewBox="0 0 100 100" className="w-full h-full rounded-full bg-black">
                  <circle cx="50" cy="50" r="48" fill="#000" stroke="#888" strokeWidth="2" />
                  <circle cx="50" cy="50" r="34" fill="#000" stroke="#bbb" strokeWidth="1.5" />
                  <path d="M 50 16 A 34 34 0 0 1 84 50 L 50 50 Z" fill="#0066b1" />
                  <path d="M 50 50 L 84 50 A 34 34 0 0 1 50 84 Z" fill="#ffffff" />
                  <path d="M 16 50 A 34 34 0 0 1 50 16 L 50 50 Z" fill="#ffffff" />
                  <path d="M 50 50 L 50 84 A 34 34 0 0 1 16 50 Z" fill="#0066b1" />
                  <text x="50" y="11" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">BMW</text>
                </svg>
              </div>

              <div>
                <span className="text-xl font-bold tracking-widest text-white uppercase font-sans">
                  BMW SHOWROOM
                </span>
                <span className="text-[10px] text-gray-500 block uppercase font-mono">
                  Bayerische Motoren Werke
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-400 font-light leading-relaxed max-w-sm">
              The Ultimate Driving Machine. Engineering visionary automotive luxury, electrified dynamics, and pure motorsport heritage since 1916.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <span className="text-xs uppercase font-mono text-gray-300 font-bold block mb-2">
                BMW Exclusive Bulletin
              </span>
              {subscribed ? (
                <div className="text-xs text-emerald-400 flex items-center space-x-1.5 font-mono">
                  <Check className="w-4 h-4" />
                  <span>Thank you for subscribing to BMW updates.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex max-w-sm">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-black/60 border border-white/10 rounded-l-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-r-lg text-xs font-mono font-bold uppercase transition-colors"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Nav Column 1 */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-white">
              Fleet & Models
            </h4>
            <ul className="space-y-2 text-xs font-light">
              <li><a href="#models" className="hover:text-white transition-colors">BMW M Series</a></li>
              <li><a href="#models" className="hover:text-white transition-colors">BMW i Electric</a></li>
              <li><a href="#models" className="hover:text-white transition-colors">X Series SAVs</a></li>
              <li><a href="#models" className="hover:text-white transition-colors">BMW 7 Series & i7</a></li>
              <li><a href="#configurator" className="hover:text-white transition-colors">Design Studio</a></li>
            </ul>
          </div>

          {/* Nav Column 2 */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-white">
              Ownership & Services
            </h4>
            <ul className="space-y-2 text-xs font-light">
              <li><a href="#finance" className="hover:text-white transition-colors">BMW Financial Services</a></li>
              <li><a href="#finance" className="hover:text-white transition-colors">Lease vs Financing</a></li>
              <li><a href="#dealers" className="hover:text-white transition-colors">Find a Showroom</a></li>
              <li><a href="#" className="hover:text-white transition-colors">BMW ConnectedDrive</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Ultimate Care Warranty</a></li>
            </ul>
          </div>

          {/* Nav Column 3 */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-white">
              Heritage & Brand
            </h4>
            <ul className="space-y-2 text-xs font-light">
              <li><a href="#heritage" className="hover:text-white transition-colors">M Motorsport Heritage</a></li>
              <li><a href="#heritage" className="hover:text-white transition-colors">Vision Neue Klasse</a></li>
              <li><a href="#dealers" className="hover:text-white transition-colors">BMW Welt Munich</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sustainability & Circularity</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers & Press</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 font-mono gap-4">
          <p>© 2026 M SRI HARI SAI ESWAR. All rights reserved.</p>
          <div className="flex space-x-6 text-[11px]">
            <a href="#" className="hover:text-gray-300">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300">Terms of Service</a>
            <a href="#finance" className="hover:text-gray-300">BMW Financial Services</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

