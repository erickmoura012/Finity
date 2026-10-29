// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useToast } from './useToast';

describe('useToast', () => {
  // aqui pode trocar todos os timers, porque não tem user-event
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('começa escondido', () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.toast.visivel).toBe(false);
  });

  it('mostra a mensagem com o tipo certo', () => {
    const { result } = renderHook(() => useToast());

    act(() => result.current.mostrarToast('Erro ao salvar', 'erro'));

    expect(result.current.toast).toEqual({ mensagem: 'Erro ao salvar', tipo: 'erro', visivel: true });
  });

  it('esconde depois de 3 segundos, mas mantém o texto pra animação de saída', () => {
    const { result } = renderHook(() => useToast());

    act(() => result.current.mostrarToast('Tarefa criada'));
    act(() => vi.advanceTimersByTime(3000));

    expect(result.current.toast.visivel).toBe(false);
    expect(result.current.toast.mensagem).toBe('Tarefa criada');
  });

  it('uma mensagem nova recomeça os 3 segundos', () => {
    const { result } = renderHook(() => useToast());

    act(() => result.current.mostrarToast('Primeira'));
    act(() => vi.advanceTimersByTime(2000));
    act(() => result.current.mostrarToast('Segunda'));
    act(() => vi.advanceTimersByTime(2000));

    // 4 segundos depois da primeira, mas só 2 depois da segunda: ainda aparece
    expect(result.current.toast.visivel).toBe(true);
    expect(result.current.toast.mensagem).toBe('Segunda');

    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.toast.visivel).toBe(false);
  });
});
