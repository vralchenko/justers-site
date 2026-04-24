import { neon } from '@neondatabase/serverless';

// Ініціалізація таблиці (виконується один раз)
let tableInitialized = false;

async function ensureTable(sql) {
    if (tableInitialized) return;
    await sql`
        CREATE TABLE IF NOT EXISTS comments (
            id SERIAL PRIMARY KEY,
            article VARCHAR(255) NOT NULL,
            author VARCHAR(255) NOT NULL,
            comment_text TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    tableInitialized = true;
}

function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}

// GET /api/comments?article=...
export async function onRequestGet({ request, env }) {
    const sql = neon(env.DATABASE_URL);
    await ensureTable(sql);

    const url = new URL(request.url);
    const article = url.searchParams.get('article');

    if (!article) {
        return jsonResponse({ error: 'Article name is required' }, 400);
    }

    try {
        const rows = await sql`
            SELECT * FROM comments
            WHERE article = ${article}
            ORDER BY created_at DESC;
        `;
        return jsonResponse(rows);
    } catch (err) {
        return jsonResponse({ error: err.message }, 500);
    }
}

// POST /api/comments
export async function onRequestPost({ request, env }) {
    const sql = neon(env.DATABASE_URL);
    await ensureTable(sql);

    const { article, author, text } = await request.json();

    if (!article || !author || !text) {
        return jsonResponse({ error: 'Article, author, and text are required fields' }, 400);
    }

    try {
        await sql`
            INSERT INTO comments (article, author, comment_text)
            VALUES (${article}, ${author}, ${text});
        `;
        const rows = await sql`
            SELECT * FROM comments
            WHERE article = ${article} AND author = ${author} AND comment_text = ${text}
            ORDER BY created_at DESC LIMIT 1;
        `;
        return jsonResponse(rows[0], 201);
    } catch (err) {
        return jsonResponse({ error: err.message }, 500);
    }
}
