
import { Article, SiteConfig } from './types';
import { doc, updateDoc, increment, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { db } from './firebase';

const DB_NAME = 'TravelGuruDB';
const DB_VERSION = 1;
const STORE_ARTICLES = 'articles';
const STORE_CONFIG = 'config';

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_ARTICLES)) {
        db.createObjectStore(STORE_ARTICLES, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_CONFIG)) {
        db.createObjectStore(STORE_CONFIG, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const withRetry = async <T>(fn: () => Promise<T>, retries = 3): Promise<T> => {
  try {
    return await fn();
  } catch (err) {
    if (retries > 0) {
      console.warn(`⚠️ Errore DB, riprovo... (${4 - retries}/3)`);
      await new Promise(r => setTimeout(r, 500));
      return withRetry(fn, retries - 1);
    }
    throw err;
  }
};

export const dbService = {
  async saveArticles(articles: Article[]): Promise<void> {
    return withRetry(async () => {
      console.log('💾 Salvataggio IndexedDB in corso...');
      const db = await openDB();
      const tx = db.transaction(STORE_ARTICLES, 'readwrite');
      const store = tx.objectStore(STORE_ARTICLES);
      
      await new Promise<void>((resolve, reject) => {
        const clearRequest = store.clear();
        clearRequest.onsuccess = () => {
          if (articles.length === 0) return resolve();
          let completed = 0;
          articles.forEach(art => {
            const req = store.add(art);
            req.onsuccess = () => {
              completed++;
              if (completed === articles.length) resolve();
            };
            req.onerror = () => reject(req.error);
          });
        };
        clearRequest.onerror = () => reject(clearRequest.error);
      });

      console.log('✅ Database sincronizzato correttamente.');
    });
  },

  async loadArticles(): Promise<Article[] | null> {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_ARTICLES, 'readonly');
      const store = tx.objectStore(STORE_ARTICLES);
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => {
          const data = request.result;
          console.log(`📂 Caricati ${data.length} articoli da IndexedDB`);
          resolve(data.length > 0 ? data : null);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (e) {
      console.error('❌ Errore caricamento:', e);
      return null;
    }
  },

  async saveConfig(config: SiteConfig): Promise<void> {
    const db = await openDB();
    const tx = db.transaction(STORE_CONFIG, 'readwrite');
    const store = tx.objectStore(STORE_CONFIG);
    store.put({ key: 'current', ...config });
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },

  async loadConfig(): Promise<SiteConfig | null> {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_CONFIG, 'readonly');
      const store = tx.objectStore(STORE_CONFIG);
      return new Promise((resolve) => {
        const request = store.get('current');
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => resolve(null);
      });
    } catch (e) {
      return null;
    }
  }
};

// ========================================
// FUNZIONI LIKE/SHARE/SAVE
// ========================================

// Genera ID utente unico
export function getUserId(): string {
  let userId = sessionStorage.getItem('userId');
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('userId', userId);
  }
  return userId;
}

// Like articolo
export async function likeArticle(articleId: string, userId: string): Promise<boolean> {
  if (!db) return false;
  try {
    const articleRef = doc(db, 'articles', articleId);
    const articleDoc = await getDoc(articleRef);
    
    if (!articleDoc.exists()) return false;
    
    const data = articleDoc.data();
    const stats = data.stats || { likes: 0, shares: 0, saves: 0 };
    const likedBy = data.likedBy || [];
    
    if (likedBy.includes(userId)) {
      // Unlike
      await updateDoc(articleRef, {
        'stats.likes': Math.max(0, stats.likes - 1),
        likedBy: arrayRemove(userId)
      });
      return false;
    } else {
      // Like
      await updateDoc(articleRef, {
        'stats.likes': stats.likes + 1,
        likedBy: arrayUnion(userId)
      });
      return true;
    }
  } catch (error) {
    console.error('Like error:', error);
    return false;
  }
}

// Share articolo
export async function shareArticle(articleId: string): Promise<void> {
  if (!db) return;
  try {
    const articleRef = doc(db, 'articles', articleId);
    const articleDoc = await getDoc(articleRef);
    
    if (articleDoc.exists()) {
      const stats = articleDoc.data().stats || { likes: 0, shares: 0, saves: 0 };
      await updateDoc(articleRef, {
        'stats.shares': stats.shares + 1
      });
    }
  } catch (error) {
    console.error('Share error:', error);
  }
}

// Save articolo
export async function saveArticle(articleId: string, userId: string): Promise<boolean> {
  if (!db) return false;
  try {
    const articleRef = doc(db, 'articles', articleId);
    const articleDoc = await getDoc(articleRef);
    
    if (!articleDoc.exists()) return false;
    
    const data = articleDoc.data();
    const stats = data.stats || { likes: 0, shares: 0, saves: 0 };
    const savedBy = data.savedBy || [];
    
    if (savedBy.includes(userId)) {
      // Unsave
      await updateDoc(articleRef, {
        'stats.saves': Math.max(0, stats.saves - 1),
        savedBy: arrayRemove(userId)
      });
      return false;
    } else {
      // Save
      await updateDoc(articleRef, {
        'stats.saves': stats.saves + 1,
        savedBy: arrayUnion(userId)
      });
      return true;
    }
  } catch (error) {
    console.error('Save error:', error);
    return false;
  }
}
