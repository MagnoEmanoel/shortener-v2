import { copyToClipboard } from './copy.js';
import { generateQRCode } from './qr-code.js';

document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('url-input');
    const referenceInput = document.getElementById('reference-input');
    const encurtarBtn = document.getElementById('encurtar-btn');
    const resultado = document.getElementById('resultado');
    const urlOutput = document.getElementById('url-output');
    const qrCheckbox = document.getElementById('qr-checkbox');
    const qrCodeContainer = document.getElementById('qr-code-container');
    const copiarBtn = document.getElementById('copiar-btn');

    encurtarBtn.addEventListener('click', async () => {
        const url = urlInput.value.trim();
        const reference = referenceInput.value.trim();

        if (!isValidUrl(url)) {
            alert('Por favor, insira uma URL válida.');
            return;
        }

        try {
            console.log("Enviando solicitação para encurtar a URL:", url);
            const response = await fetch(`${window.location.origin}/api/shortener`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ long_url: url })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Erro na resposta da API. Status: ${response.status}, Mensagem: ${errorText}`);
                throw new Error(`Erro: ${errorText}`);
            }

            const data = await response.json();
            console.log("Resposta da API:", data);

            const shortUrl = data.link;
            const customUrl = reference ? `${shortUrl}?ref=${encodeURIComponent(reference)}` : shortUrl;
            urlOutput.value = customUrl;
            resultado.style.display = 'flex';

            if (qrCheckbox.checked && customUrl) {
                generateQRCode(customUrl);
            } else {
                qrCodeContainer.innerHTML = '';
            }
        } catch (error) {
            console.error(`Erro ao encurtar URL: ${error.message}`);
            alert(`Erro ao encurtar URL: ${error.message}`);
            resultado.style.display = 'none';
        }
    });

    copiarBtn.addEventListener('click', () => {
        copyToClipboard();
        urlOutput.focus();
    });
});

function isValidUrl(url) {
    const pattern = new RegExp('^(https?:\/\/)?' + // protocolo
        '((([a-z\d]([a-z\d-]*[a-z\d])*)\.?)+[a-z]{2,}|' + // domínio
        '((\d{1,3}\.){3}\d{1,3}))' + // IP (v4)
        '(\:\d+)?(\/[-a-z\d%_.~+]*)*' + // porta e caminho
        '(\?[;&a-z\d%_.~+=-]*)?' + // query string
        '(\#[-a-z\d_]*)?$', 'i'); // fragmento
    return !!pattern.test(url);
}