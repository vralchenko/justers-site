# Міграція з Vercel на безкоштовні альтернативи

## Статус

| # | Проект | Куди | Статус |
|---|--------|------|--------|
| 1 | Führerschein | Cloudflare Pages | ⬜ |
| 2 | ReadyLegacyPresentation | Cloudflare Pages | ⬜ |
| 3 | myportfoliopresentation | Cloudflare Pages | ⬜ |
| 4 | BizLingo | Cloudflare Pages | ⬜ |
| 5 | MyPortfolio | Cloudflare Pages | ⬜ |
| 6 | ReadyLegacy | Cloudflare Pages + Workers | ⬜ |
| 7 | Foreteller | Cloudflare Pages + Workers | ⬜ |
| 8 | AiCareerCoach | Cloudflare Pages + Workers | ⬜ |
| 9 | **justers-site** | **Cloudflare Pages + Workers + Neon** | 🔄 код готовий |
| 10 | ItemFlow | Render | ⬜ |

---

## Крок 0: Підготовка Cloudflare акаунту

1. Зареєструватися на [dash.cloudflare.com](https://dash.cloudflare.com)
2. Безкоштовний тариф включає:
   - Необмежена кількість Pages-проектів
   - Необмежений bandwidth
   - 500 білдів/місяць
   - 100K Workers invocations/день (~3M/міс)
   - Кастомні домени безкоштовно

---

## Крок 1: Статичні сайти → Cloudflare Pages

**Проекти:** Führerschein, ReadyLegacyPresentation, myportfoliopresentation, BizLingo

Для кожного:

1. Cloudflare Dashboard → Pages → Create a project → Connect to Git
2. Вибрати GitHub репозиторій
3. Налаштувати Build settings:

| Проект | Framework | Build command | Output directory |
|--------|-----------|---------------|------------------|
| Führerschein | Vite + React | `npm run build` | `dist` |
| ReadyLegacyPresentation | Vite + React | `npm run build` | `dist` |
| myportfoliopresentation | Vite + React | `npm run build` | `dist` |
| BizLingo | Flutter web | `flutter build web` | `build/web` |

4. Deploy → отримати `*.pages.dev` домен
5. Перевірити сайт працює
6. (Опціонально) Додати кастомний домен: Settings → Custom Domains

**Зміни в коді: 0** — нічого не потрібно міняти.

---

## Крок 2: Next.js без БД → Cloudflare Pages

**Проект:** MyPortfolio (Next.js 16)

### Варіант А: Через `@cloudflare/next-on-pages`

```bash
cd MyPortfolio
npm install -D @cloudflare/next-on-pages

# Додати в next.config.js:
# const { setupDevPlatform } = require('@cloudflare/next-on-pages/next-dev');
# if (process.env.NODE_ENV === 'development') setupDevPlatform();
```

Cloudflare Dashboard → Pages:
- Build command: `npx @cloudflare/next-on-pages`
- Output directory: `.vercel/output/static`

### Варіант Б: Простіший — Static Export

Якщо API routes не критичні, додати в `next.config.js`:
```js
module.exports = { output: 'export' }
```
- Build command: `npm run build`
- Output directory: `out`

---

## Крок 3: Serverless + зовнішня БД → Cloudflare Pages + Workers

**Проекти:** ReadyLegacy (Neon), Foreteller (Supabase), AiCareerCoach (Supabase)

### БД міграція: НЕ ПОТРІБНА
Neon та Supabase — зовнішні сервіси, працюють з будь-яким хостом.

### Зміни в коді:

#### 3.1 Створити `functions/` директорію

Vercel serverless (`api/endpoint.js`):
```js
module.exports = async function handler(req, res) {
    const data = req.body;
    res.status(200).json({ ok: true });
}
```

Cloudflare Pages Functions (`functions/api/endpoint.js`):
```js
export async function onRequestPost({ request, env }) {
    const data = await request.json();
    return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
```

**Ключові відмінності:**
| Vercel | Cloudflare |
|--------|------------|
| `req.body` | `await request.json()` |
| `req.query` | `new URL(request.url).searchParams` |
| `req.method` | `request.method` або окремі `onRequestGet/Post` |
| `res.status(200).json(data)` | `return new Response(JSON.stringify(data), { status: 200, headers: {...} })` |
| `process.env.KEY` | `env.KEY` (передається через context) |

#### 3.2 Встановити wrangler

```bash
npm install -D wrangler
```

#### 3.3 Додати wrangler.toml

```toml
name = "project-name"
compatibility_date = "2025-01-01"
pages_build_output_dir = "dist"  # або "." для статичних
```

#### 3.4 Env variables

- Локально: `.dev.vars` файл
- Прод: Cloudflare Dashboard → Settings → Environment variables
- **Secrets** (DATABASE_URL тощо): через Dashboard, НЕ в коді

#### 3.5 Для Vite-проектів (ReadyLegacy, Foreteller)

Cloudflare Dashboard → Pages:
- Build command: `npm run build`
- Output directory: `dist`
- Functions directory: `functions` (автоматично)

#### 3.6 Для Next.js (AiCareerCoach)

Аналогічно Кроку 2, плюс API routes → переписати як Functions.

---

## Крок 4: justers-site → Cloudflare Pages + Workers + Neon

### 4.1 Код (ГОТОВО ✅)

- `functions/api/comments.js` — новий API у форматі Cloudflare Pages Functions
- `@vercel/postgres` → `@neondatabase/serverless` в package.json
- `wrangler.toml` — конфігурація
- `.dev.vars` — шаблон для локальних секретів

### 4.2 Міграція БД: Vercel Postgres → Neon

1. **Експорт даних з Vercel Postgres:**
   ```bash
   # Отримати connection string з Vercel Dashboard → Storage → PostgreSQL → Settings
   pg_dump "postgres://...vercel-storage.com/verceldb" > justers_backup.sql
   ```

2. **Створити Neon базу:**
   - [console.neon.tech](https://console.neon.tech) → New Project
   - Region: eu-central-1 (Frankfurt) — ближче до UA
   - Free tier: 0.5 GB storage, 190 compute hours/міс

3. **Імпорт даних:**
   ```bash
   psql "postgres://...neon.tech/neondb?sslmode=require" < justers_backup.sql
   ```

4. **Зберегти connection string** для `.dev.vars` та Cloudflare Dashboard

### 4.3 Деплой на Cloudflare Pages

1. Cloudflare Dashboard → Pages → Create project → Connect GitHub (`vralchenko/justers-site`)
2. Build settings:
   - Build command: (залишити порожнім — статичний сайт)
   - Output directory: `.`
3. Environment variables → Add:
   - `DATABASE_URL` = `postgresql://...@ep-xxx.neon.tech/neondb?sslmode=require`
4. Deploy

### 4.4 Перенос домену justers.io

1. Cloudflare Dashboard → Add a site → `justers.io`
2. Cloudflare покаже нові nameservers
3. У реєстратора домену замінити NS-записи на Cloudflare
4. Після пропагації DNS → Pages → Custom Domains → `justers.io`
5. SSL сертифікат буде автоматично (Cloudflare Universal SSL)

### 4.5 Локальна розробка

```bash
npm install
# Заповнити .dev.vars реальним DATABASE_URL
npx wrangler pages dev .
```

---

## Крок 5: ItemFlow → Render

**Стек:** React + Express + SQLite (потребує persistent server)

1. [render.com](https://render.com) → New → Web Service → Connect GitHub
2. Build command: `npm install && npm run build`
3. Start command: `npm start`
4. Free Instance Type
5. **Важливо:** Free tier засинає через 15 хв неактивності (cold start ~30s)
6. SQLite файл зберігається на диску Render (persistent disk потребує paid plan)
   - **Альтернатива:** мігрувати SQLite → Neon PostgreSQL (free tier)

---

## Верифікація після міграції

Для кожного проекту:

- [ ] Автодеплой працює (push → build → deploy)
- [ ] Сайт відкривається на `*.pages.dev`
- [ ] Кастомний домен працює (якщо є)
- [ ] HTTPS працює
- [ ] API endpoints відповідають (serverless функції)
- [ ] БД підключення працює (для проектів з БД)
- [ ] Видалити проект з Vercel Dashboard

---

## Після завершення міграції

1. Видалити всі проекти з Vercel Dashboard
2. Видалити Vercel Storage (PostgreSQL) після підтвердження що Neon працює
3. Оновити CLAUDE.md в justers-site (хостинг: Cloudflare)
4. Видалити `api/comments.js` (старий Vercel формат) та `.vercel/`
