import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ArticleCard from './components/ArticleCard';
import FeaturedSection from './components/FeaturedSection';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import Destinations from './components/Destinations';
import Guides from './components/Guides';
import About from './components/About';
import Contact from './components/Contact';
import ArticleDetail from './components/ArticleDetail';
import AdminPanel from './components/AdminPanel';
import { INITIAL_ARTICLES, INITIAL_SITE_CONFIG } from './constants';
import { Article, Category, SiteConfig } from './types';
import { ChevronLeft, ChevronRight, ArrowRight, CheckCircle2, AlertCircle, Loader2, X, Search as SearchIcon, Lock } from 'lucide-react';
import { dbService } from './db';
import { firebaseService } from './firebase';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'destinations' | 'guides' | 'about' | 'contact' | 'article' | 'admin' | 'search' | 'login'>('home');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(INITIAL_SITE_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('isAdminLoggedIn') === 'true');
  
  // Login form state
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // --- CARICAMENTO DATI ---
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const cloudArticles = await firebaseService.loadArticles();
      
      if (cloudArticles && cloudArticles.length > 0) {
        setArticles(cloudArticles);
      } else {
        const localArticles = await dbService.loadArticles();
        if (localArticles && localArticles.length > 0) {
          setArticles(localArticles);
        } else {
          setArticles(INITIAL_ARTICLES);
        }
      }

      const savedConfig = await dbService.loadConfig();
      if (savedConfig) setSiteConfig(savedConfig);

    } catch (e) {
      console.error('❌ Errore sincronizzazione:', e);
      setArticles(INITIAL_ARTICLES);
      addToast("Errore Cloud: Dati caricati in modalità locale.", "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddArticle = async (art: Article) => {
    try {
      await firebaseService.saveArticle(art);
      const newList = [art, ...articles];
      setArticles(newList);
      await dbService.saveArticles(newList);
      addToast("✅ Articolo pubblicato su Cloud!");
    } catch (e) {
      addToast("Errore durante la pubblicazione Cloud.", "error");
    }
  };
  
  const handleUpdateArticle = async (uArt: Article) => {
    try {
      await firebaseService.saveArticle(uArt);
      const newList = articles.map(a => a.id === uArt.id ? uArt : a);
      setArticles(newList);
      await dbService.saveArticles(newList);
      if (selectedArticle?.id === uArt.id) setSelectedArticle(uArt);
      addToast("✅ Articolo aggiornato su Cloud!");
    } catch (e) {
      addToast("Errore aggiornamento Cloud.", "error");
    }
  };
  
  const handleDeleteArticle = async (id: string) => {
    if (INITIAL_ARTICLES.some(art => art.id === id)) {
      addToast("Gli articoli di sistema non possono essere rimossi.", "error");
      return;
    }
    try {
      await firebaseService.deleteArticle(id);
      const newList = articles.filter(a => a.id !== id);
      setArticles(newList);
      await dbService.saveArticles(newList);
      addToast("Articolo rimosso dal Cloud.");
    } catch (e) {
      addToast("Errore durante l'eliminazione Cloud.", "error");
    }
  };

  const handleInitializeCloudDB = async () => {
    setIsLoading(true);
    try {
      await firebaseService.seedDatabase(INITIAL_ARTICLES);
      await loadData();
      addToast("🚀 Database Cloud inizializzato!");
    } catch (e) {
      addToast("Errore inizializzazione Cloud.", "error");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdateSiteConfig = (config: SiteConfig) => {
    setSiteConfig(config);
    dbService.saveConfig(config);
    addToast("Design Homepage salvato localmente.");
  };

  const handleArticleClick = (art: Article) => {
    setSelectedArticle(art);
    setView('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setView('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPass = (import.meta as any).env?.VITE_ADMIN_PASSWORD || 'travelguru2024';
    
    if (loginUser === 'admin' && loginPass === correctPass) {
      setIsLoggedIn(true);
      sessionStorage.setItem('isAdminLoggedIn', 'true');
      setLoginError('');
      setView('admin');
    } else {
      setLoginError('Credenziali non valide');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('isAdminLoggedIn');
    setView('home');
  };

  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();
    return articles.filter(art => 
      art.title.toLowerCase().includes(q) ||
      (art.description?.toLowerCase().includes(q)) ||
      (art.content?.toLowerCase().includes(q)) ||
      art.category.toLowerCase().includes(q) ||
      art.location.toLowerCase().includes(q)
    );
  }, [articles, searchQuery]);

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <mark key={i} className="bg-blue-100 text-blue-600 rounded-sm px-0.5">{part}</mark> 
        : part
    );
  };

  // Determine if the current view should have a transparent header sitting on an image hero
  const isTransparentLayout = view === 'home' || view === 'article';

  // Redirect to login if trying to access admin without session
  useEffect(() => {
    if (view === 'admin' && !isLoggedIn) {
      setView('login');
    }
  }, [view, isLoggedIn]);

  const handleNavigate = (v: 'home' | 'destinations' | 'guides' | 'about' | 'contact' | 'admin') => {
    setView(v);
    setSelectedArticle(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white gap-6">
        <Loader2 className="size-12 text-[#0d93f2] animate-spin" />
        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">Syncing Guru Cloud Intelligence...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3">
        {toasts.map(toast => (
          <div key={toast.id} className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 ${
            toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-[#0a1128] text-white'
          }`}>
            {toast.type === 'error' ? <AlertCircle size={18}/> : <CheckCircle2 size={18} className="text-[#0d93f2]" />}
            <span className="text-[11px] font-black uppercase tracking-widest">{toast.message}</span>
          </div>
        ))}
      </div>

      {view !== 'admin' && view !== 'login' && (
        <Header 
          onNavigate={handleNavigate} 
          onSearch={handleSearch}
          isTransparentLayout={isTransparentLayout}
        />
      )}
      
      {view === 'home' && (
        <main>
          <Hero config={siteConfig} onNavigate={setView} />
          <section id="articles-section" className="max-w-7xl mx-auto py-24 px-6 md:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                <h2 className="text-5xl font-extrabold text-gray-900 mb-3 tracking-tighter">Recent Discoveries</h2>
                <p className="text-gray-400 text-lg font-medium">Cloud-synced insights from world explorers.</p>
              </div>
              <button onClick={() => setView('destinations')} className="text-[#0084ff] font-bold text-sm flex items-center gap-2 hover:underline decoration-2 underline-offset-4">
                View all stories <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {articles.slice(0, 3).map((article) => (
                <div key={article.id} onClick={() => handleArticleClick(article)}>
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
          </section>
          <FeaturedSection onNavigate={setView} />
          <Newsletter />
        </main>
      )}

      {view === 'destinations' && <Destinations articles={articles} onSelectArticle={handleArticleClick} />}
      {view === 'guides' && <Guides articles={articles} onSelectArticle={handleArticleClick} />}
      {view === 'about' && <About />}
      {view === 'contact' && <Contact />}
      {view === 'article' && selectedArticle && (
        <ArticleDetail article={selectedArticle} articles={articles} onBack={() => setView('home')} onSelectArticle={handleArticleClick} />
      )}
      
      {view === 'login' && (
        <div className="h-screen w-full flex items-center justify-center bg-[#f8f9fa] px-6">
          <div className="max-w-md w-full bg-white rounded-[2.5rem] p-12 shadow-2xl border border-gray-100">
            <div className="flex justify-center mb-8">
              <div className="size-16 bg-[#0084ff] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                <Lock className="size-8" />
              </div>
            </div>
            <h2 className="text-3xl font-black text-gray-900 text-center mb-2">Team Access</h2>
            <p className="text-gray-400 text-center text-sm font-medium mb-10 tracking-tight">Enter your credentials to manage the vault.</p>
            
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Username</label>
                <input 
                  type="text" 
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  placeholder="Username" 
                  className="w-full px-6 py-4 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-blue-100 outline-none transition-all font-bold" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Password</label>
                <input 
                  type="password" 
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="Password" 
                  className="w-full px-6 py-4 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-blue-100 outline-none transition-all font-bold" 
                />
              </div>
              
              {loginError && (
                <div className="flex items-center gap-2 text-red-500 font-bold text-xs ml-4 py-2">
                  <AlertCircle size={14} />
                  {loginError}
                </div>
              )}

              <button className="w-full bg-[#0d93f2] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20 active:scale-95 mt-4">
                Login
              </button>
              
              <button 
                type="button"
                onClick={() => setView('home')} 
                className="w-full text-gray-400 font-bold text-xs uppercase tracking-widest mt-6 hover:text-black transition-colors"
              >
                Return Home
              </button>
            </form>
          </div>
        </div>
      )}

      {view === 'admin' && isLoggedIn && (
        <AdminPanel 
          articles={articles} siteConfig={siteConfig} 
          onUpdateSiteConfig={handleUpdateSiteConfig} onAdd={handleAddArticle} 
          onUpdateArticle={handleUpdateArticle} onDelete={handleDeleteArticle} 
          onInitializeCloudDB={handleInitializeCloudDB}
          onLogout={handleLogout} 
          onClose={() => setView('home')} 
        />
      )}

      {view === 'search' && (
        <div className="bg-[#fcfcfc] min-h-screen pt-32 pb-24 px-6 md:px-12">
          <div className="max-w-6xl mx-auto mb-16 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#0084ff] mb-4 block">Search Intelligence</span>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tightest">Results for <span className="text-[#0d93f2] italic font-serif">"{searchQuery}"</span></h1>
              <p className="text-gray-400 font-medium mt-4">{searchResults.length} {searchResults.length === 1 ? 'article' : 'articles'} found in the vault.</p>
            </div>
            <button 
              onClick={() => setView('home')}
              className="flex items-center gap-2 text-gray-400 hover:text-black font-bold text-xs uppercase tracking-widest transition-colors"
            >
              <X className="w-4 h-4" /> Close Search
            </button>
          </div>

          {searchResults.length > 0 ? (
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {searchResults.map((article) => (
                <div key={article.id} onClick={() => handleArticleClick(article)} className="group cursor-pointer">
                  <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-sm relative mb-6">
                    <img src={article.cardImageUrl || article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1500ms]" />
                  </div>
                  <div className="bg-white rounded-[2rem] p-8 shadow-sm group-hover:shadow-xl transition-all duration-500 border border-gray-50">
                    <div className="text-[10px] font-black text-[#0084ff] uppercase tracking-widest mb-3">{highlightText(article.location, searchQuery)}</div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4">{highlightText(article.title, searchQuery)}</h3>
                    <p className="text-gray-400 text-sm font-medium line-clamp-2">{highlightText(article.description || '', searchQuery)}</p>
                    <div className="mt-6 flex items-center gap-2 text-[#0084ff] font-bold text-xs uppercase tracking-widest">
                      Read more <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-300">
                <SearchIcon className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-4">Empty Vault.</h3>
              <p className="text-gray-400 font-medium leading-relaxed">We couldn't find any articles matching your search terms. Try exploring different keywords or browsing our destinations.</p>
              <button 
                onClick={() => setView('destinations')}
                className="mt-10 px-8 py-4 bg-[#0d93f2] text-white rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-blue-500/20"
              >
                Browse All Destinations
              </button>
            </div>
          )}
        </div>
      )}

      {view !== 'admin' && view !== 'login' && <Footer onTeamClick={() => setView('login')} onNavigate={handleNavigate} />}
    </div>
  );
};

export default App;