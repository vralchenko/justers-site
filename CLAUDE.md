# JUSTERS.COM.UA — Сайт адвокатського об'єднання ДЖАСТЕРС

## Проект
- Статичний сайт (vanilla HTML/CSS/JS, без фреймворків)
- Хостинг: MiroHost (ovh14.mirohost.net, IP: 89.184.78.240)
- Домен: justers.com.ua (реєстратор: imena.ua)
- Деплой: автоматичний через GitHub Actions (FTP при пуші в master)
- Репозиторій: github.com/vralchenko/justers-site
- Основна гілка: `master`

## Структура
- `index.html` — головна сторінка
- `service-criminal.html` — сторінка послуги (Кримінальні справи)
- `publications.html` — список публікацій
- `publication-*.html` — окремі публікації
- `css/styles.css` — основні стилі
- `css/responsive.css` — адаптив (media queries)
- `js/script.js` — основний JS
- `api/comments.js` — Vercel serverless (PostgreSQL)

## Правила роботи
- Мова інтерфейсу: українська
- Коміти: українською
- Стек: тільки чистий HTML/CSS/JS — без бібліотек і збірників
- CSS-змінні визначені в `:root` (styles.css): `--accent`, `--bg-primary`, `--header-height` тощо
- Пуш тільки коли користувач явно просить
- Показати зміни перед комітом

## Стиль коду
- Шрифт: Montserrat
- Акцентний колір: `var(--accent)` (#d4af68 — золотий)
- Темна тема: `var(--bg-primary)` (#080c15)
- Хедер фіксований, висота: `var(--header-height, 130px)`
- Breadcrumb на сторінках послуг: `.service-sticky-cat` (fixed, right-aligned по правому краю телефонів)
