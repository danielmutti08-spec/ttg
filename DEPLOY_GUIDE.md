
# Deploy The Travel Guru (Gratis con Vercel + Firebase)

## Step 1: Setup Firebase (5 minuti)

1. Vai su [Firebase Console](https://console.firebase.google.com).
2. Crea un nuovo progetto (es: "Travel Guru Cloud").
3. Disabilita Google Analytics.
4. Vai su **Firestore Database** nel menu laterale e clicca "Crea database".
5. Scegli **Produzione**, imposta la regione vicina a te (es: europe-west1).
6. Nelle **Regole** (Tab Rules), incolla:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /articles/{article} {
         allow read, write: if true;
       }
     }
   }
   ```
7. Vai in **Impostazioni Progetto** (icona ingranaggio) e aggiungi una nuova app Web (</>).
8. Copia `apiKey`, `projectId`, e `appId`.

## Step 2: Deploy su Vercel (3 minuti)

1. Vai su [vercel.com](https://vercel.com) e importa il tuo progetto.
2. Nelle **Environment Variables**, aggiungi:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_APP_ID`
3. Clicca **Deploy**.

## Step 3: Inizializza il Cloud

1. Una volta online, accedi alla vista `/admin` del tuo sito.
2. Clicca sul pulsante **"Inizializza Cloud"** nella sidebar per popolare Firestore con i dati iniziali.

🎉 Il tuo sito è ora sincronizzato su Cloud in tempo reale!
