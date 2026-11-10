// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useTarefas } from './useTarefas';
import { criarTarefa } from '../../js/script/api';

beforeEach(() => {
  // sem nada salvo, o api.ts cria as 7 tarefas de exemplo e os 5 projetos padrão
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useTarefas', () => {
  it('começa carregando e depois traz as tarefas e os projetos', async () => {
    const { result } = renderHook(() => useTarefas());
    expect(result.current.carregando).toBe(true);

    await waitFor(() => expect(result.current.carregando).toBe(false));

    expect(result.current.tarefas).toHaveLength(7);
    expect(result.current.categorias).toHaveLength(5);
    expect(result.current.erro).toBe('');
  });

  it('recarregar traz o que mudou no LocalStorage', async () => {
    const { result } = renderHook(() => useTarefas());
    await waitFor(() => expect(result.current.carregando).toBe(false));

    await criarTarefa({
      titulo: 'Tarefa nova',
      descricao: '',
      prioridade: 'alta',
      categoria: 'Estudos',
      dataLimite: '2026-11-20',
      status: 'a_fazer'
    });
    await act(() => result.current.recarregar());

    expect(result.current.tarefas).toHaveLength(8);
    expect(result.current.tarefas.some(t => t.titulo === 'Tarefa nova')).toBe(true);
  });

  it('mostra uma mensagem quando não consegue ler os dados', async () => {
    // finge um navegador com o LocalStorage bloqueado
    const lerBloqueado = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('LocalStorage bloqueado');
    });
    // o hook mostra o erro no console, aqui não precisa aparecer
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useTarefas());
    await waitFor(() => expect(result.current.carregando).toBe(false));

    expect(result.current.erro).toBe('Não foi possível carregar os dados');
    expect(result.current.tarefas).toEqual([]);

    // quando volta a funcionar, o recarregar limpa o erro
    lerBloqueado.mockRestore();
    await act(() => result.current.recarregar());

    expect(result.current.erro).toBe('');
    expect(result.current.tarefas).toHaveLength(7);
  });
});
