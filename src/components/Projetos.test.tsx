// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Projetos from './Projetos';
import { AcoesTarefaContext, type AcoesTarefa } from '../contexts/AcoesTarefaContext';
import type { Tarefa } from '../../js/script/tarefas';

afterEach(cleanup);

const categorias = [
  { nome: 'Estudos', icone: 'bx-book-open' },
  { nome: 'Design', icone: 'bx-palette' }
];

function criarTarefa(dados: Partial<Tarefa>): Tarefa {
  return {
    id: '1',
    titulo: 'Tarefa',
    descricao: '',
    prioridade: 'media',
    categoria: 'Estudos',
    dataLimite: '2026-11-10',
    status: 'a_fazer',
    dataCriacao: '2026-11-01T10:00:00.000Z',
    ...dados
  };
}

// Estudos tem 4 tarefas (1 concluída), Design tem 1
const tarefas = [
  criarTarefa({ id: '1' }),
  criarTarefa({ id: '2', status: 'em_andamento' }),
  criarTarefa({ id: '3', status: 'concluido' }),
  criarTarefa({ id: '4' }),
  criarTarefa({ id: '5', categoria: 'Design' })
];

function montar() {
  const acoes: AcoesTarefa = {
    editar: vi.fn(),
    duplicar: vi.fn(),
    excluir: vi.fn(),
    mover: vi.fn(),
    novaTarefa: vi.fn()
  };
  const aoAbrirProjeto = vi.fn();
  const aoEditar = vi.fn();
  const aoExcluir = vi.fn();

  render(
    <AcoesTarefaContext value={acoes}>
      <Projetos
        tarefas={tarefas}
        categorias={categorias}
        aoAbrirProjeto={aoAbrirProjeto}
        aoEditar={aoEditar}
        aoExcluir={aoExcluir}
      />
    </AcoesTarefaContext>
  );

  return { acoes, aoAbrirProjeto, aoEditar, aoExcluir };
}

// o card inteiro é o pai do título
function cardDe(nome: string) {
  return screen.getByRole('heading', { name: nome }).parentElement!;
}

describe('Projetos', () => {
  it('mostra a contagem e o progresso de cada projeto', () => {
    montar();

    const estudos = within(cardDe('Estudos'));
    expect(estudos.getByText('4 tarefas')).toBeTruthy();
    expect(estudos.getByText('2 a fazer')).toBeTruthy();
    expect(estudos.getByText('1 em andamento')).toBeTruthy();
    expect(estudos.getByText('1 concluída')).toBeTruthy();
    expect(estudos.getByText('25% concluído')).toBeTruthy();

    const design = within(cardDe('Design'));
    expect(design.getByText('1 tarefa')).toBeTruthy();
    expect(design.getByText('0% concluído')).toBeTruthy();
  });

  it('clicar no card abre o projeto', async () => {
    const usuario = userEvent.setup();
    const { aoAbrirProjeto } = montar();

    await usuario.click(screen.getByRole('heading', { name: 'Design' }));

    expect(aoAbrirProjeto).toHaveBeenCalledWith('Design');
  });

  it('os botões chamam a ação certa sem abrir o projeto junto', async () => {
    const usuario = userEvent.setup();
    const { acoes, aoAbrirProjeto, aoEditar, aoExcluir } = montar();

    await usuario.click(screen.getByRole('button', { name: 'Adicionar tarefa no projeto Design' }));
    await usuario.click(screen.getByRole('button', { name: 'Editar projeto Design' }));
    await usuario.click(screen.getByRole('button', { name: 'Excluir projeto Design' }));

    // a tarefa nova já começa em "A Fazer" e no projeto clicado
    expect(acoes.novaTarefa).toHaveBeenCalledWith('a_fazer', 'Design');
    expect(aoEditar).toHaveBeenCalledWith(categorias[1]);
    expect(aoExcluir).toHaveBeenCalledWith(categorias[1]);
    // o stopPropagation impede o clique de chegar no card
    expect(aoAbrirProjeto).not.toHaveBeenCalled();
  });
});
