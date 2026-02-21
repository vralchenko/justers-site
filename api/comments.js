const { sql } = require('@vercel/postgres');

module.exports = async function handler(req, res) {
    // Ensure the table exists (Ideally, you should run this once securely, not on every request, but for simplicity we do it here)
    try {
        await sql`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        article VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        comment_text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    } catch (err) {
        console.error('Error creating table:', err);
    }

    // Handle GET request to fetch comments for a specific article
    if (req.method === 'GET') {
        const { article } = req.query;
        if (!article) return res.status(400).json({ error: 'Article name is required' });

        try {
            const { rows } = await sql`
        SELECT * FROM comments 
        WHERE article = ${article} 
        ORDER BY created_at DESC;
      `;
            return res.status(200).json(rows);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    // Handle POST request to add a new comment
    if (req.method === 'POST') {
        const { article, author, text } = req.body;
        if (!article || !author || !text) {
            return res.status(400).json({ error: 'Article, author, and text are required fields' });
        }

        try {
            await sql`
        INSERT INTO comments (article, author, comment_text) 
        VALUES (${article}, ${author}, ${text});
      `;
            // Fetch the newly created record to return to frontend
            const { rows } = await sql`
        SELECT * FROM comments 
        WHERE article = ${article} AND author = ${author} AND comment_text = ${text}
        ORDER BY created_at DESC LIMIT 1;
      `;
            return res.status(201).json(rows[0]);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    // For any other HTTP methods, return 405 Method Not Allowed
    return res.status(405).json({ error: 'Method not allowed' });
}
