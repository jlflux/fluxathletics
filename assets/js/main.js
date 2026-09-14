/* Flux Athletics — site behaviour
   Small, dependency-free. Everything degrades gracefully without JS. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- 1. Hero entrance ---------------------------------------------- */
  requestAnimationFrame(function () {
    document.documentElement.classList.add('is-loaded');
  });

  /* ---- 2. Sticky header state ---------------------------------------- */
  var header = document.querySelector('.header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- 3. Mobile navigation ------------------------------------------ */
  var toggle = document.querySelector('.nav-toggle');
  var drawer = document.getElementById('mobile-nav');
  if (toggle && drawer) {
    var setNav = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      drawer.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);
    };
    toggle.addEventListener('click', function () {
      setNav(toggle.getAttribute('aria-expanded') !== 'true');
    });
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setNav(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) setNav(false);
    });
  }

  /* ---- 4. Scroll reveal ---------------------------------------------- */
  var revealables = document.querySelectorAll('[data-reveal]');
  if (!revealables.length) {
    /* nothing to do */
  } else if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealables.forEach(function (el, i) {
      /* Stagger siblings that share a parent, unless an explicit delay is set */
      if (!el.style.getPropertyValue('--delay')) {
        var sibs = Array.prototype.filter.call(
          el.parentElement ? el.parentElement.children : [],
          function (n) { return n.hasAttribute && n.hasAttribute('data-reveal'); }
        );
        var idx = sibs.indexOf(el);
        el.style.setProperty('--delay', (idx > 0 ? Math.min(idx, 5) * 70 : 0) + 'ms');
      }
      io.observe(el);
    });
  }

  /* ---- 5. Marquee: duplicate track so the loop is seamless ----------- */
  document.querySelectorAll('.marquee').forEach(function (m) {
    var track = m.querySelector('.marquee__track');
    if (!track) return;
    var clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    m.appendChild(clone);
  });

  /* ---- 6. Counters ---------------------------------------------------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && !reduced && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        cio.unobserve(el);
        var target = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var start = performance.now();
        var dur = 1400;
        var tick = function (now) {
          var p = Math.min((now - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          var value = target % 1 === 0
            ? Math.round(target * eased)
            : (target * eased).toFixed(1);
          el.textContent = value + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---- 7. Accordions --------------------------------------------------- */
  document.querySelectorAll('.acc__btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      btn.setAttribute('aria-expanded', String(!open));
      if (panel) panel.setAttribute('data-open', String(!open));
    });
  });

  /* ---- 8. Animated mock bars ------------------------------------------ */
  var bars = document.querySelectorAll('.mock-bars');
  if (bars.length && 'IntersectionObserver' in window) {
    var bio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        bio.unobserve(entry.target);
        Array.prototype.forEach.call(entry.target.children, function (bar, i) {
          var h = bar.getAttribute('data-h') || '40';
          if (reduced) { bar.style.height = h + '%'; return; }
          bar.style.height = '0%';
          bar.style.transition = 'height 0.7s cubic-bezier(0.22,1,0.36,1) ' + (i * 60) + 'ms';
          requestAnimationFrame(function () { bar.style.height = h + '%'; });
        });
      });
    }, { threshold: 0.3 });
    bars.forEach(function (b) { bio.observe(b); });
  }

  /* ---- 9. Contact form ------------------------------------------------- */
  var form = document.querySelector('[data-contact-form]');
  if (form) {
    var status = form.querySelector('.form__status');
    var say = function (msg, kind) {
      if (!status) return;
      status.textContent = msg;
      status.className = 'form__status' + (kind ? ' is-' + kind : '');
    };

    form.addEventListener('submit', function (e) {
      var endpoint = form.getAttribute('action') || '';

      /* No endpoint configured yet → fall back to a pre-filled email. */
      if (!endpoint || endpoint.indexOf('REPLACE_WITH') !== -1) {
        e.preventDefault();
        var data = new FormData(form);
        var to = form.getAttribute('data-mailto') || 'hello@fluxathletics.com';
        var subject = 'Flux Athletics enquiry — ' + (data.get('interest') || 'General');
        var body = [
          'Name: ' + (data.get('name') || ''),
          'Organization: ' + (data.get('organization') || ''),
          'Email: ' + (data.get('email') || ''),
          'Interested in: ' + (data.get('interest') || ''),
          '',
          data.get('message') || ''
        ].join('\n');
        window.location.href = 'mailto:' + to +
          '?subject=' + encodeURIComponent(subject) +
          '&body=' + encodeURIComponent(body);
        say('Opening your email client…', 'ok');
        return;
      }

      /* Endpoint configured → post it in the background. */
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;
      say('Sending…');

      fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Request failed');
          form.reset();
          say('Thanks — we’ll be in touch within one business day.', 'ok');
        })
        .catch(function () {
          say('Something went wrong. Email hello@fluxathletics.com instead.', 'error');
        })
        .then(function () {
          if (btn) btn.disabled = false;
        });
    });
  }

  /* ---- 10. Gallery lightbox -------------------------------------------- */
  var shots = Array.prototype.slice.call(document.querySelectorAll('.shot__btn'));
  if (shots.length) {
    var box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Image viewer');
    box.innerHTML =
      '<button class="lightbox__close" type="button" aria-label="Close">\u2715</button>' +
      '<button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="Previous">\u2039</button>' +
      '<button class="lightbox__nav lightbox__nav--next" type="button" aria-label="Next">\u203A</button>' +
      '<figure class="lightbox__fig"><img alt=""><figcaption class="lightbox__cap"></figcaption></figure>';
    document.body.appendChild(box);

    var boxImg = box.querySelector('img');
    var boxCap = box.querySelector('.lightbox__cap');
    var index = 0;
    var lastFocus = null;

    var show = function (i) {
      index = (i + shots.length) % shots.length;
      var src = shots[index].querySelector('img');
      boxImg.src = src.currentSrc || src.src;
      boxImg.alt = src.alt || '';
      var fig = shots[index].closest('.shot');
      var cap = fig && fig.querySelector('figcaption');
      boxCap.textContent = cap ? cap.textContent : '';
      boxCap.hidden = !cap;
    };
    var open = function (i) {
      lastFocus = document.activeElement;
      show(i);
      box.classList.add('is-open');
      document.body.classList.add('nav-open');
      box.querySelector('.lightbox__close').focus();
    };
    var close = function () {
      box.classList.remove('is-open');
      document.body.classList.remove('nav-open');
      if (lastFocus) lastFocus.focus();
    };

    shots.forEach(function (btn, i) {
      btn.addEventListener('click', function () { open(i); });
    });
    box.querySelector('.lightbox__close').addEventListener('click', close);
    box.querySelector('.lightbox__nav--prev').addEventListener('click', function () { show(index - 1); });
    box.querySelector('.lightbox__nav--next').addEventListener('click', function () { show(index + 1); });
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });
    /* A single image needs no paging. */
    if (shots.length < 2) {
      box.querySelector('.lightbox__nav--prev').hidden = true;
      box.querySelector('.lightbox__nav--next').hidden = true;
    }
  }

  /* ---- 11. Current year ------------------------------------------------ */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
