import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { long_url } = req.body;

    if (!long_url) {
        return res.status(400).json({ error: 'URL é obrigatória.' });
    }

    const URLBAE_TOKEN = process.env.URLBAE_TOKEN;

    if (!URLBAE_TOKEN) {
        return res.status(500).json({ error: 'URLBAE_TOKEN não está configurado.' });
    }

    try {
        const response = await axios.post('https://urlbae.com/api/shorten', {
            url: long_url
        }, {
            headers: {
                'Authorization': `Bearer ${URLBAE_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        const data = response.data;

        if (data.error === 0) {
            return res.status(200).json({ link: data.short_url });
        } else {
            return res.status(500).json({ error: data.message || 'Erro desconhecido' });
        }
    } catch (error) {
        console.error('Erro ao encurtar URL:', error.message);
        return res.status(500).json({ error: `Erro ao encurtar URL: ${error.message}` });
    }
}
