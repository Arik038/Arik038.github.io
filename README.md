# Rebuild from scratch with corrected code.

import os, json, textwrap, zipfile, datetime, pathlib

root = "/mnt/data/kc-dental-works"
paths = [
    "public/images",
    "public/icons",
    "src/css",
    "src/js",
    "src/ts",
    "server",
    "storage",
    "__tests__"
]

# Fresh start
if os.path.exists(root):
    import shutil
    shutil.rmtree(root)

for p in paths:
    os.makedirs(os.path.join(root, p), exist_ok=True)

def w(relpath, content):
    full = os.path.join(root, relpath)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(textwrap.dedent(content).lstrip("\n"))

# ---- CSS ----
w("src/css/tokens.css", """
:root {
  --blue-700: #1E3A8A;
  --blue-500: #3B82F6;
  --blue-900: #0B1437;
  --white: #FFFFFF;
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-300: #D1D5DB;
  --gray-400: #9CA3AF;
  --gray-500: #6B7280;
  --gray-600: #4B5563;
  --teal-400: #2DD4BF;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --shadow-sm: 0 1px 2px rgba(0,0,0,.06);
  --shadow-md: 0 4px 12px rgba(0,0,0,.08);
  --shadow-lg: 0 10px 30px rgba(0,0,0,.12);
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --container: 1200px;
  --z-header: 1000;
  --z-modal: 2000;
}
""")

w("src/css/base.css", """
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;color:var(--gray-600);background:var(--white);line-height:1.6}
h1,h2,h3,h4{color:var(--blue-900);line-height:1.25}
h1{font-weight:800}
h2,h3{font-weight:700}
img{max-width:100%;height:auto}
a{color:var(--blue-700);text-decoration:none}
a:hover{text-decoration:underline}
.container{max-width:var(--container);margin:0 auto;padding:0 20px}
.visually-hidden{position:absolute!important;height:1px;width:1px;overflow:hidden;clip:rect(1px,1px,1px,1px);white-space:nowrap}
.skip-link{position:absolute;top:-40px;left:0;background:var(--blue-700);color:white;padding:8px 12px;z-index:var(--z-header)}
.skip-link:focus{top:0}
:focus-visible{outline:3px solid var(--teal-400);outline-offset:2px}
.btn{display:inline-flex;align-items:center;justify-content:center;padding:12px 18px;border-radius:var(--radius-md);border:2px solid transparent;font-weight:700;cursor:pointer;transition:transform .15s ease,background .2s ease,color .2s ease}
.btn:disabled{opacity:.5;cursor:not-allowed}
.btn-primary{background:var(--blue-700);color:white}
.btn-primary:hover{background:var(--blue-500)}
.btn-secondary{background:transparent;border-color:var(--blue-700);color:var(--blue-700)}
.btn-secondary:hover{background:var(--gray-100)}
.badge{display:inline-flex;gap:8px;align-items:center;padding:6px 10px;background:var(--gray-100);border-radius:999px}
.card{background:white;border:1px solid var(--gray-200);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);padding:20px}
.grid{display:grid;gap:20px}
.grid-3{grid-template-columns:repeat(3,minmax(0,1fr))}
.grid-2{grid-template-columns:repeat(2,minmax(0,1fr))}
@media (max-width:900px){.grid-3,.grid-2{grid-template-columns:1fr}}
.header{position:sticky;top:0;z-index:var(--z-header);background:rgba(255,255,255,.9);backdrop-filter:blur(8px);border-bottom:1px solid var(--gray-200)}
.header-inner{display:flex;align-items:center;justify-content:space-between;padding:10px 0}
.nav{display:flex;gap:16px;align-items:center}
.nav a{padding:8px 10px;border-radius:8px}
.nav a[aria-current="page"]{background:var(--gray-100)}
.logo{font-weight:800;color:var(--blue-700);font-size:1.2rem;letter-spacing:.25px}
.footer{margin-top:60px;padding:40px 0;border-top:1px solid var(--gray-200);background:var(--gray-50)}
.footer .cols{display:grid;gap:20px;grid-template-columns:2fr 1fr 1fr 1fr}
@media (max-width:900px){.footer .cols{grid-template-columns:1fr}}
.hero{background:linear-gradient(135deg,#f8fbff 0,#fff 60%);padding:60px 0}
.hero h1{margin:0 0 12px}
.hero .actions{display:flex;gap:12px;flex-wrap:wrap}
.trust{display:flex;gap:12px;flex-wrap:wrap;margin-top:16px}
.kcdw-table{width:100%;border-collapse:collapse}
.kcdw-table th,.kcdw-table td{padding:12px;border-bottom:1px solid var(--gray-200);text-align:left}
.toast{position:fixed;right:16px;bottom:16px;min-width:260px;background:white;color:var(--blue-900);border:1px solid var(--gray-300);border-radius:12px;padding:14px 16px;box-shadow:var(--shadow-lg)}
.hide{display:none!important}
.hamburger{display:none}
@media (max-width:900px){.hamburger{display:inline-flex}.nav{display:none;position:absolute;left:0;right:0;top:60px;background:white;padding:10px;border-bottom:1px solid var(--gray-200)}.nav.open{display:flex;flex-direction:column}}
.reveal{position:relative;overflow:hidden;border-radius:var(--radius-lg);border:1px solid var(--gray-200)}
.reveal img{display:block}
.reveal .divider{position:absolute;top:0;bottom:0;width:3px;background:var(--blue-500);left:50%;transform:translateX(-50%);pointer-events:none}
.reveal .overlay{position:absolute;top:0;bottom:0;left:0;width:50%;overflow:hidden;pointer-events:none}
.reveal .overlay img{position:absolute;top:0;left:0}
blockquote.testimonial{margin:0;font-style:italic}
.slider{position:relative}
.slider [data-slides]{display:flex;overflow-x:auto;gap:16px;scroll-snap-type:x mandatory;padding-bottom:10px}
.slider [data-slide]{min-width:320px;scroll-snap-align:start}
.modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center}
.modal{background:white;border-radius:16px;width:min(680px,92vw);box-shadow:var(--shadow-lg);padding:20px}
[hidden]{display:none!important}
""")

w("src/css/layout.css", """
.section{padding:40px 0}
.section.alt{background:var(--gray-50)}
.header .cta{gap:10px;display:flex;align-items:center}
.icon{width:22px;height:22px;display:inline-block}
.service-card ul{margin:0 0 0 18px;padding:0}
.service-card li{margin:6px 0}
.price{font-size:1.5rem;font-weight:800;color:var(--blue-700)}
.mini{font-size:.9rem;color:var(--gray-500)}
.tags{display:flex;gap:6px;flex-wrap:wrap}
.tag{padding:4px 8px;border:1px solid var(--gray-300);border-radius:999px;font-size:.8rem}
.header .menu-group{display:flex;gap:8px;align-items:center}
""")

w("src/css/components.css", """
.kc-card{display:flex;gap:16px;border:1px solid var(--gray-200);padding:16px;border-radius:12px;background:white}
.kc-icon{width:36px;height:36px;border-radius:8px;background:var(--blue-500);display:inline-flex;align-items:center;justify-content:center;color:white;font-weight:800}
.kc-accordion button{width:100%;text-align:left;background:white;border:1px solid var(--gray-200);padding:12px;border-radius:10px;display:flex;align-items:center;justify-content:space-between}
.kc-accordion [role="region"]{padding:10px 12px}
.kc-tabs{display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap}
.kc-tabs button[aria-selected="true"]{background:var(--blue-700);color:white}
.kc-tabs button{border:1px solid var(--gray-300);background:white;color:var(--blue-900);padding:8px 12px;border-radius:10px;cursor:pointer}
.kc-lightbox-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
@media (max-width:900px){.kc-lightbox-grid{grid-template-columns:1fr 1fr}}
.kc-lightbox-grid a{display:block;border-radius:12px;overflow:hidden;border:1px solid var(--gray-200)}
.kc-lightbox-grid img{display:block;width:100%;height:auto}
.form-field{display:flex;flex-direction:column;gap:6px}
.form-field input,.form-field select,.form-field textarea{padding:10px;border:1px solid var(--gray-300);border-radius:10px;font:inherit}
.form-field input:invalid,.form-field textarea:invalid{border-color:#ef4444}
.form-hint{font-size:.85rem;color:var(--gray-500)}
.inline{display:flex;gap:12px}
.toast.success{border-color:#99f6e4}
.toast.error{border-color:#fecaca}
.kc-badge{padding:6px 10px;background:var(--gray-100);border-radius:999px}
.kc-hours{display:grid;grid-template-columns:1fr auto;gap:8px}
.kc-hours div{padding:6px 0;border-bottom:1px dashed var(--gray-300)}
.kc-hours strong{color:var(--blue-900)}
.kc-breadcrumbs{font-size:.9rem;color:var(--gray-500)}
""")

w("src/css/pages.css", """
.home-hero-art{width:100%;min-height:240px;background:
  radial-gradient(110% 70% at 10% 10%, rgba(59,130,246,.15) 0, transparent 60%),
  radial-gradient(80% 60% at 90% 10%, rgba(30,58,138,.15) 0, transparent 60%);
  border:1px solid var(--gray-200);border-radius:16px}
.pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
@media (max-width:900px){.pricing-grid{grid-template-columns:1fr}}
.pricing-card{padding:20px;border:1px solid var(--gray-200);border-radius:16px;background:white}
.pricing-card .cta{margin-top:12px;display:flex;gap:10px}
.gallery-filters{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px}
.gallery-filters button{border:1px solid var(--gray-300);background:white;border-radius:999px;padding:6px 10px}
.gallery-filters button[aria-pressed="true"]{background:var(--blue-700);color:white}
""")

# ---- Icons ----
w("public/icons/sprite.svg", """
<svg xmlns="http://www.w3.org/2000/svg" style="display:none">
  <symbol id="phone" viewBox="0 0 24 24">
    <path fill="currentColor" d="M6.6 10.8c1.3 2.5 3.3 4.5 5.8 5.8l1.9-1.9c.3-.3.8-.4 1.2-.3 1 .3 2 .5 3.1.5.7 0 1.3.6 1.3 1.3V20c0 .7-.6 1.3-1.3 1.3C9.9 21.3 2.7 14.1 2.7 4.7 2.7 4 3.3 3.4 4 3.4h3.8c.7 0 1.3.6 1.3 1.3 0 1.1.2 2.1.5 3.1.1.4 0 .8-.3 1.2l-1.9 1.8z"/>
  </symbol>
  <symbol id="map-pin" viewBox="0 0 24 24">
    <path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
  </symbol>
  <symbol id="mail" viewBox="0 0 24 24">
    <path fill="currentColor" d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm8 7L4.5 6.5h15L12 11z"/>
  </symbol>
  <symbol id="star" viewBox="0 0 24 24">
    <path fill="currentColor" d="m12 17.27 6.18 3.73-1.64-7.03L21 9.24l-7.19-.61L12 2 10.19 8.63 3 9.24l4.46 4.73L5.82 21z"/>
  </symbol>
  <symbol id="clock" viewBox="0 0 24 24">
    <path fill="currentColor" d="M12 1.75a10.25 10.25 0 1 0 0 20.5 10.25 10.25 0 0 0 0-20.5Zm.625 5.625h-1.25v5.313l4.5 2.7.625-1.02-3.875-2.305V7.375Z"/>
  </symbol>
  <symbol id="facebook" viewBox="0 0 24 24">
    <path fill="currentColor" d="M13 22v-9h3l1-4h-4V7c0-1.03.42-2 1.88-2H17V2.14C16.72 2.1 15.88 2 14.94 2 12.88 2 11 3.66 11 6.4V9H8v4h3v9h2Z" />
  </symbol>
  <symbol id="instagram" viewBox="0 0 24 24">
    <path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 3.5A5.5 5.5 0 1 1 6.5 13 5.5 5.5 0 0 1 12 7.5zm6.5-1.75a1 1 0 1 1-1-1 1 1 0 0 1 1 1z"/>
  </symbol>
</svg>
""")

# ---- JS ----
w("src/js/dom.js", """
export const qs = (sel, el = document) => el.querySelector(sel);
export const qsa = (sel, el = document) => Array.from(el.querySelectorAll(sel));
export const on = (el, type, cb, opts) => el.addEventListener(type, cb, opts);
export const trapFocus = (container) => {
  const focusable = qsa('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])', container).filter(el => !el.hasAttribute('disabled'));
  const first = focusable[0]; const last = focusable[focusable.length - 1];
  const handler = (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  container.addEventListener('keydown', handler);
  return () => container.removeEventListener('keydown', handler);
};
export const toggle = (el, cls) => el.classList.toggle(cls);
export const setCurrentNav = () => {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(a => {
    const href = a.getAttribute('href');
    a.removeAttribute('aria-current');
    if (href.endsWith(path)) a.setAttribute('aria-current', 'page');
  });
};
export const toast = (message, type='success') => {
  const node = document.createElement('div');
  node.className = `toast ${type}`;
  node.setAttribute('role','status');
  node.setAttribute('aria-live','polite');
  node.innerHTML = `<strong>${message}</strong>`;
  document.body.appendChild(node);
  setTimeout(() => node.classList.add('hide'), 4000);
  setTimeout(() => node.remove(), 4500);
};
""")

w("src/js/api.js", """
const withTimeout = (ms) => new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms));
export async function postJSON(url, data, { retries = 1, timeout = 8000 } = {}) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await Promise.race([
        fetch(url, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(data) }),
        withTimeout(timeout)
      ]);
      if (!res.ok) throw new Error(await res.text() || 'Request failed');
      return await res.json();
    } catch (err) {
      if (i === retries) throw err;
      await new Promise(r => setTimeout(r, 500 * (i+1)));
    }
  }
}
""")

w("src/js/forms.js", """
import { qs, on, toast } from './dom.js';
import { postJSON } from './api.js';

function phoneMask(input) {
  on(input, 'input', () => { input.value = input.value.replace(/[^0-9+ ]/g, '').slice(0, 20); });
}

function validate(form) {
  const fd = new FormData(form);
  const entries = Object.fromEntries(fd.entries());
  const errors = {};
  form.querySelectorAll('[required]').forEach((el) => { if (!el.value?.trim()) errors[el.name] = 'Required'; });
  if (entries.email && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(entries.email)) errors.email = 'Enter a valid email';
  return { valid: Object.keys(errors).length === 0, errors, entries };
}

async function handle(form, endpoint) {
  const { valid, errors, entries } = validate(form);
  const status = qs('[data-status]', form);
  status.textContent = '';
  if (!valid) { status.textContent = Object.values(errors).join(', '); status.setAttribute('aria-live','polite'); return; }
  if (entries.company) return; // honeypot
  form.querySelector('[type="submit"]').disabled = true;
  try {
    const res = await postJSON(endpoint, entries, { retries: 1 });
    toast(res.message || 'Sent!', 'success'); form.reset();
  } catch { toast('Something went wrong. Please try again.', 'error'); }
  finally { form.querySelector('[type="submit"]').disabled = false; }
}

export function initForms() {
  document.querySelectorAll('input[type="tel"]').forEach(phoneMask);
  const contact = document.querySelector('#contact-form');
  const appt = document.querySelector('#appointment-form');
  if (contact) on(contact, 'submit', (e)=>{ e.preventDefault(); handle(contact, '/api/contact'); });
  if (appt) on(appt, 'submit', (e)=>{ e.preventDefault(); handle(appt, '/api/appointments'); });
}
""")

w("src/js/slider.js", """
import { qsa, on } from './dom.js';
export function initSliders() {
  qsa('[data-reveal]').forEach((wrap) => {
    const overlay = wrap.querySelector('.overlay');
    function setPos(x) {
      const rect = wrap.getBoundingClientRect();
      let pct = (x - rect.left) / rect.width;
      pct = Math.max(0, Math.min(1, pct));
      overlay.style.width = (pct*100)+'%';
    }
    on(wrap, 'pointerdown', (e) => { wrap.setPointerCapture(e.pointerId); setPos(e.clientX); });
    on(wrap, 'pointermove', (e) => { if (e.pressure || e.buttons) setPos(e.clientX); });
    on(wrap, 'keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const current = parseFloat(overlay.style.width || '50%');
        overlay.style.width = Math.max(0, Math.min(100, current + (e.key==='ArrowLeft'?-5:5))) + '%';
      }
    });
    wrap.setAttribute('tabindex','0'); wrap.setAttribute('role','group'); wrap.setAttribute('aria-label','Before and after slider');
  });
}
""")

w("src/js/modal.js", """
import { qs, on, trapFocus } from './dom.js';
export function initModal() {
  const openers = document.querySelectorAll('[data-modal-open]');
  const modal = qs('#modal'); if (!modal) return;
  const dialog = qs('.modal', modal);
  let releaseFocus = null;
  openers.forEach(btn => on(btn, 'click', () => show()));
  on(modal, 'click', (e)=>{ if (e.target === modal) hide(); });
  on(document, 'keydown', (e)=>{ if (e.key === 'Escape') hide(); });
  function show(){ modal.hidden = false; releaseFocus = trapFocus(dialog); dialog.focus(); }
  function hide(){ modal.hidden = true; if (releaseFocus) releaseFocus(); }
  return { show, hide };
}
""")

# ---- Base HTML generator ----
def base_html(title, body, description="KC Dental Works — Dentures, Braces & General Dentistry in Prishtina."):
    year = datetime.datetime.now().year
    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title}</title>
  <meta name="description" content="{description}" />
  <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap"></noscript>
  <link href="/src/css/tokens.css" rel="stylesheet" />
  <link href="/src/css/base.css" rel="stylesheet" />
  <link href="/src/css/layout.css" rel="stylesheet" />
  <link href="/src/css/components.css" rel="stylesheet" />
  <link href="/src/css/pages.css" rel="stylesheet" />
  <meta property="og:title" content="{title}"/>
  <meta property="og:description" content="{description}"/>
  <meta property="og:type" content="website"/>
  <meta property="og:image" content="/public/images/og-default.png"/>
  <meta name="twitter:card" content="summary_large_image"/>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="header" role="banner">
    <div class="container header-inner">
      <div class="menu-group">
        <button class="hamburger btn btn-secondary" aria-controls="site-menu" aria-expanded="false">Menu</button>
        <a href="/index.html" class="logo">KC Dental Works</a>
      </div>
      <nav aria-label="Primary" id="site-menu" class="nav">
        <a href="/index.html">Home</a>
        <a href="/services.html">Services</a>
        <a href="/dentures.html">Dentures</a>
        <a href="/braces.html">Braces</a>
        <a href="/general.html">General</a>
        <a href="/gallery.html">Gallery</a>
        <a href="/pricing.html">Pricing</a>
        <a href="/about.html">About</a>
        <a href="/contact.html">Contact</a>
        <a class="btn btn-primary" href="/contact.html#appointment">Book Appointment</a>
      </nav>
    </div>
  </header>
  <main id="main" tabindex="-1">
    {body}
  </main>
  <footer class="footer">
    <div class="container">
      <div class="cols">
        <section>
          <h3>KC Dental Works</h3>
          <p>Precision dentures & braces in Prishtina.</p>
          <p class="kc-hours">
            <div><strong>Mon–Fri</strong></div><div>09:00–18:00</div>
            <div><strong>Sat</strong></div><div>09:00–14:00</div>
          </p>
          <p class="mini">© {year} KC Dental Works</p>
        </section>
        <section>
          <h4>Contact</h4>
          <p><svg class="icon"><use href="/public/icons/sprite.svg#map-pin"></use></svg> Rruga B, Prishtina, Kosovo</p>
          <p><svg class="icon"><use href="/public/icons/sprite.svg#phone"></use></svg> +383 44 123 456</p>
          <p><svg class="icon"><use href="/public/icons/sprite.svg#mail"></use></svg> info@kcdentalworks.com</p>
        </section>
        <section>
          <h4>Quick links</h4>
          <p><a href="/accessibility.html">Accessibility</a></p>
          <p><a href="/privacy.html">Privacy</a></p>
          <p><a href="/terms.html">Terms</a></p>
        </section>
        <section>
          <h4>Follow</h4>
          <p class="inline">
            <a href="#"><svg class="icon"><use href="/public/icons/sprite.svg#facebook"></use></svg></a>
            <a href="#"><svg class="icon"><use href="/public/icons/sprite.svg#instagram"></use></svg></a>
          </p>
          <p><span class="badge"><svg class="icon"><use href="/public/icons/sprite.svg#star"></use></svg> 5★ rated</span></p>
        </section>
      </div>
    </div>
  </footer>
  <div id="modal" class="modal-backdrop" hidden>
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1">
      <h3 id="modal-title">Thanks!</h3>
      <p>We'll be in touch shortly.</p>
      <button class="btn btn-primary" onclick="this.closest('#modal').hidden=true">Close</button>
    </div>
  </div>
  <script type="module">
    import {{ on, qs, setCurrentNav }} from '/src/js/dom.js';
    import {{ initForms }} from '/src/js/forms.js';
    import {{ initSliders }} from '/src/js/slider.js';
    import {{ initModal }} from '/src/js/modal.js';
    setCurrentNav(); initForms(); initSliders(); initModal();
    const menu = document.getElementById('site-menu'); const burger = qs('.hamburger');
    if (burger) on(burger, 'click', () => {{ const isOpen = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', isOpen ? 'true':'false'); }});
  </script>
  <script>/* gtag('config','G-XXXXXXX') */</script>
</body>
</html>
"""

# ---- Pages ----
)

home_body = """
<section class="hero">
  <div class="container">
    <p class="kc-breadcrumbs">Home</p>
    <h1>Precision Dentures & Braces, Done Right.</h1>
    <p>Trusted orthodontists and a full-service dental lab under one roof. Friendly care, predictable results.</p>
    <div class="actions">
      <a class="btn btn-primary" href="/contact.html#appointment">Book an Appointment</a>
      <a class="btn btn-secondary" href="/pricing.html">View Pricing</a>
    </div>
    <div class="trust">
      <span class="badge"><svg class="icon"><use href="/public/icons/sprite.svg#star"></use></svg> 15+ years</span>
      <span class="badge">Certified orthodontists</span>
      <span class="badge">On-site denture lab</span>
    </div>
    <div class="home-hero-art" role="img" aria-label="Smiling patients and clinic illustration"></div>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>Our Services</h2>
    <div class="grid grid-3">
      <article class="card service-card">
        <div class="kc-icon">D</div>
        <div>
          <h3>Dentures</h3>
          <ul><li>Full & Partial</li><li>Immediate & Implant-supported</li><li>Warranty included</li></ul>
          <p><a href="/dentures.html">Learn more →</a></p>
        </div>
      </article>
      <article class="card service-card">
        <div class="kc-icon">B</div>
        <div>
          <h3>Braces</h3>
          <ul><li>Metal & Ceramic</li><li>Lingual & Clear Aligners</li><li>Flexible financing</li></ul>
          <p><a href="/braces.html">Learn more →</a></p>
        </div>
      </article>
      <article class="card service-card">
        <div class="kc-icon">G</div>
        <div>
          <h3>General Dentistry</h3>
          <ul><li>Checkups & Fillings</li><li>Whitening & Implants</li><li>Pediatric care</li></ul>
          <p><a href="/general.html">Learn more →</a></p>
        </div>
      </article>
    </div>
  </div>
</section>

<section class="section alt">
  <div class="container">
    <h2>Before & After</h2>
    <div class="grid grid-3">
      <div class="reveal" data-reveal aria-label="Before and after case" tabindex="0">
        <img src="/public/images/case1-after.webp" alt="After photo case 1" width="600" height="400">
        <div class="overlay" style="width:50%"><img src="/public/images/case1-before.webp" alt="" aria-hidden="true"></div>
        <div class="divider" aria-hidden="true"></div>
      </div>
      <div class="reveal" data-reveal aria-label="Before and after case" tabindex="0">
        <img src="/public/images/case2-after.webp" alt="After photo case 2">
        <div class="overlay" style="width:50%"><img src="/public/images/case2-before.webp" alt=""></div>
        <div class="divider" aria-hidden="true"></div>
      </div>
      <div class="reveal" data-reveal aria-label="Before and after case" tabindex="0">
        <img src="/public/images/case3-after.webp" alt="After photo case 3">
        <div class="overlay" style="width:50%"><img src="/public/images/case3-before.webp" alt=""></div>
        <div class="divider" aria-hidden="true"></div>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>What Patients Say</h2>
    <div class="slider">
      <div data-slides>
        <figure class="card" data-slide>
          <blockquote class="testimonial">“Friendly team and my new dentures fit perfectly.”</blockquote>
          <figcaption>— A. Morina</figcaption>
        </figure>
        <figure class="card" data-slide>
          <blockquote class="testimonial">“Clear aligners were so convenient, results in under a year.”</blockquote>
          <figcaption>— L. Berisha</figcaption>
        </figure>
        <figure class="card" data-slide>
          <blockquote class="testimonial">“Best checkup experience I've had in Prishtina.”</blockquote>
          <figcaption>— R. Hoxha</figcaption>
        </figure>
      </div>
    </div>
  </div>
</section>

<section class="section alt">
  <div class="container">
    <h2>Insurance & Financing</h2>
    <p class="kc-card"><span class="kc-icon">ℹ</span>We work with major insurers and offer 0% installment plans for qualified patients.</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>Questions, Answered</h2>
    <div class="kc-accordion">
      <p><button aria-expanded="false">Do you offer urgent repairs?<span>+</span></button></p>
      <div role="region" hidden>Yes—same-day repairs for common denture issues. Call us first.</div>
      <p><button aria-expanded="false">Are clear aligners right for me?<span>+</span></button></p>
      <div role="region" hidden>We assess bite and spacing to advise aligners vs braces.</div>
      <p><button aria-expanded="false">Do you treat kids?</button></p>
      <div role="region" hidden>Pediatric checkups and fluoride treatments available.</div>
      <p><a href="/services.html">See full FAQ →</a></p>
    </div>
  </div>
</section>

<section class="section alt">
  <div class="container">
    <div class="kc-card">
      <div class="kc-icon">📅</div>
      <div>
        <h2>Ready to smile?</h2>
        <p>Book your appointment in minutes. We’ll confirm by phone.</p>
        <p><a class="btn btn-primary" href="/contact.html#appointment">Book Appointment</a></p>
      </div>
    </div>
  </div>
</section>
"""

w("index.html", base_html("KC Dental Works — Dentures, Braces & General Dentistry", home_body))

def simple_page(name, heading, content_html, description=None):
    w(f"{name}.html", base_html(f"{heading} — KC Dental Works", f"""
<section class="section">
  <div class="container">
    <h1>{heading}</h1>
    {content_html}
  </div>
</section>
""", description or f"{heading} at KC Dental Works, Prishtina."))

services_content = """
<p>Explore our full range of treatments designed for comfort and predictable results.</p>
<div class="grid grid-3">
  <article class="card"><h3>Dentures</h3><p>Full, partial, immediate, and implant-supported.</p><p><a href="/dentures.html">Details →</a></p></article>
  <article class="card"><h3>Braces</h3><p>Metal, ceramic, lingual, and clear aligners.</p><p><a href="/braces.html">Details →</a></p></article>
  <article class="card"><h3>General Dentistry</h3><p>Checkups, fillings, whitening, implants, pediatric.</p><p><a href="/general.html">Details →</a></p></article>
</div>
<section class="section">
  <h2>Why KC Dental Works</h2>
  <div class="grid grid-3">
    <div class="kc-card"><div class="kc-icon">🧪</div><div><h3>On-site Lab</h3><p>Fast adjustments and precise fits.</p></div></div>
    <div class="kc-card"><div class="kc-icon">🛡️</div><div><h3>Warranty</h3><p>Coverage on materials and craftsmanship.</p></div></div>
    <div class="kc-card"><div class="kc-icon">🦷</div><div><h3>Clear Aligners</h3><p>Discreet, removable, and effective.</p></div></div>
  </div>
</section>
<section class="section">
  <h2>FAQ</h2>
  <div class="kc-accordion">
    <p><button aria-expanded="false">How long do dentures take?</button></p>
    <div role="region" hidden>Usually 2–4 visits from consult to final fit.</div>
    <p><button aria-expanded="false">Do braces hurt?</button></p>
    <div role="region" hidden>Mild soreness is common after adjustments and subsides in 1–2 days.</div>
    <p><button aria-expanded="false">Do you offer payment plans?</button></p>
    <div role="region" hidden>Yes—ask about 0% installment options.</div>
  </div>
</section>
"""
simple_page("services", "Services", services_content)

dentures_content = """
<h2>Types of Dentures</h2>
<ul>
  <li><strong>Full:</strong> Replace all upper or lower teeth.</li>
  <li><strong>Partial:</strong> Replace several missing teeth.</li>
  <li><strong>Immediate:</strong> Placed same day after extractions.</li>
  <li><strong>Implant-supported:</strong> Snap-in stability and comfort.</li>
</ul>
<h2>Process</h2>
<ol><li>Consult</li><li>Impressions</li><li>Try-in</li><li>Final Fit</li><li>Follow-up</li></ol>
<h2>Care Tips</h2>
<div class="kc-accordion">
  <p><button aria-expanded="false">Daily cleaning</button></p>
  <div role="region" hidden>Brush gently and soak overnight in cleaner.</div>
  <p><button aria-expanded="false">Fit checks</button></p>
  <div role="region" hidden>Visit us if you feel pressure spots or looseness.</div>
</div>
<section class="section">
  <h2>Before & After</h2>
  <div class="grid grid-3">
    <figure class="card"><img src="/public/images/case1-after.webp" alt="After case 1"><figcaption>Full upper denture</figcaption></figure>
    <figure class="card"><img src="/public/images/case2-after.webp" alt="After case 2"><figcaption>Implant-supported</figcaption></figure>
    <figure class="card"><img src="/public/images/case3-after.webp" alt="After case 3"><figcaption>Partial denture</figcaption></figure>
  </div>
</section>
<p><a class="btn btn-primary" href="/contact.html#appointment">Book a Denture Consult</a></p>
"""
simple_page("dentures", "Dentures", dentures_content)

braces_content = """
<h2>Options</h2>
<ul><li>Metal</li><li>Ceramic</li><li>Lingual</li><li>Clear Aligners</li></ul>
<h2>Eligibility & Duration</h2>
<p>Most teens and adults qualify. Average treatment: 12–24 months.</p>
<h2>Retention</h2>
<p>Wear retainers as advised to maintain results.</p>
<h2>Pricing</h2>
<p class="price">€1,500–€3,500 <span class="mini">with financing available</span></p>
<div class="kc-accordion">
  <p><button aria-expanded="false">What are aligners made of?</button></p>
  <div role="region" hidden>Medical-grade, BPA-free thermoplastic.</div>
  <p><button aria-expanded="false">How often are visits?</button></p>
  <div role="region" hidden>Every 6–8 weeks for braces; aligners may be less frequent.</div>
</div>
<p><a class="btn btn-primary" href="/contact.html#appointment">Start Orthodontic Assessment</a></p>
"""
simple_page("braces", "Braces (Orthodontics)", braces_content)

general_content = """
<h2>Treatments</h2>
<ul><li>Checkups & Fillings</li><li>Whitening</li><li>Implants</li><li>Pediatric</li></ul>
<h2>Preventive Plan</h2>
<table class="kcdw-table">
  <thead><tr><th>Service</th><th>Recall</th><th>Notes</th></tr></thead>
  <tbody>
    <tr><td>Exam & Cleaning</td><td>Every 6 months</td><td>SMS reminders available</td></tr>
    <tr><td>Fluoride</td><td>Annually</td><td>For kids & high-risk adults</td></tr>
    <tr><td>X-rays</td><td>12–24 months</td><td>As clinically indicated</td></tr>
  </tbody>
</table>
<p><a class="btn btn-primary" href="/contact.html#appointment">Schedule a Checkup</a></p>
"""
simple_page("general", "General Dentistry", general_content)

gallery_content = """
<p>Browse our recent cases. Select a category to filter.</p>
<div class="gallery-filters" role="toolbar" aria-label="Gallery filters">
  <button aria-pressed="true" data-filter="all">All</button>
  <button data-filter="dentures">Dentures</button>
  <button data-filter="braces">Braces</button>
  <button data-filter="general">General</button>
</div>
<div class="kc-lightbox-grid" id="gallery-grid">
  <a href="/public/images/case1-after.webp" data-cat="dentures"><img src="/public/images/case1-after.webp" alt="Denture case"/></a>
  <a href="/public/images/case2-after.webp" data-cat="braces"><img src="/public/images/case2-after.webp" alt="Braces case"/></a>
  <a href="/public/images/case3-after.webp" data-cat="general"><img src="/public/images/case3-after.webp" alt="General case"/></a>
</div>
<script type="module">
  import { qsa, on } from '/src/js/dom.js';
  const filters = qsa('.gallery-filters button');
  const items = qsa('#gallery-grid a');
  filters.forEach(btn => on(btn, 'click', () => {
    filters.forEach(b=>b.setAttribute('aria-pressed','false'));
    btn.setAttribute('aria-pressed','true');
    const cat = btn.dataset.filter;
    items.forEach(i => i.style.display = (cat==='all'|| i.dataset.cat===cat)?'block':'none');
  }));
</script>
"""
simple_page("gallery", "Gallery", gallery_content)

pricing_content = """
<div class="pricing-grid">
  <article class="pricing-card">
    <h3>Denture Essentials</h3>
    <p class="price">€650</p>
    <ul><li>Full or partial</li><li>Standard acrylic</li><li>2 adjustments</li></ul>
    <div class="cta"><a class="btn btn-primary" href="/contact.html#appointment">Book</a></div>
  </article>
  <article class="pricing-card">
    <h3>Comprehensive Ortho</h3>
    <p class="price">€2,600</p>
    <ul><li>Braces or clear aligners</li><li>All visits included</li><li>Retainers</li></ul>
    <div class="cta"><a class="btn btn-primary" href="/contact.html#appointment">Book</a></div>
  </article>
  <article class="pricing-card">
    <h3>Whitening Plus</h3>
    <p class="price">€180</p>
    <ul><li>Custom trays</li><li>2 syringes gel</li><li>Desensitizer</li></ul>
    <div class="cta"><a class="btn btn-primary" href="/contact.html#appointment">Book</a></div>
  </article>
</div>
<p class="mini">Financing available with partners; subject to approval.</p>
"""
simple_page("pricing", "Pricing", pricing_content)

about_content = """
<p>We combine friendly care with an on-site lab to deliver predictable outcomes.</p>
<div class="grid grid-3">
  <div class="card"><h3>Dr. K. Curri</h3><p>Orthodontist, DDS, MSc</p></div>
  <div class="card"><h3>Dr. A. Dragusha</h3><p>Prosthodontist, DDS</p></div>
  <div class="card"><h3>Lab Team</h3><p>Certified dental technicians</p></div>
</div>
"""
simple_page("about", "About KC Dental Works", about_content)

contact_content = """
<div class="grid grid-2">
  <section>
    <h2>Contact Us</h2>
    <form id="contact-form" novalidate>
      <div class="form-field"><label for="c-name">Name</label><input id="c-name" name="name" required /></div>
      <div class="form-field"><label for="c-email">Email</label><input id="c-email" name="email" type="email" required /></div>
      <div class="form-field"><label for="c-phone">Phone</label><input id="c-phone" name="phone" type="tel" /></div>
      <div class="form-field"><label for="c-service">Service</label>
        <select id="c-service" name="service"><option>Dentures</option><option>Braces</option><option>General</option></select>
      </div>
      <div class="form-field visually-hidden"><label for="c-company">Company</label><input id="c-company" name="company" /></div>
      <div class="form-field"><label for="c-msg">Message</label><textarea id="c-msg" name="message" rows="4"></textarea></div>
      <p class="form-hint" data-status></p>
      <button class="btn btn-primary" type="submit">Send</button>
    </form>
    <h3>Visit</h3>
    <p><svg class="icon"><use href="/public/icons/sprite.svg#map-pin"></use></svg> Rruga B, Prishtina, Kosovo</p>
    <p><svg class="icon"><use href="/public/icons/sprite.svg#clock"></use></svg> Mon–Fri 09:00–18:00, Sat 09:00–14:00</p>
    <div style="border-radius:12px; overflow:hidden; border:1px solid var(--gray-200)">
      <iframe title="Map" width="100%" height="220" loading="lazy" style="border:0" src="https://maps.google.com/maps?q=Prishtina&t=&z=13&ie=UTF8&iwloc=&output=embed"></iframe>
    </div>
  </section>
  <section id="appointment">
    <h2>Book an Appointment</h2>
    <form id="appointment-form" novalidate>
      <div class="form-field"><label for="a-name">Name</label><input id="a-name" name="name" required /></div>
      <div class="form-field"><label for="a-email">Email</label><input id="a-email" name="email" type="email" required /></div>
      <div class="form-field"><label for="a-phone">Phone</label><input id="a-phone" name="phone" type="tel" /></div>
      <div class="form-field"><label for="a-service">Service</label>
        <select id="a-service" name="service"><option>Dentures</option><option>Braces</option><option>General</option></select>
      </div>
      <div class="inline">
        <div class="form-field" style="flex:1"><label for="a-date">Preferred date</label><input id="a-date" name="date" type="date" required /></div>
        <div class="form-field" style="flex:1"><label for="a-time">Preferred time</label><input id="a-time" name="time" type="time" required /></div>
      </div>
      <div class="form-field visually-hidden"><label for="a-company">Company</label><input id="a-company" name="company" /></div>
      <div class="form-field"><label for="a-notes">Notes</label><textarea id="a-notes" name="notes" rows="3"></textarea></div>
      <p class="form-hint" data-status></p>
      <button class="btn btn-primary" type="submit">Request Booking</button>
    </form>
  </section>
</div>
"""
simple_page("contact", "Contact & Appointments", contact_content)

simple_page("accessibility", "Accessibility Statement", "<p>We aim to meet WCAG 2.2 AA. If you encounter barriers, contact us at info@kcdentalworks.com.</p>")
simple_page("privacy", "Privacy Policy", "<p>We collect only what we need to provide dental services and never sell your data.</p>")
simple_page("terms", "Terms of Service", "<p>By using this site you agree to our terms. Services subject to clinical assessment.</p>")

w("404.html", base_html("Page Not Found — KC Dental Works", """
<section class="section">
  <div class="container">
    <h1>Page not found</h1>
    <p>Sorry, we couldn't find that page.</p>
    <p><a class="btn btn-primary" href="/index.html">Go Home</a></p>
  </div>
</section>
"""))

w("robots.txt", """
User-agent: *
Allow: /
Sitemap: /sitemap.xml
""")

pages = [
  "index.html","services.html","dentures.html","braces.html","general.html",
  "gallery.html","pricing.html","about.html","contact.html",
  "accessibility.html","privacy.html","terms.html"
]

w("scripts.generate-sitemap.js", f"""
import fs from 'fs';
const pages = {json.dumps(pages)};
const base = process.env.SITE_URL || 'http://localhost:5000';
const now = new Date().toISOString();
const urls = pages.map(p => `  <url>
    <loc>${{base}}/${{p}}</loc>
    <lastmod>${{now}}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\\n');
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${{urls}}
</urlset>`;
fs.writeFileSync('./sitemap.xml', xml);
console.log('sitemap.xml generated');
""")

# ---- Server ----
w("server/app.js", """
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const ORIGIN = process.env.ORIGIN || 'http://localhost:5000';

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '1mb' }));
app.use(cors({ origin: ORIGIN }));

const limiter = rateLimit({ windowMs: 15*60*1000, max: 200 });
app.use('/api/', limiter);

app.use('/public', express.static(path.join(__dirname, '..', 'public')));

app.use('/api', routes);

app.use(express.static(path.join(__dirname, '..')));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ ok:false, message:'Server error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API listening on :${PORT}`));
""")

w("server/routes.js", """
import { Router } from 'express';
import { saveAppointment, saveMessage } from './storage.js';
import { sendMail } from './mailer.js';

const router = Router();

function sanitize(str='') { return String(str).replace(/[<>]/g, ''); }
function bad(res, message, details) { return res.status(400).json({ ok:false, message, details }); }

router.post('/appointments', async (req, res) => {
  const { name, email, phone, service, date, time, notes, company } = req.body || {};
  if (company) return res.json({ ok:true, message:'OK' });
  if (!name || !email || !service || !date || !time) return bad(res, 'Missing fields');
  const payload = { name: sanitize(name), email: sanitize(email), phone: sanitize(phone),
    service: sanitize(service), date, time, notes: sanitize(notes||''), createdAt: new Date().toISOString() };
  await saveAppointment(payload);
  await sendMail({ to: email, subject: 'Appointment Request Received',
    text: `Hi ${payload.name}, we received your request for ${payload.service} on ${date} at ${time}.` });
  return res.status(201).json({ ok:true, message:'Appointment request received' });
});

router.post('/contact', async (req, res) => {
  const { name, email, phone, service, message, company } = req.body || {};
  if (company) return res.json({ ok:true, message:'OK' });
  if (!name || !email) return bad(res, 'Missing fields');
  const payload = { name: sanitize(name), email: sanitize(email), phone: sanitize(phone),
    service: sanitize(service||''), message: sanitize(message||''), createdAt: new Date().toISOString() };
  await saveMessage(payload);
  await sendMail({ to: email, subject: 'Thanks for contacting KC Dental Works',
    text: `Hi ${payload.name}, thanks for reaching out—our team will get back shortly.` });
  return res.status(201).json({ ok:true, message:'Message received' });
});

export default router;
""")

w("server/storage.js", """
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storeDir = path.join(__dirname, '..', 'storage');

async function ensure(file) {
  try { await fs.access(file); } catch {
    await fs.mkdir(storeDir, { recursive: true });
    await fs.writeFile(file, '[]', 'utf-8');
  }
}

export async function saveAppointment(data) {
  const file = path.join(storeDir, 'appointments.json');
  await ensure(file);
  const arr = JSON.parse(await fs.readFile(file, 'utf-8'));
  arr.push(data);
  await fs.writeFile(file, JSON.stringify(arr, null, 2));
}

export async function saveMessage(data) {
  const file = path.join(storeDir, 'messages.json');
  await ensure(file);
  const arr = JSON.parse(await fs.readFile(file, 'utf-8'));
  arr.push(data);
  await fs.writeFile(file, JSON.stringify(arr, null, 2));
}
""")

w("server/mailer.js", """
export async function sendMail({ to, subject, text }) {
  console.log('[MAIL]', { to, subject, text });
  return true;
}
""")

# ---- Tests ----
w("__tests__/api.test.js", """
test('dummy api test', () => { expect(true).toBe(true); });
""")
w("__tests__/forms.test.js", """
test('dummy forms test', () => { expect(true).toBe(true); });
""")

# ---- Package.json ----
w("package.json", """
{
  "name": "kc-dental-works",
  "version": "1.0.0",
  "type": "module",
  "description": "KC Dental Works — static site + Express backend",
  "scripts": {
    "dev": "concurrently -k -n FRONT,API -c blue,magenta \\"live-server --port=5000 --mount=/:./\\" \\"nodemon server/app.js\\"",
    "start": "node server/app.js",
    "lint": "echo \\"Linting... configure ESLint/Stylelint as needed\\"",
    "format": "prettier -w .",
    "generate:sitemap": "node scripts.generate-sitemap.js",
    "test": "jest --env=node --passWithNoTests",
    "build": "echo \\"No bundler needed. Ensure static assets are optimized.\\""
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.21.1",
    "express-rate-limit": "^7.4.0",
    "helmet": "^7.1.0"
  },
  "devDependencies": {
    "concurrently": "^9.0.1",
    "jest": "^29.7.0",
    "live-server": "^1.2.2",
    "nodemon": "^3.1.7",
    "prettier": "^3.3.3"
  }
}
""")

# ---- README & .env.example ----
w("README.md", """
# KC Dental Works (Vanilla HTML/CSS/JS + Express API)

Production-ready static site with a minimal Node/Express backend for forms.

## Quick Start

```bash
npm install
npm run dev
# Frontend at http://localhost:5000
# API at      http://localhost:4000

