export function copyToClipboard() {
    const urlOutput = document.getElementById('url-output');
    urlOutput.select();
    document.execCommand('copy');
    alert('Link copiado para a área de transferência!');
}
