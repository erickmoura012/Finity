// Cria um link temporário pra baixar os dados como arquivo .json
export function baixarArquivoJSON(nomeArquivo: string, dados: unknown) {
  const conteudo = JSON.stringify(dados, null, 2);
  const arquivo = new Blob([conteudo], { type: 'application/json' });
  const url = URL.createObjectURL(arquivo);

  const link = document.createElement('a');
  link.href = url;
  link.download = nomeArquivo;
  link.click();

  URL.revokeObjectURL(url);
}
