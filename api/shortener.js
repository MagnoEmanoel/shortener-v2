// api/shorten.js

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const { long_url } = req.body;

    if (!long_url) {
        res.status(400).json({ error: 'URL é obrigatória.' });
        return;
    }

    const URLBAE_TOKEN = process.env.URLBAE_TOKEN;

    if (!URLBAE_TOKEN) {
        res.status(500).json({ error: 'URLBAE_TOKEN não está configurado.' });
        return;
    }

    const apiUrl = 'https://urlbae.com/api/shorten';
    const headers = {
        'Authorization': `Bearer ${URLBAE_TOKEN}`,
        'Content-Type': 'application/json'
    };

    const body = JSON.stringify({ url: long_url });

    try {
        console.log('Fazendo requisição à API URLBae com a URL:', long_url);
        const response = await fetch(apiUrl, { method: 'POST', headers, body });
        const data = await response.json();

        if (data.error === 0) {
            console.log('URL encurtada com sucesso:', data.short_url);
            res.status(200).json({ link: data.short_url });
        } else {
            res.status(500).json({ error: data.message || 'Erro desconhecido' });
        }
    } catch (error) {
        console.error('Erro ao encurtar URL:', error.message);
        res.status(500).json({ error: `Erro ao encurtar URL: ${error.message}` });
    }
}
