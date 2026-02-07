import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, FileText, Image as ImageIcon, LogOut, Edit3, Trash2, Upload, CheckCircle2, Plus, Save, Monitor, AlertCircle, RefreshCw, CloudCheck, Clock, Database } from 'lucide-react';
import Cropper from 'https://esm.sh/react-easy-crop@5.2.0';
import { Article, Category, SiteConfig } from '../types.ts';

const getCroppedImg = async (imageSrc: string, pixelCrop: any, rotation = 0): Promise<string> => {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (error) => reject(error));
    img.src = imageSrc;
  });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const rotRad = (rotation * Math.PI) / 180;
  const { width: bBoxWidth, height: bBoxHeight } = {
    width: Math.abs(Math.cos(rotRad) * image.width) + Math.abs(Math.sin(rotRad) * image.height),
    height: Math.abs(Math.sin(rotRad) * image.width) + Math.abs(Math.cos(rotRad) * image.height),
  };

  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);

  const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height);
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  ctx.putImageData(data, 0, 0);
  return canvas.toDataURL('image/jpeg', 0.85);
};

interface AdminPanelProps {
  articles: Article[];
  siteConfig: SiteConfig;
  onUpdateSiteConfig: (config: SiteConfig) => void;
  onAdd: (article: Article) => void;
  onUpdateArticle: (article: Article) => void;
  onDelete: (id: string) => void;
  onInitializeCloudDB?: () => void;
  onLogout: () => void;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  articles, 
  siteConfig, 
  onUpdateSiteConfig, 
  onAdd, 
  onUpdateArticle,
  onDelete, 
  onInitializeCloudDB,
  onLogout, 
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState<'articles' | 'config'>('articles');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<string>('Mai');
  const [syncStatus, setSyncStatus] = useState<'synced' | 'saving' | 'dirty'>('synced');
  const [dragActive, setDragActive] = useState<string | null>(null);

  const [tempConfig, setTempConfig] = useState<SiteConfig>(siteConfig);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [cropTarget, setCropTarget] = useState<'hero' | 'card' | 'siteHero'>('card');
  const [aspect, setAspect] = useState<number>(3 / 4);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const mainFileInputRef = useRef<HTMLInputElement>(null);
  const siteHeroFileInputRef = useRef<HTMLInputElement>(null);
  
  const initialFormState: Partial<Article> = {
    title: '', location: '', category: Category.EUROPE,
    imageUrl: '', cardImageUrl: '', heroImageUrl: '',
    description: '', content: '', intel: { bestTime: '', budget: '', mustTry: '', vibe: '' }
  };

  const [formArticle, setFormArticle] = useState<Partial<Article>>(initialFormState);

  const handleManualSave = useCallback(() => {
    if (!formArticle.title) return;
    setSyncStatus('saving');
    const submission = { ...formArticle, id: editingId || `art-${Date.now()}` } as Article;
    
    try {
      if (editingId) onUpdateArticle(submission); else onAdd(submission);
      
      const now = new Date();
      setLastSaved(`${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`);
      setSyncStatus('synced');
    } catch (e) {
      console.error('⚠️ Errore salvataggio Cloud');
      setSyncStatus('dirty');
    }
  }, [formArticle, editingId, onUpdateArticle, onAdd]);

  useEffect(() => {
    if (syncStatus === 'dirty' && (editingId || formArticle.title)) {
      const timer = setTimeout(() => handleManualSave(), 10000);
      return () => clearTimeout(timer);
    }
  }, [formArticle, editingId, syncStatus, handleManualSave]);

  const onInputChange = (key: keyof Article, value: any) => {
    setFormArticle(prev => ({ ...prev, [key]: value }));
    setSyncStatus('dirty');
  };

  const processFile = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  const handleFileAction = async (file: File, target: 'card' | 'hero' | 'siteHero') => {
    setCropTarget(target);
    setAspect(target === 'card' ? 3 / 4 : 16 / 9);
    const base64 = await processFile(file);
    setCropImageSrc(base64);
  };

  const handleDrag = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(id);
    } else if (e.type === "dragleave") {
      setDragActive(null);
    }
  };

  const handleDrop = (e: React.DragEvent, target: 'card' | 'hero' | 'siteHero') => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileAction(e.dataTransfer.files[0], target);
    }
  };

  const handleConfirmCrop = async () => {
    if (!cropImageSrc || !croppedAreaPixels) return;
    const croppedBase64 = await getCroppedImg(cropImageSrc, croppedAreaPixels);
    if (cropTarget === 'card') {
      setFormArticle(prev => ({ ...prev, cardImageUrl: croppedBase64, imageUrl: croppedBase64 }));
    } else if (cropTarget === 'hero') {
      setFormArticle(prev => ({ ...prev, heroImageUrl: croppedBase64 }));
    } else if (cropTarget === 'siteHero') {
      setTempConfig(prev => ({ ...prev, heroImageUrl: croppedBase64 }));
    }
    setSyncStatus('dirty');
    setCropImageSrc(null);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormArticle(initialFormState);
    setSyncStatus('synced');
  };

  return (
    <div className="fixed inset-0 z-[60] flex bg-white animate-in slide-in-from-bottom duration-500 overflow-hidden">
      
      {cropImageSrc && (
        <div className="fixed inset-0 z-[100] bg-slate-900/98 flex flex-col p-12">
          <div className="flex-1 relative bg-black rounded-[2rem] overflow-hidden">
            <Cropper image={cropImageSrc} crop={crop} zoom={zoom} aspect={aspect} onCropChange={setCrop} onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)} onZoomChange={setZoom} />
          </div>
          <div className="mt-8 flex justify-center gap-4">
            <button onClick={() => setCropImageSrc(null)} className="px-8 py-4 bg-white/10 text-white rounded-xl font-bold">Annulla</button>
            <button onClick={handleConfirmCrop} className="px-10 py-4 bg-[#0d93f2] text-white rounded-xl font-bold">Applica</button>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <div className="w-80 bg-slate-50 border-r border-slate-100 flex flex-col p-8 shrink-0">
        <div className="flex items-center gap-3 mb-10">
          <div className="size-8 bg-[#0d93f2] rounded-lg flex items-center justify-center"><div className="size-3 bg-white rotate-45" /></div>
          <span className="font-black text-xl tracking-tighter">GURU CLOUD</span>
        </div>
        
        <div className="mb-10 p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            {syncStatus === 'synced' ? (
              <><div className="size-2.5 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" /><span className="text-[10px] font-black uppercase tracking-widest text-green-600">🟢 Cloud Synced</span></>
            ) : (
              <><div className="size-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" /><span className="text-[10px] font-black uppercase tracking-widest text-red-600">🔴 Modifiche Cloud</span></>
            )}
          </div>
          <div className="space-y-2 text-slate-400">
            <div className="flex items-center gap-2"><Clock size={12} /><p className="text-[10px] font-bold">Sync: {lastSaved}</p></div>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <button onClick={() => { setActiveTab('articles'); resetForm(); }} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === 'articles' ? 'bg-white text-[#0d93f2] shadow-sm' : 'text-slate-400 hover:bg-slate-100'}`}><FileText size={18} /> Cloud Editorial</button>
          <button onClick={() => setActiveTab('config')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === 'config' ? 'bg-white text-[#0d93f2] shadow-sm' : 'text-slate-400 hover:bg-slate-100'}`}><Monitor size={18} /> Identità Sito</button>
          
          {onInitializeCloudDB && (
            <div className="pt-8 mt-auto">
              <button 
                onClick={() => { if(confirm("Vuoi popolare il Cloud con gli articoli di base?")) onInitializeCloudDB(); }} 
                className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm text-slate-400 hover:bg-blue-50 hover:text-blue-500 transition-all border border-dashed border-slate-200"
              >
                <Database size={18} /> Inizializza Cloud
              </button>
            </div>
          )}
        </nav>

        <button onClick={onLogout} className="mt-8 flex items-center gap-4 px-5 py-4 text-red-500 font-bold text-sm hover:bg-red-50 rounded-2xl"><LogOut size={18} /> Logout</button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto p-12 bg-white">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-black">{activeTab === 'articles' ? 'Gestione Storie' : 'Design Homepage'}</h2>
          <div className="flex gap-4">
            {syncStatus === 'dirty' && (
              <button onClick={handleManualSave} className="flex items-center gap-3 px-8 py-3.5 bg-[#0d93f2] text-white rounded-xl font-bold text-xs shadow-xl shadow-blue-500/20 hover:scale-105 transition-all">
                <Save size={14} /> Pubblica su Cloud
              </button>
            )}
            <button onClick={onClose} className="p-3.5 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"><X size={20} /></button>
          </div>
        </div>

        {activeTab === 'articles' && (
          <div className="grid grid-cols-12 gap-12">
            <div className="col-span-8 space-y-12">
              <section className="bg-slate-50/50 p-10 rounded-[2.5rem] border border-slate-100 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Titolo dell'articolo</label>
                    <input type="text" placeholder="Es: Il risveglio di Kyoto..." value={formArticle.title} onChange={e => onInputChange('title', e.target.value)} className="w-full px-6 py-4 rounded-2xl border-transparent bg-white shadow-sm focus:border-blue-200 outline-none font-bold text-lg" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Località</label>
                    <input type="text" placeholder="Es: KYOTO, JAPAN" value={formArticle.location} onChange={e => onInputChange('location', e.target.value)} className="w-full px-6 py-4 rounded-2xl border-transparent bg-white shadow-sm focus:border-blue-200 outline-none" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Cover Anteprima (3:4)</label>
                    <div 
                      onDragEnter={(e) => handleDrag(e, 'card')} 
                      onDragOver={(e) => handleDrag(e, 'card')} 
                      onDragLeave={(e) => handleDrag(e, 'card')} 
                      onDrop={(e) => handleDrop(e, 'card')}
                      onClick={() => { setCropTarget('card'); setAspect(3/4); mainFileInputRef.current?.click(); }} 
                      className={`aspect-[3/4] bg-white border-2 border-dashed rounded-3xl flex items-center justify-center overflow-hidden cursor-pointer transition-all ${dragActive === 'card' ? 'border-[#0d93f2] bg-blue-50 scale-[1.02]' : 'border-slate-200 hover:border-blue-300'}`}
                    >
                      {formArticle.cardImageUrl ? (
                        <img src={formArticle.cardImageUrl} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center">
                          <Plus className="text-slate-300 mx-auto mb-2" />
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trascina qui l'immagine</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Header Hero (16:9)</label>
                    <div 
                      onDragEnter={(e) => handleDrag(e, 'hero')} 
                      onDragOver={(e) => handleDrag(e, 'hero')} 
                      onDragLeave={(e) => handleDrag(e, 'hero')} 
                      onDrop={(e) => handleDrop(e, 'hero')}
                      onClick={() => { setCropTarget('hero'); setAspect(16/9); mainFileInputRef.current?.click(); }} 
                      className={`aspect-video bg-white border-2 border-dashed rounded-3xl flex items-center justify-center overflow-hidden cursor-pointer transition-all ${dragActive === 'hero' ? 'border-[#0d93f2] bg-blue-50 scale-[1.02]' : 'border-slate-200 hover:border-blue-300'}`}
                    >
                      {formArticle.heroImageUrl ? (
                        <img src={formArticle.heroImageUrl} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="text-slate-300 mx-auto mb-2" />
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trascina qui l'immagine</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Narrazione (Markdown supportato)</label>
                  <textarea placeholder="Scrivi la tua storia qui..." value={formArticle.content} onChange={e => onInputChange('content', e.target.value)} className="w-full p-8 rounded-3xl border-transparent bg-white shadow-sm focus:border-blue-200 outline-none min-h-[500px] font-mono text-sm leading-relaxed" />
                </div>
              </section>
              <input type="file" ref={mainFileInputRef} onChange={async e => { const f = e.target.files?.[0]; if(f) handleFileAction(f, cropTarget); }} className="hidden" accept="image/*" />
            </div>

            <div className="col-span-4 space-y-4">
              <h3 className="text-xl font-black mb-6">Cloud Database ({articles.length})</h3>
              <div className="space-y-3">
                {articles.map(art => (
                  <div key={art.id} className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4 group hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-slate-100">
                    <img src={art.cardImageUrl || art.imageUrl} className="size-14 rounded-xl object-cover shadow-sm" />
                    <div className="flex-1 truncate">
                      <p className="font-black text-[13px] text-slate-900 truncate">{art.title}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{art.location}</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingId(art.id); setFormArticle(art); setSyncStatus('synced'); }} className="p-2.5 bg-white rounded-xl text-blue-500 shadow-md hover:scale-110 transition-transform"><Edit3 size={14}/></button>
                      <button onClick={() => onDelete(art.id)} className="p-2.5 bg-white rounded-xl text-red-500 shadow-md hover:scale-110 transition-transform"><Trash2 size={14}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'config' && (
          <form onSubmit={e => { e.preventDefault(); onUpdateSiteConfig(tempConfig); setSyncStatus('synced'); }} className="max-w-4xl space-y-12">
            <section className="bg-slate-50/50 p-10 rounded-[2.5rem] border border-slate-100 space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Sfondo Principale (16:9)</label>
                <div 
                  onDragEnter={(e) => handleDrag(e, 'siteHero')} 
                  onDragOver={(e) => handleDrag(e, 'siteHero')} 
                  onDragLeave={(e) => handleDrag(e, 'siteHero')} 
                  onDrop={(e) => handleDrop(e, 'siteHero')}
                  onClick={() => { setCropTarget('siteHero'); setAspect(16/9); siteHeroFileInputRef.current?.click(); }} 
                  className={`aspect-video bg-white border-2 border-dashed rounded-3xl overflow-hidden cursor-pointer flex items-center justify-center transition-all ${dragActive === 'siteHero' ? 'border-[#0d93f2] bg-blue-50 scale-[1.02]' : 'border-slate-200 hover:border-blue-300'}`}
                >
                  {tempConfig.heroImageUrl ? (
                    <img src={tempConfig.heroImageUrl} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <Upload className="text-slate-300 mx-auto mb-2" />
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trascina qui lo sfondo hero</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <input type="text" value={tempConfig.heroTitle} onChange={e => { setTempConfig({...tempConfig, heroTitle: e.target.value}); setSyncStatus('dirty'); }} className="w-full px-6 py-4 rounded-xl border-transparent bg-white shadow-sm outline-none font-bold" />
                <input type="text" value={tempConfig.heroHighlight} onChange={e => { setTempConfig({...tempConfig, heroHighlight: e.target.value}); setSyncStatus('dirty'); }} className="w-full px-6 py-4 rounded-xl border-transparent bg-white shadow-sm outline-none font-serif italic text-[#0d93f2]" />
              </div>
              <textarea value={tempConfig.heroSubtitle} onChange={e => { setTempConfig({...tempConfig, heroSubtitle: e.target.value}); setSyncStatus('dirty'); }} className="w-full p-6 rounded-xl border-transparent bg-white shadow-sm outline-none h-32" />
              <button type="submit" className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-[#0d93f2] transition-colors">Applica Modifiche Locali</button>
            </section>
            <input type="file" ref={siteHeroFileInputRef} onChange={async e => { const f = e.target.files?.[0]; if(f) handleFileAction(f, 'siteHero'); }} className="hidden" accept="image/*" />
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;