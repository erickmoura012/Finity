// Regras das tarefas: valores possíveis, filtros, contagem e validação

import { dataDeHoje, somarDias, formatarData, normalizarTexto } from './utils.ts';

export type Status = 'a_fazer' | 'em_andamento' | 'concluido';
export type Prioridade = 'alta' | 'media' | 'baixa';

export interface Tarefa {
  id: string;
  titulo: string;
  descricao: string;
  prioridade: Prioridade;
  categoria: string;
  dataLimite: string; // AAAA-MM-DD
  status: Status;
  dataCriacao: string; // data completa em ISO
}

// O que vem do formulário: os selects podem mandar qualquer texto,
// por isso a validação confere se a prioridade e o status existem
export interface DadosTarefa {
  titulo: string;
  descricao: string;
  prioridade: string;
  categoria: string;
  dataLimite: string;
  status: string;
}

export interface Categoria {
  nome: string;
  icone: string;
}

export interface Filtros {
  busca: string;
  prioridade: string;
  categoria: string;
}

export interface Contagem {
  total: number;
  pendentes: number;
  andamento: number;
  concluidas: number;
}

// Formato do arquivo de exportar/importar
export interface Backup {
  tarefas: Tarefa[];
  categorias: Categoria[];
}

// Colunas da tabela que dá pra ordenar (vazio = sem ordenação)
export type CampoOrdem = 'titulo' | 'categoria' | 'prioridade' | 'status' | 'dataLimite' | 'dataCriacao' | '';

const CAMPOS_ORDEM = ['titulo', 'categoria', 'prioridade', 'status', 'dataLimite', 'dataCriacao'];

// O campo da ordenação vem da URL, onde a pessoa pode escrever qualquer coisa.
// Se não for uma coluna que existe, fica sem ordenação.
export function lerCampoOrdem(texto: string | null): CampoOrdem {
  if (texto && CAMPOS_ORDEM.includes(texto)) {
    return texto as CampoOrdem;
  }
  return '';
}

export const STATUS: Record<Status, string> = {
  a_fazer: 'A Fazer',
  em_andamento: 'Em andamento',
  concluido: 'Concluído'
};

export const PRIORIDADES: Record<Prioridade, string> = {
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa'
};

// As categorias aparecem como "projetos" na página Meus projetos.
// Essas são as que já vêm no sistema, as novas são criadas pelo usuário.
export const CATEGORIAS_PADRAO: Categoria[] = [
  { nome: 'Desenvolvimento', icone: 'bx-code-alt' },
  { nome: 'Design', icone: 'bx-palette' },
  { nome: 'Marketing', icone: 'bx-trending-up' },
  { nome: 'Estudos', icone: 'bx-book-open' },
  { nome: 'Pessoal', icone: 'bx-user' }
];

// Ícones que dá pra escolher pra um projeto (todos do Boxicons).
// O nome é o que o leitor de tela fala, já que o botão só mostra o desenho.
export const ICONES_PROJETO = [
  { icone: 'bx-folder', nome: 'Pasta' },
  { icone: 'bx-code-alt', nome: 'Código' },
  { icone: 'bx-palette', nome: 'Paleta' },
  { icone: 'bx-trending-up', nome: 'Gráfico' },
  { icone: 'bx-book-open', nome: 'Livro' },
  { icone: 'bx-user', nome: 'Pessoa' },
  { icone: 'bx-briefcase', nome: 'Maleta' },
  { icone: 'bx-home', nome: 'Casa' },
  { icone: 'bx-heart', nome: 'Coração' },
  { icone: 'bx-dumbbell', nome: 'Academia' },
  { icone: 'bx-cart', nome: 'Compras' },
  { icone: 'bx-music', nome: 'Música' }
];

export function filtrarTarefas(tarefas: Tarefa[], filtros: Filtros): Tarefa[] {
  // sem acento dos dois lados: "relatorio" acha "Relatório" e "função" acha "funcao"
  const busca = normalizarTexto(filtros.busca.trim());

  return tarefas.filter(function (tarefa) {
    const texto = normalizarTexto(tarefa.titulo + ' ' + tarefa.descricao);

    if (busca && !texto.includes(busca)) return false;
    if (filtros.prioridade && tarefa.prioridade !== filtros.prioridade) return false;
    if (filtros.categoria && tarefa.categoria !== filtros.categoria) return false;

    return true;
  });
}

// Prioridade e status não dá pra ordenar pelo texto ("Alta" viria antes de "Baixa"
// mas "Média" ficaria por último), então cada valor ganha um número
const ORDEM_PRIORIDADE: Record<Prioridade, number> = { alta: 1, media: 2, baixa: 3 };
const ORDEM_STATUS: Record<Status, number> = { a_fazer: 1, em_andamento: 2, concluido: 3 };

// Devolve uma cópia ordenada, a lista original continua igual
export function ordenarTarefas(tarefas: Tarefa[], campo: CampoOrdem, crescente: boolean): Tarefa[] {
  if (!campo) return tarefas;

  return [...tarefas].sort(function (a, b) {
    let resultado: number;

    if (campo === 'prioridade') {
      resultado = ORDEM_PRIORIDADE[a.prioridade] - ORDEM_PRIORIDADE[b.prioridade];
    } else if (campo === 'status') {
      resultado = ORDEM_STATUS[a.status] - ORDEM_STATUS[b.status];
    } else {
      // título, categoria e as datas são texto (as datas ficam no formato AAAA-MM-DD)
      resultado = a[campo].localeCompare(b[campo], 'pt-BR');
    }

    return crescente ? resultado : -resultado;
  });
}

// "7 tarefas" ou, quando tem filtro, "Mostrando 2 de 7 tarefas"
export function textoResultado(mostrando: number, total: number): string {
  const palavra = total === 1 ? 'tarefa' : 'tarefas';

  if (mostrando === total) {
    return total + ' ' + palavra;
  }
  return 'Mostrando ' + mostrando + ' de ' + total + ' ' + palavra;
}

export function contarTarefas(tarefas: Tarefa[]): Contagem {
  return {
    total: tarefas.length,
    pendentes: tarefas.filter(t => t.status === 'a_fazer').length,
    andamento: tarefas.filter(t => t.status === 'em_andamento').length,
    concluidas: tarefas.filter(t => t.status === 'concluido').length
  };
}

// Tarefa atrasada = passou da data limite e ainda não foi concluída
export function estaAtrasada(tarefa: Tarefa): boolean {
  if (!tarefa.dataLimite || tarefa.status === 'concluido') return false;
  return tarefa.dataLimite < dataDeHoje();
}

// Texto da data limite no card: "Hoje" e "Amanhã" chamam mais atenção
// do que a data, nos outros dias fica a data normal (DD/MM/AAAA)
export function textoPrazo(dataLimite: string): string {
  if (dataLimite === dataDeHoje()) return 'Hoje';
  if (dataLimite === somarDias(1)) return 'Amanhã';
  return formatarData(dataLimite);
}

// Retorna uma mensagem de erro, ou texto vazio se estiver tudo certo.
// Depois essa mesma validação pode ser feita no backend também.
export function validarTarefa(dados: DadosTarefa): string {
  if (!dados.titulo) {
    return 'Informe o título da tarefa.';
  }
  if (dados.titulo.length < 3) {
    return 'O título precisa ter pelo menos 3 caracteres.';
  }
  if (!dados.dataLimite) {
    return 'Informe a data limite.';
  }
  if (!Object.keys(PRIORIDADES).includes(dados.prioridade)) {
    return 'Prioridade inválida.';
  }
  if (!Object.keys(STATUS).includes(dados.status)) {
    return 'Status inválido.';
  }
  return '';
}

// Ao editar, o nomeAtual é o do próprio projeto, que não conta como repetido
export function validarProjeto(nome: string, categorias: Categoria[], nomeAtual = ''): string {
  if (!nome) {
    return 'Informe o nome do projeto.';
  }
  if (nome.length < 2) {
    return 'O nome precisa ter pelo menos 2 caracteres.';
  }

  const jaExiste = categorias.some(
    c => c.nome !== nomeAtual && c.nome.toLowerCase() === nome.toLowerCase()
  );
  if (jaExiste) {
    return 'Já existe um projeto com esse nome.';
  }
  return '';
}

// O arquivo importado pode ter qualquer coisa dentro, então antes de usar
// confiro se tem as listas certas e se cada tarefa passa na validação
export function validarBackup(dados: unknown): string {
  const backup = dados as Partial<Backup> | null;

  if (!backup || !Array.isArray(backup.tarefas) || !Array.isArray(backup.categorias)) {
    return 'Esse arquivo não é um backup do Finity.';
  }

  const categorias = backup.categorias;
  // o ícone vai dentro do class do HTML, então só aceito nomes do Boxicons (bx-alguma-coisa)
  const categoriaInvalida = categorias.some(c => !c || !c.nome || !/^bx-[a-z0-9-]+$/.test(c.icone));
  if (categoriaInvalida) {
    return 'O arquivo tem projetos com dados inválidos.';
  }

  // o id e a data também vão direto no HTML, então confiro o formato deles
  const tarefaInvalida = backup.tarefas.some(function (t) {
    if (!t || validarTarefa(t) !== '') return true;
    if (!/^[a-zA-Z0-9-]+$/.test(t.id)) return true;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(t.dataLimite)) return true;
    return false;
  });
  if (tarefaInvalida) {
    return 'O arquivo tem tarefas com dados inválidos.';
  }

  // toda tarefa precisa estar num projeto que existe no arquivo
  const semProjeto = backup.tarefas.some(t => !categorias.some(c => c.nome === t.categoria));
  if (semProjeto) {
    return 'O arquivo tem tarefas de um projeto que não existe.';
  }

  return '';
}
