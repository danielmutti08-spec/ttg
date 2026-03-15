
import React from 'react';
import { BookOpen, Map, Shield, Download, ArrowRight, Zap } from 'lucide-react';
import { Article } from '../types';

interface GuidesProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

const Guides: React.FC<GuidesProps> = ({ articles, onSelectArticle }) => {
  const guideArticles = articles.slice(0, 4);

  return (
    <div className="bg-[#fcfcfc] min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-20">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#0d93f2] mb-6 block text-center md:text-left">Guru Knowledge Base</span>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <h1 className="text-6xl md:text-8xl font-bold text-gray-900 tracking-tightest max-w-4xl">Master the Art of <span className="text-[#0d93f2] italic font-serif lowercase">Exploration.</span></h1>
            <p className="text-gray-400 font-medium max-w-sm leading-relaxed mb-4">
              Comprehensive dossiers designed for the modern nomad. Less noise, more intelligence.
            </p>
          </div>
        </div>

        {/* Featured Guide Card */}
        <div className="relative h-[600px] rounded-[3.5rem] overflow-hidden mb-24 group">
          <img 
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=90&w=2000" 
            className="w-full h-full object-cover transition-transform duration-[4000ms] group-hover:scale-110" 
            alt="Adventure Guide"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1128] via-[#0a1128]/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-12 md:p-20">
            <div className="flex items-center gap-3 text-[#0d93f2] font-extrabold text-[11px] uppercase tracking-widest-extra mb-6">
              <Shield className="size-4 fill-current" />
              ANNUAL RELEASE
            </div>
            <h2 className="text-white text-5xl md:text-7xl font-extrabold leading-none mb-8 max-w-3xl">The Ultimate Solo Expedition Manual</h2>
            <div className="flex flex-col sm:flex-row gap-6">
              <button className="bg-[#0d93f2] text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20">
                Access Full Dossier
                <ArrowRight className="size-4" />
              </button>
              <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all">
                Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {[
            { title: 'Packing Lists', icon: Zap, color: 'bg-amber-50 text-amber-500' },
            { title: 'Travel Safety', icon: Shield, color: 'bg-emerald-50 text-emerald-500' },
            { title: 'Budget Logic', icon: BookOpen, color: 'bg-blue-50 text-blue-500' }
          ].map((cat, i) => (
            <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-gray-50 shadow-sm hover:shadow-xl transition-all group cursor-pointer">
              <div className={`size-14 rounded-2xl ${cat.color} flex items-center justify-center mb-8 transition-transform group-hover:scale-110`}>
                <cat.icon className="size-6" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">{cat.title}</h3>
              <p className="text-gray-400 text-sm font-medium leading-relaxed mb-6">Expertly curated resources to streamline your journey and maximize every moment.</p>
              <span className="text-[#0d93f2] font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                Explore Category <ArrowRight className="size-3" />
              </span>
            </div>
          ))}
        </div>

        {/* Recent Guides Table */}
        <div className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm">
          <div className="p-10 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-2xl font-black">Latest Intel</h3>
            <button className="text-[10px] font-black uppercase tracking-widest text-[#0d93f2]">View all files</button>
          </div>
          <div className="divide-y divide-gray-50">
            {guideArticles.map((art, i) => (
              <div 
                key={art.id} 
                onClick={() => onSelectArticle(art)}
                className="p-8 flex items-center gap-8 hover:bg-gray-50 transition-all cursor-pointer group"
              >
                <div className="w-16 h-20 rounded-xl overflow-hidden shadow-sm shrink-0">
                  <img src={art.cardImageUrl || art.imageUrl} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <span className="text-[9px] font-black text-[#0d93f2] uppercase tracking-widest mb-1 block">{art.location}</span>
                  <h4 className="text-xl font-bold text-gray-900 group-hover:text-[#0d93f2] transition-colors">{art.title}</h4>
                </div>
                <div className="hidden md:flex items-center gap-12 text-gray-400 font-bold text-xs">
                  <span>PDF / 4.2 MB</span>
                  <button className="size-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-900 hover:bg-[#0d93f2] hover:text-white transition-all">
                    <Download className="size-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guides;
