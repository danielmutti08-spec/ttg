
import React from 'react';
import { Globe, Share2, Info } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#fcfcfc] border-t border-gray-100 pt-20 pb-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-5 h-5 bg-[#0084ff] rounded-sm flex items-center justify-center">
              <div className="w-2 h-2 bg-white rotate-45" />
            </div>
            <span className="text-gray-900 font-black tracking-tight text-lg">The Travel Guru</span>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed mb-8 pr-10">
            Your source for travel excellence. We explore hidden gems and share stories to fuel your next adventure.
          </p>
          <div className="flex gap-3">
            {[Globe, Share2, Info].map((Icon, idx) => (
              <button key={idx} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#0084ff] hover:text-white transition-all">
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-900 mb-8">Explore</h4>
          <ul className="space-y-4 text-gray-400 text-xs font-medium">
            <li><a href="#" className="hover:text-[#0084ff]">Destinations</a></li>
            <li><a href="#" className="hover:text-[#0084ff]">Best Hotels</a></li>
            <li><a href="#" className="hover:text-[#0084ff]">Travel Gear</a></li>
            <li><a href="#" className="hover:text-[#0084ff]">Photography Tips</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-900 mb-8">About</h4>
          <ul className="space-y-4 text-gray-400 text-xs font-medium">
            <li><a href="#" className="hover:text-[#0084ff]">Our Story</a></li>
            <li><a href="#" className="hover:text-[#0084ff]">The Team</a></li>
            <li><a href="#" className="hover:text-[#0084ff]">Careers</a></li>
            <li><a href="#" className="hover:text-[#0084ff]">Press Kit</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-900 mb-8">Support</h4>
          <ul className="space-y-4 text-gray-400 text-xs font-medium">
            <li><a href="#" className="hover:text-[#0084ff]">Help Center</a></li>
            <li><a href="#" className="hover:text-[#0084ff]">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-[#0084ff]">Terms of Service</a></li>
            <li><a href="#" className="hover:text-[#0084ff]">Contact Us</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-gray-100 flex justify-between items-center text-[10px] font-bold text-gray-300">
        <span>© 2024 THE TRAVEL GURU.</span>
        <div className="flex gap-4">
          <span>ENGLISH</span>
          <span>USD</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
