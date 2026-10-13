/* =============================================================
   CONFIGURAZIONE DELLO STUDIO
   -------------------------------------------------------------
   Per personalizzare il sito per un altro studio basta modificare
   questo file. Un campo lasciato vuoto ('') nasconde il relativo
   elemento nella pagina.

   TUTTI I DATI QUI SOTTO SONO DI ESEMPIO E VOLUTAMENTE FINTI.

   Unica eccezione: i meta tag nel <head> di index.html (titolo,
   descrizione, anteprima WhatsApp/Open Graph) vanno aggiornati
   anche lì, perché WhatsApp e i social non eseguono JavaScript.
   ============================================================= */

window.STUDIO = {

  /* ---------- Studio ---------- */
  studio: {
    name: 'Studio Dentistico Esempio',
    address: 'Via Esempio 00',
    cap: '65100',
    city: 'Pescara',
    province: 'PE',
    phone: '085 000 0000',          // come viene mostrato
    phoneLink: '+390850000000',     // usato per il collegamento "Chiama"
    whatsapp: '393000000000',       // numero di esempio, internazionale senza spazi; vuoto = nascosto
    email: 'info@example.com'
  },

  /* ---------- Testi principali ---------- */
  hero: {
    lines: ['Cure dentali attente,', 'in un ambiente sereno.'],
    image: 'img/hero.jpg',
    imageMobile: 'img/hero-mobile.jpg',
    mirror: true                    // specchia la foto per lasciare spazio al testo a sinistra
  },
  approach: {
    title: 'Ogni sorriso merita tempo, ascolto e precisione.',
    text: 'Testo di esempio. Crediamo che una buona cura inizi da una conversazione: prima di proporre qualsiasi trattamento spieghiamo con calma cosa abbiamo visto, quali sono le possibilità e quali tempi richiede ciascuna. Lo studio è pensato per essere un luogo luminoso e tranquillo, dove sentirsi a proprio agio.'
  },

  /* ---------- Professionista ---------- */
  doctor: {
    title: 'Dott.ssa',
    name: 'Nome Cognome',
    role: 'Odontoiatra',
    gender: 'f',                    // 'f' oppure 'm' (per "Iscritta/Iscritto")
    photo: 'img/dottoressa.jpg',    // foto di esempio da Unsplash: sostituire con quella reale
    photoIsExample: true,           // mostra la dicitura "Foto di esempio"
    intro: [
      'Testo di presentazione di esempio. Qui il professionista racconta in poche righe il proprio percorso e il modo in cui imposta il rapporto con i pazienti.',
      'Un secondo paragrafo, anche questo di esempio, può descrivere gli ambiti a cui si dedica con maggiore attenzione e l\'importanza dell\'aggiornamento continuo.'
    ],
    degree: {
      title: 'Laurea in Odontoiatria e Protesi Dentaria',
      university: 'Università di Esempio',
      year: '20XX'
    },
    albo: {
      province: 'Pescara',
      number: '0000'
    },
    courses: [
      { year: '20XX', title: 'Corso di esempio in ortodonzia con allineatori', org: 'Ente formativo di esempio' },
      { year: '20XX', title: 'Corso di esempio in parodontologia', org: 'Ente formativo di esempio' },
      { year: '20XX', title: 'Corso di esempio in odontoiatria pediatrica', org: 'Ente formativo di esempio' }
    ]
  },

  /* ---------- Numeri dello studio (dati di esempio) ---------- */
  stats: [
    { value: 20, suffix: '+', label: 'anni di esperienza' },
    { value: 3500, suffix: '+', label: 'pazienti seguiti' },
    { value: 8, suffix: '', label: 'aree di cura' },
    { value: 3, suffix: '', label: 'sale operative' }
  ],

  /* ---------- Prenotazioni ----------
     bookingUrl: link a un sistema di prenotazione esterno (facoltativo).
     Se vuoto, "Prenota una visita" porta al modulo di richiesta. */
  bookingUrl: '',

  /* ---------- Orari (da lunedì a domenica; [] = chiuso) ---------- */
  hours: [
    { day: 'Lunedì',    slots: [['09:00', '13:00'], ['15:00', '19:00']] },
    { day: 'Martedì',   slots: [['09:00', '13:00'], ['15:00', '19:00']] },
    { day: 'Mercoledì', slots: [['09:00', '13:00'], ['15:00', '19:00']] },
    { day: 'Giovedì',   slots: [['09:00', '13:00'], ['15:00', '19:00']] },
    { day: 'Venerdì',   slots: [['09:00', '13:00']] },
    { day: 'Sabato',    slots: [] },
    { day: 'Domenica',  slots: [] }
  ],

  /* ---------- Trattamenti ----------
     active: true = mostrato, false = nascosto.
     text: descrizione breve (2-3 righe, circa 140 caratteri). */
  treatments: [
    {
      active: true,
      name: 'Igiene e prevenzione',
      image: 'img/tr-igiene.jpg',
      text: 'Pulizia professionale che rimuove placca e tartaro, con controlli periodici per individuare per tempo carie e problemi alle gengive.',
      benefits: ['Bocca più pulita e fresca', 'Controllo regolare di denti e gengive', 'Consigli personalizzati per l\'igiene di tutti i giorni']
    },
    {
      active: true,
      name: 'Conservativa ed endodonzia',
      image: 'img/tr-conservativa.jpg',
      text: 'Cura di carie e piccole fratture con otturazioni nel colore del dente; quando è coinvolta la polpa, devitalizzazione e sigillatura dei canali.',
      benefits: ['Si conserva il più possibile il dente naturale', 'Restauri in materiale del colore del dente', 'Si interviene prima che il problema si estenda']
    },
    {
      active: true,
      name: 'Ortodonzia e allineatori trasparenti',
      image: 'img/tr-ortodonzia.jpg',
      text: 'Correzione della posizione dei denti per bambini, ragazzi e adulti, con apparecchi tradizionali o allineatori trasparenti e rimovibili.',
      benefits: ['Percorsi per bambini, ragazzi e adulti', 'Allineatori trasparenti e rimovibili', 'Controlli programmati durante tutto il trattamento']
    },
    {
      active: true,
      name: 'Implantologia',
      image: 'img/tr-implantologia.jpg',
      text: 'Una piccola radice in titanio inserita nell\'osso sostiene un dente su misura. Ogni fase viene valutata e spiegata prima di iniziare.',
      benefits: ['Sostituisce il dente mancante in modo fisso', 'Non richiede di limare i denti vicini', 'Fasi e tempi chiari fin dall\'inizio']
    },
    {
      active: true,
      name: 'Protesi',
      image: 'img/tr-protesi.jpg',
      text: 'Corone, ponti e protesi rimovibili realizzate su misura con il laboratorio odontotecnico, per ricostruire o sostituire i denti mancanti.',
      benefits: ['Soluzioni fisse o rimovibili', 'Ritorno a una masticazione confortevole', 'Forma e colore studiati sul singolo paziente']
    },
    {
      active: true,
      name: 'Estetica e sbiancamento',
      image: 'img/sorriso.jpg',
      text: 'Sbiancamento professionale e trattamenti come le faccette per migliorare colore e forma dei denti, dopo una valutazione della loro salute.',
      benefits: ['Valutazione preliminare accurata', 'Trattamenti eseguiti con prodotti professionali', 'Obiettivi realistici, concordati insieme']
    },
    {
      active: true,
      name: 'Pedodonzia',
      image: 'img/tr-pedodonzia.jpg',
      text: 'Visite pensate per i più piccoli, con tempi e modi adatti all\'età, per prendere confidenza con lo studio e impostare la prevenzione.',
      benefits: ['Approccio graduale e sereno', 'Prevenzione fin dai primi denti', 'Indicazioni pratiche per i genitori']
    },
    {
      active: true,
      name: 'Parodontologia',
      image: 'img/tr-parodontologia.jpg',
      text: 'Diagnosi e cura delle gengive che sanguinano o si ritirano, con terapie di pulizia profonda e un programma di controlli nel tempo.',
      benefits: ['Diagnosi dello stato delle gengive', 'Terapie di pulizia profonda', 'Programma di controlli nel tempo']
    }
  ],

  /* ---------- Google ----------
     Voto e recensioni di esempio. rating vuoto = sezione nascosta. */
  google: {
    rating: '4,9',
    reviews: '120',
    reviewsUrl: ''                  // link alla scheda Google con le recensioni
  },
  // Recensioni mostrate nel sito: QUELLE QUI SOTTO SONO DI ESEMPIO
  reviewsAreExamples: true,
  reviews: [
    { author: 'Nome C.', text: 'Ambiente curato e personale molto gentile. Mi è stato spiegato tutto con calma prima di iniziare e ho apprezzato la puntualità.' },
    { author: 'Nome C.', text: 'Ho portato mia figlia per la prima visita: è stata accolta con pazienza e ora va dal dentista volentieri.' },
    { author: 'Nome C.', text: 'Studio luminoso e pulitissimo. Preventivo chiaro e dettagliato, senza sorprese.' }
  ],

  /* ---------- Mappa ----------
     Per ora puntano alla sola città: nessun indirizzo inventato. */
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Pescara',
  mapsEmbedQuery: 'Pescara',

  /* ---------- Come arrivare ---------- */
  parking: 'Testo di esempio: indicare qui dove parcheggiare nelle vicinanze dello studio.',
  accessibility: 'Testo di esempio: indicare se lo studio è al piano terra o servito da ascensore.',

  /* ---------- Domande frequenti ---------- */
  faq: [
    { q: 'È possibile pagare a rate?', a: 'Le modalità di pagamento disponibili, comprese eventuali soluzioni rateali, vengono illustrate in studio insieme al preventivo.' },
    { q: 'Lo studio ha convenzioni con assicurazioni o fondi sanitari?', a: 'Le convenzioni attive possono variare nel tempo: chiedi alla segreteria indicando il nome della tua assicurazione o del tuo fondo.' },
    { q: 'Dove posso parcheggiare?', a: 'Trovi le indicazioni nella sezione "Dove trovarci" in fondo alla pagina. Per qualsiasi dubbio puoi chiamare lo studio prima della visita.' },
    { q: 'Visitate anche i bambini?', a: 'Sì. Alla prima visita è utile la presenza di un genitore; la segreteria può indicarti come prepararla al meglio.' },
    { q: 'Cosa devo portare alla prima visita?', a: 'Un documento d\'identità, la tessera sanitaria ed eventuali radiografie o documenti di visite precedenti.' },
    { q: 'Come posso disdire o spostare un appuntamento?', a: 'Chiama la segreteria negli orari di apertura: avvisare con anticipo permette di offrire l\'orario ad altri pazienti.' }
  ],

  /* ---------- Dati legali (vuoto = nascosto) ---------- */
  legal: {
    company: 'Studio Dentistico Esempio',
    vat: '00000000000',
    medicalDirector: 'Dott.ssa Nome Cognome',
    privacyUrl: 'privacy.html',
    cookieUrl: 'cookie.html'
  },

  /* ---------- Nota a piè di pagina ---------- */
  credit: 'Bozza dimostrativa realizzata da Davide Carestia · nomi e dati di esempio'
};
