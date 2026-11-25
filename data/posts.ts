import { Post, CategoryItem, EditorialTask, UserProfile } from '@/types/posts';

export const defaultCategories: CategoryItem[] = [
  {
    id: 'cat-1',
    name: 'Intelligenza Artificiale',
    slug: 'intelligenza-artificiale',
    description: 'Modelli generativi, Machine Learning, LLM e automazione intelligente.',
    color: '#6366f1', // Indigo
  },
  {
    id: 'cat-2',
    name: 'Sviluppo Web & Cloud',
    slug: 'sviluppo-web-cloud',
    description: 'Architetture moderne, Next.js, TypeScript, microservizi e DevOps.',
    color: '#0ea5e9', // Sky
  },
  {
    id: 'cat-3',
    name: 'Cybersecurity',
    slug: 'cybersecurity',
    description: 'Sicurezza informatica, Zero Trust, crittografia e protezione dati.',
    color: '#10b981', // Emerald
  },
  {
    id: 'cat-4',
    name: 'Product & UX Design',
    slug: 'product-ux-design',
    description: 'Design system, accessibilità, interfacce utente e ricerca prodotto.',
    color: '#f59e0b', // Amber
  },
  {
    id: 'cat-5',
    name: 'Tech Business',
    slug: 'tech-business',
    description: 'Strategie digitali, startup, crescita SaaS e innovazione aziendale.',
    color: '#ec4899', // Pink
  },
];

export const defaultTasks: EditorialTask[] = [
  {
    id: 'task-1',
    title: 'Revisione guida pratica su Next.js 15 e React Server Actions',
    description: 'Controllare gli snippet di codice e aggiungere i benchmark di performance prima della pubblicazione.',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2025-05-22',
    assignee: 'Marco Rossi',
    category: 'Sviluppo Web & Cloud',
  },
  {
    id: 'task-2',
    title: 'Preparare infografica sul report AI Q2',
    description: 'Creare i grafici comparativi per il post sui modelli multimodali open-source.',
    status: 'todo',
    priority: 'high',
    dueDate: '2025-05-24',
    assignee: 'Elena Conti',
    category: 'Intelligenza Artificiale',
  },
  {
    id: 'task-3',
    title: 'Ottimizzazione SEO articoli Cybersecurity',
    description: 'Aggiornare meta description, tag e link interni dei 4 articoli più letti.',
    status: 'todo',
    priority: 'medium',
    dueDate: '2025-05-26',
    assignee: 'Davide Galli',
    category: 'Cybersecurity',
  },
  {
    id: 'task-4',
    title: 'Intervista al team Design System',
    description: 'Raccogliere le domande sull’adozione di Tailwind e Radix UI in produzione.',
    status: 'in_progress',
    priority: 'medium',
    dueDate: '2025-05-25',
    assignee: 'Sofia Moretti',
    category: 'Product & UX Design',
  },
  {
    id: 'task-5',
    title: 'Newsletter mensile Tech & Innovazione',
    description: 'Selezionare i 5 migliori articoli del mese e programmare l’invio agli iscritti.',
    status: 'done',
    priority: 'low',
    dueDate: '2025-05-18',
    assignee: 'Marco Rossi',
    category: 'Tech Business',
  },
];

export const defaultUserProfile: UserProfile = {
  name: 'Marco Rossi',
  email: 'marco.rossi@veltrionhub.it',
  role: 'Caporedattore & Admin',
  bio: 'Responsabile editoriale e architetto frontend. Appassionato di interfacce moderne, intelligenza artificiale e prodotti digitali ad alto impatto.',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  company: 'VeltrionHub Studio',
};

const posts: Post[] = [
  {
    id: '1',
    title: "L'Ascesa degli Agenti AI Autonomi nel 2025",
    excerpt: 'Come gli agenti intelligenti stanno trasformando i flussi di lavoro nello sviluppo software e nelle operazioni aziendali.',
    body: `L'Intelligenza Artificiale ha superato la fase dei semplici chatbot conversazionali per entrare nell'era degli agenti autonomi capaci di pianificare, utilizzare strumenti esterni e completare attività complesse end-to-end.

Nelle moderne piattaforme enterprise, gli agenti collaborano con i team umani per automatizzare l'analisi dei dati, il controllo qualità del codice e il supporto clienti proattivo.

### Punti chiave per l'adozione
1. **Affidabilità e Guardrail**: definire perimetri operativi chiari e validazioni strutturate.
2. **Integrazione via API e MCP**: connettere i modelli ai database e agli strumenti interni in modo sicuro.
3. **Human-in-the-loop**: mantenere la supervisione umana sulle decisioni critiche di business.`,
    author: 'Marco Rossi',
    date: '2025-05-18',
    status: 'published',
    category: 'Intelligenza Artificiale',
    views: 4820,
    featured: true,
    tags: ['AI Agents', 'LLM', 'Automazione', 'Produttività'],
    comments: [
      { id: 'c1', text: 'Articolo chiarissimo! La parte sui guardrail è fondamentale.', username: 'Giulia_B', date: '2025-05-18' },
      { id: 'c2', text: 'Stiamo testando proprio questo approccio nel nostro team di sviluppo.', username: 'AlexDev', date: '2025-05-19' },
    ],
  },
  {
    id: '2',
    title: 'Architetture Next.js Moderne: Server Components e Caching',
    excerpt: 'Guida pratica per massimizzare le prestazioni delle applicazioni React full-stack evitando gli errori più comuni.',
    body: `Con l'introduzione dell'App Router e dei React Server Components, il modo in cui progettiamo applicazioni web è cambiato radicalmente. Spostare il rendering e il recupero dati sul server riduce drasticamente il bundle JavaScript inviato al browser.

Tuttavia, bilanciare componenti Server e Client richiede una strategia precisa: usa i Server Components per il data fetching e mantieni i Client Components leggeri e focalizzati sull'interattività.`,
    author: 'Elena Conti',
    date: '2025-05-16',
    status: 'published',
    category: 'Sviluppo Web & Cloud',
    views: 3650,
    featured: true,
    tags: ['Next.js', 'React', 'TypeScript', 'Performance'],
    comments: [
      { id: 'c3', text: 'Finalmente una spiegazione chiara sulla differenza tra Server e Client component!', username: 'MatteoCode', date: '2025-05-17' },
    ],
  },
  {
    id: '3',
    title: 'Zero Trust Security: Proteggere le Infrastrutture Cloud',
    excerpt: 'Perché il vecchio modello di sicurezza perimetrale non basta più e come implementare il principio "Never Trust, Always Verify".',
    body: `Nel lavoro ibrido e nelle architetture multi-cloud, il perimetro aziendale tradizionale non esiste più. L'approccio Zero Trust richiede l'autenticazione continua, l'autorizzazione granulare e la crittografia end-to-end per ogni singola richiesta.

Implementare token a breve scadenza, autenticazione multifattore resistente al phishing (Passkeys/FIDO2) e micro-segmentazione della rete riduce drasticamente la superficie di attacco.`,
    author: 'Davide Galli',
    date: '2025-05-14',
    status: 'published',
    category: 'Cybersecurity',
    views: 2910,
    featured: false,
    tags: ['Zero Trust', 'Cloud Security', 'Passkeys'],
    comments: [
      { id: 'c4', text: 'Le Passkeys hanno ridotto del 90% i ticket di reset password nella nostra azienda.', username: 'SaraSec', date: '2025-05-15' },
      { id: 'c5', text: 'Ottima panoramica tecnica.', username: 'LucaNet', date: '2025-05-15' },
    ],
  },
  {
    id: '4',
    title: 'Costruire un Design System Accessibile con Tailwind e Radix UI',
    excerpt: 'Come unire la velocità delle utility classes all’accessibilità WAI-ARIA nativa dei componenti headless.',
    body: `Un buon Design System non è solo una questione estetica: deve garantire coerenza visiva, velocità di sviluppo e piena accessibilità da tastiera e screen reader.

Combinare componenti headless come Radix UI (alla base di shadcn/ui) con token semantici in Tailwind CSS permette di supportare il tema chiaro/scuro senza sforzo e di mantenere il pieno controllo sul codice sorgente.`,
    author: 'Sofia Moretti',
    date: '2025-05-12',
    status: 'published',
    category: 'Product & UX Design',
    views: 3180,
    featured: false,
    tags: ['Design System', 'Tailwind', 'UI/UX', 'Accessibilità'],
    comments: [
      { id: 'c6', text: 'Shadcn/ui ha cambiato completamente il nostro flusso di lavoro.', username: 'FedeDesign', date: '2025-05-13' },
    ],
  },
  {
    id: '5',
    title: 'Metriche SaaS Essenziali: Dal Churn Rate al Net Revenue Retention',
    excerpt: 'Quali indicatori monitorare nella propria dashboard per guidare la crescita sostenibile di un prodotto digitale.',
    body: `Lanciare un prodotto digitale è solo l'inizio: comprendere la salute del business richiede il monitoraggio costante delle metriche giuste. Oltre al classico MRR (Monthly Recurring Revenue), il vero indicatore di valore a lungo termine è il Net Revenue Retention (NRR).

Un'interfaccia di analytics chiara aiuta tutto il team a individuare rapidamente i colli di bottiglia nell'onboarding e a migliorare la fidelizzazione degli utenti.`,
    author: 'Marco Rossi',
    date: '2025-05-10',
    status: 'published',
    category: 'Tech Business',
    views: 2140,
    featured: false,
    tags: ['SaaS', 'Analytics', 'Startup', 'KPI'],
    comments: [],
  },
  {
    id: '6',
    title: 'Ottimizzazione Database PostgreSQL per Applicazioni ad Alto Traffico',
    excerpt: 'Indici parziali, connection pooling e analisi dei piani di esecuzione per query ultra-veloci.',
    body: `Quando i volumi di dati crescono, anche una singola query non indicizzata può rallentare l'intera applicazione. Utilizzare EXPLAIN ANALYZE permette di individuare subito le scansioni sequenziali costose e sostituirle con indici B-Tree o GIN mirati.`,
    author: 'Elena Conti',
    date: '2025-05-08',
    status: 'review',
    category: 'Sviluppo Web & Cloud',
    views: 1420,
    featured: false,
    tags: ['PostgreSQL', 'Database', 'Backend'],
    comments: [
      { id: 'c7', text: 'Aspetto la pubblicazione definitiva, tema super utile!', username: 'PaoloDB', date: '2025-05-09' },
    ],
  },
  {
    id: '7',
    title: 'Modelli AI Locali e Edge Computing con WebGPU',
    excerpt: 'Eseguire modelli linguistici e di visione direttamente nel browser per massimizzare la privacy e azzerare la latenza.',
    body: `Grazie a WebGPU e alla quantizzazione avanzata dei pesi, oggi è possibile eseguire modelli di intelligenza artificiale direttamente sul dispositivo dell'utente, senza inviare dati sensibili a server esterni e abbattendo i costi di infrastruttura.`,
    author: 'Marco Rossi',
    date: '2025-05-05',
    status: 'draft',
    category: 'Intelligenza Artificiale',
    views: 890,
    featured: false,
    tags: ['WebGPU', 'Edge AI', 'Privacy'],
    comments: [],
  },
  {
    id: '8',
    title: 'Guida Completa a TypeScript 5.x per Team Enterprise',
    excerpt: 'Pattern avanzati di tipizzazione, inferenza rigorosa e validazione runtime con Zod.',
    body: `TypeScript riduce drasticamente i bug in produzione, ma solo quando viene accompagnato da una validazione rigorosa ai confini dell'applicazione (form, API, localStorage). Integrare Zod con React Hook Form garantisce sicurezza end-to-end dai dati grezzi all'interfaccia utente.`,
    author: 'Elena Conti',
    date: '2025-05-02',
    status: 'published',
    category: 'Sviluppo Web & Cloud',
    views: 2790,
    featured: false,
    tags: ['TypeScript', 'Zod', 'Clean Code'],
    comments: [
      { id: 'c8', text: 'Zod + React Hook Form è la combo perfetta.', username: 'ClaraTS', date: '2025-05-03' },
    ],
  },
  {
    id: '9',
    title: 'Micro-interazioni e Psicologia delle Interfacce Moderne',
    excerpt: 'Perché i feedback visivi immediati e le transizioni fluide aumentano la fiducia e la soddisfazione degli utenti.',
    body: `La differenza tra un software frustrante e uno piacevole da usare risiede spesso nei dettagli: stati di caricamento chiari, conferme immediate (toast), scorciatoie da tastiera come Ctrl+K e gerarchie tipografiche pulite riducono il carico cognitivo dell'utente.`,
    author: 'Sofia Moretti',
    date: '2025-04-28',
    status: 'published',
    category: 'Product & UX Design',
    views: 1980,
    featured: false,
    tags: ['UX', 'Micro-interazioni', 'UI Design'],
    comments: [],
  },
  {
    id: '10',
    title: 'Audit di Sicurezza Automatizzati nelle Pipeline CI/CD',
    excerpt: 'Integrare controlli SAST, scansione delle dipendenze e gestione dei segreti ad ogni pull request.',
    body: `Spostare la sicurezza "a sinistra" (Shift-Left Security) significa intercettare le vulnerabilità mentre il codice viene scritto, prima ancora che arrivi in staging. Automatizzare i controlli nelle GitHub Actions protegge il team senza rallentare i rilasci.`,
    author: 'Davide Galli',
    date: '2025-04-24',
    status: 'review',
    category: 'Cybersecurity',
    views: 1650,
    featured: false,
    tags: ['DevSecOps', 'CI/CD', 'Security'],
    comments: [],
  },
];

export default posts;
