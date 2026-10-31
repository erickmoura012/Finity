// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import {
  listarTarefas,
  criarTarefa,
  atualizarTarefa,
  excluirTarefa,
  listarCategorias,
  criarCategoria,
  renomearCategoria,
  excluirCategoria
} from './api.ts';
import type { NovaTarefa } from './api.ts';
import { CATEGORIAS_PADRAO } from './tarefas.ts';

// o jsdom tem um localStorage de mentira, então os testes não mexem em dado nenhum de verdade.
// Cada teste começa com ele vazio, como se fosse a primeira vez abrindo o sistema.
beforeEach(() => {
  localStorage.clear();
});

const nova: NovaTarefa = {
  titulo: 'Estudar React',
  descricao: '',
  prioridade: 'media',
  categoria: 'Estudos',
  dataLimite: '2026-11-10',
  status: 'a_fazer'
};

// sem isso o listarTarefas cria as tarefas de exemplo
function comecarSemTarefas() {
  localStorage.setItem('finity_tarefas', '[]');
}

describe('listarTarefas', () => {
  it('na primeira vez cria as tarefas de exemplo e salva', async () => {
    const tarefas = await listarTarefas();
    expect(tarefas.length).toBeGreaterThan(0);
    expect(JSON.parse(localStorage.getItem('finity_tarefas')!)).toHaveLength(tarefas.length);
  });

  it('devolve lista vazia se o que está salvo não é um JSON', async () => {
    localStorage.setItem('finity_tarefas', 'isso não é json');
    expect(await listarTarefas()).toEqual([]);
  });
});

describe('criarTarefa', () => {
  it('gera o id e a data de criação e guarda no LocalStorage', async () => {
    comecarSemTarefas();
    const tarefa = await criarTarefa(nova);

    expect(tarefa.id).toBeTruthy();
    expect(tarefa.dataCriacao).toBeTruthy();
    expect(tarefa.titulo).toBe('Estudar React');
    expect(await listarTarefas()).toEqual([tarefa]);
  });

  it('cada tarefa ganha um id diferente', async () => {
    comecarSemTarefas();
    const primeira = await criarTarefa(nova);
    const segunda = await criarTarefa(nova);
    expect(primeira.id).not.toBe(segunda.id);
  });
});

describe('atualizarTarefa', () => {
  it('muda só o que foi passado e mantém o id e a data de criação', async () => {
    comecarSemTarefas();
    const tarefa = await criarTarefa(nova);

    const atualizada = await atualizarTarefa(tarefa.id, { status: 'concluido', id: 'outro' });

    expect(atualizada.status).toBe('concluido');
    expect(atualizada.titulo).toBe('Estudar React');
    expect(atualizada.id).toBe(tarefa.id);
    expect(atualizada.dataCriacao).toBe(tarefa.dataCriacao);
  });

  it('dá erro se a tarefa não existe', async () => {
    comecarSemTarefas();
    await expect(atualizarTarefa('nao-existe', { titulo: 'x' })).rejects.toThrow('Tarefa não encontrada');
  });
});

describe('excluirTarefa', () => {
  it('tira só a tarefa escolhida', async () => {
    comecarSemTarefas();
    const fica = await criarTarefa(nova);
    const sai = await criarTarefa({ ...nova, titulo: 'Sai' });

    await excluirTarefa(sai.id);

    expect((await listarTarefas()).map(t => t.id)).toEqual([fica.id]);
  });
});

describe('listarCategorias', () => {
  it('na primeira vez começa com as categorias padrão', async () => {
    expect(await listarCategorias()).toEqual(CATEGORIAS_PADRAO);
  });

  it('criar um projeto não altera a lista padrão', async () => {
    await criarCategoria('Faculdade');
    expect(CATEGORIAS_PADRAO).toHaveLength(5);
    expect(await listarCategorias()).toHaveLength(6);
  });
});

describe('criarCategoria', () => {
  it('projeto novo usa o ícone de pasta', async () => {
    const categoria = await criarCategoria('Faculdade');
    expect(categoria).toEqual({ nome: 'Faculdade', icone: 'bx-folder' });
  });
});

describe('renomearCategoria', () => {
  it('muda o nome do projeto e das tarefas dele, mantendo o ícone', async () => {
    comecarSemTarefas();
    await criarTarefa(nova);
    await criarTarefa({ ...nova, categoria: 'Design' });

    const categoria = await renomearCategoria('Estudos', 'Faculdade');
    const categorias = await listarCategorias();
    const tarefas = await listarTarefas();

    expect(categoria).toEqual({ nome: 'Faculdade', icone: 'bx-book-open' });
    expect(categorias.map(c => c.nome)).toContain('Faculdade');
    expect(categorias.map(c => c.nome)).not.toContain('Estudos');
    expect(tarefas.map(t => t.categoria)).toEqual(['Faculdade', 'Design']);
  });

  it('dá erro se o projeto não existe', async () => {
    await expect(renomearCategoria('Nada', 'Outro')).rejects.toThrow('Projeto não encontrado');
  });
});

describe('excluirCategoria', () => {
  it('tira o projeto e as tarefas dele, as outras ficam', async () => {
    comecarSemTarefas();
    await criarTarefa(nova);
    const fica = await criarTarefa({ ...nova, categoria: 'Design' });

    await excluirCategoria('Estudos');

    expect((await listarCategorias()).map(c => c.nome)).not.toContain('Estudos');
    expect((await listarTarefas()).map(t => t.id)).toEqual([fica.id]);
  });
});
