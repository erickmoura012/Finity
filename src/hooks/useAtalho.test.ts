// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, renderHook } from '@testing-library/react';
import { useAtalho } from './useAtalho';

afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
});

function apertar(tecla: string, opcoes = {}, alvo: Element = document.body) {
  // devolve false quando o preventDefault foi chamado
  return fireEvent.keyDown(alvo, { key: tecla, ...opcoes });
}

describe('useAtalho', () => {
  it('chama a ação quando aperta a tecla', () => {
    const acao = vi.fn();
    renderHook(() => useAtalho('n', acao, true));

    const naoCancelado = apertar('n');

    expect(acao).toHaveBeenCalledTimes(1);
    // o preventDefault evita que o "n" seja digitado no campo que recebe o foco
    expect(naoCancelado).toBe(false);
  });

  it('funciona com a letra maiúscula também', () => {
    const acao = vi.fn();
    renderHook(() => useAtalho('n', acao, true));

    apertar('N');

    expect(acao).toHaveBeenCalledTimes(1);
  });

  it('não faz nada quando está desligado', () => {
    const acao = vi.fn();
    renderHook(() => useAtalho('n', acao, false));

    apertar('n');

    expect(acao).not.toHaveBeenCalled();
  });

  it('deixa o Ctrl+N e o Cmd+N com o navegador', () => {
    const acao = vi.fn();
    renderHook(() => useAtalho('n', acao, true));

    apertar('n', { ctrlKey: true });
    apertar('n', { metaKey: true });

    expect(acao).not.toHaveBeenCalled();
  });

  it('não atrapalha quem está digitando num campo', () => {
    const acao = vi.fn();
    renderHook(() => useAtalho('n', acao, true));

    const campo = document.createElement('input');
    document.body.appendChild(campo);
    apertar('n', {}, campo);

    expect(acao).not.toHaveBeenCalled();
  });

  it('remove o evento quando o componente sai da tela', () => {
    const acao = vi.fn();
    const { unmount } = renderHook(() => useAtalho('n', acao, true));

    unmount();
    apertar('n');

    expect(acao).not.toHaveBeenCalled();
  });
});
