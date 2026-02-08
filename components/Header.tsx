import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface HeaderProps {
  onNavigate: (view: 'home' | 'destinations' | 'guides' | 'about' | 'contact' | 'admin') => void;
  onSearch: (query: string) => void;
  isTransparentLayout?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, onSearch, isTransparentLayout = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      onSearch(searchValue.trim());
      setIsSearchExpanded(false);
    }
    if (e.key === 'Escape') {
      setIsSearchExpanded(false);
    }
  };

  const toggleSearch = () => {
    if (!isSearchExpanded) {
      setIsSearchExpanded(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    } else if (searchValue.trim()) {
      onSearch(searchValue.trim());
      setIsSearchExpanded(false);
    } else {
      setIsSearchExpanded(false);
    }
  };

  const navItems: { label: string; view: 'home' | 'destinations' | 'guides' | 'about' | 'contact' | 'admin' }[] = [
    { label: 'Destinations', view: 'destinations' },
    { label: 'Guides', view: 'guides' },
    { label: 'About', view: 'about' },
    { label: 'Contact', view: 'contact' },
  ];

  const showOpaque = isScrolled || !isTransparentLayout;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 md:px-12 py-4 flex items-center justify-between ${
      showOpaque ? 'bg-white/80 backdrop-blur-xl border-b border-gray-100' : 'bg-transparent'
    }`}>
      {/* Logo */}
      <div className={`flex items-center gap-2.5 cursor-pointer group transition-opacity duration-300 ${isSearchExpanded ? 'opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto' : 'opacity-100'}`} onClick={() => onNavigate('home')}>
        <div className="size-7 bg-[#0084ff] rounded-[6px] flex items-center justify-center transition-transform group-hover:rotate-12">
          <div className="size-3 bg-white rotate-45" />
        </div>
        <span className={`font-extrabold tracking-widest text-[13px] uppercase transition-colors duration-500 ${
          showOpaque ? 'text-gray-900' : 'text-white'
        }`}>The Travel Guru</span>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-10">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => onNavigate(item.view)}
            className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-500 ${
              showOpaque ? 'text-gray-500 hover:text-black' : 'text-white/80 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Search Bar Container */}
      <div className={`flex items-center gap-6 ${isSearchExpanded ? 'flex-1 justify-end' : ''}`}>
        <div className={`relative flex items-center transition-all duration-500 ease-in-out ${
          isSearchExpanded ? 'w-full md:w-64' : 'w-10 md:w-56'
        }`}>
          <Search 
            onClick={toggleSearch}
            className={`size-4 absolute left-3 md:left-4 z-10 transition-colors duration-500 cursor-pointer ${
            showOpaque ? 'text-gray-400' : 'text-white/60 hover:text-white'
          }`} />
          
          <input
            ref={inputRef}
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => !searchValue && setIsSearchExpanded(false)}
            placeholder="Search stories..."
            className={`py-2.5 rounded-full text-[13px] font-medium outline-none transition-all duration-500 ease-in-out placeholder:opacity-60 ${
              showOpaque 
                ? 'bg-gray-100 text-gray-900 focus:bg-white focus:ring-1 focus:ring-blue-100' 
                : 'bg-white/10 text-white backdrop-blur-sm border border-white/10 focus:bg-white/20'
            } ${
              isSearchExpanded 
                ? 'w-full pl-10 pr-10 opacity-100' 
                : 'w-10 md:w-full pl-10 pr-4 opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto'
            }`}
          />

          {/* Mobile Close Button */}
          {isSearchExpanded && (
            <X 
              onClick={() => {setSearchValue(''); setIsSearchExpanded(false);}}
              className="size-4 absolute right-3 md:hidden text-gray-400 cursor-pointer" 
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;