import React from 'react';
import { MapPin, Phone, Mail, Clock, Calendar, ExternalLink } from 'lucide-react';

export default function Dealerships({ dealerships = [], onBookAtDealer }) {
  return (
    <section id="dealers" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-blue-400 font-mono text-xs uppercase tracking-widest mb-2 font-semibold">
            <MapPin className="w-3.5 h-3.5" />
            <span>Authorized Experience Centers</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-tight font-sans">
            Flagship Showrooms
          </h2>
          <p className="text-gray-400 text-sm mt-2 max-w-xl">
            Visit our state-of-the-art BMW Welt and boutique centers worldwide. Consult with private product geniuses in bespoke lounges.
          </p>
        </div>

        <span className="text-xs uppercase font-mono text-gray-500 mt-4 md:mt-0">
          Global Luxury Network
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dealerships.map((dealer) => (
          <div
            key={dealer.id}
            className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group"
          >
            <div>
              <div className="h-44 overflow-hidden relative">
                <img
                  src={dealer.image}
                  alt={dealer.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <span className="absolute bottom-3 left-3 text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-black/70 text-blue-300 border border-white/10">
                  {dealer.city.split(',')[1] || dealer.city}
                </span>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="text-base font-bold text-white uppercase group-hover:text-blue-400 transition-colors">
                  {dealer.name}
                </h3>

                <div className="space-y-2 text-xs font-mono text-gray-400">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>{dealer.address}, {dealer.city}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    <span>{dealer.phone}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    <span className="truncate">{dealer.hours.split('|')[0]}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                onClick={() => onBookAtDealer(dealer)}
                className="w-full py-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs uppercase font-mono font-bold tracking-wider flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span>Book Visit</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}

