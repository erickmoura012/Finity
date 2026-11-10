// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router';
import App from './App';

// Mostra a URL atual na tela, pra o teste conseguir conferir o que mudou nela
function UrlAtual() {
  const location = useLocation();
  return <output data-testid="url">{location.pathname + location.search}</output>;
}

function montar(caminho: string) {
  render(
    <MemoryRouter initialEntries={[caminho]}>
      <App />
      <UrlAtual />
    </MemoryRouter>
  );
}

function url() {
  return decodeURIComponent(screen.getByTestId('url').textContent ?? '');
}

beforeEach(() => {
  // começa sem nada salvo, então o App cria as 7 tarefas de exemplo
  localStorage.clear();
  // o jsdom não tem o matchMedia, que o useTema usa pra ver o tema do computador
  vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('App', () => {
  it('abre a página que está na URL', async () => {
    montar('/projetos');

    expect(screen.getByRole('heading', { level: 1, name: 'Meus projetos' })).toBeTruthy();
    // os cards aparecem depois que as tarefas carregam
    expect(await screen.findByRole('heading', { name: 'Design' })).toBeTruthy();
  });

  it('trocar de página pelo menu muda a URL', async () => {
    const usuario = userEvent.setup();
    montar('/');

    await usuario.click(screen.getByRole('link', { name: 'Concluídas' }));

    expect(url()).toBe('/concluidas');
    expect(screen.getByRole('heading', { level: 1, name: 'Concluídas' })).toBeTruthy();
  });

  it('o título da aba muda junto com a página', async () => {
    const usuario = userEvent.setup();
    montar('/');
    expect(document.title).toBe('Dashboard | Finity');

    await usuario.click(screen.getByRole('link', { name: 'Tarefas' }));
    expect(document.title).toBe('Tarefas | Finity');
  });

  it('um link com filtro já abre filtrado', async () => {
    montar('/tarefas?categoria=Design');

    expect(await screen.findByText('Mostrando 2 de 7 tarefas')).toBeTruthy();
    expect(screen.getByRole<HTMLSelectElement>('combobox', { name: 'Filtrar por categoria' }).value).toBe('Design');
  });

  it('o filtro Atrasadas mostra só as que passaram da data e não foram concluídas', async () => {
    const usuario = userEvent.setup();
    montar('/tarefas');
    await screen.findByText('7 tarefas');

    await usuario.selectOptions(screen.getByRole('combobox', { name: 'Filtrar por status' }), 'Atrasadas');

    expect(url()).toBe('/tarefas?status=atrasadas');
    // das tarefas de exemplo, 3 passaram da data, mas 2 delas já estão concluídas
    expect(screen.getByText('Mostrando 1 de 7 tarefas')).toBeTruthy();
    expect(screen.getByText('Corrigir validação do formulário de login')).toBeTruthy();
    expect(screen.queryByText('Revisar paleta de cores')).toBeNull();
  });

  it('ordenar põe a ordem na URL e mantém os filtros', async () => {
    const usuario = userEvent.setup();
    montar('/tarefas?categoria=Design');
    await screen.findByText('Mostrando 2 de 7 tarefas');

    await usuario.click(screen.getByRole('columnheader', { name: 'Tarefa' }));
    expect(url()).toBe('/tarefas?categoria=Design&ordem=titulo');

    // clicar de novo inverte
    await usuario.click(screen.getByRole('columnheader', { name: 'Tarefa' }));
    expect(url()).toBe('/tarefas?categoria=Design&ordem=titulo&desc=1');

    // e o Limpar tira só os filtros
    await usuario.click(screen.getByRole('button', { name: 'Limpar' }));
    expect(url()).toBe('/tarefas?ordem=titulo&desc=1');
  });

  it('caminho que não existe mostra a página 404', async () => {
    const usuario = userEvent.setup();
    montar('/tarefa');

    expect(await screen.findByRole('heading', { level: 2, name: 'Página não encontrada' })).toBeTruthy();
    // na 404 não tem filtro
    expect(screen.queryByRole('combobox', { name: 'Filtrar por categoria' })).toBeNull();
    expect(document.title).toBe('Página não encontrada | Finity');

    await usuario.click(screen.getByRole('link', { name: 'Voltar pro dashboard' }));

    expect(url()).toBe('/');
    expect(screen.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeTruthy();
  });
});
