// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useTema } from './useTema';

// funções que o useTema registrou pra saber quando o tema do computador muda
let ouvintes: ((evento: { matches: boolean }) => void)[] = [];

// O jsdom não tem o matchMedia, então esse finge o tema do computador
function computadorNoEscuro(escuro: boolean) {
  vi.stubGlobal('matchMedia', () => ({
    matches: escuro,
    addEventListener: (_tipo: string, funcao: (evento: { matches: boolean }) => void) => ouvintes.push(funcao),
    removeEventListener: vi.fn()
  }));
}

// avisa o hook que o computador trocou de tema
function trocarTemaDoComputador(escuro: boolean) {
  act(() => ouvintes.forEach(funcao => funcao({ matches: escuro })));
}

beforeEach(() => {
  localStorage.clear();
  ouvintes = [];
  document.body.className = '';
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useTema', () => {
  it('sem nada salvo, segue o tema do computador', () => {
    computadorNoEscuro(true);
    const { result } = renderHook(() => useTema());

    expect(result.current.escuro).toBe(true);
    expect(document.body.classList.contains('tema-escuro')).toBe(true);
  });

  it('o tema escolhido vale mais que o do computador', () => {
    localStorage.setItem('finity_tema', 'claro');
    computadorNoEscuro(true);
    const { result } = renderHook(() => useTema());

    expect(result.current.escuro).toBe(false);
  });

  it('trocarTema troca e salva a escolha', () => {
    computadorNoEscuro(false);
    const { result } = renderHook(() => useTema());

    act(() => result.current.trocarTema());

    expect(result.current.escuro).toBe(true);
    expect(localStorage.getItem('finity_tema')).toBe('escuro');
  });

  it('muda junto com o computador enquanto a pessoa não escolheu', () => {
    computadorNoEscuro(false);
    const { result } = renderHook(() => useTema());

    trocarTemaDoComputador(true);
    expect(result.current.escuro).toBe(true);

    trocarTemaDoComputador(false);
    expect(result.current.escuro).toBe(false);
  });

  it('depois de escolher, não muda mais com o computador', () => {
    computadorNoEscuro(false);
    const { result } = renderHook(() => useTema());

    act(() => result.current.trocarTema()); // escolheu o escuro
    trocarTemaDoComputador(false);

    expect(result.current.escuro).toBe(true);
  });
});
