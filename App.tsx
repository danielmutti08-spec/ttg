
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header.tsx';
import Hero from './components/Hero.tsx';
import ArticleCard from './components/ArticleCard.tsx';
import FeaturedSection from './components/FeaturedSection.tsx';
import Newsletter from './components/Newsletter.tsx';
import Footer from './components/Footer.tsx';
import Destinations from './components/Destinations.tsx';
import Guides from './components/Guides.tsx';
import About from './components/About.tsx';
import Contact from './components/Contact.tsx';
import ArticleDetail from './components/ArticleDetail.tsx';
import AdminPanel from './components/AdminPanel.tsx';
import { INITIAL_ARTICLES, INITIAL_SITE_CONFIG } from './constants.tsx';
import { Article, Category, SiteConfig } from './types.ts';
import { ChevronLeft, ChevronRight, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { dbService } from './db.ts';
import { firebaseService } from './firebase.ts';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'destinations' | 'guides' | 'about' | 'contact' | 'article' | 'admin'>('home');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(INITIAL_SITE_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>(Category.ALL);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

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
      // 1. Prova a caricare da Firebase
      const cloudArticles = await firebaseService.loadArticles();
      
      if (cloudArticles && cloudArticles.length > 0) {
        setArticles(cloudArticles);
        console.log("☁️ Articoli caricati da Cloud Firestore");
      } else {
        // 2. Se Cloud è vuoto, usa IndexedDB come fallback o dati Hard-coded
        const localArticles = await dbService.loadArticles();
        if (localArticles && localArticles.length > 0) {
          setArticles(localArticles);
          console.log("📂 Articoli caricati da IndexedDB (Local Fallback)");
        } else {
          setArticles(INITIAL_ARTICLES);
          console.log("💡 Caricati articoli predefiniti di sistema");
        }
      }

      // Configurazione sito rimane locale o da IndexedDB per ora
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
      // Salvataggio Cloud
      await firebaseService.saveArticle(art);
      // Aggiornamento locale
      const newList = [art, ...articles];
      setArticles(newList);
      // Backup locale IndexedDB
      await dbService.saveArticles(newList);
      addToast("✅ Articolo pubblicato su Cloud!");
    } catch (e) {
      console.error("Errore salvataggio Cloud:", e);
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
      console.error("Errore aggiornamento Cloud:", e);
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

      <Header 
        onNavigate={(v) => { setView(v); setSelectedArticle(null); }} 
        onLoginClick={() => isLoggedIn ? setView('admin') : setShowLoginModal(true)}
      />
      
      {view === 'home' && (
        <main>
          <Hero config={siteConfig} onNavigate={setView} />
          <section className="max-w-7xl mx-auto py-24 px-6 md:px-12">
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
      {view === 'admin' && (
        <AdminPanel 
          articles={articles} siteConfig={siteConfig} 
          onUpdateSiteConfig={handleUpdateSiteConfig} onAdd={handleAddArticle} 
          onUpdateArticle={handleUpdateArticle} onDelete={handleDeleteArticle} 
          onInitializeCloudDB={handleInitializeCloudDB}
          onLogout={() => { setIsLoggedIn(false); setView('home'); }} onClose={() => setView('home')} 
        />
      )}

      {showLoginModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-[#0a1128]/95 backdrop-blur-xl">
          <div className="bg-white rounded-[2.5rem] p-12 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-extrabold text-gray-900 mb-8 text-center">Elite Access</h3>
            <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); setShowLoginModal(false); setView('admin'); }} className="space-y-4">
              <input type="text" placeholder="Username" className="w-full px-6 py-4 rounded-xl bg-gray-50 outline-none" />
              <input type="password" placeholder="Password" className="w-full px-6 py-4 rounded-xl bg-gray-50 outline-none" />
              <button className="w-full bg-[#1a1a1a] text-white py-4 rounded-xl font-bold">Unlock Vault</button>
              <button type="button" onClick={() => setShowLoginModal(false)} className="w-full text-gray-400 font-bold text-sm mt-4">Cancel</button>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default App;
