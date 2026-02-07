
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface HeaderProps {
  onNavigate: (view: 'home' | 'destinations' | 'guides' | 'about' | 'contact' | 'admin') => void;
  onLoginClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, onLoginClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { label: string; view: 'home' | 'destinations' | 'guides' | 'about' | 'contact' | 'admin' }[] = [
    { label: 'Destinations', view: 'destinations' },
    { label: 'Guides', view: 'guides' },
    { label: 'About', view: 'about' },
    { label: 'Contact', view: 'contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 md:px-12 py-4 flex items-center justify-between ${
      isScrolled ? 'bg-white/80 backdrop-blur-xl border-b border-gray-100' : 'bg-transparent'
    }`}>
      <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => onNavigate('home')}>
        <div className="size-7 bg-[#0084ff] rounded-[6px] flex items-center justify-center transition-transform group-hover:rotate-12">
          <div className="size-3 bg-white rotate-45" />
        </div>
        <span className={`font-extrabold tracking-widest text-[13px] uppercase transition-colors duration-500 ${
          isScrolled ? 'text-gray-900' : 'text-white'
        }`}>The Travel Guru</span>
      </div>

      <nav className="hidden lg:flex items-center gap-10">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => onNavigate(item.view)}
            className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-500 ${
              isScrolled ? 'text-gray-500 hover:text-black' : 'text-white/80 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block group">
          <Search className={`size-4 absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-500 ${
            isScrolled ? 'text-gray-400' : 'text-white/60 group-hover:text-white'
          }`} />
          <input
            type="text"
            placeholder="Search stories..."
            className={`pl-11 pr-4 py-2.5 rounded-full text-[13px] font-medium outline-none w-56 transition-all placeholder:opacity-60 ${
              isScrolled 
                ? 'bg-gray-100 text-gray-900 focus:bg-white focus:ring-1 focus:ring-blue-100' 
                : 'bg-white/10 text-white backdrop-blur-sm border border-white/10 focus:bg-white/20'
            }`}
          />
        </div>
        <button 
          onClick={onLoginClick}
          className={`px-8 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all duration-500 ${
            isScrolled 
              ? 'bg-[#1a1a1a] text-white hover:bg-black' 
              : 'bg-white text-gray-900 hover:bg-white/90'
          }`}
        >
          Sign In
        </button>
      </div>
    </header>
  );
};

export default Header;
