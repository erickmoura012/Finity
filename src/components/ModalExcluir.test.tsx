// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ModalExcluir from './ModalExcluir';

afterEach(cleanup);

function montar() {
  const aoCancelar = vi.fn();
  const aoConfirmar = vi.fn();

  render(
    <ModalExcluir
      aberto
      titulo="Excluir projeto?"
      mensagem={<>O projeto <strong>"Design"</strong> será removido.</>}
      aoCancelar={aoCancelar}
      aoConfirmar={aoConfirmar}
    />
  );

  return { aoCancelar, aoConfirmar };
}

describe('ModalExcluir', () => {
  it('mostra o título e a mensagem que recebeu', () => {
    montar();

    // o título também vira o nome do diálogo pro leitor de tela
    expect(screen.getByRole('dialog', { name: 'Excluir projeto?' })).toBeTruthy();
    expect(screen.getByText('"Design"').tagName).toBe('STRONG');
  });

  it('o botão Excluir confirma', async () => {
    const usuario = userEvent.setup();
    const { aoCancelar, aoConfirmar } = montar();

    await usuario.click(screen.getByRole('button', { name: 'Excluir' }));

    expect(aoConfirmar).toHaveBeenCalledOnce();
    expect(aoCancelar).not.toHaveBeenCalled();
  });

  it('Cancelar e o ESC não excluem', async () => {
    const usuario = userEvent.setup();
    const { aoCancelar, aoConfirmar } = montar();

    await usuario.click(screen.getByRole('button', { name: 'Cancelar' }));
    await usuario.keyboard('{Escape}');

    expect(aoCancelar).toHaveBeenCalledTimes(2);
    expect(aoConfirmar).not.toHaveBeenCalled();
  });
});
