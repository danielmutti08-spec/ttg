
import React from 'react';
import { Shield, Download } from 'lucide-react';

interface FeaturedSectionProps {
  onNavigate: (view: 'home' | 'destinations' | 'guides' | 'admin') => void;
}

const FeaturedSection: React.FC<FeaturedSectionProps> = ({ onNavigate }) => {
  return (
    <section className="px-6 md:px-12 py-24">
      <div className="max-w-7xl mx-auto bg-[#0a1128] rounded-[3rem] overflow-hidden flex flex-col md:flex-row min-h-[600px] shadow-2xl">
        <div className="flex-1 p-16 md:p-24 flex flex-col justify-center">
          <div className="flex items-center gap-3 text-[#0d93f2] font-extrabold text-[11px] uppercase tracking-widest-extra mb-10">
            <Shield className="size-4 fill-current" />
            MASTER GUIDE
          </div>
          
          <h2 className="text-white text-5xl md:text-7xl font-extrabold leading-[0.95] mb-10 tracking-tightest">
            The 2024 Solo <br /> Traveler's Bible
          </h2>
          
          <p className="text-white/60 text-lg leading-relaxed mb-14 max-w-md font-medium">
            A deep-dive into venturing out on your own. From safety tips to the world's most welcoming hidden hubs.
          </p>

          <button 
            onClick={() => onNavigate('guides')}
            className="bg-[#0d93f2] text-white px-12 py-5 rounded-full font-bold text-xs uppercase tracking-[0.2em] w-fit flex items-center gap-3 hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            Get the Dossier
            <Download className="size-4" />
          </button>
        </div>

        <div className="flex-1 relative overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=1200" 
            alt="Mountain Traveler"
            className="w-full h-full object-cover transition-transform duration-[3000ms] hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
