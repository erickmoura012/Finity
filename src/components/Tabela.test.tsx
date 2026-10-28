// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Tabela, { type Ordem } from './Tabela';
import { AcoesTarefaContext, type AcoesTarefa } from '../contexts/AcoesTarefaContext';
import type { Tarefa } from '../../js/script/tarefas';

afterEach(cleanup);

const tarefas: Tarefa[] = [
  {
    id: '1',
    titulo: 'Estudar React',
    descricao: '',
    prioridade: 'alta',
    categoria: 'Estudos',
    dataLimite: '2026-11-10',
    status: 'a_fazer',
    dataCriacao: '2026-10-01T12:00:00.000Z'
  },
  {
    id: '2',
    titulo: 'Criar logo',
    descricao: 'Testar cores',
    prioridade: 'baixa',
    categoria: 'Design',
    dataLimite: '2026-11-12',
    status: 'concluido',
    dataCriacao: '2026-10-02T12:00:00.000Z'
  }
];

function montar(lista: Tarefa[], ordem: Ordem = { campo: '', crescente: true }) {
  const acoes: AcoesTarefa = {
    editar: vi.fn(),
    duplicar: vi.fn(),
    excluir: vi.fn(),
    mover: vi.fn(),
    novaTarefa: vi.fn()
  };
  const aoOrdenar = vi.fn();

  render(
    <AcoesTarefaContext value={acoes}>
      <Tabela tarefas={lista} mensagemVazia="Nenhuma tarefa encontrada." ordem={ordem} aoOrdenar={aoOrdenar} />
    </AcoesTarefaContext>
  );

  return { acoes, aoOrdenar };
}

describe('Tabela', () => {
  it('mostra uma linha pra cada tarefa', () => {
    montar(tarefas);

    // 1 linha do cabeçalho + 2 tarefas
    expect(screen.getAllByRole('row')).toHaveLength(3);
    expect(screen.getByText('Criar logo')).toBeTruthy();
  });

  it('mostra a mensagem quando não tem nenhuma tarefa', () => {
    montar([]);
    expect(screen.getByText('Nenhuma tarefa encontrada.')).toBeTruthy();
  });

  it('clicar no nome da coluna pede pra ordenar por ela', async () => {
    const usuario = userEvent.setup();
    const { aoOrdenar } = montar(tarefas);

    await usuario.click(screen.getByRole('columnheader', { name: 'Prioridade' }));

    expect(aoOrdenar).toHaveBeenCalledWith('prioridade');
  });

  it('coloca a setinha só na coluna que está ordenando', () => {
    montar(tarefas, { campo: 'titulo', crescente: false });

    expect(screen.getByRole('columnheader', { name: 'Tarefa' }).className).toBe('decrescente');
    expect(screen.getByRole('columnheader', { name: 'Categoria' }).className).toBe('');
  });

  it('os botões de cada linha chamam a ação com a tarefa daquela linha', async () => {
    const usuario = userEvent.setup();
    const { acoes } = montar(tarefas);

    await usuario.click(screen.getAllByTitle('Duplicar')[1]);

    expect(acoes.duplicar).toHaveBeenCalledWith(expect.objectContaining({ id: '2' }));
  });
});
