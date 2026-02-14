# 🌍 The Travel Guru - Deploy & API Guide

## 📋 CHANGELOG - Problemi Risolti

### ✅ Fix Applicati:
1. **Rimosso duplicato AdminPanel.tsx** dalla root (causava conflitti nel build)
2. **API convertita da TypeScript a JavaScript** (compatibilità Vercel serverless)
3. **vercel.json configurato** per gestire sia SPA che API routes
4. **CORS headers** aggiunti per chiamate API cross-origin
5. **Validazione robusta** input con messaggi errore chiari

---

## 🚀 DEPLOY SU VERCEL

### Step 1: Preparazione Variabili

**Genera API Secret Token:**
```bash
# Su Linux/Mac:
openssl rand -hex 32

# O usa: https://generate-secret.vercel.app/32
```

**Esempio output:** `8f4d7c2e9a1b5f6d8e2c4a7b9d1f3e5c7a9b1d3f5e7c9a1b3d5f7e9c1a3b5d7`

### Step 2: Deploy

**Opzione A - Deploy da GitHub:**
1. Carica questo codice su GitHub
2. Vai su [vercel.com](https://vercel.com)
3. New Project → Import dal tuo repo
4. Vercel rileva automaticamente Vite
5. Clicca "Deploy"

**Opzione B - Deploy da CLI:**
```bash
npm install -g vercel
cd path/to/travel-guru-fixed
vercel
```

### Step 3: Configura Environment Variables

**Su Vercel Dashboard:**
1. Vai su Settings → Environment Variables
2. Aggiungi TUTTE queste variabili:

```
Nome: VITE_FIREBASE_API_KEY
Valore: [tua chiave Firebase]

Nome: VITE_FIREBASE_PROJECT_ID  
Valore: [tuo project ID]

Nome: VITE_FIREBASE_APP_ID
Valore: [tuo app ID]

Nome: API_SECRET_TOKEN
Valore: [il token generato nello Step 1]
```

3. **IMPORTANTE:** Seleziona tutti gli environment (Production, Preview, Development)
4. Clicca "Save"

### Step 4: Redeploy

Dopo aver aggiunto le variabili:
1. Vai su Deployments
2. Clicca sui tre puntini dell'ultimo deploy
3. "Redeploy"

**✅ Deploy completato!**

---

## 🤖 USO API - Telegram Bot Integration

### Endpoint API

```
POST https://thetravelguru.vercel.app/api/posts
```

### Headers Richiesti

```http
Content-Type: application/json
Authorization: Bearer IL_TUO_API_SECRET_TOKEN
```

### Body JSON

```json
{
  "title": "Guida Completa a Santorini 2026",
  "location": "SANTORINI, GRECIA",
  "content": "# Guida a Santorini\n\n## Introduzione\n\nSantorini è...",
  "coverImage": "https://example.com/cover.jpg",
  "heroImage": "https://example.com/hero.jpg",
  "slug": "guida-santorini-2026"
}
```

**Campi:**
- `title` (obbligatorio): Titolo articolo
- `content` (obbligatorio): Contenuto in Markdown (min 100 caratteri)
- `location` (opzionale): Località (es: "ROMA, ITALIA")
- `coverImage` (opzionale): URL immagine copertina
- `heroImage` (opzionale): URL immagine hero (default: usa coverImage)
- `slug` (opzionale): Slug personalizzato (default: generato da title)

### Esempio cURL

```bash
curl -X POST https://thetravelguru.vercel.app/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 8f4d7c2e9a1b5f6d8e2c4a7b9d1f3e5c" \
  -d '{
    "title": "Venezia: Guida ai Luoghi Nascosti",
    "location": "VENEZIA, ITALIA",
    "content": "# Venezia\n\n## Luoghi Segreti\n\nOltre Piazza San Marco...",
    "coverImage": "https://images.unsplash.com/photo-venice.jpg"
  }'
```

### Risposte

**✅ Successo (201 Created):**
```json
{
  "success": true,
  "message": "Article created successfully",
  "article": {
    "id": "api-1234567890-abc",
    "slug": "venezia-guida-luoghi-nascosti",
    "title": "Venezia: Guida ai Luoghi Nascosti",
    "location": "VENEZIA, ITALIA",
    "url": "https://thetravelguru.vercel.app/venezia-guida-luoghi-nascosti",
    "createdAt": "2026-02-14T12:30:00.000Z"
  }
}
```

**❌ Errore 400 (Bad Request):**
```json
{
  "success": false,
  "error": "Missing mandatory fields: title and content are required"
}
```

**❌ Errore 401 (Unauthorized):**
```json
{
  "success": false,
  "error": "Unauthorized: Invalid Bearer token"
}
```

**❌ Errore 500 (Server Error):**
```json
{
  "success": false,
  "error": "Internal Server Error",
  "message": "Firebase connection failed"
}
```

---

## 🔧 CONFIGURAZIONE PIPEDREAM

### Nel workflow Step "Publish to Site":

**Method:** `POST`

**URL:** `https://thetravelguru.vercel.app/api/posts`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer IL_TUO_API_SECRET_TOKEN"
}
```

**Body (Expression mode):**
```javascript
{
  "title": steps.generate_metadata.title,
  "slug": steps.generate_metadata.slug,
  "location": steps.generate_metadata.location,
  "content": steps.generate_metadata.content,
  "coverImage": steps.generate_metadata.coverImage,
  "heroImage": steps.generate_metadata.heroImage
}
```

---

## 🧪 TEST API

### Test 1: Articolo Base

```bash
curl -X POST https://thetravelguru.vercel.app/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TUO_TOKEN" \
  -d '{
    "title": "Test Article",
    "content": "# Test\n\nQuesto è un test con più di 100 caratteri per superare la validazione minima richiesta dall articolo."
  }'
```

### Test 2: Articolo Completo

```bash
curl -X POST https://thetravelguru.vercel.app/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TUO_TOKEN" \
  -d '{
    "title": "Parigi: Top 10 Musei Imperdibili 2026",
    "location": "PARIGI, FRANCIA",
    "content": "# Parigi e i Suoi Musei\n\n## Introduzione\n\nParigi è la capitale mondiale dell arte...",
    "coverImage": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
    "slug": "parigi-musei-2026"
  }'
```

### Test 3: Verifica Slug Unico

Se invii 2 volte lo stesso titolo, il sistema genera automaticamente:
- Prima volta: `parigi-musei-2026`
- Seconda volta: `parigi-musei-2026-2`
- Terza volta: `parigi-musei-2026-3`

---

## ❓ TROUBLESHOOTING

### Problema: API risponde 404

**Causa:** Vercel non ha riconosciuto la serverless function

**Soluzione:**
```bash
# Verifica che esista: /api/posts.js (non .ts!)
# Redeploy completo:
vercel --prod
```

### Problema: 401 Unauthorized

**Causa:** Token Bearer errato o mancante

**Verifica:**
1. Token in environment variables su Vercel
2. Header Authorization nel formato: `Bearer TOKEN` (con spazio!)
3. Token corrisponde esattamente (case-sensitive)

### Problema: 500 Internal Error

**Causa:** Firebase non configurato o credenziali errate

**Verifica:**
1. Tutte le variabili VITE_FIREBASE_* su Vercel
2. Firebase project attivo
3. Firestore Database creato e regole configurate

**Test Firebase:**
```bash
# Vai su Firebase Console
# Firestore Database → Rules
# Assicurati che ci sia accesso in scrittura
```

### Problema: Articolo non appare sul sito

**Causa:** Database non sincronizzato o cache

**Soluzione:**
1. Vai su Firebase Console → Firestore
2. Verifica che l'articolo esista in collection `articles`
3. Hard refresh del sito (Ctrl+Shift+R)
4. Verifica campo `published: true`

---

## 📊 MONITORAGGIO

### Logs Vercel

1. Dashboard Vercel → tuo progetto
2. Functions → `/api/posts`
3. Vedi logs real-time delle chiamate
4. Errori mostrati con stack trace

### Firebase Logs

1. Firebase Console → Firestore
2. Filtra per data creazione
3. Verifica articoli creati da `source: "telegram-bot"`

---

## 🎯 PROSSIMI PASSI

Dopo il deploy funzionante:

1. ✅ Testa API con cURL
2. ✅ Configura Pipedream con URL e token
3. ✅ Testa bot Telegram end-to-end
4. ✅ Monitora i primi articoli pubblicati
5. ✅ Setup Google Search Console per SEO

---

## 💡 BEST PRACTICES

### Sicurezza Token:
- Non committare mai il token su GitHub
- Usa token casuali di almeno 32 caratteri
- Ruota il token ogni 3-6 mesi
- Un token diverso per dev/production

### Gestione Immagini:
- Usa URL HTTPS
- Preferisci Unsplash/Cloudinary
- Dimensioni: cover 800x600, hero 1600x900
- Formato WebP se possibile

### Content Markdown:
- Usa # solo per titolo principale
- ## per sezioni, ### per sottosezioni
- Minimo 2000 parole per articolo
- Include emoji nelle sezioni (##)

---

## 📞 SUPPORTO

Se hai problemi:
1. Controlla i logs Vercel
2. Verifica environment variables
3. Testa con cURL prima di Pipedream
4. Controlla Firebase Console

**API pronta!** 🚀
