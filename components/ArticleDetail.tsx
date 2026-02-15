import React, { useEffect } from 'react';
import { Share2, Heart, Bookmark, Calendar, CreditCard, Coffee, Sparkles, Quote as QuoteIcon } from 'lucide-react';
import { Article } from '../types.ts';
import ArticleCard from './ArticleCard.tsx';

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

  // Extract first italic paragraph OR first paragraph as description
  const extractIntroAndContent = (text: string) => {
    if (!text) return { intro: null, remainingContent: text };
    
    const blocks = text.split(/\n\n+/);
    
    // Skip H1 title if present at the start
    let startIndex = 0;
    if (blocks[0]?.trim().startsWith('# ')) {
      startIndex = 1;
    }
    
    const firstBlock = blocks[startIndex]?.trim();
    
    if (!firstBlock) return { intro: null, remainingContent: blocks.slice(startIndex).join('\n\n') };

    // Check if entire first block is wrapped in single asterisks (italic)
    if (firstBlock.startsWith('*') && firstBlock.endsWith('*') && !firstBlock.startsWith('**')) {
      const introText = firstBlock.slice(1, -1);
      const remainingContent = blocks.slice(startIndex + 1).join('\n\n');
      return { intro: introText, remainingContent };
    }
    
    // If first paragraph is not italic but is a regular paragraph (not a heading),
    // use it as intro anyway
    if (!firstBlock.startsWith('#') && !firstBlock.startsWith('> ') && !firstBlock.startsWith('!')) {
      const introText = firstBlock.replace(/\*\*/g, '').replace(/\*/g, '');
      const remainingContent = blocks.slice(startIndex + 1).join('\n\n');
      return { intro: introText, remainingContent };
    }
    
    return { intro: null, remainingContent: blocks.slice(startIndex).join('\n\n') };
  };

  // Improved Markdown parser
  const renderMarkdown = (text: string) => {
    if (!text) return null;

    const blocks = text.split(/\n\n+/);

    return blocks.map((block, index) => {
      const trimmedBlock = block.trim();
      if (!trimmedBlock) return null;

      // 0. Skip H1 titles (# Title) - already shown in hero
      if (trimmedBlock.startsWith('# ')) {
        return null;
      }

      // 1. Handle Images: ![alt](url)
      const imageMatch = trimmedBlock.match(/!\[(.*?)\]\((.*?)\)/);
      if (imageMatch) {
        const alt = imageMatch[1];
        const src = imageMatch[2];
        return (
          <figure key={index} className="my-12 flex flex-col items-center w-full mx-auto">
            <div className="w-full max-w-[800px] rounded-[12px] overflow-hidden shadow-md">
              <img 
                src={src} 
                alt={alt} 
                className="w-full h-auto object-cover block" 
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            </div>
            {alt && (
              <figcaption className="mt-4 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 text-center max-w-[600px]">
                {alt}
              </figcaption>
            )}
          </figure>
        );
      }

      // 2. Handle Headings: ## Heading
      if (trimmedBlock.startsWith('## ')) {
        return (
          <h2 key={index} className="text-[1.8rem] font-bold text-slate-900 mt-16 mb-8 leading-tight">
            {processInline(trimmedBlock.replace('## ', ''))}
          </h2>
        );
      }

      // 3. Handle H3: ### Heading
      if (trimmedBlock.startsWith('### ')) {
        return (
          <h3 key={index} className="text-[1.4rem] font-bold text-slate-800 mt-10 mb-4 leading-tight">
            {processInline(trimmedBlock.replace('### ', ''))}
          </h3>
        );
      }

      // 4. Handle Blockquotes: > Quote
      if (trimmedBlock.startsWith('> ')) {
        return (
          <blockquote key={index} className="my-16 bg-blue-50/40 rounded-[2rem] p-10 md:p-14 text-center relative overflow-hidden">
            <QuoteIcon className="absolute top-6 left-6 size-12 text-[#0d93f2]/10" />
            <p className="text-2xl md:text-3xl font-serif italic text-slate-900 leading-snug">
              {processInline(trimmedBlock.replace('> ', ''))}
            </p>
          </blockquote>
        );
      }

      // 5. Handle bullet lists
      if (trimmedBlock.includes('\n- ') || trimmedBlock.startsWith('- ')) {
        const items = trimmedBlock.split('\n').filter(line => line.trim().startsWith('- '));
        if (items.length > 0) {
          return (
            <ul key={index} className="list-disc list-outside ml-6 mb-8 space-y-2">
              {items.map((item, i) => (
                <li key={i} className="text-lg md:text-xl leading-[1.7] text-slate-600">
                  {processInline(item.replace(/^-\s+/, ''))}
                </li>
              ))}
            </ul>
          );
        }
      }

      // 6. Default Paragraph
      return (
        <p key={index} className="text-lg md:text-xl leading-[1.7] text-slate-600 mb-8 whitespace-pre-wrap">
          {processInline(trimmedBlock)}
        </p>
      );
    });
  };

  const processInline = (text: string) => {
    const parts: (string | JSX.Element)[] = [];
    let currentIndex = 0;
    
    const inlineRegex = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
    let match;
    
    while ((match = inlineRegex.exec(text)) !== null) {
      if (match.index > currentIndex) {
        parts.push(text.substring(currentIndex, match.index));
      }
      
      const matchedText = match[0];
      
      if (matchedText.startsWith('**') && matchedText.endsWith('**')) {
        parts.push(
          <strong key={match.index} className="font-bold text-slate-900">
            {matchedText.slice(2, -2)}
          </strong>
        );
      } else if (matchedText.startsWith('*') && matchedText.endsWith('*')) {
        parts.push(
          <em key={match.index} className="italic">
            {matchedText.slice(1, -1)}
          </em>
        );
      }
      
      currentIndex = match.index + matchedText.length;
    }
    
    if (currentIndex < text.length) {
      parts.push(text.substring(currentIndex));
    }
    
    return parts.length > 0 ? parts : text;
  };

  // Determine intro and content
  const { intro: extractedIntro, remainingContent } = extractIntroAndContent(article.content || "");
  const introText = article.description || extractedIntro;
  const bodyContent = article.description ? article.content : remainingContent;

  return (
    <div className="bg-[#fcfdfe] min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={article.heroImageUrl || article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 w-full max-w-4xl px-6">
          <div className="animate-in fade-in zoom-in-95 duration-[1200ms]">
            <h1 className="text-white text-5xl md:text-[3.5rem] font-serif font-bold italic leading-tight drop-shadow-xl">
              {article.title}
            </h1>
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
            {/* Intro Paragraph: Italic with Azure Drop Cap */}
            {introText && (
              <p className="text-3xl leading-relaxed text-slate-900 font-serif italic mb-16 border-b border-slate-100 pb-16 first-letter:text-[4.5rem] first-letter:font-black first-letter:text-[#0d93f2] first-letter:float-left first-letter:mr-4 first-letter:mt-1 first-letter:leading-[0.8] first-letter:font-serif first-letter:not-italic">
                {introText}
              </p>
            )}

            {/* Markdown Body Content */}
            <div className="article-body">
              {renderMarkdown(bodyContent || "")}
            </div>
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
                  <p className="font-serif italic text-lg text-slate-900">{article.intel?.budget || 'Flexible'}</p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="size-12 rounded-2xl bg-[#0d93f2]/5 flex items-center justify-center text-[#0d93f2]">
                  <Coffee className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Must Try</p>
                  <p className="font-serif italic text-lg text-slate-900">{article.intel?.mustTry || 'Local Experiences'}</p>
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
