import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  filtrarTarefas,
  ordenarTarefas,
  contarTarefas,
  estaAtrasada,
  validarTarefa,
  validarProjeto
} from './tarefas.js';

function criarTarefa(dados) {
  return {
    id: '1',
    titulo: 'Tarefa',
    descricao: '',
    prioridade: 'media',
    categoria: 'Estudos',
    dataLimite: '2026-10-25',
    status: 'a_fazer',
    dataCriacao: '2026-10-01T10:00:00.000Z',
    ...dados
  };
}

const tarefas = [
  criarTarefa({ id: '1', titulo: 'Estudar React', prioridade: 'baixa', categoria: 'Estudos' }),
  criarTarefa({ id: '2', titulo: 'Criar logo', descricao: 'Testar cores', prioridade: 'alta', categoria: 'Design', status: 'em_andamento' }),
  criarTarefa({ id: '3', titulo: 'Ábaco', prioridade: 'media', categoria: 'Pessoal', status: 'concluido' })
];

const semFiltro = { busca: '', prioridade: '', categoria: '' };

describe('filtrarTarefas', () => {
  it('sem filtro devolve todas', () => {
    expect(filtrarTarefas(tarefas, semFiltro)).toHaveLength(3);
  });

  it('busca no título e na descrição, sem diferenciar maiúscula', () => {
    expect(filtrarTarefas(tarefas, { ...semFiltro, busca: 'REACT' })[0].id).toBe('1');
    expect(filtrarTarefas(tarefas, { ...semFiltro, busca: 'cores' })[0].id).toBe('2');
  });

  it('filtra por prioridade e categoria juntas', () => {
    const resultado = filtrarTarefas(tarefas, { ...semFiltro, prioridade: 'alta', categoria: 'Design' });
    expect(resultado.map(t => t.id)).toEqual(['2']);
  });
});

describe('ordenarTarefas', () => {
  it('ordena a prioridade de alta pra baixa, e não pelo texto', () => {
    const ordem = ordenarTarefas(tarefas, 'prioridade', true).map(t => t.prioridade);
    expect(ordem).toEqual(['alta', 'media', 'baixa']);
  });

  it('inverte quando não é crescente', () => {
    const ordem = ordenarTarefas(tarefas, 'status', false).map(t => t.status);
    expect(ordem).toEqual(['concluido', 'em_andamento', 'a_fazer']);
  });

  it('ordena o título considerando acento', () => {
    const ordem = ordenarTarefas(tarefas, 'titulo', true).map(t => t.titulo);
    expect(ordem).toEqual(['Ábaco', 'Criar logo', 'Estudar React']);
  });

  it('não muda a lista original', () => {
    ordenarTarefas(tarefas, 'titulo', true);
    expect(tarefas.map(t => t.id)).toEqual(['1', '2', '3']);
  });
});

describe('contarTarefas', () => {
  it('conta por status', () => {
    expect(contarTarefas(tarefas)).toEqual({ total: 3, pendentes: 1, andamento: 1, concluidas: 1 });
  });
});

describe('estaAtrasada', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 20));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('passou da data e não foi concluída', () => {
    expect(estaAtrasada(criarTarefa({ dataLimite: '2026-10-19' }))).toBe(true);
  });

  it('vence hoje ainda não está atrasada', () => {
    expect(estaAtrasada(criarTarefa({ dataLimite: '2026-10-20' }))).toBe(false);
  });

  it('tarefa concluída nunca fica atrasada', () => {
    expect(estaAtrasada(criarTarefa({ dataLimite: '2026-10-01', status: 'concluido' }))).toBe(false);
  });
});

describe('validarTarefa', () => {
  it('aceita uma tarefa certa', () => {
    expect(validarTarefa(criarTarefa())).toBe('');
  });

  it('pede título com pelo menos 3 letras', () => {
    expect(validarTarefa(criarTarefa({ titulo: '' }))).toBe('Informe o título da tarefa.');
    expect(validarTarefa(criarTarefa({ titulo: 'ab' }))).toBe('O título precisa ter pelo menos 3 caracteres.');
  });

  it('não aceita prioridade ou status que não existem', () => {
    expect(validarTarefa(criarTarefa({ prioridade: 'urgente' }))).toBe('Prioridade inválida.');
    expect(validarTarefa(criarTarefa({ status: 'parado' }))).toBe('Status inválido.');
  });
});

describe('validarProjeto', () => {
  const categorias = [{ nome: 'Design', icone: 'bx-palette' }];

  it('não deixa criar projeto repetido, mesmo com maiúscula diferente', () => {
    expect(validarProjeto('design', categorias)).toBe('Já existe um projeto com esse nome.');
  });

  it('aceita um nome novo', () => {
    expect(validarProjeto('Faculdade', categorias)).toBe('');
  });
});
