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
    whatsapp: '',                   // numero internazionale senza spazi, es. '393330000000'; vuoto = nascosto
    email: 'info@example.com'
  },

  /* ---------- Professionista ---------- */
  doctor: {
    title: 'Dott.ssa',
    name: 'Nome Cognome',
    role: 'Odontoiatra',
    gender: 'f',                    // 'f' oppure 'm' (per "Iscritta/Iscritto")
    photo: '',                      // es. 'img/dottore.jpg' — vuoto = riquadro segnaposto
    intro: [
      'Testo di presentazione di esempio. Qui il professionista può raccontare in poche righe come imposta il rapporto con i pazienti e il lavoro in studio.',
      'Un secondo paragrafo facoltativo, anche questo di esempio, da sostituire con un testo scritto insieme al professionista.'
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
    // Corsi e specializzazioni: una riga ciascuno
    courses: [
      { year: '20XX', title: 'Corso di esempio in ortodonzia', org: 'Ente formativo di esempio' },
      { year: '20XX', title: 'Corso di esempio in parodontologia', org: 'Ente formativo di esempio' },
      { year: '20XX', title: 'Corso di esempio in odontoiatria pediatrica', org: 'Ente formativo di esempio' }
    ]
  },

  /* ---------- Prenotazioni ----------
     bookingUrl: link a un sistema di prenotazione ufficiale (facoltativo).
     Se vuoto, "Prenota una visita" porta al modulo di richiesta. */
  bookingUrl: '',

  /* ---------- Orari ----------
     Giorni da lunedì a domenica. Ogni fascia: ['HH:MM', 'HH:MM'].
     Lista vuota = chiuso. Orari di esempio. */
  hours: [
    { day: 'Lunedì',    slots: [['09:00', '13:00'], ['15:00', '19:00']] },
    { day: 'Martedì',   slots: [['09:00', '13:00'], ['15:00', '19:00']] },
    { day: 'Mercoledì', slots: [['09:00', '13:00'], ['15:00', '19:00']] },
    { day: 'Giovedì',   slots: [['09:00', '13:00'], ['15:00', '19:00']] },
    { day: 'Venerdì',   slots: [['09:00', '13:00']] },
    { day: 'Sabato',    slots: [] },
    { day: 'Domenica',  slots: [] }
  ],

  /* ---------- Trattamenti attivi ----------
     true = mostrato, false = nascosto. */
  treatments: {
    igiene: true,
    conservativa: true,
    ortodonzia: true,
    implantologia: true,
    protesi: true,
    estetica: true,
    pedodonzia: true,
    parodontologia: true
  },

  /* ---------- Google ----------
     Voto e recensioni di esempio. rating vuoto = badge nascosto. */
  google: {
    rating: '4,9',
    reviews: '00',
    reviewsUrl: ''                  // link alla scheda Google con le recensioni
  },

  /* ---------- Mappa ----------
     mapsUrl: link "Apri in Google Maps".
     mapsEmbedQuery: indirizzo o nome per la mappa incorporata.
     Per ora puntano alla sola città: nessun indirizzo inventato. */
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Pescara',
  mapsEmbedQuery: 'Pescara',

  /* ---------- Come arrivare ---------- */
  parking: 'Testo di esempio: indicare qui dove parcheggiare nelle vicinanze dello studio (parcheggi pubblici, strisce blu, eventuali posti riservati).',
  accessibility: 'Testo di esempio: indicare qui se lo studio è al piano terra o servito da ascensore e se è accessibile in sedia a rotelle.',

  /* ---------- Domande frequenti ----------
     Risposte generiche e prudenti: adattarle allo studio. */
  faq: [
    {
      q: 'È possibile pagare a rate?',
      a: 'Le modalità di pagamento disponibili, comprese eventuali soluzioni rateali, vengono illustrate in studio insieme al preventivo. Per informazioni puoi contattare la segreteria.'
    },
    {
      q: 'Lo studio ha convenzioni con assicurazioni o fondi sanitari?',
      a: 'Le eventuali convenzioni attive possono variare nel tempo. Ti consigliamo di chiedere direttamente alla segreteria indicando il nome della tua assicurazione o del tuo fondo.'
    },
    {
      q: 'Dove posso parcheggiare?',
      a: 'Trovi le indicazioni sul parcheggio nella sezione "Contatti e orari". Per qualsiasi dubbio puoi chiamare lo studio prima della visita.'
    },
    {
      q: 'Visitate anche i bambini?',
      a: 'Sì, è possibile prenotare una visita anche per i più piccoli. Alla prima visita è utile la presenza di un genitore; la segreteria può indicarti come prepararla.'
    },
    {
      q: 'Cosa devo portare alla prima visita?',
      a: 'Un documento d\'identità, la tessera sanitaria ed eventuali radiografie o documenti di visite precedenti, se li hai. Se assumi farmaci, ne parlerai direttamente con il professionista durante la visita.'
    },
    {
      q: 'Come posso disdire o spostare un appuntamento?',
      a: 'Puoi chiamare la segreteria negli orari di apertura. Avvisare con un po\' di anticipo permette di offrire l\'orario ad altri pazienti.'
    }
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
