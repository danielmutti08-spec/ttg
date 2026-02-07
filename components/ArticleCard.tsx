
import React from 'react';
import { MapPin } from 'lucide-react';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <div className="group cursor-pointer relative h-full pb-12">
      <div className="aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-sm">
        <img 
          src={article.cardImageUrl || article.imageUrl} 
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
        />
      </div>

      <div className="absolute -bottom-2 left-6 right-6 bg-white rounded-[1.5rem] p-8 shadow-premium border border-gray-50 transition-all duration-500 group-hover:-translate-y-4">
        <div className="flex items-center gap-2 text-[#0d93f2] font-extrabold text-[10px] uppercase tracking-[0.2em] mb-3">
          <MapPin className="size-3.5 fill-current" />
          {article.location}
        </div>
        <h3 className="text-[#1a1a1a] font-extrabold text-xl leading-snug group-hover:text-[#0d93f2] transition-colors">
          {article.title}
        </h3>
      </div>
    </div>
  );
};

export default ArticleCard;
