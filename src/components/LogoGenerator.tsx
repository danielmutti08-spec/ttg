import React from 'react';
import { Download, Image as ImageIcon } from 'lucide-react';

interface LogoGeneratorProps {
  type: 'full' | 'icon' | 'white' | 'dark';
  filename: string;
}

const LogoGenerator: React.FC<LogoGeneratorProps> = ({ type, filename }) => {
  const downloadLogo = async () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions based on type
    const width = type === 'icon' ? 512 : 500;
    const height = type === 'icon' ? 512 : 120;
    canvas.width = width;
    canvas.height = height;

    // Colors
    const primaryBlue = '#0084ff';
    const textColor = type === 'white' ? '#ffffff' : (type === 'dark' ? '#1a1a1a' : '#1a1a1a');
    const diamondColor = type === 'white' ? '#ffffff' : (type === 'dark' ? '#1a1a1a' : primaryBlue);
    const innerSquareColor = type === 'white' ? primaryBlue : '#ffffff';

    // Clear background (transparent)
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Diamond Icon
    const iconSize = type === 'icon' ? 300 : 40;
    const iconX = type === 'icon' ? width / 2 : 40;
    const iconY = type === 'icon' ? height / 2 : height / 2;

    ctx.save();
    ctx.translate(iconX, iconY);
    ctx.rotate((45 * Math.PI) / 180);
    
    // Main Diamond Square
    ctx.fillStyle = diamondColor;
    const rectSize = iconSize / Math.sqrt(2);
    const borderRadius = rectSize * 0.15;

    // Draw rounded rectangle for the diamond
    ctx.beginPath();
    ctx.roundRect(-rectSize / 2, -rectSize / 2, rectSize, rectSize, borderRadius);
    ctx.fill();

    // Inner White Square (rotated)
    if (type !== 'dark' && type !== 'white') {
        ctx.fillStyle = innerSquareColor;
        const innerSize = rectSize * 0.4;
        ctx.fillRect(-innerSize / 2, -innerSize / 2, innerSize, innerSize);
    } else if (type === 'white') {
        // For white version, maybe a subtle cutout or just the diamond
        // We'll stick to a solid diamond for pure white/dark versions
    }

    ctx.restore();

    // 2. Draw Text (if not icon only)
    if (type !== 'icon') {
      // Ensure font is loaded (Plus Jakarta Sans from index.html)
      ctx.fillStyle = textColor;
      ctx.font = '800 16px "Plus Jakarta Sans", sans-serif';
      ctx.letterSpacing = '0.2em';
      ctx.textBaseline = 'middle';
      ctx.fillText('THE TRAVEL GURU', 80, height / 2);
    }

    // Trigger Download
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  };

  const getLabel = () => {
    switch (type) {
      case 'full': return 'Full Logo (Standard)';
      case 'icon': return 'Icon Only (512px)';
      case 'white': return 'White Version';
      case 'dark': return 'Dark Version';
    }
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center justify-between group hover:shadow-xl transition-all">
      <div className="flex items-center gap-4">
        <div className={`size-12 rounded-xl flex items-center justify-center ${type === 'white' ? 'bg-slate-900' : 'bg-gray-50'}`}>
           <ImageIcon className={type === 'white' ? 'text-white' : 'text-slate-400'} size={20} />
        </div>
        <div>
          <p className="text-sm font-black text-gray-900 uppercase tracking-widest">{getLabel()}</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">PNG • Transparent</p>
        </div>
      </div>
      <button 
        onClick={downloadLogo}
        className="p-3 bg-gray-50 rounded-full text-slate-400 hover:bg-[#0d93f2] hover:text-white transition-all active:scale-90"
      >
        <Download size={18} />
      </button>
    </div>
  );
};

export default LogoGenerator;