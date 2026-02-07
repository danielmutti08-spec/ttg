
# Deploy su Vercel - The Travel Guru

Questo progetto è ottimizzato per il deploy su Vercel con un sistema di persistenza locale robusto basato su IndexedDB.

## Istruzioni Veloci per il Deploy

1. **Registrazione**: Vai su [vercel.com](https://vercel.com) e registrati (piano gratuito Hobby).
2. **Importazione**: Clicca su **"Add New Project"**.
3. **Sorgente**: Connetti il tuo repository GitHub/GitLab oppure carica la cartella del progetto.
4. **Rilevamento**: Vercel rileverà automaticamente che si tratta di un progetto **Vite**.
5. **Deploy**: Clicca su **"Deploy"**.
6. **Fatto!**: Il tuo sito sarà online in meno di 2 minuti.

## Come funziona il salvataggio dei dati
- **IndexedDB**: Il sito utilizza un database locale nel browser chiamato `TravelGuruDB`.
- **Persistenza**: Tutti gli articoli creati o modificati nell'Admin Panel vengono salvati permanentemente sul dispositivo dell'utente.
- **Factory Reset**: Se il database è vuoto (primo avvio o pulizia browser), il sito carica automaticamente gli articoli "Hidden Gems of Amalfi" e "Le Cinque Terre".
- **Zero Backend**: Non è necessario un database esterno (SQL/NoSQL) o un server; tutto gira sul client, rendendo il sito velocissimo e facile da manutenere.

## Note Tecniche
- La configurazione `vercel.json` gestisce correttamente i refresh delle pagine interne (routing).
- Il sistema di Auto-Save garantisce che non andrà mai perso nulla durante la scrittura.
