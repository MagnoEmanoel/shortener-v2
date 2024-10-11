encurtarBtn.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    const reference = referenceInput.value.trim();

    if (!isValidUrl(url)) {
        alert('Por favor, insira uma URL válida.');
        return;
    }

    try {
        const response = await fetch(`${window.location.origin}/api/shorten`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ long_url: url })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro: ${errorText}`);
        }

        const data = await response.json();

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
        alert(`Erro ao encurtar URL: ${error.message}`);
        resultado.style.display = 'none';
    }
});
