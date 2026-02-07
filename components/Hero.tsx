
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { SiteConfig } from '../types';

interface HeroProps {
  config: SiteConfig;
  onNavigate: (view: 'home' | 'destinations' | 'guides' | 'admin') => void;
}

const Hero: React.FC<HeroProps> = ({ config, onNavigate }) => {
  return (
    <section className="relative h-[100vh] flex items-center justify-center text-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src={config.heroImageUrl} 
          alt="Hero Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-white pt-20 w-full">
        <span className="text-[10px] uppercase tracking-[0.6em] font-extrabold mb-8 block opacity-90 drop-shadow-md">
          TRAVEL CHRONICLES
        </span>
        <h1 className="text-7xl md:text-[140px] font-extrabold mb-10 leading-[0.8] tracking-tightest hero-title-shadow">
          {config.heroTitle} <br />
          <span className="text-[#0d93f2] italic font-serif lowercase block mt-4">
            {config.heroHighlight}
          </span>
        </h1>
        <p className="text-xl md:text-2xl font-medium max-w-3xl mx-auto mb-14 opacity-95 leading-snug drop-shadow-lg">
          {config.heroSubtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
          <button 
            onClick={() => onNavigate('destinations')}
            className="bg-[#0d93f2] text-white px-[32px] py-[14px] rounded-full font-bold text-[18px] hover:scale-105 transition-all shadow-2xl shadow-blue-500/40"
          >
            Start Exploring
          </button>
          <button 
            onClick={() => onNavigate('guides')}
            className="bg-white/10 border-2 border-white/20 text-white px-[32px] py-[14px] rounded-full font-bold text-[18px] hover:bg-white/20 transition-all backdrop-blur-md"
          >
            Travel Guides
          </button>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-70">
        <ChevronDown className="text-white size-10 animate-bounce" />
      </div>
    </section>
  );
};

export default Hero;
