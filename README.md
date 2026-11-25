# VeltrionHub — Piattaforma SaaS & Editorial CRM

## Il Problema di Business risolto

Nelle aziende, nelle agenzie digitali e nei team editoriali moderni, la gestione dei contenuti, il monitoraggio delle metriche e il coordinamento operativo sono spesso sparsi su tre o quattro strumenti diversi, lenti e costosi. Questo crea rallentamenti nelle revisioni, poca visibilità sulle scadenze e difficoltà nell'estrarre report rapidi.

**VeltrionHub** centralizza tutto in un unico **cruscotto aziendale veloce e pulito**:
- **Gestione del catalogo contenuti (CMS):** flussi di stato (*Pubblicato*, *In Revisione*, *Bozza*, *Archiviato*), stima automatica dei tempi di lettura, anteprima live e moderazione dei commenti.
- **Coordinamento operativo Kanban:** gestione dei task per priorità e scadenze per tenere allineato il team senza uscire dalla piattaforma.
- **Analytics & Reporting immediato:** grafici interattivi multi-metrica e motore di esportazione nativo che genera fogli **CSV pronti in colonne per Microsoft Excel** e backup completi in **JSON**.

---

## Architettura e Tech Stack

L'applicazione è progettata per offrire tempi di risposta immediati e piena usabilità su desktop, tablet e smartphone:

- **Frontend & UI/UX:** **Next.js (App Router)**, **React**, **TypeScript**, **Tailwind CSS** e componenti accessibili **shadcn/ui (Radix UI)**, con menu mobile dedicato, ricerca rapida da tastiera (`Ctrl + K`), tema **Chiaro / Scuro**, grafici interattivi (**Recharts**) e form validati in tempo reale (**React Hook Form & Zod**).
- **Logica Applicativa & Export Dati:** stato centralizzato e disaccoppiato dall'interfaccia (pronto per collegare API REST o Server Actions senza riscrivere la UI) e motore di esportazione CSV configurato per aprirsi correttamente in colonne sulle impostazioni europee di Microsoft Excel e Google Sheets.
- **Persistenza & Database:** nella versione dimostrativa i dati vengono salvati istantaneamente nel browser (`localStorage`) con backup e ripristino via file `.json`; la struttura dati è già modellata per il collegamento diretto a **PostgreSQL** (via Prisma) o **Supabase** in produzione.
- **Integrazioni Predisposte:** schermate di Login/Registrazione validate e pronte per essere collegate a **NextAuth.js (Auth.js)**, **Clerk** o **Supabase Auth**.

---

## Nota di Trasparenza B2B & Personalizzazione

Questo repository presenta una **versione dimostrativa autonoma (Standalone MVP)** progettata per essere provata subito online o in locale **senza richiedere chiavi API a pagamento o configurazioni di database complessi**.

- **Cosa è già attivo e funzionante al 100% in questa demo:**
  - Intera interfaccia grafica responsive (Desktop, Tablet, Mobile) con tema Chiaro/Scuro.
  - Operazioni **CRUD complete** su Articoli, Commenti, Categorie e Task Kanban con salvataggio persistente nel browser.
  - Ricerca globale istantanea (`Ctrl + K`), filtri multipli combinati, ordinamento e paginazione dinamica.
  - Esportazione reale di report **CSV formattati per Excel** (Articoli, Task, Analytics) e sistema di **Backup/Ripristino JSON**.
- **Cosa viene integrato nella consegna in produzione (White-Label / B2B):**
  - Collegamento a database cloud dedicato (**PostgreSQL / Supabase**) per la collaborazione multi-utente in tempo reale.
  - Attivazione dei permessi per ruolo (**Amministratore, Caporedattore, Autore, Revisore**) tramite autenticazione dedicata.
  - Collegamento a storage cloud (**AWS S3 / Cloudflare R2**) per file multimediali, personalizzazione completa sul brand del cliente ed eventuali integrazioni con CRM/ERP esistenti.

---

## Avvio Rapido in Locale

```bash
# 1. Installa le dipendenze
npm install

# 2. Avvia l'ambiente di sviluppo
npm run dev

# 3. Apri nel browser
# Visita http://localhost:3000
```

Per compilare e verificare la build di produzione:

```bash
npm run build
npm run start
```

© 2026 Filippo De Biase — Tutti i diritti riservati. Codice pubblicato esclusivamente a scopo dimostrativo e di portfolio.