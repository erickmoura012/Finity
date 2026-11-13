// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Topo from './Topo';

afterEach(cleanup);

function montar(temaEscuro = false) {
  const aoAbrirMenu = vi.fn();
  const aoTrocarTema = vi.fn();
  const aoClicarAdicionar = vi.fn();

  render(
    <Topo
      titulo="Tarefas"
      subtitulo="Todas as tarefas cadastradas"
      textoBotao="Nova tarefa"
      temaEscuro={temaEscuro}
      aoAbrirMenu={aoAbrirMenu}
      aoTrocarTema={aoTrocarTema}
      aoClicarAdicionar={aoClicarAdicionar}
    />
  );

  return { aoAbrirMenu, aoTrocarTema, aoClicarAdicionar };
}

describe('Topo', () => {
  it('mostra o título e o subtítulo da página', () => {
    montar();

    expect(screen.getByRole('heading', { level: 1, name: 'Tarefas' })).toBeTruthy();
    expect(screen.getByText('Todas as tarefas cadastradas')).toBeTruthy();
  });

  it('o botão de adicionar usa o texto que recebeu', async () => {
    const usuario = userEvent.setup();
    const { aoClicarAdicionar } = montar();

    await usuario.click(screen.getByRole('button', { name: 'Nova tarefa' }));

    expect(aoClicarAdicionar).toHaveBeenCalledOnce();
  });

  it('o botão do tema oferece o tema contrário do atual', async () => {
    const usuario = userEvent.setup();
    const { aoTrocarTema } = montar(true);

    // no escuro, o botão é pra voltar pro claro
    await usuario.click(screen.getByRole('button', { name: 'Usar tema claro' }));
    expect(aoTrocarTema).toHaveBeenCalledOnce();

    cleanup();
    montar(false);
    expect(screen.getByRole('button', { name: 'Usar tema escuro' })).toBeTruthy();
  });

  it('o botão de menu (do celular) abre o menu', async () => {
    const usuario = userEvent.setup();
    const { aoAbrirMenu } = montar();

    await usuario.click(screen.getByRole('button', { name: 'Abrir menu' }));

    expect(aoAbrirMenu).toHaveBeenCalledOnce();
  });
});
