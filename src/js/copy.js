export function copyToClipboard() {
    const urlOutput = document.getElementById('url-output');
    navigator.clipboard.writeText(urlOutput.value)
        .then(() => {
            alert('Link copiado para a área de transferência!');
        })
        .catch(err => {
            console.error('Erro ao copiar link:', err);
        });
}
