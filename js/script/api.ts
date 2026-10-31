// Camada de dados
//
// Todas as operações de salvar, buscar, editar e excluir passam por aqui.
// Por enquanto os dados ficam no LocalStorage do navegador.
//
// Quando o backend estiver pronto (Node + Express + PostgreSQL), a ideia é
// trocar o que tem dentro dessas funções por chamadas fetch() para a API.
// Como as funções já são async, o resto do código não vai precisar mudar.

import { gerarId, somarDias } from './utils.ts';
import { CATEGORIAS_PADRAO } from './tarefas.ts';
import type { Tarefa, Categoria, Backup } from './tarefas.ts';

// Dados de uma tarefa nova: o id e a data de criação são gerados aqui
export type NovaTarefa = Omit<Tarefa, 'id' | 'dataCriacao'>;

const CHAVE_TAREFAS = 'finity_tarefas';
const CHAVE_CATEGORIAS = 'finity_categorias';
// const API_URL = 'http://localhost:3000/api';

// <T> deixa quem chama dizer o tipo da lista salva (Tarefa, Categoria...)
function lerStorage<T>(chave: string): T[] | null {
  const dados = localStorage.getItem(chave);
  if (!dados) return null;

  try {
    return JSON.parse(dados);
  } catch (erro) {
    console.error('Erro ao ler os dados salvos', erro);
    return [];
  }
}

function gravarStorage(chave: string, dados: unknown): void {
  localStorage.setItem(chave, JSON.stringify(dados));
}

// GET /api/tarefas
export async function listarTarefas(): Promise<Tarefa[]> {
  let tarefas = lerStorage<Tarefa>(CHAVE_TAREFAS);

  // primeira vez abrindo o sistema: cria algumas tarefas de exemplo
  if (tarefas === null) {
    tarefas = tarefasDeExemplo();
    gravarStorage(CHAVE_TAREFAS, tarefas);
  }

  return tarefas;
}

// POST /api/tarefas
export async function criarTarefa(dados: NovaTarefa): Promise<Tarefa> {
  const tarefas = await listarTarefas();

  const novaTarefa: Tarefa = {
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
  gravarStorage(CHAVE_TAREFAS, tarefas);
  return novaTarefa;
}

// PUT /api/tarefas/:id
export async function atualizarTarefa(id: string, dados: Partial<Tarefa>): Promise<Tarefa> {
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

  gravarStorage(CHAVE_TAREFAS, tarefas);
  return tarefas[indice];
}

// DELETE /api/tarefas/:id
export async function excluirTarefa(id: string): Promise<void> {
  const tarefas = await listarTarefas();
  const restantes = tarefas.filter(t => t.id !== id);
  gravarStorage(CHAVE_TAREFAS, restantes);
}

// GET /api/categorias
export async function listarCategorias(): Promise<Categoria[]> {
  let categorias = lerStorage<Categoria>(CHAVE_CATEGORIAS);

  // primeira vez: começa com as categorias padrão
  if (categorias === null) {
    // uso uma cópia pra não alterar a constante quando um projeto novo for criado
    categorias = [...CATEGORIAS_PADRAO];
    gravarStorage(CHAVE_CATEGORIAS, categorias);
  }

  return categorias;
}

// POST /api/categorias
export async function criarCategoria(nome: string): Promise<Categoria> {
  const categorias = await listarCategorias();

  // projeto novo usa o ícone de pasta
  const novaCategoria: Categoria = { nome: nome, icone: 'bx-folder' };

  categorias.push(novaCategoria);
  gravarStorage(CHAVE_CATEGORIAS, categorias);
  return novaCategoria;
}

// PUT /api/categorias/:nome
// As tarefas guardam o nome do projeto, então elas também precisam mudar
export async function renomearCategoria(nomeAtual: string, novoNome: string): Promise<Categoria> {
  const categorias = await listarCategorias();
  const categoria = categorias.find(c => c.nome === nomeAtual);

  if (!categoria) {
    throw new Error('Projeto não encontrado');
  }

  categoria.nome = novoNome;
  gravarStorage(CHAVE_CATEGORIAS, categorias);

  const tarefas = await listarTarefas();
  for (const tarefa of tarefas) {
    if (tarefa.categoria === nomeAtual) tarefa.categoria = novoNome;
  }
  gravarStorage(CHAVE_TAREFAS, tarefas);

  return categoria;
}

// POST /api/importar
// Troca todas as tarefas e projetos pelos do arquivo importado
export async function importarBackup(backup: Backup): Promise<void> {
  gravarStorage(CHAVE_TAREFAS, backup.tarefas);
  gravarStorage(CHAVE_CATEGORIAS, backup.categorias);
}

// Exemplo de como deve ficar com o backend:
//
// async function listarTarefas() {
//   const resposta = await fetch(API_URL + '/tarefas', {
//     headers: { Authorization: 'Bearer ' + token }
//   });
//   return resposta.json();
// }

function tarefasDeExemplo(): Tarefa[] {
  const diasAtras = (dias: number) => new Date(Date.now() - dias * 24 * 60 * 60 * 1000).toISOString();

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
