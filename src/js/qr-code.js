// Função para baixar o arquivo via Blob e forçar o download automático
async function downloadFile(url, filename) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href); // Limpa o objeto URL para liberar memória
    } catch (error) {
        console.error('Erro ao baixar o arquivo:', error);
    }
}

// Função para gerar o QR Code e adicionar opções de download
export function generateQRCode(url) {
    const qrCodeContainer = document.getElementById('qr-code-container');

    // Limpa o QR Code anterior e botões
    qrCodeContainer.innerHTML = '';

    if (!url) {
        alert('Por favor, insira uma URL válida.');
        return;
    }

    // Gerar o QR Code em PNG
    const pngUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}`;
    const pngImg = document.createElement('img');
    pngImg.src = pngUrl;
    pngImg.alt = 'QR Code';
    qrCodeContainer.appendChild(pngImg);

    // Gerar o QR Code em SVG
    const svgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}&format=svg`;

    // Contêiner para os botões de download
    const btnContainer = document.createElement('div');
    btnContainer.classList.add('qr-code-btns'); // Aplica o estilo para os botões lado a lado

    // Criar botão de download PNG
    const pngDownloadBtn = document.createElement('button');
    pngDownloadBtn.textContent = 'PNG';
    pngDownloadBtn.classList.add('download-btn');
    pngDownloadBtn.addEventListener('click', () => {
        downloadFile(pngUrl, 'qr-code.png'); // Chama a função de download para PNG
    });

    // Criar botão de download SVG
    const svgDownloadBtn = document.createElement('button');
    svgDownloadBtn.textContent = 'SVG';
    svgDownloadBtn.classList.add('download-btn');
    svgDownloadBtn.addEventListener('click', () => {
        downloadFile(svgUrl, 'qr-code.svg'); // Chama a função de download para SVG
    });

    // Adicionar os botões ao contêiner de botões
    btnContainer.appendChild(pngDownloadBtn);
    btnContainer.appendChild(svgDownloadBtn);

    // Adicionar o contêiner de botões ao QR Code container
    qrCodeContainer.appendChild(btnContainer);
}

// Função para capturar o evento de click no botão e gerar o QR Code
document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('gerar-qr-btn');
    generateBtn.addEventListener('click', () => {
        const urlInput = document.getElementById('qr-url-input').value;
        generateQRCode(urlInput);
    });
});
