import React from 'react';
import { Award, Zap, Flag, Compass, ChevronRight } from 'lucide-react';

export default function Heritage() {
  const milestones = [
    {
      year: '1916',
      title: 'Bavarian Aviation Origins',
      description: 'Born in Munich as Bayerische Motoren Werke, engineering ultra-reliable, high-altitude aircraft engines before revolutionizing road machinery.',
      badge: 'Bavaria, Germany'
    },
    {
      year: '1972',
      title: 'Birth of BMW M Division',
      description: 'Created to fuel racing championships. From the iconic BMW 3.0 CSL Batmobile to the legendary mid-engine M1, defining the tricolor motorsport stripe.',
      badge: 'Motorsport Dynasty'
    },
    {
      year: '2013',
      title: 'BMW i Electric Pioneers',
      description: 'Setting a global benchmark in sustainable luxury with the futuristic BMW i8 plug-in hybrid supercar and carbon-chassis i3 mobility.',
      badge: 'Electric Vision'
    },
    {
      year: '2025+',
      title: 'Vision Neue Klasse',
      description: 'Next-generation cylindrical battery cells delivering 30% more range and 30% faster charging with BMW Panoramic Vision projection display.',
      badge: 'Next Era'
    }
  ];

  return (
    <section id="heritage" className="py-24 bg-gradient-to-b from-[#08090c] via-[#0d0f17] to-[#08090c] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 text-blue-400 font-mono text-xs uppercase tracking-widest mb-2 font-semibold">
            <Award className="w-4 h-4" />
            <span>Over A Century Of Excellence</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-tight font-sans">
            Heritage & The Future Of Speed
          </h2>
          <p className="text-gray-400 text-sm mt-3">
            More than a century of unyielding pursuit for driving purity, precision engineering, and groundbreaking innovation.
          </p>
        </div>

        {/* Milestone Cards Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {milestones.map((item, idx) => (
            <div 
              key={idx}
              className="glass-card rounded-2xl p-6 border border-white/10 relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-extrabold text-white font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white">
                    {item.year}
                  </span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-gray-300 border border-white/10">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white uppercase mb-2">
                  {item.title}
                </h3>

                <p className="text-xs text-gray-400 leading-relaxed font-light">
                  {item.description}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-white/5 flex items-center text-xs font-mono text-blue-400">
                <span>Sheer Driving Pleasure</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

