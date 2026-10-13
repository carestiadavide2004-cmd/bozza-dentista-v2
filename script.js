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
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const pad = (n) => String(n).padStart(2, '0');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = () => window.matchMedia('(max-width: 767px)').matches;

  /* ---------- Testi semplici ---------- */
  function bindText() {
    $$('[data-text]').forEach((n) => { const v = get(n.dataset.text); n.textContent = filled(v) ? v : ''; });
    $$('[data-lower]').forEach((n) => { const v = get(n.dataset.lower); n.textContent = filled(v) ? String(v).toLowerCase() : ''; });
    $$('[data-if]').forEach((n) => { if (!filled(get(n.dataset.if))) n.hidden = true; });

    const d = S.doctor || {};
    const full = [d.title, d.name].filter(filled).join(' ');
    $$('[data-doctor-full]').forEach((n) => { n.textContent = full; });
    $$('[data-registered]').forEach((n) => { n.textContent = d.gender === 'm' ? 'Iscritto' : 'Iscritta'; });

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
      if (!/\d/.test(a.textContent)) a.setAttribute('aria-label', `${a.textContent.trim() || 'Chiama'} ${s.phone}`);
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
      if (filled(S.bookingUrl)) { a.href = S.bookingUrl; a.target = '_blank'; a.rel = 'noopener'; }
      else a.href = '#prenota';
    });
    $$('[data-maps]').forEach((a) => { if (filled(S.mapsUrl)) a.href = S.mapsUrl; else a.hidden = true; });
    const legal = S.legal || {};
    $$('[data-privacy]').forEach((a) => { if (filled(legal.privacyUrl)) a.href = legal.privacyUrl; });
    $$('[data-cookie]').forEach((a) => { if (filled(legal.cookieUrl)) a.href = legal.cookieUrl; });

    const g = S.google || {};
    $$('[data-rating]').forEach((a) => {
      if (!filled(g.rating)) return;
      a.hidden = false;
      a.setAttribute('aria-label', `Voto ${g.rating} su 5 su Google`);
      if (filled(g.reviewsUrl)) { a.href = g.reviewsUrl; a.target = '_blank'; a.rel = 'noopener'; }
      else a.href = '#recensioni';
    });
  }

  /* ---------- Hero ---------- */
  function renderHero() {
    const hero = $('.hero');
    const h = S.hero || {};
    if (h.mirror) hero.classList.add('is-mirrored');
    const img = $('[data-hero-img]');
    if (filled(h.image)) img.src = h.image;
    const src = $('[data-hero-src-mobile]');
    if (src && filled(h.imageMobile)) src.srcset = h.imageMobile;

    const title = $('[data-hero-lines]');
    const lines = (h.lines || []).filter(filled);
    if (!lines.length) return;
    title.replaceChildren();
    title.setAttribute('aria-label', lines.join(' '));
    lines.forEach((t, i) => {
      const line = el('span', 'line');
      line.setAttribute('aria-hidden', 'true');
      const inner = el('span', null, t);
      inner.style.setProperty('--i', i);
      line.append(inner);
      title.append(line);
    });
  }

  /* ---------- Approccio ---------- */
  function renderApproach() {
    const a = S.approach || {};
    if (!filled(a.title) && !filled(a.text)) $('#approccio').hidden = true;
  }

  /* ---------- Il dottore ---------- */
  function renderDoctor() {
    const d = S.doctor || {};
    const intro = $('[data-doctor-intro]');
    (d.intro || []).filter(filled).forEach((t) => intro.append(el('p', null, t)));

    const fig = $('[data-doctor-photo]');
    const img = $('img', fig);
    if (filled(d.photo)) {
      img.src = d.photo;
      img.alt = 'Ritratto di ' + [d.title, d.name].filter(filled).join(' ');
      if (d.photoIsExample) $('[data-photo-note]').hidden = false;
    } else {
      img.remove();
      fig.append(el('p', 'doctor__photo-note', 'Foto del professionista da inserire'));
    }

    const list = $('[data-courses]');
    const courses = (d.courses || []).filter((c) => c && filled(c.title));
    if (!courses.length) { list.hidden = true; $('[data-courses-title]').hidden = true; return; }
    courses.forEach((c) => {
      const li = el('li', 'cv__row');
      const what = el('span', 'cv__what');
      what.append(el('span', 'cv__name', c.title));
      if (filled(c.org)) what.append(el('span', 'cv__org', c.org));
      li.append(el('span', 'cv__year', c.year || ''), what);
      list.append(li);
    });
  }

  /* ---------- Numeri con contatori ---------- */
  const fmtNum = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  function renderStats() {
    const list = $('[data-stats]');
    const stats = (S.stats || []).filter((s) => s && filled(s.label));
    if (!stats.length) { $('#numeri').hidden = true; return; }
    stats.forEach((s, i) => {
      const li = el('li', 'stat rv');
      li.style.setProperty('--d', (i * 0.12) + 's');
      const v = el('p', 'stat__value');
      const num = el('span', null, reduced ? fmtNum(s.value) : '0');
      num.dataset.count = s.value;
      v.append(num);
      if (filled(s.suffix)) v.append(el('span', 'stat__suffix', s.suffix));
      v.setAttribute('aria-label', fmtNum(s.value) + (s.suffix || ''));
      li.append(v, el('p', 'stat__label', s.label));
      list.append(li);
    });

    if (reduced) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        $$('[data-count]', list).forEach((n, i) => {
          const target = Number(n.dataset.count) || 0;
          const dur = 2200, start = performance.now() + i * 120;
          const tick = (now) => {
            const t = Math.min(Math.max((now - start) / dur, 0), 1);
            n.textContent = fmtNum(target * (1 - Math.pow(1 - t, 4)));
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      });
    }, { threshold: 0.4 });
    io.observe(list);
  }

  /* ---------- Trattamenti ----------
     Computer (≥ 960px): elenco a sinistra, pannello unico a destra che
     cambia al clic o al passaggio del mouse; frecce ↑ ↓ per scorrere.
     Telefono: fisarmonica, un solo trattamento aperto alla volta. */
  function renderTreatments() {
    const box = $('[data-treatments]');
    const list = $('[data-trx-list]');
    const items = (S.treatments || []).filter((t) => t && t.active && filled(t.name));
    if (!items.length) { $('#trattamenti').hidden = true; return; }

    const desktop = window.matchMedia('(min-width: 960px)');
    const altOf = (t) => t.alt || ('Immagine illustrativa: ' + t.name.toLowerCase());

    // Elenco (unico per entrambe le modalità)
    const buttons = items.map((t, i) => {
      const li = el('li', 'trx__item');
      const btn = el('button', 'trx__btn');
      btn.type = 'button';
      btn.id = 'trx-btn-' + i;
      btn.append(el('span', 'trx__n', pad(i + 1)), el('span', 'trx__name', t.name));
      const icon = el('span', 'trx__icon');
      icon.setAttribute('aria-hidden', 'true');
      btn.append(icon);

      // Contenuto della fisarmonica (telefono)
      const acc = el('div', 'trx__acc');
      acc.id = 'trx-acc-' + i;
      acc.setAttribute('role', 'region');
      acc.setAttribute('aria-labelledby', btn.id);
      const wrap = el('div');
      const inner = el('div', 'trx__acc-inner');
      if (filled(t.image)) {
        const img = el('img', 'trx__thumb');
        img.src = t.image; img.alt = altOf(t); img.loading = 'lazy'; img.width = 96; img.height = 96;
        inner.append(img);
      }
      inner.append(el('p', null, t.text || ''));
      const more = el('a', 'link-line', 'Richiedi informazioni');
      more.href = '#prenota';
      inner.append(more);
      wrap.append(inner);
      acc.append(wrap);

      li.append(btn, acc);
      list.append(li);
      return btn;
    });

    // Pannello unico (computer)
    const panel = $('[data-trx-panel]');
    const imgs = $$('.trx__img', panel);
    const body = $('.trx__body', panel);
    let current = -1, swapTimer = 0;

    const fillPanel = (i) => {
      const t = items[i];
      $('[data-trx-n]', panel).textContent = pad(i + 1);
      $('[data-trx-title]', panel).textContent = t.name;
      $('[data-trx-text]', panel).textContent = t.text || '';
      const ul = $('[data-trx-benefits]', panel);
      ul.replaceChildren(...(t.benefits || []).filter(filled).map((b) => el('li', null, b)));
      panel.setAttribute('aria-labelledby', buttons[i].id);
    };

    const select = (i, instant) => {
      if (i === current) return;
      current = i;
      buttons.forEach((b, k) => b.setAttribute('aria-current', String(k === i)));
      const t = items[i];
      // Dissolvenza incrociata della foto: la nuova entra sopra la precedente
      const on = imgs.find((im) => im.classList.contains('is-on')) || imgs[0];
      const off = imgs.find((im) => im !== on);
      if (filled(t.image)) {
        if (instant || reduced) { on.src = t.image; on.alt = altOf(t); }
        else {
          off.alt = altOf(t);
          const show = () => { off.classList.add('is-on'); on.classList.remove('is-on'); };
          off.onload = show;
          off.src = t.image;
          if (off.complete && off.naturalWidth) show();
        }
      }
      // Dissolvenza del testo
      clearTimeout(swapTimer);
      if (instant || reduced) { fillPanel(i); return; }
      body.classList.add('is-out');
      swapTimer = setTimeout(() => { fillPanel(i); body.classList.remove('is-out'); }, 260);
    };

    // Fisarmonica: apre un elemento e chiude gli altri
    const toggle = (i) => {
      buttons.forEach((b, k) => {
        const open = k === i && b.getAttribute('aria-expanded') !== 'true';
        b.setAttribute('aria-expanded', String(open));
        b.parentElement.classList.toggle('is-open', open);
      });
    };

    const applyMode = () => {
      if (desktop.matches) {
        buttons.forEach((b, i) => {
          b.removeAttribute('aria-expanded');
          b.setAttribute('aria-controls', 'trx-panel');
          b.parentElement.classList.remove('is-open');
        });
        panel.id = 'trx-panel';
        panel.setAttribute('role', 'region');
        const keep = current < 0 ? 0 : current;
        current = -1;
        select(keep, true);
        // Precarica le foto per transizioni immediate
        items.forEach((t) => { if (filled(t.image)) { const p = new Image(); p.src = t.image; } });
      } else {
        buttons.forEach((b, i) => {
          b.removeAttribute('aria-current');
          b.setAttribute('aria-expanded', 'false');
          b.setAttribute('aria-controls', 'trx-acc-' + i);
          b.parentElement.classList.remove('is-open');
        });
      }
    };

    buttons.forEach((b, i) => {
      b.addEventListener('click', () => (desktop.matches ? select(i) : toggle(i)));
      // Passaggio del mouse (solo computer), con un breve ritardo per evitare cambi involontari
      let hoverTimer = 0;
      b.addEventListener('mouseenter', () => {
        if (!desktop.matches) return;
        hoverTimer = setTimeout(() => select(i), 110);
      });
      b.addEventListener('mouseleave', () => clearTimeout(hoverTimer));
      // Tastiera: frecce, Home/Fine; Invio e Spazio attivano il pulsante
      b.addEventListener('keydown', (e) => {
        let k = null;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') k = (i + 1) % buttons.length;
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') k = (i - 1 + buttons.length) % buttons.length;
        if (e.key === 'Home') k = 0;
        if (e.key === 'End') k = buttons.length - 1;
        if (k === null) return;
        e.preventDefault();
        buttons[k].focus();
        if (desktop.matches) select(k);
      });
    });

    desktop.addEventListener('change', applyMode);
    applyMode();
    box.dataset.ready = 'true';
  }

  /* ---------- Recensioni ---------- */
  function renderReviews() {
    const g = S.google || {};
    const reviews = (S.reviews || []).filter((r) => r && filled(r.text));
    if (!filled(g.rating) && !reviews.length) { $('#recensioni').hidden = true; return; }
    if (!filled(g.rating)) $('.reviews__score').hidden = true;
    if (!filled(g.reviews)) $('[data-reviews-count]').hidden = true;
    const link = $('[data-reviews-link]');
    if (filled(g.reviewsUrl)) { link.href = g.reviewsUrl; link.target = '_blank'; link.rel = 'noopener'; link.hidden = false; }

    const list = $('[data-reviews]');
    reviews.forEach((r, i) => {
      const li = el('li', 'review rv');
      li.style.setProperty('--d', (i * 0.12) + 's');
      const q = el('blockquote', 'review__text', r.text);
      q.style.margin = '0';
      const meta = el('p', 'review__meta');
      meta.append(el('span', 'smallcaps', r.author || ''));
      if (S.reviewsAreExamples) meta.append(el('span', 'review__tag', 'Recensione di esempio'));
      li.append(q, meta);
      list.append(li);
    });
  }

  /* ---------- Domande frequenti ---------- */
  function renderFaq() {
    const box = $('[data-faq]');
    const items = (S.faq || []).filter((f) => f && filled(f.q) && filled(f.a));
    if (!items.length) { $('#faq').hidden = true; return; }
    items.forEach((f, i) => {
      const d = el('details', 'qa rv');
      d.style.setProperty('--d', Math.min(i * 0.07, 0.4) + 's');
      d.append(el('summary', null, f.q), el('p', 'qa__a', f.a));
      box.append(d);
    });
  }

  /* ---------- Orari: oggi, aperto/chiuso ---------- */
  const toMin = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
  const fmt = (hhmm) => hhmm.replace(/^0(\d)/, '$1');
  function romeNow() {
    const n = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Rome' }));
    return { day: (n.getDay() + 6) % 7, min: n.getHours() * 60 + n.getMinutes() };
  }
  function renderHours() {
    const tbody = $('[data-hours]');
    const hours = S.hours || [];
    if (hours.length !== 7) return;
    const { day } = romeNow();
    tbody.replaceChildren();
    hours.forEach((h, i) => {
      const tr = el('tr', i === day ? 'is-today' : null);
      const th = el('th', null, h.day);
      th.scope = 'row';
      const td = el('td');
      if (h.slots && h.slots.length) h.slots.forEach(([a, b]) => td.append(el('span', 'slot', `${fmt(a)}–${fmt(b)}`)));
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
        const s = hours[(day + k) % 7].slots || [];
        if (s.length) next = { label: k === 1 ? 'domani' : hours[(day + k) % 7].day.toLowerCase(), time: s[0][0] };
      }
      line = next ? `Riapre ${next.label} alle ${fmt(next.time)}.` : '';
    }
    $$('[data-open-chip]').forEach((n) => { n.textContent = chip; n.classList.toggle('is-open', !!current); });
    $$('[data-open-status]').forEach((n) => { n.textContent = line; });
  }

  /* ---------- Mappa incorporata ---------- */
  function renderMap() {
    const box = $('[data-map]');
    if (!filled(S.mapsEmbedQuery)) { box.hidden = true; return; }
    const iframe = el('iframe');
    iframe.src = 'https://maps.google.com/maps?q=' + encodeURIComponent(S.mapsEmbedQuery) + '&z=14&output=embed';
    iframe.title = 'Mappa: ' + S.mapsEmbedQuery;
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    box.append(iframe);
  }

  /* ---------- Header, menu, barra rapida ---------- */
  function initHeader() {
    const header = $('#header');
    const hero = $('.hero');
    const quick = $('.quickbar');
    const burger = $('.burger');
    const menu = $('#menu');

    const onScroll = () => {
      const y = window.scrollY;
      const heroH = hero.offsetHeight;
      header.classList.toggle('is-solid', y > heroH - 100);
      if (quick) quick.classList.toggle('is-visible', y > heroH * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    $$('.menu__list a', menu).forEach((a, i) => a.style.setProperty('--i', i));
    const setOpen = (open) => {
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Chiudi il menu' : 'Apri il menu');
      menu.hidden = !open;
      menu.classList.toggle('is-visible', open);
      header.classList.toggle('menu-open', open);
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

  /* ---------- Comparsa durante lo scroll ---------- */
  function initReveal() {
    const items = $$('.rv, .reveal-img');
    if (reduced || !('IntersectionObserver' in window)) { items.forEach((n) => n.classList.add('is-in')); return; }
    // Sequenza: ritardo crescente tra fratelli dello stesso blocco
    const groups = new Map();
    items.forEach((n) => {
      if (n.style.getPropertyValue('--d')) return;
      const k = n.parentElement;
      const i = groups.get(k) || 0;
      n.style.setProperty('--d', Math.min(i * 0.11, 0.55) + 's');
      groups.set(k, i + 1);
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    items.forEach((n) => io.observe(n));
  }

  /* ---------- Parallax leggero sulle foto grandi ---------- */
  function initParallax() {
    if (reduced) return;
    const imgs = $$('[data-parallax]');
    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      const k = small() ? 0.4 : 1; // effetto più leggero su telefono
      imgs.forEach((img) => {
        const box = img.parentElement.getBoundingClientRect();
        if (box.bottom < -100 || box.top > vh + 100) return;
        const p = (box.top + box.height / 2 - vh / 2) / vh; // -1 … 1
        const amount = parseFloat(img.dataset.parallax) || 0.08;
        img.style.setProperty('--py', (-p * amount * box.height * k).toFixed(1) + 'px');
      });
    };
    const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', req, { passive: true });
    window.addEventListener('resize', req);
    update();
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
      if (!reduced) { dlg.classList.remove('is-anim'); void dlg.offsetWidth; dlg.classList.add('is-anim'); }
    };
    buttons.forEach((b, i) => {
      b.setAttribute('aria-label', 'Apri la foto: ' + $('img', b).alt);
      b.addEventListener('click', () => { show(i); dlg.showModal(); document.body.style.overflow = 'hidden'; });
    });
    dlg.addEventListener('close', () => { document.body.style.overflow = ''; });
    $('.lightbox__close', dlg).addEventListener('click', () => dlg.close());
    $('.lightbox__prev', dlg).addEventListener('click', () => show(index - 1));
    $('.lightbox__next', dlg).addEventListener('click', () => show(index + 1));
    dlg.addEventListener('click', (e) => { if (e.target === dlg || e.target.classList.contains('lightbox__figure')) dlg.close(); });
    dlg.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });
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
     Nella bozza non viene inviato nulla: si mostra solo un riepilogo.
     Nel sito definitivo la richiesta andrà inviata allo studio via
     email tramite un servizio conforme al GDPR. */
  function initForm() {
    const form = $('#booking-form');
    const summary = $('#booking-summary');
    if (!form || !summary) return;

    const daySel = $('[data-day-options]', form);
    (S.hours || []).forEach((h) => {
      if (h.slots && h.slots.length) { const o = el('option', null, h.day); o.value = h.day; daySel.append(o); }
    });

    const rules = {
      'f-name': (n) => n.value.trim().length >= 2,
      'f-phone': (n) => /^\+?[\d\s().\/-]{6,}$/.test(n.value.trim()),
      'f-email': (n) => n.value.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(n.value.trim()),
      'f-consent': (n) => n.checked
    };
    const check = (id) => {
      const n = document.getElementById(id);
      const ok = rules[id](n);
      n.setAttribute('aria-invalid', String(!ok));
      if (ok) n.removeAttribute('aria-errormessage'); else n.setAttribute('aria-errormessage', id + '-err');
      document.getElementById(id + '-err').hidden = ok;
      return ok;
    };
    // L'errore si aggiorna mentre si scrive, senza spostare il layout al cambio di campo
    Object.keys(rules).forEach((id) => {
      const n = document.getElementById(id);
      n.addEventListener(n.type === 'checkbox' ? 'change' : 'input', () => { if (n.getAttribute('aria-invalid') === 'true') check(id); });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const bad = Object.keys(rules).filter((id) => !check(id));
      if (bad.length) { document.getElementById(bad[0]).focus(); return; }
      const data = new FormData(form);
      const rows = [
        ['Nome', data.get('nome')], ['Telefono', data.get('telefono')], ['Email', data.get('email')],
        ['Giorno preferito', data.get('giorno')], ['Fascia oraria', data.get('fascia')], ['Note', data.get('note')]
      ].filter(([, v]) => filled(v));
      const dl = $('[data-summary]', summary);
      dl.replaceChildren();
      rows.forEach(([k, v]) => {
        const row = el('div');
        row.append(el('dt', null, k), el('dd', null, String(v).trim()));
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
  renderHero();
  renderApproach();
  renderDoctor();
  renderStats();
  renderTreatments();
  renderReviews();
  renderFaq();
  renderHours();
  renderMap();
  bindLinks();
  initHeader();
  initReveal();
  initParallax();
  initLightbox();
  initForm();
  setInterval(updateOpenStatus, 60000);
})();
