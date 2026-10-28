// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormTarefa from './FormTarefa';
import type { DadosTarefa, Tarefa } from '../../js/script/tarefas';

// sem o globals do Vitest, a Testing Library não limpa a tela sozinha entre os testes
afterEach(cleanup);

const categorias = [
  { nome: 'Estudos', icone: 'bx-book-open' },
  { nome: 'Design', icone: 'bx-palette' }
];

const valoresIniciais: DadosTarefa = {
  titulo: '',
  descricao: '',
  prioridade: 'media',
  categoria: 'Estudos',
  dataLimite: '2026-10-30',
  status: 'a_fazer'
};

function montar(tarefaEditando: Tarefa | null = null) {
  const aoSalvar = vi.fn();
  const aoCancelar = vi.fn();

  render(
    <FormTarefa
      valoresIniciais={valoresIniciais}
      categorias={categorias}
      tarefaEditando={tarefaEditando}
      aoCancelar={aoCancelar}
      aoSalvar={aoSalvar}
    />
  );

  return { aoSalvar, aoCancelar };
}

describe('FormTarefa', () => {
  it('mostra o erro e não salva quando o título está vazio', async () => {
    const usuario = userEvent.setup();
    const { aoSalvar } = montar();

    await usuario.click(screen.getByRole('button', { name: 'Criar tarefa' }));

    expect(screen.getByText('Informe o título da tarefa.')).toBeTruthy();
    expect(screen.getByLabelText('Título').className).toContain('invalido');
    expect(aoSalvar).not.toHaveBeenCalled();
  });

  it('salva com os campos preenchidos e sem espaços sobrando no título', async () => {
    const usuario = userEvent.setup();
    const { aoSalvar } = montar();

    await usuario.type(screen.getByLabelText('Título'), '  Estudar React  ');
    await usuario.selectOptions(screen.getByLabelText('Prioridade'), 'alta');
    await usuario.selectOptions(screen.getByLabelText('Categoria'), 'Design');
    await usuario.click(screen.getByRole('button', { name: 'Criar tarefa' }));

    expect(aoSalvar).toHaveBeenCalledWith({
      ...valoresIniciais,
      titulo: 'Estudar React',
      prioridade: 'alta',
      categoria: 'Design'
    });
  });

  it('chama o aoCancelar no botão Cancelar', async () => {
    const usuario = userEvent.setup();
    const { aoCancelar } = montar();

    await usuario.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(aoCancelar).toHaveBeenCalledTimes(1);
  });

  it('muda os textos quando está editando uma tarefa', () => {
    montar({
      ...valoresIniciais,
      id: '1',
      titulo: 'Tarefa antiga',
      prioridade: 'baixa',
      status: 'em_andamento',
      dataCriacao: '2026-10-01T12:00:00.000Z'
    });

    expect(screen.getByRole('heading', { name: 'Editar tarefa' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Salvar alterações' })).toBeTruthy();
    expect(screen.getByText('Criada em 01/10/2026')).toBeTruthy();
  });
});
