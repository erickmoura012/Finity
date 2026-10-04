// Regras das tarefas: valores possíveis, filtros, contagem e validação

const STATUS = {
  a_fazer: 'A Fazer',
  em_andamento: 'Em andamento',
  concluido: 'Concluído'
};

const PRIORIDADES = {
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa'
};

// As categorias aparecem como "projetos" na página Meus projetos.
// Essas são as que já vêm no sistema, as novas são criadas pelo usuário.
const CATEGORIAS_PADRAO = [
  { nome: 'Desenvolvimento', icone: 'bx-code-alt' },
  { nome: 'Design', icone: 'bx-palette' },
  { nome: 'Marketing', icone: 'bx-trending-up' },
  { nome: 'Estudos', icone: 'bx-book-open' },
  { nome: 'Pessoal', icone: 'bx-user' }
];

function filtrarTarefas(tarefas, filtros) {
  const busca = filtros.busca.trim().toLowerCase();

  return tarefas.filter(function (tarefa) {
    const texto = (tarefa.titulo + ' ' + tarefa.descricao).toLowerCase();

    if (busca && !texto.includes(busca)) return false;
    if (filtros.prioridade && tarefa.prioridade !== filtros.prioridade) return false;
    if (filtros.categoria && tarefa.categoria !== filtros.categoria) return false;

    return true;
  });
}

function contarTarefas(tarefas) {
  return {
    total: tarefas.length,
    pendentes: tarefas.filter(t => t.status === 'a_fazer').length,
    andamento: tarefas.filter(t => t.status === 'em_andamento').length,
    concluidas: tarefas.filter(t => t.status === 'concluido').length
  };
}

// Tarefa atrasada = passou da data limite e ainda não foi concluída
function estaAtrasada(tarefa) {
  if (!tarefa.dataLimite || tarefa.status === 'concluido') return false;
  return tarefa.dataLimite < dataDeHoje();
}

// Retorna uma mensagem de erro, ou texto vazio se estiver tudo certo.
// Depois essa mesma validação pode ser feita no backend também.
function validarTarefa(dados) {
  if (!dados.titulo) {
    return 'Informe o título da tarefa.';
  }
  if (dados.titulo.length < 3) {
    return 'O título precisa ter pelo menos 3 caracteres.';
  }
  if (!dados.dataLimite) {
    return 'Informe a data limite.';
  }
  if (!PRIORIDADES[dados.prioridade]) {
    return 'Prioridade inválida.';
  }
  if (!STATUS[dados.status]) {
    return 'Status inválido.';
  }
  return '';
}

function validarProjeto(nome, categorias) {
  if (!nome) {
    return 'Informe o nome do projeto.';
  }
  if (nome.length < 2) {
    return 'O nome precisa ter pelo menos 2 caracteres.';
  }

  const jaExiste = categorias.some(c => c.nome.toLowerCase() === nome.toLowerCase());
  if (jaExiste) {
    return 'Já existe um projeto com esse nome.';
  }
  return '';
}
