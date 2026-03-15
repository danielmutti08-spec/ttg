
import React, { useState, useMemo } from 'react';
import { Search, Sparkles, Snowflake, Globe, Ship, Landmark, Compass } from 'lucide-react';
import { Article, Category } from '../types';

interface DestinationsProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

const CategoryIcons: Record<string, any> = {
  [Category.ASIA]: Sparkles,
  [Category.NORDIC]: Snowflake,
  [Category.EUROPE]: Ship,
  [Category.CULTURE]: Landmark,
  [Category.ADVENTURE]: Compass,
  'default': Globe
};

const Destinations: React.FC<DestinationsProps> = ({ articles, onSelectArticle }) => {
  const [activeCategory, setActiveCategory] = useState<string>(Category.ALL);
  const [localSearch, setLocalSearch] = useState('');

  const categories = [Category.ALL, Category.OCEANIA, Category.NORDIC, Category.ASIA, Category.EUROPE];

  const filteredArticles = useMemo(() => {
    return articles.filter(art => {
      const matchCategory = activeCategory === Category.ALL || art.category === activeCategory;
      const matchSearch = !localSearch || 
        art.title.toLowerCase().includes(localSearch.toLowerCase()) ||
        art.location.toLowerCase().includes(localSearch.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [articles, activeCategory, localSearch]);

  return (
    <div className="bg-[#fcfcfc] min-h-screen pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#0084ff] mb-6 block">World Collection</span>
        <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-8 tracking-tighter">Iconic Horizons.</h1>
        <p className="text-gray-400 font-medium max-w-xl mx-auto leading-relaxed">
          Experience the globe's most captivating locations through pure, unfiltered imagery and curated insight.
        </p>
      </div>

      <div className="max-w-4xl mx-auto mb-16 space-y-10">
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
          <input 
            type="text" 
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search destinations..."
            className="w-full pl-16 pr-8 py-6 rounded-2xl bg-white border border-gray-100 shadow-2xl shadow-gray-200/50 outline-none focus:ring-2 focus:ring-[#0084ff] transition-all text-lg"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-full text-xs font-bold transition-all ${
                activeCategory === cat ? 'bg-[#0084ff] text-white shadow-xl shadow-blue-100' : 'bg-white text-gray-400 border border-gray-100 hover:border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredArticles.length > 0 ? (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredArticles.map((article) => {
            const Icon = CategoryIcons[article.category] || CategoryIcons.default;
            return (
              <div 
                key={article.id} 
                onClick={() => onSelectArticle(article)}
                className="group cursor-pointer space-y-6"
              >
                <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-sm relative">
                  <img src={article.cardImageUrl || article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1500ms]" />
                </div>
                <div className="bg-white rounded-[2rem] p-8 shadow-sm group-hover:shadow-xl transition-all duration-500 min-h-[160px] flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-black text-gray-900 leading-snug">{article.title}</h3>
                    <Icon className="w-5 h-5 text-[#0084ff] shrink-0" />
                  </div>
                  <p className="text-gray-400 font-serif italic text-sm leading-relaxed">
                    {article.quote || 'Silence is the loudest sound in the groves at dawn.'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-400 font-medium text-lg">No destinations found in this category matching your search.</p>
          <button 
            onClick={() => {setLocalSearch(''); setActiveCategory(Category.ALL);}}
            className="mt-6 text-[#0084ff] font-bold text-sm underline decoration-2 underline-offset-4"
          >
            Clear all filters
          </button>
        </div>
      )}

      <div className="mt-20 text-center">
        <button className="px-10 py-5 rounded-full border border-gray-100 bg-white text-gray-900 font-bold text-sm hover:bg-gray-50 transition-all flex items-center gap-3 mx-auto shadow-sm">
          Deepen your exploration
          <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
             <Globe className="w-4 h-4" />
          </span>
        </button>
      </div>
    </div>
  );
};

export default Destinations;
