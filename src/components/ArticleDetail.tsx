import React, { useEffect } from 'react';
import { Share2, Heart, Bookmark, Calendar, CreditCard, Coffee, Sparkles, MapPin } from 'lucide-react';
import DOMPurify from 'dompurify';
import { Article } from '../types.ts';
import ArticleCard from './ArticleCard.tsx';

// Function to remove the first H1 from content (duplicate title)
function removeFirstH1(content: string): string {
  if (!content) return '';
  
  // Removes first <h1>...</h1> or # Title (Markdown)
  return content
    .replace(/^#\s+.+$/m, '') // Removes # Title (Markdown)
    .replace(/<h1[^>]*>.*?<\/h1>/i, '') // Removes <h1>Title</h1> (HTML)
    .trim();
}

interface ArticleDetailProps {
  article: Article;
  articles: Article[];
  onBack: () => void;
  onSelectArticle: (article: Article) => void;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, articles, onBack, onSelectArticle }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [article.id]);

  const relatedArticles = articles
    .filter(a => a.id !== article.id)
    .slice(0, 3);

  const formatContent = (html: string) => {
    if (!html) return "";
    
    // Check if it's already well-formatted HTML (multiple paragraphs)
    const pCount = (html.match(/<p>/g) || []).length;
    if (pCount > 1) return html;

    // If it's a single <p> or plain text with newlines
    let text = html;
    if (html.startsWith('<p>') && html.endsWith('</p>') && pCount === 1) {
      text = html.replace(/^<p>/, '').replace(/<\/p>$/, '');
    }

    // Split by double newlines and wrap in <p>
    let formatted = text
      .split(/\n\n+/)
      .map(para => {
        const trimmed = para.trim();
        if (!trimmed) return "";
        
        // Simple markdown heading support
        if (trimmed.startsWith('## ')) return `<h2 class="text-[1.8rem] font-bold text-slate-900 mt-16 mb-8 leading-tight">${trimmed.slice(3)}</h2>`;
        if (trimmed.startsWith('### ')) return `<h3 class="text-[1.5rem] font-bold text-slate-900 mt-12 mb-6 leading-tight">${trimmed.slice(4)}</h3>`;
        
        return `<p class="mb-8">${trimmed}</p>`;
      })
      .join('\n');

    return formatted;
  };

  return (
    <div className="bg-[#fcfdfe] min-h-screen">
      {/* Hero Section: Centered and Scaled Down */}
      <section className="relative h-[70vh] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={article.heroImageUrl || article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 w-full max-w-4xl px-6">
          <div className="animate-in fade-in zoom-in-95 duration-[1200ms]">
            <h1 className="text-white text-5xl md:text-[3.5rem] font-serif font-bold italic leading-tight drop-shadow-xl mb-6">
              {article.title}
            </h1>
            {article.location && (
              <div className="flex items-center justify-center gap-2 text-white/90 font-bold uppercase tracking-[0.2em] text-xs md:text-sm">
                <MapPin className="size-4 text-[#0d93f2]" />
                {article.location}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 flex flex-col lg:flex-row gap-16 md:gap-24">
        
        {/* Interaction Sidebar */}
        <aside className="hidden lg:flex flex-col gap-10 w-12 sticky top-32 h-fit">
          <button className="group flex flex-col items-center gap-3">
            <Heart className="w-6 h-6 text-slate-300 group-hover:text-[#0d93f2] transition-colors" />
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">1.2k</p>
          </button>
          <button className="group flex flex-col items-center gap-3">
            <Share2 className="w-6 h-6 text-slate-300 group-hover:text-[#0d93f2] transition-colors" />
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Share</p>
          </button>
          <button className="group flex flex-col items-center gap-3">
            <Bookmark className="w-6 h-6 text-slate-300 group-hover:text-[#0d93f2] transition-colors" />
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Save</p>
          </button>
        </aside>

        {/* Narrative Column */}
        <div className="flex-1 w-full max-w-[800px] mx-auto lg:mx-0">
          <article>
            {/* HTML Body Content (with drop cap included) */}
            <div 
              className="article-content prose prose-lg max-w-none text-slate-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(formatContent(removeFirstH1(article.content || ""))) }} 
            />
          </article>

          {/* Related Stories */}
          <div className="mt-32 pt-20 border-t border-gray-100">
            <h3 className="text-3xl font-black tracking-tighter mb-12">Related Intelligence</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map((ra) => (
                <div key={ra.id} onClick={() => onSelectArticle(ra)} className="cursor-pointer">
                  <ArticleCard article={ra} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info Sidebar (GURU INTEL) */}
        <aside className="w-full lg:w-96 shrink-0">
          <div className="bg-white border border-gray-100 rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50 relative">
            <h3 className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] mb-12 text-slate-900">
              <span className="w-5 h-5 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#0d93f2]" />
              </span>
              Guru Intel
            </h3>

            <div className="space-y-10">
              <div className="flex gap-5">
                <div className="size-12 rounded-2xl bg-[#0d93f2]/5 flex items-center justify-center text-[#0d93f2]">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Best Time</p>
                  <p className="font-serif italic text-lg text-slate-900">{article.intel?.bestTime || 'Year Round'}</p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="size-12 rounded-2xl bg-[#0d93f2]/5 flex items-center justify-center text-[#0d93f2]">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Budget</p>
                  <p className="font-serif italic text-lg text-slate-900">{article.intel?.budget || 'High'}</p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="size-12 rounded-2xl bg-[#0d93f2]/5 flex items-center justify-center text-[#0d93f2]">
                  <Coffee className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Must Try</p>
                  <p className="font-serif italic text-lg text-slate-900">{article.intel?.mustTry || 'Ask a Local'}</p>
                </div>
              </div>
            </div>

            <button className="w-full mt-14 bg-slate-900 text-white font-bold py-5 rounded-2xl hover:bg-[#0d93f2] transition-all text-[11px] uppercase tracking-[0.3em]">
              Download Brief
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ArticleDetail;