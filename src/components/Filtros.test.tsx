// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Filtros, { type FiltrosTela } from './Filtros';

afterEach(cleanup);

const categorias = [
  { nome: 'Estudos', icone: 'bx-book-open' },
  { nome: 'Design', icone: 'bx-palette' }
];

// já começa com uma busca, pra conferir que ela não se perde ao mudar outro filtro
const filtros: FiltrosTela = { busca: 'react', prioridade: '', categoria: '', status: '' };

function montar(mostrarStatus = false) {
  const aoMudar = vi.fn();
  const aoLimpar = vi.fn();

  render(
    <Filtros
      filtros={filtros}
      categorias={categorias}
      mostrarStatus={mostrarStatus}
      aoMudar={aoMudar}
      aoLimpar={aoLimpar}
    />
  );

  return { aoMudar, aoLimpar };
}

describe('Filtros', () => {
  it('mostra os valores que recebeu e as categorias', () => {
    montar();

    expect(screen.getByRole<HTMLInputElement>('textbox', { name: 'Pesquisar tarefas' }).value).toBe('react');
    expect(screen.getByRole('option', { name: 'Estudos' })).toBeTruthy();
    expect(screen.getByRole('option', { name: 'Design' })).toBeTruthy();
  });

  it('mudar um filtro mantém os outros', async () => {
    const usuario = userEvent.setup();
    const { aoMudar } = montar();

    await usuario.selectOptions(screen.getByRole('combobox', { name: 'Filtrar por categoria' }), 'Design');

    expect(aoMudar).toHaveBeenCalledWith({ ...filtros, categoria: 'Design' });
  });

  it('o filtro de status só aparece quando é pedido', () => {
    montar();
    expect(screen.queryByRole('combobox', { name: 'Filtrar por status' })).toBeNull();

    cleanup();
    montar(true);
    expect(screen.getByRole('combobox', { name: 'Filtrar por status' })).toBeTruthy();
  });

  it('o botão Limpar chama o aoLimpar', async () => {
    const usuario = userEvent.setup();
    const { aoLimpar } = montar();

    await usuario.click(screen.getByRole('button', { name: 'Limpar' }));

    expect(aoLimpar).toHaveBeenCalledOnce();
  });
});
