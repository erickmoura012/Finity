// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Card from './Card';
import { AcoesTarefaContext, type AcoesTarefa } from '../contexts/AcoesTarefaContext';
import type { Tarefa } from '../../js/script/tarefas';

const tarefa: Tarefa = {
  id: '1',
  titulo: 'Estudar React',
  descricao: 'Ver hooks e contexto',
  prioridade: 'alta',
  categoria: 'Estudos',
  dataLimite: '2026-10-25',
  status: 'a_fazer',
  dataCriacao: '2026-10-01T12:00:00.000Z'
};

// no lugar das ações de verdade, funções "espiãs" que só guardam se foram chamadas
function criarAcoes(): AcoesTarefa {
  return {
    editar: vi.fn(),
    duplicar: vi.fn(),
    excluir: vi.fn(),
    mover: vi.fn(),
    novaTarefa: vi.fn()
  };
}

function montar(dados: Partial<Tarefa> = {}) {
  const acoes = criarAcoes();

  render(
    <AcoesTarefaContext value={acoes}>
      <Card tarefa={{ ...tarefa, ...dados }} />
    </AcoesTarefaContext>
  );

  return acoes;
}

describe('Card', () => {
  // fixa o "hoje" em 28/10/2026, mas só a data (o user-event usa os timers de verdade)
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 9, 28));
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('mostra os dados da tarefa', () => {
    montar();

    expect(screen.getByText('Estudar React')).toBeTruthy();
    expect(screen.getByText('Ver hooks e contexto')).toBeTruthy();
    expect(screen.getByText('Alta')).toBeTruthy();
    expect(screen.getByText('Estudos')).toBeTruthy();
  });

  it('os botões dizem de qual tarefa são (pra quem usa leitor de tela)', () => {
    montar();

    expect(screen.getByRole('button', { name: 'Editar tarefa Estudar React' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Duplicar tarefa Estudar React' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Excluir tarefa Estudar React' })).toBeTruthy();
  });

  it('marca a data em vermelho quando a tarefa está atrasada', () => {
    montar();
    expect(screen.getByTitle('Atrasada').className).toContain('atrasada');
  });

  it('não marca como atrasada se já foi concluída', () => {
    montar({ status: 'concluido' });
    expect(screen.queryByTitle('Atrasada')).toBeNull();
  });

  it('clicar no card abre a edição', async () => {
    const usuario = userEvent.setup();
    const acoes = montar();

    await usuario.click(screen.getByText('Estudar React'));

    expect(acoes.editar).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }));
  });

  it('o botão de excluir não abre a edição junto', async () => {
    const usuario = userEvent.setup();
    const acoes = montar();

    await usuario.click(screen.getByTitle('Excluir'));

    expect(acoes.excluir).toHaveBeenCalledTimes(1);
    // o stopPropagation impede o clique de chegar no card
    expect(acoes.editar).not.toHaveBeenCalled();
  });
});
