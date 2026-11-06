// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import Indicadores from './Indicadores';
import type { Tarefa } from '../../js/script/tarefas';

afterEach(cleanup);

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

// pega o cartão inteiro pelo título dele
function cartao(titulo: string) {
  return within(screen.getByText(titulo).closest('.indicador') as HTMLElement);
}

describe('Indicadores', () => {
  it('conta as tarefas de cada status com a porcentagem', () => {
    // 2 pendentes, 1 em andamento e 1 concluída
    const tarefas = [
      criarTarefa({ id: '1' }),
      criarTarefa({ id: '2' }),
      criarTarefa({ id: '3', status: 'em_andamento' }),
      criarTarefa({ id: '4', status: 'concluido' })
    ];
    render(<Indicadores tarefas={tarefas} />);

    expect(cartao('Total de tarefas').getByText('4')).toBeTruthy();
    expect(cartao('Pendentes').getByText('2')).toBeTruthy();
    expect(cartao('Pendentes').getByText('50% do total')).toBeTruthy();
    expect(cartao('Em andamento').getByText('25% do total')).toBeTruthy();
    expect(cartao('Concluídas').getByText('25% do total')).toBeTruthy();
  });

  it('sem tarefas mostra 0% em vez de dar erro na divisão', () => {
    render(<Indicadores tarefas={[]} />);

    expect(cartao('Total de tarefas').getByText('0')).toBeTruthy();
    expect(screen.getAllByText('0% do total')).toHaveLength(3);
  });
});
