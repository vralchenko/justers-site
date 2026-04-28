export async function onRequestPost(context) {
    const { request, env } = context;

    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    try {
        const { name, phone, formType } = await request.json();

        if (!name || !phone) {
            return new Response(JSON.stringify({ ok: false, error: 'Missing fields' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const botToken = env.TG_BOT_TOKEN;
        const chatId = env.TG_CHAT_ID;

        if (!botToken || !chatId) {
            return new Response(JSON.stringify({ ok: false, error: 'Bot not configured' }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const text = `📋 *Нова заявка з сайту*\n\n👤 Ім'я: ${name}\n📞 Телефон: ${phone}\n📝 Тип: ${formType || 'Консультація'}`;

        const tgResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' })
        });

        const tgData = await tgResponse.json();

        return new Response(JSON.stringify({ ok: tgData.ok }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
}

export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
    });
}
