import { initializeApp } from 'firebase/app';
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
 * Genera uno slug URL-friendly (identica logica del frontend)
 */
const slugify = (text: string) => {
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

// Configurazione Firebase (Backend side)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: `${process.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req: any, res: any) {
  // 1. Solo richieste POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  // 2. Autenticazione Bearer
  const authHeader = req.headers.authorization;
  const secretToken = process.env.API_SECRET_TOKEN || 'your-default-secure-token-32-chars';
  
  if (!authHeader || authHeader !== `Bearer ${secretToken}`) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Missing or invalid Bearer token' });
  }

  try {
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
      return res.status(400).json({ success: false, error: 'Missing mandatory fields: title and content are required.' });
    }

    // 4. Gestione Slug Intelligence (Generazione + Unicità)
    let baseSlug = customSlug ? slugify(customSlug) : slugify(title);
    let finalSlug = baseSlug;
    let counter = 1;
    let isUnique = false;

    // Loop per trovare uno slug unico aggiungendo -2, -3... se necessario
    while (!isUnique) {
      const q = query(
        collection(db, 'articles'), 
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

    // 5. Creazione dati articolo
    const articleId = `api-${Date.now()}`;
    const articleData = {
      id: articleId,
      slug: finalSlug,
      title,
      location: location || 'DISCOVERED, WORLD',
      content,
      category: 'Europe', // Default
      imageUrl: coverImage || '',
      cardImageUrl: coverImage || '',
      heroImageUrl: heroImage || coverImage || '',
      published: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      intel: {
        bestTime: 'Consult Local Guru',
        budget: 'Flexible',
        mustTry: 'Hidden Secrets'
      }
    };

    // 6. Salvataggio su Firestore
    await setDoc(doc(db, 'articles', articleId), articleData);

    // 7. Risposta con i dettagli dell'articolo creato
    return res.status(201).json({
      success: true,
      slug: finalSlug,
      id: articleId,
      url: `https://thetravelguru.vercel.app/${finalSlug}`
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal Server Error while saving post.' 
    });
  }
}