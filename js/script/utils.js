// Funções de ajuda usadas em vários lugares do projeto

// Gera um id simples para a tarefa.
// Quando tiver banco de dados, o id vai vir do PostgreSQL.
function gerarId() {
  return Date.now().toString() + Math.floor(Math.random() * 1000);
}

// Retorna a data de hoje no formato do input date (AAAA-MM-DD)
function dataDeHoje() {
  return formatarParaInput(new Date());
}

// Soma (ou subtrai) dias da data de hoje. Usado nas tarefas de exemplo.
function somarDias(dias) {
  const data = new Date();
  data.setDate(data.getDate() + dias);
  return formatarParaInput(data);
}

function formatarParaInput(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

// "2026-10-15" -> "15/10/2026"
// Não usei new Date() aqui porque ele pode mudar o dia por causa do fuso horário
function formatarData(data) {
  if (!data) return '-';
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

// A data de criação é salva completa (com hora), então aqui pode usar o Date
function formatarDataCriacao(dataISO) {
  if (!dataISO) return '-';
  return new Date(dataISO).toLocaleDateString('pt-BR');
}

function calcularPorcentagem(parte, total) {
  if (total === 0) return 0;
  return Math.round((parte / total) * 100);
}

// Evita que um texto digitado pelo usuário vire HTML na página
function escaparHTML(texto) {
  if (!texto) return '';
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
