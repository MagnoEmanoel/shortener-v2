import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';  // Middleware para CORS

dotenv.config();  // Carrega as variáveis de ambiente do arquivo .env

const app = express();

// Configuração de CORS para permitir requisições do domínio Vercel
const corsOptions = {
  origin: '*',  // Permite todas as origens (teste inicial, pode ajustar conforme necessário)
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));  // Permite requisições de outras origens

app.use(express.json());

const PORT = process.env.PORT || 3000;
const URLBAE_TOKEN = process.env.URLBAE_TOKEN || 'e71727f824f472569094e908bc8070f1';  // Chave de API da URLBae

// Verificar se o token está presente antes de usar
if (!URLBAE_TOKEN) {
    console.error('Erro: URLBAE_TOKEN não está configurado. Verifique o arquivo .env.');
    process.exit(1);  // Encerra a aplicação se o token não estiver configurado
}

// Rota para encurtar URL
app.post('/api/shorten', async (req, res) => {
    const { long_url } = req.body;

    if (!long_url) {
        return res.status(400).json({ error: 'URL é obrigatória.' });
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

        // Verificar se a resposta da API foi bem-sucedida
        if (data.error === 0) {
            console.log('URL encurtada com sucesso:', data.short_url);
            return res.status(200).json({ link: data.short_url });
        } else {
            throw new Error(data.message || 'Erro desconhecido');
        }
    } catch (error) {
        console.error('Erro ao encurtar URL:', error.message);
        return res.status(500).json({ error: `Erro ao encurtar URL: ${error.message}` });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
