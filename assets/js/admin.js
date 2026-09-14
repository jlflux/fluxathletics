/* Flux Athletics — site admin.

   Edits content.json in the browser, previews the real pages live using the
   same tools/templates.js the build uses, and commits the regenerated site to
   GitHub in one commit. No server, no framework.

   The form is generated from the shape of content.json itself, so any field you
   add to that file automatically becomes editable here. */
(function () {
  'use strict';

  var DRAFT_KEY = 'flux_admin_draft';
  var TOKEN_KEY = 'flux_admin_gh_token';

  var state = {
    content: null,     // what you are editing
    published: null,   // what content.json held when the page loaded
    section: 'site',
    page: 'index.html',
    server: null,   // null = no publish API; else { configured, authenticated, repo, missing }
  };

  /* ------------------------------------------------------------------ *
   * Labels and field types
   * ------------------------------------------------------------------ */
  var LABELS = {
    site: 'Site & identity', brand: 'Brand colours', nav: 'Navigation',
    footer: 'Footer', home: 'Home page', commandCenter: 'Command Center',
    toolkit: 'Broadcaster’s Toolkit', consulting: 'Consulting', about: 'About',
    contact: 'Contact', notFound: '404 page', repo: 'Publishing target',

    meta: 'Search & social meta', hero: 'Hero', cta: 'Closing CTA band',
    title: 'Title', description: 'Description', heading: 'Heading',
    eyebrow: 'Eyebrow (small label above the heading)', lead: 'Lead paragraph',
    body: 'Body text', label: 'Label', href: 'Link target', num: 'Small label',
    titleLines: 'Headline (one line per box)', titleAccent: 'Second line (accent colour)',
    k: 'Large text', v: 'Supporting text', q: 'Question', a: 'Answer',
    crumb: 'Breadcrumb text', buttons: 'Buttons', button: 'Button',
    items: 'Items', cards: 'Cards', list: 'Bullet list', links: 'Links',
    paragraphs: 'Paragraphs', columns: 'Columns', stats: 'Stats',
    steps: 'Steps', style: 'Style',

    whatWeDo: '“What we do” intro', pillars: 'Three pillars',
    commandCenterSplit: 'Command Center feature block',
    toolkitSplit: 'Toolkit feature block', consultingSection: 'Consulting block',
    howWeWork: 'How we work', marquee: 'Scrolling ticker words',
    mockRows: 'Dashboard mock rows', mockLabel: 'Mock window title',
    scoreboard: 'Scoreboard graphic', lowerThird: 'Lower third graphic',
    sponsorBug: 'Sponsor bug text', preview: 'On-air preview', caption: 'Caption',
    problem: 'Problem section', modules: 'Modules', faq: 'FAQ',
    kit: 'The kit', compat: 'Compatibility section', why: 'Why us',
    practices: 'Practice areas', engagements: 'Engagement types', process: 'Process',
    intro: 'Intro', beliefs: 'Beliefs', team: 'Team block',
    details: 'Contact details', form: 'Contact form',
    interests: 'Interest dropdown options', include: '“Good things to include” list',
    expect: 'What to expect', expectTitle: '“What to expect” label',
    includeTitle: '“Good things to include” label',
    messageLabel: 'Message field label', messagePlaceholder: 'Message field placeholder',
    submitLabel: 'Submit button label', action: 'Form endpoint URL',
    note: 'Internal note (becomes an HTML comment — not visible on the page)',
    word: 'Large footer line', legal: 'Legal line',
    wordmarkBold: 'Wordmark — bold part', wordmarkLight: 'Wordmark — light part',
    ctaLabel: 'Header button label', domain: 'Domain', email: 'Email address',
    name: 'Name', primary: 'Primary accent', support: 'Support accent',
    ink: 'Dark background', paper: 'Light background',
    owner: 'GitHub owner', branch: 'Branch', chip: 'Status pill text',
    chipStyle: 'Status pill colour', theme: 'Accent theme', meta_: '',
    home_: '', clock: 'Clock', away: 'Away label', awayScore: 'Away score',
    homeScore: 'Home score', sponsor: 'Sponsor line', linkLabel: 'Link text',
    linkHref: 'Link target',
    gallery: 'On-air photos', src: 'Image', alt: 'Alt text (describes the image for screen readers)',
    caption: 'Caption', emptyNote: 'Note shown while there are no photos yet',
  };

  /* Lists that can start empty need a known item shape to add into. */
  var DEFAULT_SHAPES = {
    'toolkit.gallery.items': { src: '', alt: '', caption: '' },
  };

  /* path -> { dataUrl, base64 } for images chosen but not yet published. */
  var pendingUploads = {};

  var SECTION_ORDER = ['site', 'brand', 'nav', 'home', 'commandCenter', 'toolkit',
    'consulting', 'about', 'contact', 'notFound', 'footer', 'repo'];

  var SECTION_HELP = {
    site: 'Company name, domain and email. The domain feeds the canonical and social tags on every page.',
    brand: 'Change these and every page updates. Colours are applied to the site the moment you publish.',
    nav: 'The header and mobile menu. Changing a label here changes it on all seven pages at once.',
    home: 'Everything on the home page, top to bottom.',
    commandCenter: 'The Athletics Command Center product page.',
    toolkit: 'The Broadcaster’s Toolkit product page.',
    consulting: 'The consulting page.',
    about: 'The about page.',
    contact: 'The contact page, including the form dropdown options and where the form posts.',
    notFound: 'The page people see when a URL does not exist.',
    footer: 'The footer, shown on every page.',
    repo: 'Where Publish sends your changes. Only change this if you move the repository.',
  };

  var SECTION_PAGE = {
    home: 'index.html', commandCenter: 'command-center.html',
    toolkit: 'broadcasters-toolkit.html', consulting: 'consulting.html',
    about: 'about.html', contact: 'contact.html', notFound: '404.html',
  };

  var SELECTS = {
    style: ['primary', 'ghost'],
    chipStyle: ['live', 'ok', 'pend'],
    theme: ['primary', 'support'],
  };

  function labelFor(key) {
    if (LABELS[key]) return LABELS[key];
    return key.replace(/([A-Z])/g, ' $1')
      .replace(/^./, function (m) { return m.toUpperCase(); })
      .trim();
  }

  function typeFor(key, value, path) {
    if (key === 'src') return 'image';
    if (SELECTS[key]) return 'select';
    if (path.indexOf('brand.') === 0) return 'color';
    if (key === 'href' || key === 'action' || key === 'domain' || key === 'linkHref') return 'url';
    if (typeof value === 'string' && (value.indexOf('\n') !== -1 || value.length > 80)) return 'textarea';
    return 'text';
  }

  /* ------------------------------------------------------------------ *
   * Small DOM helpers
   * ------------------------------------------------------------------ */
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'text') n.textContent = attrs[k];
      else if (k.indexOf('on') === 0) n.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] !== null && attrs[k] !== undefined) n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }
  var $ = function (s) { return document.querySelector(s); };

  var toastEl = $('#toast'), toastTimer;
  function toast(msg, isErr) {
    toastEl.textContent = msg;
    toastEl.className = 'toast is-up' + (isErr ? ' is-err' : '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.className = 'toast'; }, isErr ? 7000 : 3200);
  }

  /* ------------------------------------------------------------------ *
   * State
   * ------------------------------------------------------------------ */
  function isDirty() {
    return JSON.stringify(state.content) !== JSON.stringify(state.published);
  }

  function markChanged(structural) {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(state.content)); } catch (e) { /* private mode */ }
    updateState();
    schedulePreview();
    if (structural) { renderEditor(); renderSidebar(); }
  }

  function updateState() {
    var s = $('#state');
    if (isDirty()) {
      s.className = 'bar__state';
      s.innerHTML = '<b>●</b> unpublished changes';
    } else {
      s.className = 'bar__state is-clean';
      s.innerHTML = '<b>●</b> up to date';
    }
  }

  function blankLike(v) {
    if (Array.isArray(v)) return [];
    if (v && typeof v === 'object') {
      var o = {};
      Object.keys(v).forEach(function (k) { o[k] = blankLike(v[k]); });
      return o;
    }
    return '';
  }

  /* ------------------------------------------------------------------ *
   * Form building — driven by the shape of the data
   * ------------------------------------------------------------------ */
  /* Phone photos are far larger than a web page needs, and the publish API caps
     file size, so shrink to a sensible width before it ever leaves the browser. */
  function resizeImage(file, maxW, quality) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onerror = function () { reject(new Error('Could not read that file.')); };
      reader.onload = function () {
        var im = new Image();
        im.onerror = function () { reject(new Error('That does not look like an image.')); };
        im.onload = function () {
          var scale = Math.min(1, maxW / im.naturalWidth);
          var w = Math.max(1, Math.round(im.naturalWidth * scale));
          var h = Math.max(1, Math.round(im.naturalHeight * scale));
          var cv = document.createElement('canvas');
          cv.width = w; cv.height = h;
          cv.getContext('2d').drawImage(im, 0, 0, w, h);
          resolve({ dataUrl: cv.toDataURL('image/jpeg', quality), w: w, h: h });
        };
        im.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function slugify(name) {
    return String(name || '').toLowerCase()
      .replace(/\.[a-z0-9]+$/, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'shot';
  }

  function imageControl(obj, key, id) {
    var wrap = el('div', { class: 'imgfield' });
    var thumb = el('div', { class: 'imgfield__thumb' });
    var img = el('img', { alt: '' });
    var empty = el('span', { class: 'imgfield__empty', text: 'No image yet' });
    thumb.appendChild(img);
    thumb.appendChild(empty);

    var paint = function () {
      var v = obj[key];
      var shown = (pendingUploads[v] && pendingUploads[v].dataUrl) || v;
      if (shown) { img.src = shown; img.hidden = false; empty.hidden = true; }
      else { img.removeAttribute('src'); img.hidden = true; empty.hidden = false; }
    };

    var file = el('input', { type: 'file', accept: 'image/*', hidden: '' });
    var status = el('p', { class: 'f__hint' });

    file.addEventListener('change', function () {
      var f = file.files && file.files[0];
      file.value = '';
      if (!f) return;
      status.textContent = 'Processing…';
      resizeImage(f, 1600, 0.85).then(function (out) {
        var base64 = out.dataUrl.slice(out.dataUrl.indexOf(',') + 1);
        var bytes = Math.round(base64.length * 0.75);
        if (bytes > 1800000) {
          status.textContent = 'That image is still too large after resizing. Try a smaller one.';
          return;
        }
        var path = 'assets/img/gallery/' + slugify(f.name) + '-' + Date.now().toString(36) + '.jpg';
        pendingUploads[path] = { dataUrl: out.dataUrl, base64: base64 };
        obj[key] = path;
        paint();
        status.textContent = out.w + '×' + out.h + ' · ' + Math.round(bytes / 1024) + ' KB · publishes with your next Publish';
        markChanged();
      }).catch(function (err) {
        status.textContent = err.message;
      });
    });

    var pathInput = el('input', { type: 'text', id: id, value: obj[key] || '', placeholder: 'assets/img/gallery/…' });
    pathInput.addEventListener('input', function () { obj[key] = pathInput.value; paint(); markChanged(); });

    var row = el('div', { class: 'imgfield__row' }, [
      el('button', { class: 'btn btn--sm', type: 'button', text: 'Upload image', onclick: function () { file.click(); } }),
      el('button', {
        class: 'btn btn--sm btn--danger', type: 'button', text: 'Clear',
        onclick: function () { obj[key] = ''; pathInput.value = ''; paint(); status.textContent = ''; markChanged(); }
      }),
    ]);

    wrap.appendChild(thumb);
    wrap.appendChild(row);
    wrap.appendChild(pathInput);
    wrap.appendChild(status);
    wrap.appendChild(file);
    paint();
    return wrap;
  }

  function control(obj, key, path) {
    var value = obj[key];
    var type = typeFor(key, value, path);
    var field = el('div', { class: 'f' });
    var id = 'f_' + path.replace(/[^a-z0-9]/gi, '_');
    field.appendChild(el('label', { for: id, text: labelFor(key) }));

    var input;
    if (type === 'image') {
      field.appendChild(imageControl(obj, key, id));
      return field;
    }
    if (type === 'select') {
      input = el('select', { id: id });
      SELECTS[key].forEach(function (opt) {
        input.appendChild(el('option', { value: opt, text: opt, selected: value === opt ? '' : null }));
      });
    } else if (type === 'textarea') {
      input = el('textarea', { id: id, rows: String(Math.min(8, Math.max(2, String(value).split('\n').length + 1))) });
      input.value = value;
    } else if (type === 'color') {
      var wrap = el('div', { class: 'color' });
      var swatch = el('input', { type: 'color', value: /^#[0-9a-f]{6}$/i.test(value) ? value : '#000000', 'aria-label': labelFor(key) + ' swatch' });
      var text = el('input', { type: 'text', id: id, value: value });
      swatch.addEventListener('input', function () { text.value = swatch.value.toUpperCase(); obj[key] = text.value; markChanged(); });
      text.addEventListener('input', function () {
        obj[key] = text.value;
        if (/^#[0-9a-f]{6}$/i.test(text.value)) swatch.value = text.value;
        markChanged();
      });
      wrap.appendChild(swatch); wrap.appendChild(text);
      field.appendChild(wrap);
      if (key === 'primary') field.appendChild(el('p', { class: 'f__hint', text: 'The social share image (assets/img/og.png) is a rendered file — run "npm run og" to regenerate it after a colour change.' }));
      return field;
    } else {
      input = el('input', { type: type === 'url' ? 'text' : 'text', id: id, value: value });
    }

    input.addEventListener('input', function () { obj[key] = input.value; markChanged(); });
    field.appendChild(input);

    if (key === 'action') field.appendChild(el('p', { class: 'f__hint', text: 'Leave empty and the form opens the visitor’s email app pre-filled. Paste a Formspree/Basin endpoint to collect submissions instead.' }));
    if (key === 'titleLines') field.appendChild(el('p', { class: 'f__hint', text: 'Each entry is one line of the big headline.' }));
    return field;
  }

  function itemTitle(item, i) {
    var v = item.title || item.label || item.k || item.q || item.heading || item.num || item.name;
    if (typeof v === 'string' && v) return v.length > 46 ? v.slice(0, 46) + '…' : v;
    return 'Item ' + (i + 1);
  }

  var shapeMemory = {};

  function listEditor(parent, key, path) {
    var arr = parent[key];
    if (arr.length && typeof arr[0] === 'object') shapeMemory[path] = blankLike(arr[0]);
    var simple = arr.length === 0 || typeof arr[0] === 'string';
    var box = el('div', { class: 'list' + (simple ? ' list--simple' : '') });

    arr.forEach(function (item, i) {
      var row = el('div', { class: 'list__item' });
      var tools = el('div', { class: 'list__tools' }, [
        el('button', {
          type: 'button', title: 'Move up', text: '↑', onclick: function () {
            if (i === 0) return;
            arr.splice(i - 1, 0, arr.splice(i, 1)[0]); markChanged(true);
          }
        }),
        el('button', {
          type: 'button', title: 'Move down', text: '↓', onclick: function () {
            if (i === arr.length - 1) return;
            arr.splice(i + 1, 0, arr.splice(i, 1)[0]); markChanged(true);
          }
        }),
        el('button', {
          class: 'rm', type: 'button', title: 'Remove', text: '✕', onclick: function () {
            if (!confirm('Remove "' + (simple ? item : itemTitle(item, i)) + '"?')) return;
            arr.splice(i, 1); markChanged(true);
          }
        }),
      ]);

      if (simple) {
        var inp = el('input', { type: 'text', value: item, 'aria-label': labelFor(key) + ' ' + (i + 1) });
        inp.addEventListener('input', function () { arr[i] = inp.value; markChanged(); });
        row.appendChild(el('span', { class: 'list__n', text: String(i + 1).padStart(2, '0') }));
        row.appendChild(inp);
        row.appendChild(tools);
      } else {
        row.appendChild(el('div', { class: 'list__head' }, [
          el('span', { class: 'list__n', text: String(i + 1).padStart(2, '0') }),
          el('strong', { style: 'font-size:12.5px;font-weight:600', text: itemTitle(item, i) }),
          tools,
        ]));
        Object.keys(item).forEach(function (k) {
          row.appendChild(nodeFor(item, k, path + '[' + i + '].' + k));
        });
      }
      box.appendChild(row);
    });

    box.appendChild(el('button', {
      class: 'btn btn--sm list__add', type: 'button', text: '+ Add ' + labelFor(key).toLowerCase().replace(/s$/, ''),
      onclick: function () {
        arr.push(
          arr.length ? blankLike(arr[0])
          : shapeMemory[path] ? blankLike(shapeMemory[path])
          : DEFAULT_SHAPES[path] ? blankLike(DEFAULT_SHAPES[path])
          : ''
        );
        markChanged(true);
      }
    }));
    return box;
  }

  /* Returns the right editor for parent[key], whatever shape it is. */
  function nodeFor(parent, key, path) {
    var value = parent[key];

    if (Array.isArray(value)) {
      var d = el('details', { class: 'grp grp--nested', open: '' }, [
        el('summary', {}, [
          document.createTextNode(labelFor(key)),
          el('span', { class: 'side__count', text: value.length + ' item' + (value.length === 1 ? '' : 's') }),
        ]),
      ]);
      d.appendChild(el('div', { class: 'grp__body' }, [listEditor(parent, key, path)]));
      return d;
    }

    if (value && typeof value === 'object') {
      var g = el('details', { class: 'grp grp--nested', open: '' }, [
        el('summary', { text: labelFor(key) }),
      ]);
      var body = el('div', { class: 'grp__body' });
      Object.keys(value).forEach(function (k) { body.appendChild(nodeFor(value, k, path + '.' + k)); });
      g.appendChild(body);
      return g;
    }

    return control(parent, key, path);
  }

  function renderEditor() {
    var key = state.section;
    var data = state.content[key];
    $('#ed-title').textContent = labelFor(key);
    $('#ed-sub').textContent = SECTION_HELP[key] || '';

    var host = $('#fields');
    host.innerHTML = '';

    if (data && typeof data === 'object' && !Array.isArray(data)) {
      Object.keys(data).forEach(function (k) {
        var v = data[k];
        if ((v && typeof v === 'object') || Array.isArray(v)) {
          host.appendChild(nodeFor(data, k, key + '.' + k));
        } else {
          var g = el('details', { class: 'grp', open: '' }, [el('summary', { text: labelFor(key) })]);
          var existing = host.querySelector('[data-loose]');
          if (!existing) {
            g.setAttribute('data-loose', '');
            g.appendChild(el('div', { class: 'grp__body' }));
            host.insertBefore(g, host.firstChild);
            existing = g;
          }
          existing.querySelector('.grp__body').appendChild(control(data, k, key + '.' + k));
        }
      });
    } else if (Array.isArray(data)) {
      var g2 = el('details', { class: 'grp', open: '' }, [
        el('summary', {}, [
          document.createTextNode(labelFor(key)),
          el('span', { class: 'side__count', text: data.length + ' items' }),
        ]),
      ]);
      g2.appendChild(el('div', { class: 'grp__body' }, [listEditor(state.content, key, key)]));
      host.appendChild(g2);
    }
  }

  function renderSidebar() {
    var side = $('#side');
    side.innerHTML = '';
    side.appendChild(el('p', { class: 'side__h', text: 'Sections' }));
    SECTION_ORDER.forEach(function (key) {
      if (!(key in state.content)) return;
      var v = state.content[key];
      var count = Array.isArray(v) ? v.length : null;
      side.appendChild(el('button', {
        class: 'side__item', 'aria-current': key === state.section ? 'true' : 'false',
        onclick: function () {
          state.section = key;
          if (SECTION_PAGE[key]) { state.page = SECTION_PAGE[key]; $('#prev-page').value = state.page; }
          renderSidebar(); renderEditor(); renderPreview();
        }
      }, [
        el('span', { text: labelFor(key) }),
        count !== null ? el('span', { class: 'side__count', text: String(count) }) : null,
      ]));
    });
  }

  /* ------------------------------------------------------------------ *
   * Preview
   * ------------------------------------------------------------------ */
  /* The preview pane is far narrower than a desktop viewport, so render the
     iframe at a real desktop width and scale it down to fit. Without this,
     "Desktop" would just be showing the mobile breakpoint. */
  var MAX_FRAME_PX = 12000;

  function fitPreview() {
    var stage = $('#stage');
    var frame = $('#frame');
    if (!stage || !frame) return;

    /* Hidden (narrow layouts) means zero width — scaling by 0 would blank the
       iframe and poison the height. Leave the last good values alone. */
    var avail = stage.clientWidth;
    if (!avail) return;

    var target = stage.classList.contains('is-mobile') ? 390 : 1280;
    var scale = Math.min(1, avail / target);
    if (!isFinite(scale) || scale <= 0) scale = 1;

    var height = stage.clientHeight / scale;
    if (!isFinite(height) || height <= 0) height = stage.clientHeight || 600;
    height = Math.min(height, MAX_FRAME_PX);

    frame.style.width = target + 'px';
    frame.style.height = height + 'px';
    frame.style.transform = 'scale(' + scale + ')';
  }

  var previewTimer;
  function schedulePreview() {
    clearTimeout(previewTimer);
    previewTimer = setTimeout(renderPreview, 350);
  }

  function renderPreview() {
    var files;
    try {
      files = window.FluxTemplates.renderAll(state.content);
    } catch (e) {
      toast('Preview failed: ' + e.message, true);
      return;
    }
    var html = files[state.page];
    if (!html) return;
    /* Relative asset paths must resolve against the site root, and reveal
       animations should not hide content in a static preview. */
    html = html.replace('<head>', '<head>\n<base href="' + location.href + '">')
               .replace('</head>', '<style>[data-reveal]{opacity:1!important;transform:none!important}</style></head>');
    $('#frame').srcdoc = html;
    fitPreview();
  }

  /* ------------------------------------------------------------------ *
   * GitHub publishing
   * ------------------------------------------------------------------ */
  function b64(str) {
    var bytes = new TextEncoder().encode(str);
    var bin = '', CH = 0x8000;
    for (var i = 0; i < bytes.length; i += CH) {
      bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CH));
    }
    return btoa(bin);
  }

  function ghLog(msg, cls) {
    var log = $('#gh-log');
    log.hidden = false;
    var line = el('div', { class: cls || '', text: msg });
    log.appendChild(line);
    log.scrollTop = log.scrollHeight;
  }

  async function gh(token, path, opts) {
    var res = await fetch('https://api.github.com' + path, Object.assign({}, opts, {
      headers: Object.assign({
        Authorization: 'Bearer ' + token,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      }, (opts && opts.headers) || {}),
    }));
    if (!res.ok) {
      var text = await res.text();
      var msg = res.status + ' on ' + path;
      try { msg += ' — ' + (JSON.parse(text).message || ''); } catch (e) { /* non-JSON */ }
      if (res.status === 401) msg += ' — the token was rejected; it may have expired.';
      if (res.status === 403) {
        msg += ' — the token can read this repository but not write to it. ' +
          'Re-create it with Repository access = "Only select repositories" (this one) ' +
          'and Permissions > Repository > Contents: "Read and write". ' +
          'Choosing "Public repositories" gives read-only access.';
      }
      if (res.status === 404) msg += ' — check the owner, repo and branch names, and that the token can reach this repository.';
      throw new Error(msg);
    }
    return res.json();
  }

  async function publish(token, message) {
    var repo = state.content.repo;
    var base = '/repos/' + repo.owner + '/' + repo.name;
    var files = window.FluxTemplates.renderAll(state.content);
    files['content.json'] = JSON.stringify(state.content, null, 2) + '\n';

    var paths = Object.keys(files);
    ghLog('Publishing ' + paths.length + ' files to ' + repo.owner + '/' + repo.name + '@' + repo.branch);

    var ref = await gh(token, base + '/git/ref/heads/' + repo.branch);
    var baseSha = ref.object.sha;
    ghLog('base commit ' + baseSha.slice(0, 7));

    var baseCommit = await gh(token, base + '/git/commits/' + baseSha);

    var tree = [];
    for (var i = 0; i < paths.length; i++) {
      var p = paths[i];
      var entry = files[p];
      var payload = (entry && typeof entry === 'object' && entry.encoding === 'base64')
        ? { content: entry.content, encoding: 'base64' }      /* already binary */
        : { content: b64(entry), encoding: 'base64' };        /* text -> base64 */
      var blob = await gh(token, base + '/git/blobs', { method: 'POST', body: JSON.stringify(payload) });
      tree.push({ path: p, mode: '100644', type: 'blob', sha: blob.sha });
      ghLog('  blob ' + p);
    }

    var newTree = await gh(token, base + '/git/trees', {
      method: 'POST',
      body: JSON.stringify({ base_tree: baseCommit.tree.sha, tree: tree }),
    });

    var commit = await gh(token, base + '/git/commits', {
      method: 'POST',
      body: JSON.stringify({ message: message, tree: newTree.sha, parents: [baseSha] }),
    });
    ghLog('commit ' + commit.sha.slice(0, 7));

    await gh(token, base + '/git/refs/heads/' + repo.branch, {
      method: 'PATCH',
      body: JSON.stringify({ sha: commit.sha }),
    });

    ghLog('Published. Your host will redeploy shortly.', 'ok');
    return commit;
  }

  /* ------------------------------------------------------------------ *
   * Server-side publishing (password login, token stays on the server)
   * ------------------------------------------------------------------ */
  async function api(path, body) {
    var res = await fetch('/api/' + path, {
      method: body ? 'POST' : 'GET',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'same-origin',
      cache: 'no-store',
    });
    var data = null;
    try { data = await res.json(); } catch (e) { /* not JSON */ }
    if (!res.ok) throw new Error((data && data.error) || ('HTTP ' + res.status));
    return data;
  }

  /* Probe for the publish API. A static host with no functions returns the
     404 page (HTML), so anything that is not our JSON means token mode. */
  async function detectServer() {
    try {
      var info = await api('session');
      return (info && info.mode === 'server') ? info : null;
    } catch (e) { return null; }
  }

  function buildFiles() {
    var files = window.FluxTemplates.renderAll(state.content);
    files['content.json'] = JSON.stringify(state.content, null, 2) + '\n';
    /* Only ship images still referenced by the content — clearing a photo and
       publishing should not upload the file anyway. */
    var used = JSON.stringify(state.content);
    Object.keys(pendingUploads).forEach(function (path) {
      if (used.indexOf(path) !== -1) {
        files[path] = { encoding: 'base64', content: pendingUploads[path].base64 };
      }
    });
    return files;
  }

  async function publishViaServer(message) {
    var files = buildFiles();
    ghLog('Publishing ' + Object.keys(files).length + ' files…');
    var out = await api('publish', { files: files, message: message });
    ghLog('commit ' + String(out.commit).slice(0, 7) + ' on ' + out.branch, 'ok');
    ghLog('Published. Your host will redeploy shortly.', 'ok');
    return out;
  }

  function showPanel(which) {
    ['login', 'ready', 'token'].forEach(function (p) {
      var node = $('#panel-' + p);
      if (node) node.hidden = (p !== which);
    });
    /* The "not configured" note sits alongside the token panel rather than
       replacing it, so a half-set-up server never blocks publishing. */
    $('#panel-unconfigured').hidden = !(which === 'token' && state.server && !state.server.configured);
    var titles = { login: 'Sign in to publish', ready: 'Publish', token: 'Publish to GitHub' };
    $('#dlg-title').textContent = titles[which] || 'Publish';
    $('#gh-go').textContent = which === 'login' ? 'Sign in' : 'Publish';
  }

  function currentPanel() {
    if (!state.server || !state.server.configured) return 'token';
    return state.server.authenticated ? 'ready' : 'login';
  }

  /* ------------------------------------------------------------------ *
   * Wiring
   * ------------------------------------------------------------------ */
  function download(name, text, type) {
    var blob = new Blob([text], { type: type || 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = el('a', { href: url, download: name });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function wire() {
    $('#btn-download').addEventListener('click', function () {
      download('content.json', JSON.stringify(state.content, null, 2) + '\n');
      toast('Downloaded content.json — commit it to publish.');
    });

    $('#btn-import').addEventListener('click', function () { $('#file-import').click(); });
    $('#file-import').addEventListener('change', function (e) {
      var file = e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        try {
          state.content = JSON.parse(reader.result);
          markChanged(true); renderSidebar(); renderPreview();
          toast('Imported ' + file.name);
        } catch (err) { toast('That file is not valid JSON.', true); }
      };
      reader.readAsText(file);
      e.target.value = '';
    });

    $('#btn-revert').addEventListener('click', function () {
      if (!isDirty()) return toast('Nothing to discard.');
      if (!confirm('Discard all unpublished changes and go back to the live content?')) return;
      state.content = JSON.parse(JSON.stringify(state.published));
      try { localStorage.removeItem(DRAFT_KEY); } catch (e) {}
      renderSidebar(); renderEditor(); renderPreview(); updateState();
      toast('Reverted to published content.');
    });

    var dlg = $('#dlg-publish');

    function openPublish() {
      var panel = currentPanel();
      showPanel(panel);
      $('#gh-log').innerHTML = '';
      $('#gh-log').hidden = true;

      if (state.server && state.server.repo) {
        var r = state.server.repo;
        var label = r.owner + '/' + r.name + ' @ ' + r.branch;
        $('#ready-repo').textContent = label;
        $('#login-repo').textContent = label;
      }
      if (state.server && !state.server.configured) {
        $('#missing-vars').textContent =
          ' A publish server is deployed but these environment variables are not set: ' +
          state.server.missing.join(', ') + '. ' + (state.server.hint || '') +
          ' (The function can currently see ' +
          (state.server.diagnostics && state.server.diagnostics.envVarsVisible >= 0
            ? state.server.diagnostics.envVarsVisible
            : 'an unknown number of') +
          ' environment variables.) See the README.';
      }
      if (panel === 'token') {
        var r2 = state.content.repo || {};
        $('#dlg-repo').textContent = r2.owner + '/' + r2.name + ' @ ' + r2.branch;
        try {
          var saved = localStorage.getItem(TOKEN_KEY);
          if (saved) { $('#gh-token').value = saved; $('#gh-remember').checked = true; }
        } catch (e) {}
      }
      dlg.showModal();
      setTimeout(function () {
        var focusTarget = panel === 'login' ? $('#admin-password') : (panel === 'token' ? $('#gh-token') : null);
        if (focusTarget) focusTarget.focus();
      }, 50);
    }

    $('#btn-publish').addEventListener('click', openPublish);

    $('#btn-signout').addEventListener('click', async function () {
      try { await api('logout', {}); } catch (e) {}
      state.server.authenticated = false;
      showPanel('login');
      toast('Signed out.');
    });

    function afterPublish() {
      state.published = JSON.parse(JSON.stringify(state.content));
      try { localStorage.removeItem(DRAFT_KEY); } catch (e) {}
      updateState();
      toast('Published.');
      setTimeout(function () { dlg.close(); }, 1400);
    }

    $('#gh-go').addEventListener('click', async function () {
      var btn = this;
      var panel = currentPanel();

      /* Step one in server mode: exchange the password for a session cookie. */
      if (panel === 'login') {
        var pw = $('#admin-password').value;
        if (!pw) return toast('Enter your password.', true);
        btn.disabled = true; btn.textContent = 'Signing in…';
        try {
          await api('login', { password: pw });
          state.server.authenticated = true;
          $('#admin-password').value = '';
          showPanel('ready');
          toast('Signed in.');
        } catch (err) {
          toast(err.message, true);
        } finally {
          btn.disabled = false;
          btn.textContent = currentPanel() === 'login' ? 'Sign in' : 'Publish';
        }
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Publishing…';
      try {
        if (panel === 'ready') {
          await publishViaServer($('#gh-message').value.trim() || 'Update site content');
          afterPublish();
        } else {
          var token = $('#gh-token').value.trim();
          if (!token) { toast('Paste a GitHub token first.', true); return; }
          await publish(token, $('#gh-message-token').value.trim() || 'Update site content');
          try {
            if ($('#gh-remember').checked) localStorage.setItem(TOKEN_KEY, token);
            else localStorage.removeItem(TOKEN_KEY);
          } catch (e) {}
          afterPublish();
        }
      } catch (err) {
        /* An expired cookie should send you back to the password prompt. */
        if (state.server && /not signed in/i.test(err.message)) {
          state.server.authenticated = false;
          showPanel('login');
          toast('Your session expired — sign in again.', true);
        } else {
          ghLog('FAILED: ' + err.message, 'err');
          toast('Publish failed — see the log in the dialog.', true);
        }
      } finally {
        btn.disabled = false;
        btn.textContent = currentPanel() === 'login' ? 'Sign in' : 'Publish';
      }
    });

    $('#prev-page').addEventListener('change', function () {
      state.page = this.value;
      renderPreview();
    });

    document.querySelectorAll('.preview__widths button').forEach(function (b) {
      b.addEventListener('click', function () {
        document.querySelectorAll('.preview__widths button').forEach(function (o) {
          o.setAttribute('aria-pressed', String(o === b));
        });
        $('#stage').classList.toggle('is-mobile', b.dataset.w === 'mobile');
        fitPreview();
      });
    });

    window.addEventListener('resize', fitPreview);

    window.addEventListener('beforeunload', function (e) {
      if (isDirty()) { e.preventDefault(); e.returnValue = ''; }
    });
  }

  /* ------------------------------------------------------------------ *
   * Boot
   * ------------------------------------------------------------------ */
  fetch('content.json', { cache: 'no-store' })
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function (published) {
      state.published = published;
      state.content = JSON.parse(JSON.stringify(published));

      var restored = false;
      try {
        var draft = localStorage.getItem(DRAFT_KEY);
        if (draft) {
          var parsed = JSON.parse(draft);
          if (JSON.stringify(parsed) !== JSON.stringify(published)) {
            state.content = parsed;
            restored = true;
          }
        }
      } catch (e) { /* ignore a corrupt draft */ }

      return detectServer().then(function (server) {
        state.server = server;
        wire();
        renderSidebar();
        renderEditor();
        renderPreview();
        updateState();
        if (restored) toast('Restored your unpublished draft from this browser.');
      });
    })
    .catch(function (e) {
      $('#ed-title').textContent = 'Could not load content.json';
      $('#ed-sub').textContent =
        'The admin reads content.json from the same folder. Open this page over http:// (run "npm run serve") rather than from a file:// path. (' + e.message + ')';
      $('#state').textContent = 'error';
    });
})();
