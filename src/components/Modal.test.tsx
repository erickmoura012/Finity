// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import Modal from './Modal';

afterEach(cleanup);

function montar(aberto = true) {
  const aoFechar = vi.fn();

  render(
    <Modal aberto={aberto} idTitulo="tituloTeste" aoFechar={aoFechar}>
      <h2 id="tituloTeste">Nova tarefa</h2>
      <input aria-label="Título" />
    </Modal>
  );

  return aoFechar;
}

describe('Modal', () => {
  it('é um diálogo com o nome que vem do título', () => {
    montar();
    expect(screen.getByRole('dialog', { name: 'Nova tarefa' })).toBeTruthy();
  });

  it('fecha com ESC quando está aberto', () => {
    const aoFechar = montar();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(aoFechar).toHaveBeenCalledTimes(1);
  });

  it('não escuta o ESC quando está fechado', () => {
    const aoFechar = montar(false);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(aoFechar).not.toHaveBeenCalled();
  });

  it('fecha clicando no fundo, mas não clicando dentro da caixa', () => {
    const aoFechar = montar();

    fireEvent.mouseDown(screen.getByLabelText('Título'));
    expect(aoFechar).not.toHaveBeenCalled();

    // o fundo é o elemento em volta da caixa do diálogo
    fireEvent.mouseDown(screen.getByRole('dialog').parentElement!);
    expect(aoFechar).toHaveBeenCalledTimes(1);
  });
});
