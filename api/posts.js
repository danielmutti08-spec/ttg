// Vercel Serverless Function per creazione articoli
// Endpoint: POST /api/posts

import { initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  query, 
  where,
  serverTimestamp,
  limit
} from 'firebase/firestore';

/**
 * Genera slug URL-friendly (identica logica del frontend)
 */
const slugify = (text) => {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

// Inizializza Firebase (singleton pattern)
let db;
function getDB() {
  if (!db) {
    const firebaseConfig = {
      apiKey: process.env.VITE_FIREBASE_API_KEY,
      authDomain: `${process.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: `${process.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
      appId: process.env.VITE_FIREBASE_APP_ID
    };

    // Inizializza solo se non già fatto
    if (getApps().length === 0) {
      initializeApp(firebaseConfig);
    }
    
    db = getFirestore();
  }
  return db;
}

/**
 * Handler principale della serverless function
 */
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type');

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. Solo richieste POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method Not Allowed. Use POST.' 
    });
  }

  try {
    // 2. Autenticazione Bearer
    const authHeader = req.headers.authorization;
    const secretToken = process.env.API_SECRET_TOKEN || 'your-default-secure-token-change-me';
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized: Missing Authorization header. Use: Bearer YOUR_TOKEN' 
      });
    }

    const token = authHeader.replace('Bearer ', '');
    if (token !== secretToken) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized: Invalid Bearer token' 
      });
    }

    const { 
      title, 
      location, 
      content, 
      coverImage, 
      heroImage, 
      slug: customSlug 
    } = req.body;

    // 3. Validazione campi obbligatori
    if (!title || !content) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing mandatory fields: title and content are required' 
      });
    }

    // Validazione lunghezza
    if (title.length < 3) {
      return res.status(400).json({ 
        success: false, 
        error: 'Title must be at least 3 characters long' 
      });
    }

    if (content.length < 100) {
      return res.status(400).json({ 
        success: false, 
        error: 'Content must be at least 100 characters long' 
      });
    }

    // 4. Gestione Slug Intelligence (Generazione + Unicità)
    const firestore = getDB();
    let baseSlug = customSlug ? slugify(customSlug) : slugify(title);
    let finalSlug = baseSlug;
    let counter = 1;
    let isUnique = false;

    // Loop per trovare uno slug unico aggiungendo -2, -3... se necessario
    while (!isUnique && counter < 100) { // Max 100 tentativi
      const q = query(
        collection(firestore, 'articles'), 
        where('slug', '==', finalSlug),
        limit(1)
      );
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        isUnique = true;
      } else {
        counter++;
        finalSlug = `${baseSlug}-${counter}`;
      }
    }

    if (!isUnique) {
      return res.status(500).json({ 
        success: false, 
        error: 'Could not generate unique slug after 100 attempts' 
      });
    }

    // 5. Creazione dati articolo
    const articleId = `api-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    const articleData = {
      id: articleId,
      slug: finalSlug,
      title: title.trim(),
      location: location ? location.trim() : 'WORLD WANDERER',
      content,
      category: 'Travel', // Default category
      imageUrl: coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
      cardImageUrl: coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
      heroImageUrl: heroImage || coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600',
      published: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdAtISO: now, // Per sorting client-side
      source: 'telegram-bot',
      intel: {
        bestTime: 'Year-round',
        budget: 'Flexible',
        mustTry: 'Local Experiences'
      }
    };

    // 6. Salvataggio su Firestore
    await setDoc(doc(firestore, 'articles', articleId), articleData);

    // 7. Risposta con i dettagli dell'articolo creato
    return res.status(201).json({
      success: true,
      message: 'Article created successfully',
      article: {
        id: articleId,
        slug: finalSlug,
        title: articleData.title,
        location: articleData.location,
        url: `https://thetravelguru.vercel.app/${finalSlug}`,
        createdAt: now
      }
    });

  } catch (error) {
    console.error('❌ API Error:', error);
    
    // Log più dettagliato per debugging
    return res.status(500).json({ 
      success: false, 
      error: 'Internal Server Error',
      message: error.message || 'Unknown error occurred',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
