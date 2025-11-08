# Arik038.github.io
# 0) Project Inputs (fill before generating)

* **Company name:** `<COMPANY_NAME>`
* **Tagline:** `<Short value prop; e.g., “We detect threats before they do.”>`
* **Primary audience:** `<SMBs, Enterprises, SaaS, Fintech, Healthcare, Gov>`
* **Primary services:** `<Pen-Testing, vCISO, Incident Response, MDR/XDR, Secure SDLC, Cloud Security>`
* **Brand style:** `<Dark mode first / neon accents / minimal / corporate>`
* **Color tokens (HEX):** `--brand: #00E5FF; --ink: #E6F7FF; --bg: #0B1220; --accent: #7C4DFF`
* **Tone of voice:** `<calm, expert, trustworthy>`
* **Regions & languages:** `<en-US, sq-AL, de-DE, …>`
* **Contact endpoints:** `<contact@company.tld, +383…>`

---

# 1) Monorepo & Tech Stack

**Stack choices (consistent):** React + TypeScript (strict) + Tailwind (utility-first) + Vite. PWA enabled. WASM (Rust→wasm-bindgen) for crypto demos. Minimal backend with **Fastify (TS)** + **PostgreSQL (Prisma)** + **Redis** for rate-limits/queues. Content in **MDX**. CI via **GitHub Actions**. Docker Compose for local dev.

```txt
.
├─ package.json                # workspace root (pnpm)
├─ pnpm-workspace.yaml
├─ turbo.json                  # optional: Turborepo
├─ .editorconfig  .prettierrc  .eslintrc.cjs  .stylelintrc.cjs
├─ docker-compose.yml          # Postgres + Redis + Mailhog (optional)
├─ .github/workflows/ci.yml
├─ packages/
│  ├─ ui/                      # shared UI (React components, tokens)
│  ├─ wasm-crypto/             # Rust crate, compiled to WASM
│  └─ config/                  # eslint, ts, tailwind, csp helpers
├─ apps/
│  ├─ web/                     # Vite React app (PWA)
│  │  ├─ index.html
│  │  ├─ vite.config.ts
│  │  ├─ src/
│  │  │  ├─ main.tsx
│  │  │  ├─ app.tsx
│  │  │  ├─ routes/            # Home, Services, Threat Scanner, Learning, ...
│  │  │  ├─ components/        # Nav, Footer, Card, Tabs, Meter, Quiz, Modal
│  │  │  ├─ hooks/ utils/
│  │  │  ├─ i18n/              # JSON resource files; Intl helpers
│  │  │  ├─ styles/            # tailwind.css + tokens.css
│  │  │  ├─ sw.ts              # service worker (build → sw.js)
│  │  │  └─ csp.ts             # runtime CSP nonce helpers for inline-critical styles only
│  │  └─ public/               # icons, manifest.webmanifest, robots.txt, sitemap.xml
│  └─ functions/               # Fastify API (serverless or Node process)
│     ├─ src/server.ts         # creates fastify instance
│     ├─ src/routes/contact.ts # /contact
│     ├─ src/plugins/security.ts
│     ├─ src/plugins/rate.ts
│     ├─ src/db/prisma.ts
│     └─ prisma/schema.prisma
└─ README.md
```

**Why React over Web Components?** Rich client features (WASM demos, quizzes, search, charts) + strong ecosystem for a11y/testing. You can replace with Web Components if you prefer; APIs below remain similar.

---

# 2) Frontend Essentials

## 2.1 index.html (semantic head, preload, strict CSP-friendly)

```html
<!doctype html>
<html lang="en" class="no-js" data-theme="dark">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title><COMPANY_NAME> — <TAGLINE></title>
    <meta name="description" content="<Calm, expert cybersecurity services. Pen-testing, vCISO, IR, Cloud Security.>">

    <!-- Preload fonts (self-hosted); ensure font-display: swap -->
    <link rel="preload" href="/fonts/Inter-Variable.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/JetBrainsMono-Variable.woff2" as="font" type="font/woff2" crossorigin />

    <link rel="manifest" href="/manifest.webmanifest" />
    <meta name="theme-color" content="#0B1220" />

    <!-- No inline JS. Critical CSS can be inlined with a build step or a hashed <style> that matches CSP. -->
    <link rel="stylesheet" href="/styles/tokens.css" />
    <link rel="stylesheet" href="/styles/tailwind.css" />
  </head>
  <body class="min-h-screen bg-bg text-ink">
    <a href="#content" class="sr-only focus:not-sr-only focus:absolute focus:p-2 focus:bg-black/70">Skip to content</a>
    <div id="root" role="main"></div>
    <!-- Vite will inject module scripts; ensure CSP allows 'self' and 'wasm-unsafe-eval' is NOT used. -->
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## 2.2 Tailwind + tokens

**`/apps/web/src/styles/tokens.css`**

```css
:root {
  --brand: #00e5ff;
  --ink: #e6f7ff;
  --bg: #0b1220;
  --accent: #7c4dff;
}
:root[data-theme="light"] {
  --bg: #f7fbff;
  --ink: #0e1726;
}
```

**`/apps/web/tailwind.config.ts`**

```ts
import type { Config } from 'tailwindcss'
export default {
  content: ['index.html', 'src/**/*.{ts,tsx,mdx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: { brand: 'var(--brand)', ink: 'var(--ink)', bg: 'var(--bg)', accent: 'var(--accent)' },
      borderRadius: { xl: '1rem', '2xl': '1.25rem' },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
} satisfies Config
```

## 2.3 App bootstrap (theme, routing, keyboard shortcuts)

**`/apps/web/src/main.tsx`**

```tsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './app'
import Home from './routes/home'
import Services from './routes/services'
import ThreatScanner from './routes/threat-scanner'
import Learning from './routes/learning'
import CaseStudies from './routes/case-studies'
import Pricing from './routes/pricing'
import About from './routes/about'
import Trust from './routes/trust'
import Contact from './routes/contact'
import Status from './routes/status'
import NotFound from './routes/404'
import './styles/tailwind.css'

const router = createBrowserRouter([
  { path: '/', element: <App />, children: [
    { index: true, element: <Home /> },
    { path: 'services', element: <Services /> },
    { path: 'threat-scanner', element: <ThreatScanner /> },
    { path: 'learning', element: <Learning /> },
    { path: 'case-studies', element: <CaseStudies /> },
    { path: 'pricing', element: <Pricing /> },
    { path: 'about', element: <About /> },
    { path: 'trust', element: <Trust /> },
    { path: 'contact', element: <Contact /> },
    { path: 'status', element: <Status /> },
    { path: '*', element: <NotFound /> },
  ]},
])

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)

// PWA install
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
  })
}
```

**`/apps/web/src/app.tsx`** (theme + shortcuts)

```tsx
import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Nav } from './components/nav'
import { Footer } from './components/footer'

export default function App() {
  const navigate = useNavigate()

  useEffect(() => {
    // Theme
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    document.documentElement.dataset.theme = (stored as 'dark'|'light') || (prefersDark ? 'dark' : 'light')

    // Keyboard shortcuts
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === '/' || (e.key === 'k' && (e.ctrlKey || e.metaKey))) && !('tagName' in (e.target as any) && /input|textarea/i.test((e.target as any).tagName))) {
        e.preventDefault(); (document.getElementById('site-search') as HTMLInputElement)?.focus()
      }
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault(); document.getElementById('kbd-sheet')?.classList.remove('hidden')
      }
      if ((e.key === 's' && e.ctrlKey && !e.shiftKey) || (e.key === 's' && e.altKey && e.key.toLowerCase() === 'g')) {
        // ctrl+s reserved; keep example simple.
      }
      if (e.key === 's' && e.metaKey) navigate('/services')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])

  return (
    <div className="min-h-screen grid grid-rows-[auto,1fr,auto]">
      <Nav />
      <main id="content" className="px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
```

## 2.4 Accessible CTA button (HTML)

```html
<button
  class="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 font-medium text-black hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand disabled:opacity-60"
  aria-live="polite"
  aria-busy="false"
  data-cta="talk-to-expert"
>
  <span>Talk to an Expert</span>
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
</button>
<!-- Security note: never inject untrusted HTML into the button label. -->
```

## 2.5 Hero animation (Canvas; pauses on hidden)

**`/apps/web/src/components/hero-net.tsx`** (minimal, GPU‑friendly)

```tsx
import React, { useEffect, useRef } from 'react'

export function HeroNet() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current!
    const ctx = c.getContext('2d', { alpha: true })!
    let raf = 0, running = true
    const DPR = Math.min(window.devicePixelRatio || 1, 2)

    function resize(){ c.width = c.clientWidth*DPR; c.height = c.clientHeight*DPR }
    resize(); window.addEventListener('resize', resize)

    const nodes = Array.from({ length: 60 }, () => ({ x: Math.random(), y: Math.random(), vx: (Math.random()-0.5)/400, vy:(Math.random()-0.5)/400 }))

    const loop = () => {
      if (!running) return
      ctx.clearRect(0,0,c.width,c.height)
      const w=c.width, h=c.height
      for (const n of nodes) {
        n.x+=n.vx; n.y+=n.vy; if(n.x<0||n.x>1) n.vx*=-1; if(n.y<0||n.y>1) n.vy*=-1
      }
      ctx.lineWidth=1; ctx.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue('--brand')
      for (let i=0;i<nodes.length;i++) for (let j=i+1;j<nodes.length;j++) {
        const a=nodes[i], b=nodes[j]; const dx=(a.x-b.x), dy=(a.y-b.y); const d=dx*dx+dy*dy
        if (d<0.02) { ctx.globalAlpha=0.6*(0.02-d)/0.02; ctx.beginPath(); ctx.moveTo(a.x*w,a.y*h); ctx.lineTo(b.x*w,b.y*h); ctx.stroke(); }
      }
      ctx.globalAlpha=1
      raf = requestAnimationFrame(loop)
    }

    const onVis = () => { running = !document.hidden; if (running) { raf = requestAnimationFrame(loop) } else cancelAnimationFrame(raf) }
    document.addEventListener('visibilitychange', onVis)
    raf = requestAnimationFrame(loop)
    return () => { running=false; cancelAnimationFrame(raf); document.removeEventListener('visibilitychange', onVis); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} className="w-full h-[40vh] rounded-2xl" aria-hidden="true" />
}
```

---

# 3) Threat Scanner (WASM + TS)

## 3.1 Rust crate (Argon2 + SHA-256 visual)

**`/packages/wasm-crypto/Cargo.toml`**

```toml
[package]
name = "wasm-crypto"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2"
argon2 = "0.5"
sha2 = "0.10"
getrandom = { version = "0.2", features = ["js"] }

[profile.release]
lto = true
codegen-units = 1
opt-level = 'z'
```

**`/packages/wasm-crypto/src/lib.rs`**

```rust
use wasm_bindgen::prelude::*;
use argon2::{Argon2, PasswordHasher};
use sha2::{Digest, Sha256};

#[wasm_bindgen]
pub fn sha256_steps(input: &str) -> Vec<JsValue> {
    // For visualization: expose intermediate block states (simplified)
    let mut hasher = Sha256::new();
    hasher.update(input.as_bytes());
    let digest = hasher.finalize();
    let hex = format!("{:x}", digest);
    vec![JsValue::from(hex)]
}

#[wasm_bindgen]
pub fn argon2_hash(password: &str, salt: &str, t_cost: u32, m_cost_kib: u32, parallelism: u32) -> String {
    let argon = Argon2::new_with_secret(&[], argon2::Algorithm::Argon2id, argon2::Version::V0x13, argon2::Params::new(m_cost_kib, t_cost, parallelism, None).unwrap()).unwrap();
    let salt_bytes = salt.as_bytes();
    let pw = password.as_bytes();
    argon.hash_password(pw, salt_bytes).unwrap().to_string()
}
```

> **Security note:** This demo runs fully client-side. Never send password inputs to the server. Use randomly generated salts for each run; do not reuse real passwords.

## 3.2 TS wrapper

**`/apps/web/src/wasm/crypto.ts`**

```ts
// Vite will handle WASM dynamic import if configured.
export async function loadCrypto() {
  const mod = await import('../../../packages/wasm-crypto/pkg/wasm_crypto.js')
  await mod.default() // init
  return mod
}
```

## 3.3 Password meter component

**`/apps/web/src/components/password-meter.tsx`**

```tsx
import React, { useEffect, useState } from 'react'
import { loadCrypto } from '../wasm/crypto'

export function PasswordMeter() {
  const [score, setScore] = useState(0)
  const [ms, setMs] = useState<number | null>(null)

  useEffect(() => {
    // lazy-load WASM only when needed
  }, [])

  async function onInput(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value
    const t0 = performance.now()
    const { argon2_hash } = await loadCrypto()
    const salt = crypto.getRandomValues(new Uint32Array(2)).join('-')
    try {
      await argon2_hash(v, salt, 2, 64 * 1024, 1) // t=2, m=64MiB, p=1 (adjust for demo)
    } catch {}
    const t1 = performance.now()
    const elapsed = Math.max(1, Math.round(t1 - t0))
    setMs(elapsed)
    // naive strength heuristic for demo (replace with zxcvbn if self-hosted)
    const entropyish = Math.min(100, Math.round(v.length * 6 + (elapsed / 10)))
    setScore(entropyish)
  }

  return (
    <div className="space-y-2">
      <label htmlFor="pw" className="block text-sm text-ink/80">Test a password (local only)</label>
      <input id="pw" type="password" onChange={onInput} className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2" autoComplete="off" />
      <div aria-live="polite" className="h-2 rounded bg-white/10">
        <div className="h-2 rounded bg-brand transition-all" style={{ width: `${score}%` }} />
      </div>
      <p className="text-xs text-ink/70">Argon2 demo time: {ms ?? '—'} ms • Never leaves your browser.</p>
    </div>
  )
}
```

## 3.4 Phishing quiz (accessible)

**`/apps/web/src/components/quiz.tsx`** (skeleton; stores score in localStorage)

```tsx
import React, { useEffect, useState } from 'react'

type Q = { id: string; html: string; correct: 'phish'|'legit'; reason: string }
const QUESTIONS: Q[] = [
  { id:'1', html:'<b>From:</b> IT Support <it@companny.com> — "Password expires today!"', correct:'phish', reason:'Misspelled domain; urgent language.' },
  { id:'2', html:'Okta login from new device — was this you?', correct:'legit', reason:'Expected MFA pattern; matches org sender.' },
  // add 6–10 total
]

export function Quiz() {
  const [i, setI] = useState(0)
  const [score, setScore] = useState<number>(() => Number(localStorage.getItem('quiz-score')||0))

  function answer(a: 'phish'|'legit'){
    const q = QUESTIONS[i]
    const ok = q.correct === a
    if (ok) setScore(s => { const v=s+1; localStorage.setItem('quiz-score', String(v)); return v })
    alert(`${ok ? 'Correct' : 'Not quite'} — ${q.reason}`)
    setI((i+1) % QUESTIONS.length)
  }

  return (
    <section aria-labelledby="quiz-h" className="space-y-3">
      <h2 id="quiz-h" className="text-lg font-semibold">Phishing Quiz</h2>
      <div className="rounded-xl border border-white/10 p-4 bg-black/20">
        <p className="mb-2" dangerouslySetInnerHTML={{__html: QUESTIONS[i].html}} />
        <div className="flex gap-2">
          <button onClick={()=>answer('phish')} className="px-3 py-2 rounded-xl bg-accent text-white">Phish</button>
          <button onClick={()=>answer('legit')} className="px-3 py-2 rounded-xl bg-brand text-black">Legit</button>
        </div>
      </div>
      <p className="text-sm text-ink/70">Score: {score}</p>
    </section>
  )
}
```

> **Security note:** Do not use `dangerouslySetInnerHTML` with untrusted strings in production. Here we control the content.

---

# 4) PWA & Offline

## 4.1 Service Worker (workbox-free, tiny cache)

**`/apps/web/src/sw.ts`**

```ts
/// <reference lib="WebWorker" />
export default null as any

const sw = self as unknown as ServiceWorkerGlobalScope
const CACHE = 'app-v1'
const APP_SHELL = [
  '/', '/index.html', '/styles/tokens.css', '/styles/tailwind.css', '/manifest.webmanifest'
]

sw.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(APP_SHELL)))
})

sw.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys()
    await Promise.all(keys.filter(k => k!==CACHE).map(k => caches.delete(k)))
    sw.clients.claim()
  })())
})

sw.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url)
  if (e.request.method !== 'GET') return
  // Network-first for HTML, cache-first for static
  if (url.pathname === '/' || url.pathname.endsWith('.html')) {
    e.respondWith((async () => {
      try { const res = await fetch(e.request); const cache = await caches.open(CACHE); cache.put(e.request, res.clone()); return res }
      catch { const cache = await caches.open(CACHE); const res = await cache.match(e.request) || await cache.match('/index.html'); return res as Response }
    })())
  } else {
    e.respondWith((async () => (await caches.match(e.request)) || fetch(e.request))())
  }
})
```

> **Security note:** Background sync for forms should queue POST bodies encrypted (if used); avoid storing sensitive content.

---

# 5) Backend (Fastify + Zod + Redis rate limit)

## 5.1 Prisma schema

**`/apps/functions/prisma/schema.prisma`**

```prisma
datasource db { provider = "postgresql" url = env("DATABASE_URL") }

generator client { provider = "prisma-client-js" }

model Contact {
  id        String   @id @default(cuid())
  email     String   @db.Citext
  name      String
  company   String?
  message   String
  consent   Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

## 5.2 Rate limit + security plugins

**`/apps/functions/src/plugins/security.ts`**

```ts
import fp from 'fastify-plugin'
import helmet from '@fastify/helmet'

export default fp(async (app) => {
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        objectSrc: ["'none'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", 'data:'],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'same-origin' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    frameguard: { action: 'deny' },
  })
})
```

**`/apps/functions/src/plugins/rate.ts`**

```ts
import fp from 'fastify-plugin'
import rateLimit from '@fastify/rate-limit'

export default fp(async (app) => {
  await app.register(rateLimit, {
    global: false,
    ban: 3,
    max: 20,
    timeWindow: '1 minute',
    addHeaders: {
      'x-ratelimit-limit': true,
      'x-ratelimit-remaining': true,
      'x-ratelimit-reset': true,
      'retry-after': true,
    },
  })
})
```

## 5.3 /contact route with Zod

**`/apps/functions/src/routes/contact.ts`**

```ts
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import rate from '../plugins/rate'
import prisma from '../db/prisma'

const ContactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  company: z.string().max(120).optional(),
  message: z.string().min(20).max(4000),
  consent: z.literal(true), // must be checked
  honey: z.string().max(0).optional(), // honeypot
})

export default async function routes(app: FastifyInstance) {
  app.register(rate)
  app.post('/contact', { config: { rateLimit: { max: 3, timeWindow: '1 minute' } } }, async (req, reply) => {
    const parsed = ContactSchema.safeParse(req.body)
    if (!parsed.success) return reply.code(400).send({ ok:false })
    const { honey, ...data } = parsed.data as any
    if (honey) return reply.code(204).send()
    await prisma.contact.create({ data })
    return reply.send({ ok: true })
  })
}
```

> **Security note:** No raw echo of user input; validate and normalize. Add SMTP queue later via Redis worker if desired.

## 5.4 Fastify server

**`/apps/functions/src/server.ts`**

```ts
import Fastify from 'fastify'
import security from './plugins/security'
import contact from './routes/contact'

export const build = () => {
  const app = Fastify({ logger: true, trustProxy: true })
  app.register(security)
  app.register(contact)
  app.get('/health', async () => ({ ok: true }))
  return app
}

if (require.main === module) {
  const app = build()
  app.listen({ port: Number(process.env.PORT) || 8787, host: '0.0.0.0' })
}
```

---

# 6) Docker & Local Dev

**`docker-compose.yml`**

```yml
version: '3.9'
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: postgres
      POSTGRES_USER: postgres
      POSTGRES_DB: app
    ports: ["5432:5432"]
    volumes: [db:/var/lib/postgresql/data]
  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
volumes: { db: {} }
```

**Root `package.json` (pnpm + turbo)**

```json
{
  "name": "cybersec-monorepo",
  "private": true,
  "packageManager": "pnpm@9",
  "scripts": {
    "dev:web": "pnpm --filter @app/web dev",
    "dev:api": "pnpm --filter @app/functions dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "audit": "npm audit --omit=dev && cargo audit || true"
  },
  "devDependencies": { "turbo": "^2.0.0" }
}
```

**`pnpm-workspace.yaml`**

```yaml
packages:
  - apps/*
  - packages/*
```

---

# 7) Security Headers & CSP

**CSP.md (exact headers)**

```txt
Content-Security-Policy:
  default-src 'self';
  base-uri 'self';
  object-src 'none';
  script-src 'self';
  style-src 'self';
  img-src 'self' data:;
  connect-src 'self';
  font-src 'self' data:;
  frame-ancestors 'none';
  upgrade-insecure-requests;

Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), camera=(), microphone=(), interest-cohort=()
```

> If you must inline critical CSS, use a **hashed** style tag and add the SHA-256 to `style-src`.

**Vercel** (edge headers in `vercel.json`)

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains; preload" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "geolocation=(), camera=(), microphone=()" }
      ]
    }
  ]
}
```

**Netlify** (`_headers`)

```txt
/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), camera=(), microphone=()
```

---

# 8) IA & Content Stubs (Routes)

Each route includes: header/footer, breadcrumb, sticky "Talk to an Expert". Avoid fear tactics; quantify outcomes.

* **Home**: Hero (HeroNet), 3-step value prop, marquee certs (SOC2, ISO 27001, CISSP, OSCP, CEH), testimonials.
* **Services** (+ subpages): Cards → detail pages for Pen-Testing, vCISO, Incident Response, Cloud Security, Red/Blue Team.
* **Threat Scanner**: PasswordMeter + SHA-256 visual + Quiz.
* **Learning Hub**: blog + guides + glossary (OWASP Top 10, CWE, MITRE ATT&CK primer) + fuzzy search.
* **Case Studies**: filterable; template: Context → Threat model → Actions → Results (quantified).
* **Pricing**: Startup / Growth / Enterprise with monthly/annual toggle.
* **About**: mission, team (no direct emails), careers CTA.
* **Trust & Compliance**: whitepaper download, data handling, breach process, subprocessors.
* **Contact / Book a Call**: form with honeypot, consent, rate-limit; calendar embed with static fallback.
* **Status**: mock component with API pins (operational/degraded) for demo.
* **404/500**: branded error pages, quick nav.

**Example Services card**

```tsx
<article className="rounded-2xl border border-white/10 p-6 bg-black/20">
  <h3 className="text-xl font-semibold">Penetration Testing</h3>
  <p className="text-ink/80">Find and fix exploitable weaknesses before attackers do.</p>
  <a className="mt-3 inline-flex items-center gap-2 text-brand" href="/services/pen-testing" aria-label="Read more about Penetration Testing">Read more →</a>
</article>
```

---

# 9) Accessibility & Motion

* WCAG 2.2 AA: keyboard-only journey, visible focus, land-marks (`<header> <main> <footer>`), aria-labels for icons, alt text required.
* Obey `prefers-reduced-motion`: hero stops animating and displays a static graphic.
* Screen reader shortcuts sheet (`?`) is focusable and closable with `Esc`.

---

# 10) Performance Budgets

* **LCP < 2.0s, TTI < 3.0s** on Moto G4/Slow 4G.
* Initial JS < 120KB gz. Lazy-load WASM and heavy components.
* AVIF/WebP; `<picture>` with sizes/srcset.
* Fonts preloaded; `font-display: swap`.

---

# 11) i18n Example

**`/apps/web/src/i18n/en.json`**

```json
{ "hero.title": "<COMPANY_NAME>", "hero.tag": "<TAGLINE>", "cta.talk": "Talk to an Expert" }
```

**`/apps/web/src/i18n/sq.json`**

```json
{ "hero.title": "<COMPANY_NAME>", "hero.tag": "<TAGLINE>", "cta.talk": "Bisedo me një ekspert" }
```

Locale switcher uses Intl and sets `lang` + `dir`.

---

# 12) Testing & CI

**Vitest** for units, **Playwright** for E2E, **axe/pa11y** for a11y, **Lighthouse CI** for perf. **npm audit** + **cargo audit** + **gitleaks** for security.

**`.github/workflows/ci.yml`** (excerpt)

```yml
name: CI
on: [push, pull_request]
jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm -w exec npx pa11y http://localhost:5173 || true
      - run: npx lighthouse-ci http://localhost:5173 || true
      - run: npm audit --omit=dev || true
      - name: Cargo audit
        run: |
          sudo apt-get update && sudo apt-get install -y cargo
          cargo install cargo-audit || true
          cargo audit || true
```

---

# 13) Deployment

* **Vercel/Netlify**: zero-config static hosting for `apps/web` + Edge/serverless for `/contact`.
* Add edge function for rate limit on `/contact` (fallback to Fastify if using separate server).
* Enforce headers at platform level (see **CSP.md**). Provide `sitemap.xml` + `robots.txt`.

---

# 14) README: Run, Build, Test, Deploy

```md
## Prereqs
- Node 22+, pnpm 9+, Rust (for WASM), wasm-pack, Docker (for Postgres/Redis)

## Setup
pnpm i
pnpm -w run dev:web  # http://localhost:5173
pnpm -w run dev:api  # http://localhost:8787

## Database
docker compose up -d
pnpm --filter @app/functions prisma migrate dev

## Build
pnpm build

## Test
pnpm test

## Deploy
- Push to main; CI runs. Configure Vercel/Netlify for apps/web. Bind `/contact` to serverless or Fastify.
```

---

# 15) Acceptance Checklist

* [ ] Semantic HTML; labeled forms; no div soup.
* [ ] CSS tokens + dark/light themes; AA+ contrast.
* [ ] TypeScript strict; **no** `any`.
* [ ] WASM demo fully offline; never transmits secrets.
* [ ] PWA installable; SW tested.
* [ ] Keyboard accessible everywhere; quiz operable without mouse.
* [ ] LCP < 2s; TTI < 3s; JS < 120KB gz initial.
* [ ] CSP blocks inline scripts; SRI on third-party (if any); headers verified.
* [ ] No third-party trackers; privacy page present.
* [ ] CI green: tests, audits, lint, format.

---

# 16) Notes & Security Considerations

* No inline scripts. If unavoidable for critical CSS, hash and allow exact SHA in `style-src`.
* Cookies: avoid; if used, `HttpOnly; Secure; SameSite=Strict`.
* Secrets only via server env; never shipped to client bundle.
* Rate-limit and add spam honeypot; consider proof-of-work token over CAPTCHA for privacy.
* Prefer first-party, privacy-preserving analytics.
* Progressive enhancement: content renders without JS; critical nav/CTA are standard links/buttons.
