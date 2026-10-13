/* =============================================================
   Studio dentistico — logica della pagina
   Tutti i dati arrivano da config.js (window.STUDIO).
   ============================================================= */
(function () {
  'use strict';

  const S = window.STUDIO;
  if (!S) {
    console.warn('config.js non trovato: impossibile mostrare i dati dello studio.');
    return;
  }

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const get = (path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), S);
  const filled = (v) => v !== undefined && v !== null && String(v).trim() !== '';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Contenuti di base ---------- */
  function bindText() {
    $$('[data-text]').forEach((el) => {
      const v = get(el.dataset.text);
      el.textContent = filled(v) ? v : '';
    });
    $$('[data-if]').forEach((el) => {
      if (!filled(get(el.dataset.if))) el.hidden = true;
    });

    const d = S.doctor || {};
    const full = [d.title, d.name].filter(filled).join(' ');
    $$('[data-doctor-full]').forEach((el) => { el.textContent = full; });
    $$('[data-registered]').forEach((el) => { el.textContent = d.gender === 'm' ? 'Iscritto' : 'Iscritta'; });

    const s = S.studio || {};
    document.title = [s.name, s.city].filter(filled).join(' — ');
  }

  /* ---------- Collegamenti ---------- */
  function bindLinks() {
    const s = S.studio || {};
    const tel = filled(s.phoneLink || s.phone) ? 'tel:' + String(s.phoneLink || s.phone).replace(/[^\d+]/g, '') : '';
    $$('[data-tel]').forEach((a) => {
      if (!tel) { a.hidden = true; return; }
      a.href = tel;
      if (!a.textContent.trim().match(/\d/)) a.setAttribute('aria-label', (a.textContent.trim() || 'Chiama') + ' ' + s.phone);
    });

    $$('[data-mail]').forEach((a) => { if (filled(s.email)) a.href = 'mailto:' + s.email; });

    $$('[data-whatsapp]').forEach((a) => {
      if (!filled(s.whatsapp)) return;
      a.href = 'https://wa.me/' + String(s.whatsapp).replace(/\D/g, '');
      a.target = '_blank';
      a.rel = 'noopener';
      a.hidden = false;
    });

    $$('[data-booking]').forEach((a) => {
      if (filled(S.bookingUrl)) {
        a.href = S.bookingUrl;
        a.target = '_blank';
        a.rel = 'noopener';
      } else {
        a.href = '#prenota';
      }
    });

    $$('[data-maps]').forEach((a) => {
      if (filled(S.mapsUrl)) a.href = S.mapsUrl;
      else a.hidden = true;
    });

    const legal = S.legal || {};
    $$('[data-privacy]').forEach((a) => { if (filled(legal.privacyUrl)) a.href = legal.privacyUrl; });
    $$('[data-cookie]').forEach((a) => { if (filled(legal.cookieUrl)) a.href = legal.cookieUrl; });

    // Badge del voto Google: nascosto se il voto è vuoto
    const g = S.google || {};
    $$('[data-rating]').forEach((el) => {
      if (!filled(g.rating)) return;
      el.hidden = false;
      if (!filled(g.reviews)) { const c = $('.rating__count', el); if (c) c.hidden = true; }
      if (filled(g.reviewsUrl)) {
        el.href = g.reviewsUrl;
        el.target = '_blank';
        el.rel = 'noopener';
        el.setAttribute('aria-label', `Voto ${g.rating} su Google, vedi le recensioni (si apre in una nuova scheda)`);
      }
    });
  }

  /* ---------- Il dottore ---------- */
  function renderDoctor() {
    const d = S.doctor || {};

    const intro = $('[data-doctor-intro]');
    if (intro) {
      (d.intro || []).filter(filled).forEach((t) => {
        const p = document.createElement('p');
        p.textContent = t;
        intro.append(p);
      });
    }

    const frame = $('[data-doctor-photo]');
    if (frame && filled(d.photo)) {
      const img = document.createElement('img');
      img.src = d.photo;
      img.alt = 'Ritratto di ' + [d.title, d.name].filter(filled).join(' ');
      img.loading = 'lazy';
      frame.replaceChildren(img);
    }

    const list = $('[data-courses]');
    const courses = (d.courses || []).filter((c) => c && filled(c.title));
    if (!courses.length) {
      if (list) list.hidden = true;
      const t = $('[data-courses-title]');
      if (t) t.hidden = true;
      return;
    }
    courses.forEach((c) => {
      const li = document.createElement('li');
      li.className = 'cv__row';
      li.innerHTML = '<span class="cv__year"></span><span class="cv__what"><span class="cv__title"></span><span class="cv__org"></span></span>';
      $('.cv__year', li).textContent = c.year || '';
      $('.cv__title', li).textContent = c.title;
      const org = $('.cv__org', li);
      if (filled(c.org)) org.textContent = c.org; else org.remove();
      list.append(li);
    });
  }

  /* ---------- Trattamenti ---------- */
  const TREATMENTS = {
    igiene: {
      name: 'Igiene e prevenzione',
      short: 'Pulizia professionale e controlli periodici.',
      text: 'Durante la seduta di igiene vengono rimossi placca e tartaro che lo spazzolino non riesce a eliminare. I controlli periodici aiutano a individuare per tempo eventuali problemi e sono l\'occasione per ricevere consigli pratici sulla pulizia di tutti i giorni.'
    },
    conservativa: {
      name: 'Conservativa ed endodonzia',
      short: 'Cura delle carie e devitalizzazione.',
      text: 'La conservativa cura i denti colpiti da carie o piccole fratture con otturazioni e ricostruzioni, per mantenere il più possibile il dente naturale. L\'endodonzia, conosciuta come devitalizzazione, interviene quando è coinvolta la parte interna del dente: i canali vengono puliti e sigillati.'
    },
    ortodonzia: {
      name: 'Ortodonzia',
      short: 'Apparecchi fissi, mobili e allineatori trasparenti.',
      text: 'L\'ortodonzia si occupa della posizione dei denti e di come si chiudono le arcate, nei bambini come negli adulti. Può prevedere apparecchi fissi, mobili oppure allineatori trasparenti: quale soluzione sia adatta lo valuta il professionista dopo la visita.'
    },
    implantologia: {
      name: 'Implantologia',
      short: 'Impianti per sostituire denti mancanti.',
      text: 'Un impianto è una piccola vite in titanio inserita nell\'osso, che fa da radice per un dente artificiale. Prima di proporlo il professionista valuta l\'osso e lo stato di salute generale, e spiega tempi e fasi del percorso.'
    },
    protesi: {
      name: 'Protesi',
      short: 'Corone, ponti e protesi mobili.',
      text: 'Le protesi sostituiscono denti mancanti o ricostruiscono denti molto danneggiati. Possono essere fisse, come corone e ponti, oppure rimovibili. La scelta dipende dalla situazione della bocca e viene discussa insieme al paziente.'
    },
    estetica: {
      name: 'Estetica e sbiancamento',
      short: 'Colore e forma dei denti.',
      text: 'Lo sbiancamento schiarisce il colore dei denti con prodotti specifici, sotto il controllo del professionista. Altri trattamenti estetici intervengono su forma e proporzioni dei denti. Prima si verifica che denti e gengive siano sani, poi si valuta insieme quale risultato è ragionevole attendersi.'
    },
    pedodonzia: {
      name: 'Pedodonzia',
      short: 'Cure dentali per i bambini.',
      text: 'La pedodonzia è l\'odontoiatria dedicata ai bambini. Le prime visite servono anche a prendere confidenza con lo studio, con tempi e modi adatti all\'età, e a dare ai genitori indicazioni su igiene e alimentazione.'
    },
    parodontologia: {
      name: 'Parodontologia',
      short: 'Salute delle gengive.',
      text: 'La parodontologia si occupa delle gengive e dei tessuti che sostengono i denti. Gengive che sanguinano o si ritirano sono un segnale da non trascurare: il professionista valuta la situazione e indica le cure e i controlli più adatti.'
    }
  };

  function renderTreatments() {
    const list = $('[data-treatments]');
    if (!list) return;
    const active = Object.keys(TREATMENTS).filter((k) => (S.treatments || {})[k]);
    if (!active.length) { $('#trattamenti').hidden = true; return; }

    active.forEach((key, i) => {
      const t = TREATMENTS[key];
      const id = 'tr-panel-' + key;
      const li = document.createElement('li');
      li.className = 'tr';
      li.innerHTML = `
        <button class="tr__toggle" type="button" aria-expanded="false" aria-controls="${id}">
          <span class="tr__name"></span>
          <span class="tr__short"></span>
          <span class="tr__plus" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></span>
        </button>
        <div class="tr__panel" id="${id}" role="region" aria-label="">
          <div><p></p><a href="#prenota">Chiedi informazioni</a></div>
        </div>`;
      $('.tr__name', li).textContent = t.name;
      $('.tr__short', li).textContent = t.short;
      $('.tr__panel p', li).textContent = t.text;
      $('.tr__panel', li).setAttribute('aria-label', t.name);
      const panelLink = $('.tr__panel a', li);
      panelLink.tabIndex = -1;
      list.append(li);
    });

    list.addEventListener('click', (e) => {
      const btn = e.target.closest('.tr__toggle');
      if (!btn) return;
      const item = btn.parentElement;
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      item.classList.toggle('is-open', open);
      $('.tr__panel a', item).tabIndex = open ? 0 : -1;
    });
  }

  /* ---------- Domande frequenti ---------- */
  function renderFaq() {
    const box = $('[data-faq]');
    if (!box) return;
    const items = (S.faq || []).filter((f) => f && filled(f.q) && filled(f.a));
    if (!items.length) { $('#faq').hidden = true; return; }
    items.forEach((f) => {
      const d = document.createElement('details');
      d.className = 'qa';
      d.innerHTML = '<summary></summary><p class="qa__a"></p>';
      $('summary', d).textContent = f.q;
      $('.qa__a', d).textContent = f.a;
      box.append(d);
    });
  }

  /* ---------- Orari: oggi, aperto/chiuso ---------- */
  const toMin = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
  const fmt = (hhmm) => hhmm.replace(/^0(\d)/, '$1');

  function romeNow() {
    // Ora italiana, indipendentemente dal fuso del dispositivo
    const n = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Rome' }));
    return { day: (n.getDay() + 6) % 7, min: n.getHours() * 60 + n.getMinutes() };
  }

  function renderHours() {
    const tbody = $('[data-hours]');
    const hours = S.hours || [];
    if (!tbody || hours.length !== 7) return;
    const { day } = romeNow();

    tbody.replaceChildren();
    hours.forEach((h, i) => {
      const tr = document.createElement('tr');
      if (i === day) tr.className = 'is-today';
      const th = document.createElement('th');
      th.scope = 'row';
      th.textContent = h.day;
      const td = document.createElement('td');
      if (h.slots && h.slots.length) {
        h.slots.forEach(([a, b]) => {
          const s = document.createElement('span');
          s.className = 'slot';
          s.textContent = `${fmt(a)}–${fmt(b)}`;
          td.append(s);
        });
      }
      else { td.textContent = 'Chiuso'; td.className = 'closed'; }
      tr.append(th, td);
      tbody.append(tr);
    });
    updateOpenStatus();
  }

  function updateOpenStatus() {
    const hours = S.hours || [];
    if (hours.length !== 7) return;
    const { day, min } = romeNow();
    const today = hours[day].slots || [];
    const current = today.find(([a, b]) => min >= toMin(a) && min < toMin(b));

    let chip, line;
    if (current) {
      chip = 'Aperto ora';
      line = `Aperto ora, fino alle ${fmt(current[1])}.`;
    } else {
      chip = 'Chiuso ora';
      let next = null;
      const later = today.find(([a]) => toMin(a) > min);
      if (later) next = { label: 'oggi', time: later[0] };
      for (let k = 1; !next && k <= 7; k++) {
        const d = (day + k) % 7;
        const s = hours[d].slots || [];
        if (s.length) next = { label: k === 1 ? 'domani' : hours[d].day.toLowerCase(), time: s[0][0] };
      }
      line = next ? `Chiuso ora. Riapre ${next.label} alle ${fmt(next.time)}.` : 'Chiuso ora.';
    }
    $$('[data-open-chip]').forEach((el) => {
      el.textContent = chip;
      el.classList.toggle('is-open', !!current);
    });
    $$('[data-open-status]').forEach((el) => { el.textContent = line; });
  }

  /* ---------- Mappa (caricata solo su richiesta) ---------- */
  function initMap() {
    const btn = $('[data-map-load]');
    const frame = $('[data-map]');
    if (!btn || !frame) return;
    if (!filled(S.mapsEmbedQuery)) { frame.hidden = true; return; }
    btn.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.src = 'https://maps.google.com/maps?q=' + encodeURIComponent(S.mapsEmbedQuery) + '&z=14&output=embed';
      iframe.title = 'Mappa: ' + S.mapsEmbedQuery;
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      frame.replaceChildren(iframe);
    });
  }

  /* ---------- Header e menu ---------- */
  function initHeader() {
    const header = $('#header');
    const burger = $('.burger');
    const menu = $('#menu');

    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const setOpen = (open) => {
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Chiudi il menu' : 'Apri il menu');
      menu.hidden = !open;
      menu.classList.toggle('is-visible', open);
      header.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) $('a', menu).focus({ preventScroll: true });
    };

    burger.addEventListener('click', () => setOpen(menu.hidden));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => {
      if (menu.hidden) return;
      if (e.key === 'Escape') { setOpen(false); burger.focus(); }
      if (e.key === 'Tab') {
        const items = [burger, ...$$('a[href]', menu)];
        const first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---------- Galleria con lightbox ---------- */
  function initLightbox() {
    const dlg = $('#lightbox');
    const buttons = $$('[data-lightbox]');
    if (!dlg || !buttons.length || typeof dlg.showModal !== 'function') return;
    const img = $('img', dlg);
    const cap = $('figcaption', dlg);
    const photos = buttons.map((b) => { const i = $('img', b); return { src: i.getAttribute('src'), alt: i.alt }; });
    let index = 0;

    const show = (i) => {
      index = (i + photos.length) % photos.length;
      img.src = photos[index].src;
      img.alt = photos[index].alt;
      cap.textContent = `${photos[index].alt} (${index + 1} di ${photos.length})`;
      if (!reducedMotion.matches) {
        dlg.classList.remove('is-anim');
        void dlg.offsetWidth;
        dlg.classList.add('is-anim');
      }
    };

    buttons.forEach((b, i) => b.addEventListener('click', () => {
      show(i);
      dlg.showModal();
      document.body.style.overflow = 'hidden';
    }));
    dlg.addEventListener('close', () => { document.body.style.overflow = ''; });
    $('.lightbox__close', dlg).addEventListener('click', () => dlg.close());
    $('.lightbox__prev', dlg).addEventListener('click', () => show(index - 1));
    $('.lightbox__next', dlg).addEventListener('click', () => show(index + 1));
    dlg.addEventListener('click', (e) => { if (e.target === dlg || e.target.classList.contains('lightbox__figure')) dlg.close(); });
    dlg.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });

    // Scorrimento con il dito
    let x0 = null;
    dlg.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    dlg.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  }

  /* ---------- Modulo di richiesta appuntamento ----------
     Nessun dato viene inviato: nella bozza viene mostrato solo un
     riepilogo. Nel sito definitivo la richiesta andrà inviata allo
     studio via email tramite un servizio conforme al GDPR. */
  function initForm() {
    const form = $('#booking-form');
    const summary = $('#booking-summary');
    if (!form || !summary) return;

    const daySel = $('[data-day-options]', form);
    (S.hours || []).forEach((h) => {
      if (h.slots && h.slots.length) {
        const o = document.createElement('option');
        o.value = o.textContent = h.day;
        daySel.append(o);
      }
    });

    const rules = {
      'f-name': (el) => el.value.trim().length >= 2,
      'f-phone': (el) => /^\+?[\d\s().\/-]{6,}$/.test(el.value.trim()),
      'f-email': (el) => el.value.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim()),
      'f-consent': (el) => el.checked
    };
    const check = (id) => {
      const el = document.getElementById(id);
      const ok = rules[id](el);
      el.setAttribute('aria-invalid', String(!ok));
      if (ok) el.removeAttribute('aria-errormessage');
      else el.setAttribute('aria-errormessage', id + '-err');
      document.getElementById(id + '-err').hidden = ok;
      return ok;
    };
    // L'errore si aggiorna mentre si scrive, senza spostare il layout al cambio di campo
    Object.keys(rules).forEach((id) => {
      const el = document.getElementById(id);
      el.addEventListener(el.type === 'checkbox' ? 'change' : 'input', () => {
        if (el.getAttribute('aria-invalid') === 'true') check(id);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const bad = Object.keys(rules).filter((id) => !check(id));
      if (bad.length) { document.getElementById(bad[0]).focus(); return; }

      const data = new FormData(form);
      const rows = [
        ['Nome', data.get('nome')],
        ['Telefono', data.get('telefono')],
        ['Email', data.get('email')],
        ['Giorno preferito', data.get('giorno')],
        ['Fascia oraria', data.get('fascia')],
        ['Note', data.get('note')]
      ].filter(([, v]) => filled(v));

      const dl = $('[data-summary]', summary);
      dl.replaceChildren();
      rows.forEach(([k, v]) => {
        const row = document.createElement('div');
        const dt = document.createElement('dt');
        const dd = document.createElement('dd');
        dt.textContent = k;
        dd.textContent = String(v).trim();
        row.append(dt, dd);
        dl.append(row);
      });
      form.hidden = true;
      summary.hidden = false;
      summary.focus();
    });

    $('[data-summary-back]', summary).addEventListener('click', () => {
      summary.hidden = true;
      form.hidden = false;
      $('#f-name').focus();
    });
  }

  /* ---------- Avvio ---------- */
  bindText();
  bindLinks();
  renderDoctor();
  renderTreatments();
  renderFaq();
  renderHours();
  initMap();
  initHeader();
  initLightbox();
  initForm();
  setInterval(updateOpenStatus, 60000);
})();
