// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import Sidebar from './Sidebar';

afterEach(cleanup);

// O NavLink precisa de um Router em volta. O MemoryRouter é um router de mentira,
// que guarda a URL na memória em vez de mexer na barra do navegador.
function montar(caminho = '/') {
  const aoFecharMenu = vi.fn();
  const aoExportar = vi.fn();
  const aoImportar = vi.fn();

  const { container } = render(
    <MemoryRouter initialEntries={[caminho]}>
      <Sidebar aberta={false} aoFecharMenu={aoFecharMenu} aoExportar={aoExportar} aoImportar={aoImportar} />
    </MemoryRouter>
  );

  return { container, aoFecharMenu, aoExportar, aoImportar };
}

describe('Sidebar', () => {
  it('tem um link pra cada página, com o caminho certo', () => {
    montar();

    expect(screen.getByRole('link', { name: 'Dashboard' }).getAttribute('href')).toBe('/');
    expect(screen.getByRole('link', { name: 'Meus projetos' }).getAttribute('href')).toBe('/projetos');
    expect(screen.getByRole('link', { name: 'Tarefas' }).getAttribute('href')).toBe('/tarefas');
    expect(screen.getByRole('link', { name: 'Concluídas' }).getAttribute('href')).toBe('/concluidas');
  });

  it('marca só o link da página atual', () => {
    montar('/projetos');

    expect(screen.getByRole('link', { name: 'Meus projetos' }).className).toContain('ativo');
    // o "/" é o começo de todos os caminhos, mas só conta como ativo quando é exatamente ele
    expect(screen.getByRole('link', { name: 'Dashboard' }).className).not.toContain('ativo');
  });

  it('no dashboard, o link Dashboard é o ativo', () => {
    montar('/');
    expect(screen.getByRole('link', { name: 'Dashboard' }).className).toContain('ativo');
  });

  it('avisa pra fechar o menu ao escolher uma página', async () => {
    const usuario = userEvent.setup();
    const { aoFecharMenu } = montar();

    await usuario.click(screen.getByRole('link', { name: 'Tarefas' }));

    expect(aoFecharMenu).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('link', { name: 'Tarefas' }).className).toContain('ativo');
  });

  it('o botão Exportar chama a exportação', async () => {
    const usuario = userEvent.setup();
    const { aoExportar } = montar();

    await usuario.click(screen.getByRole('button', { name: 'Exportar tarefas' }));

    expect(aoExportar).toHaveBeenCalledTimes(1);
  });

  it('escolher um arquivo chama a importação com ele', () => {
    const { container, aoImportar } = montar();
    const arquivo = new File(['{}'], 'backup.json', { type: 'application/json' });

    // o input fica escondido (o botão Importar é que abre ele), então o change é disparado direto
    const campo = container.querySelector('input[type="file"]')!;
    fireEvent.change(campo, { target: { files: [arquivo] } });

    expect(aoImportar).toHaveBeenCalledWith(arquivo);
  });
});
