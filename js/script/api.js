// Camada de dados
//
// Todas as operações de salvar, buscar, editar e excluir passam por aqui.
// Por enquanto os dados ficam no LocalStorage do navegador.
//
// Quando o backend estiver pronto (Node + Express + PostgreSQL), a ideia é
// trocar o que tem dentro dessas funções por chamadas fetch() para a API.
// Como as funções já são async, o resto do código não vai precisar mudar.

const CHAVE_STORAGE = 'finity_tarefas';
// const API_URL = 'http://localhost:3000/api';

function lerStorage() {
  const dados = localStorage.getItem(CHAVE_STORAGE);
  if (!dados) return null;

  try {
    return JSON.parse(dados);
  } catch (erro) {
    console.error('Erro ao ler as tarefas salvas', erro);
    return [];
  }
}

function gravarStorage(tarefas) {
  localStorage.setItem(CHAVE_STORAGE, JSON.stringify(tarefas));
}

// GET /api/tarefas
async function listarTarefas() {
  let tarefas = lerStorage();

  // primeira vez abrindo o sistema: cria algumas tarefas de exemplo
  if (tarefas === null) {
    tarefas = tarefasDeExemplo();
    gravarStorage(tarefas);
  }

  return tarefas;
}

// POST /api/tarefas
async function criarTarefa(dados) {
  const tarefas = await listarTarefas();

  const novaTarefa = {
    id: gerarId(),
    titulo: dados.titulo,
    descricao: dados.descricao,
    prioridade: dados.prioridade,
    categoria: dados.categoria,
    dataLimite: dados.dataLimite,
    status: dados.status,
    dataCriacao: new Date().toISOString()
  };

  tarefas.push(novaTarefa);
  gravarStorage(tarefas);
  return novaTarefa;
}

// PUT /api/tarefas/:id
async function atualizarTarefa(id, dados) {
  const tarefas = await listarTarefas();
  const indice = tarefas.findIndex(t => t.id === id);

  if (indice === -1) {
    throw new Error('Tarefa não encontrada');
  }

  // mantém o id e a data de criação originais
  tarefas[indice] = {
    ...tarefas[indice],
    ...dados,
    id: tarefas[indice].id,
    dataCriacao: tarefas[indice].dataCriacao
  };

  gravarStorage(tarefas);
  return tarefas[indice];
}

// DELETE /api/tarefas/:id
async function excluirTarefa(id) {
  const tarefas = await listarTarefas();
  const restantes = tarefas.filter(t => t.id !== id);
  gravarStorage(restantes);
}

// Exemplo de como deve ficar com o backend:
//
// async function listarTarefas() {
//   const resposta = await fetch(API_URL + '/tarefas', {
//     headers: { Authorization: 'Bearer ' + token }
//   });
//   return resposta.json();
// }

function tarefasDeExemplo() {
  const diasAtras = (dias) => new Date(Date.now() - dias * 24 * 60 * 60 * 1000).toISOString();

  return [
    {
      id: gerarId() + '1',
      titulo: 'Criar layout da página inicial',
      descricao: 'Montar o wireframe e definir as cores principais do site.',
      prioridade: 'alta',
      categoria: 'Design',
      dataLimite: somarDias(3),
      status: 'a_fazer',
      dataCriacao: diasAtras(2)
    },
    {
      id: gerarId() + '2',
      titulo: 'Configurar servidor com Express',
      descricao: 'Criar as primeiras rotas da API e testar no Insomnia.',
      prioridade: 'media',
      categoria: 'Desenvolvimento',
      dataLimite: somarDias(7),
      status: 'a_fazer',
      dataCriacao: diasAtras(1)
    },
    {
      id: gerarId() + '3',
      titulo: 'Corrigir validação do formulário de login',
      descricao: 'O campo de e-mail está aceitando qualquer texto.',
      prioridade: 'alta',
      categoria: 'Desenvolvimento',
      dataLimite: somarDias(-1),
      status: 'em_andamento',
      dataCriacao: diasAtras(5)
    },
    {
      id: gerarId() + '4',
      titulo: 'Estudar Flexbox e Grid',
      descricao: 'Refazer os exercícios do curso e montar uma página de teste.',
      prioridade: 'baixa',
      categoria: 'Estudos',
      dataLimite: somarDias(5),
      status: 'em_andamento',
      dataCriacao: diasAtras(4)
    },
    {
      id: gerarId() + '5',
      titulo: 'Planejar posts da semana',
      descricao: 'Separar os temas e as imagens dos posts do Instagram.',
      prioridade: 'media',
      categoria: 'Marketing',
      dataLimite: somarDias(2),
      status: 'a_fazer',
      dataCriacao: diasAtras(1)
    },
    {
      id: gerarId() + '6',
      titulo: 'Revisar paleta de cores',
      descricao: 'Testar o contraste das cores com o texto.',
      prioridade: 'baixa',
      categoria: 'Design',
      dataLimite: somarDias(-2),
      status: 'concluido',
      dataCriacao: diasAtras(6)
    },
    {
      id: gerarId() + '7',
      titulo: 'Pagar conta de internet',
      descricao: '',
      prioridade: 'media',
      categoria: 'Pessoal',
      dataLimite: somarDias(-3),
      status: 'concluido',
      dataCriacao: diasAtras(8)
    }
  ];
}
