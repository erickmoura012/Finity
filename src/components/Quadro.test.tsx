// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Quadro from './Quadro';
import { AcoesTarefaContext, type AcoesTarefa } from '../contexts/AcoesTarefaContext';
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

// 2 em "A Fazer", 1 em "Em andamento" e nenhuma concluída
const tarefas = [
  criarTarefa({ id: '1', titulo: 'Estudar React' }),
  criarTarefa({ id: '2', titulo: 'Criar logo' }),
  criarTarefa({ id: '3', titulo: 'Montar o README', status: 'em_andamento' })
];

function montar() {
  const acoes: AcoesTarefa = {
    editar: vi.fn(),
    duplicar: vi.fn(),
    excluir: vi.fn(),
    mover: vi.fn(),
    novaTarefa: vi.fn()
  };

  render(
    <AcoesTarefaContext value={acoes}>
      <Quadro tarefas={tarefas} />
    </AcoesTarefaContext>
  );

  return acoes;
}

// pega a coluna inteira pelo título dela
function coluna(titulo: string) {
  return screen.getByRole('heading', { name: titulo }).closest('.coluna') as HTMLElement;
}

// O jsdom não tem o DataTransfer do arrastar e soltar,
// então esse objeto faz o papel dele: guarda o que o card coloca e devolve pra coluna
function criarDataTransfer() {
  const dados: Record<string, string> = {};
  return {
    effectAllowed: '',
    setData: (tipo: string, valor: string) => { dados[tipo] = valor; },
    getData: (tipo: string) => dados[tipo] ?? ''
  };
}

describe('Quadro', () => {
  it('separa as tarefas por status, com o contador de cada coluna', () => {
    montar();

    expect(within(coluna('A Fazer')).getByText('Estudar React')).toBeTruthy();
    expect(within(coluna('A Fazer')).getByText('2')).toBeTruthy();
    expect(within(coluna('Em andamento')).getByText('Montar o README')).toBeTruthy();
    expect(within(coluna('Concluído')).getByText('Nenhuma tarefa por aqui')).toBeTruthy();
  });

  it('soltar um card em outra coluna move a tarefa', () => {
    const acoes = montar();
    const dataTransfer = criarDataTransfer();
    const card = screen.getByText('Criar logo').closest('.card') as HTMLElement;

    fireEvent.dragStart(card, { dataTransfer });
    expect(card.classList.contains('arrastando')).toBe(true);

    fireEvent.drop(coluna('Concluído'), { dataTransfer });
    fireEvent.dragEnd(card, { dataTransfer });

    expect(acoes.mover).toHaveBeenCalledWith('2', 'concluido');
    expect(card.classList.contains('arrastando')).toBe(false);
  });

  it('a coluna fica destacada enquanto tem um card em cima dela', () => {
    montar();
    const emAndamento = coluna('Em andamento');

    fireEvent.dragOver(emAndamento);
    expect(emAndamento.classList.contains('destaque')).toBe(true);

    // relatedTarget null = o mouse saiu pra fora da coluna
    fireEvent.dragLeave(emAndamento, { relatedTarget: null });
    expect(emAndamento.classList.contains('destaque')).toBe(false);
  });

  it('o + da coluna abre uma tarefa nova já com o status dela', async () => {
    const usuario = userEvent.setup();
    const acoes = montar();

    await usuario.click(screen.getByRole('button', { name: 'Adicionar tarefa em Em andamento' }));

    expect(acoes.novaTarefa).toHaveBeenCalledWith('em_andamento');
  });
});
