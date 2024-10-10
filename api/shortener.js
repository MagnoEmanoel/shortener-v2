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
const BITLY_TOKEN = process.env.BITLY_TOKEN;  // Token de API do Bitly armazenado em .env

// Verificar se o token está presente antes de usar
if (!BITLY_TOKEN) {
    console.error('Erro: BITLY_TOKEN não está configurado. Verifique o arquivo .env.');
    process.exit(1);  // Encerra a aplicação se o token não estiver configurado
}

// Rota para encurtar URL
app.post('/api/shorten', async (req, res) => {
    const { long_url } = req.body;

    if (!long_url) {
        return res.status(400).json({ error: 'URL é obrigatória.' });
    }

    const apiUrl = 'https://api-ssl.bitly.com/v4/shorten';
    const headers = {
        'Authorization': `Bearer ${BITLY_TOKEN}`,
        'Content-Type': 'application/json'
    };

    const body = JSON.stringify({ long_url });

    try {
        console.log('Fazendo requisição à API Bitly com a URL:', long_url);  // Log adicional
        const response = await fetch(apiUrl, { method: 'POST', headers, body });
        const data = await response.json();

        // Adicionar mais logs para verificar a resposta da API Bitly
        console.log('Status da resposta:', response.status);
        console.log('Dados da resposta:', data);

        if (response.ok) {
            console.log('URL encurtada com sucesso:', data.link);
            return res.status(200).json({ link: data.link });
        } else {
            throw new Error(data.description || 'Erro desconhecido');
        }
    } catch (error) {
        console.error('Erro ao encurtar URL:', error.message);
        return res.status(500).json({ error: `Erro ao encurtar URL: ${error.message}` });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
