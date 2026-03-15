
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  setDoc, 
  getDoc,
  doc, 
  deleteDoc, 
  query, 
  orderBy,
  serverTimestamp,
  Firestore
} from 'firebase/firestore';
import { Article } from './types';

// Helper to safely get environment variables from either import.meta.env or process.env
const getEnv = (key: string): string => {
  // Try Vite's import.meta.env
  try {
    const metaEnv = (import.meta as any).env;
    if (metaEnv && metaEnv[key]) return metaEnv[key];
  } catch (e) {}

  // Try process.env (common in some sandboxes)
  try {
    if (typeof process !== 'undefined' && process.env && (process.env as any)[key]) {
      return (process.env as any)[key] as string;
    }
  } catch (e) {}

  return '';
};

const apiKey = getEnv('VITE_FIREBASE_API_KEY');
const projectId = getEnv('VITE_FIREBASE_PROJECT_ID');
const appId = getEnv('VITE_FIREBASE_APP_ID');

let db: Firestore | null = null;
let isConfigured = false;

// Initialize Firebase only if we have the necessary configuration
if (apiKey && projectId && appId) {
  try {
    const firebaseConfig = {
      apiKey,
      authDomain: `${projectId}.firebaseapp.com`,
      projectId,
      storageBucket: `${projectId}.appspot.com`,
      messagingSenderId: "1234567890", 
      appId
    };

    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    isConfigured = true;
    console.log("🔥 Firebase/Firestore initialized successfully.");
  } catch (e) {
    console.error("❌ Failed to initialize Firebase Service:", e);
  }
} else {
  console.warn("⚠️ Firebase credentials missing. Application will operate in local fallback mode using IndexedDB.");
}

const COLLECTION_NAME = 'articles';

export const firebaseService = {
  /**
   * Check if firebase is ready and configured
   */
  isReady(): boolean {
    return isConfigured && db !== null;
  },

  /**
   * Loads all articles from Firestore, ordered by creation date descending.
   */
  async loadArticles(): Promise<Article[]> {
    if (!this.isReady() || !db) return [];
    
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const articles: Article[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        articles.push({
          ...data,
          id: doc.id,
        } as Article);
      });
      return articles;
    } catch (error) {
      console.error("Error loading articles from Firestore:", error);
      return []; // Return empty array on error to allow app to continue
    }
  },

  /**
   * Saves or updates an article in Firestore.
   */
  async saveArticle(article: Article): Promise<void> {
    if (!this.isReady() || !db) {
        console.warn("Cloud saving skipped: Firebase not configured.");
        return;
    }

    try {
      const docRef = doc(db, COLLECTION_NAME, article.id);
      const payload = {
        ...article,
        updatedAt: serverTimestamp(),
        // Initialize createdAt if it's a new article
        createdAt: article.createdAt || serverTimestamp(),
        published: article.published !== undefined ? article.published : true
      };
      await setDoc(docRef, payload);
    } catch (error) {
      console.error("Error saving article to Firestore:", error);
      throw error;
    }
  },

  /**
   * Verifies admin login credentials against Firestore.
   */
  async verifyAdminLogin(username: string, password: string): Promise<boolean> {
    if (!this.isReady() || !db) {
      // Fallback for local development if Firebase is not configured
      console.warn("Firebase not configured. Using fallback login.");
      return username === 'admin' && password === 'admin';
    }

    try {
      const settingsRef = doc(db, 'settings', 'admin');
      const settingsDoc = await getDoc(settingsRef);
      
      if (!settingsDoc.exists()) {
        console.error('Admin settings not found in Firestore');
        return false;
      }
      
      const data = settingsDoc.data();
      return data.username === username && data.password === password;
    } catch (error) {
      console.error('Login verification error:', error);
      return false;
    }
  },

  /**
   * Sets the admin password in Firestore. Use this once to initialize.
   */
  async setAdminPassword(password: string): Promise<void> {
    if (!this.isReady() || !db) return;

    try {
      const settingsRef = doc(db, 'settings', 'admin');
      await setDoc(settingsRef, {
        username: 'admin',
        password: password,
        createdAt: serverTimestamp()
      });
      console.log('✅ Admin password set successfully in Firestore.');
    } catch (error) {
      console.error('Error setting admin password:', error);
      throw error;
    }
  },

  /**
   * Deletes an article from Firestore.
   */
  async deleteArticle(id: string): Promise<void> {
    if (!this.isReady() || !db) return;

    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error("Error deleting article from Firestore:", error);
      throw error;
    }
  },

  /**
   * Populates the database with initial seed data.
   */
  async seedDatabase(initialArticles: Article[]): Promise<void> {
    if (!this.isReady()) {
        throw new Error("Cannot seed database: Firebase not configured.");
    }
    
    console.log("🌱 Starting Cloud Database Seeding...");
    for (const art of initialArticles) {
      await this.saveArticle(art);
    }
    console.log("✅ Seeding completed successfully.");
  }
};
