// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormProjeto from './FormProjeto';
import type { Categoria } from '../../js/script/tarefas';

afterEach(cleanup);

const categorias = [
  { nome: 'Estudos', icone: 'bx-book-open' },
  { nome: 'Design', icone: 'bx-palette' }
];

function montar(projetoEditando: Categoria | null = null) {
  const aoSalvar = vi.fn();
  const aoCancelar = vi.fn();

  render(
    <FormProjeto
      categorias={categorias}
      projetoEditando={projetoEditando}
      aoCancelar={aoCancelar}
      aoSalvar={aoSalvar}
    />
  );

  return { aoSalvar, aoCancelar };
}

describe('FormProjeto', () => {
  it('cria o projeto com o nome digitado, sem os espaços das pontas', async () => {
    const usuario = userEvent.setup();
    const { aoSalvar } = montar();

    expect(screen.getByRole('heading', { name: 'Novo projeto' })).toBeTruthy();
    await usuario.type(screen.getByLabelText('Nome do projeto'), '  Faculdade  ');
    await usuario.click(screen.getByRole('button', { name: 'Criar projeto' }));

    // sem escolher, fica com a pasta
    expect(aoSalvar).toHaveBeenCalledWith('Faculdade', 'bx-folder');
  });

  it('salva com o ícone escolhido', async () => {
    const usuario = userEvent.setup();
    const { aoSalvar } = montar();

    await usuario.type(screen.getByLabelText('Nome do projeto'), 'Academia');
    await usuario.click(screen.getByRole('button', { name: 'Ícone Academia' }));

    expect(screen.getByRole('button', { name: 'Ícone Academia' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: 'Ícone Pasta' }).getAttribute('aria-pressed')).toBe('false');

    await usuario.click(screen.getByRole('button', { name: 'Criar projeto' }));
    expect(aoSalvar).toHaveBeenCalledWith('Academia', 'bx-dumbbell');
  });

  it('mostra o erro e não salva quando o nome já existe', async () => {
    const usuario = userEvent.setup();
    const { aoSalvar } = montar();

    await usuario.type(screen.getByLabelText('Nome do projeto'), 'design');
    await usuario.click(screen.getByRole('button', { name: 'Criar projeto' }));

    expect(screen.getByText('Já existe um projeto com esse nome.')).toBeTruthy();
    expect(aoSalvar).not.toHaveBeenCalled();
  });

  it('ao renomear, começa com o nome atual e o botão vira Salvar', async () => {
    const usuario = userEvent.setup();
    const { aoSalvar } = montar(categorias[1]);

    expect(screen.getByRole('heading', { name: 'Renomear projeto' })).toBeTruthy();
    const campo = screen.getByLabelText<HTMLInputElement>('Nome do projeto');
    expect(campo.value).toBe('Design');

    await usuario.clear(campo);
    await usuario.type(campo, 'Visual');
    await usuario.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(aoSalvar).toHaveBeenCalledWith('Visual', 'bx-palette');
  });

  it('ao renomear, o próprio nome não conta como repetido', async () => {
    const usuario = userEvent.setup();
    const { aoSalvar } = montar(categorias[1]);

    const campo = screen.getByLabelText('Nome do projeto');
    await usuario.clear(campo);
    await usuario.type(campo, 'design');
    await usuario.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(aoSalvar).toHaveBeenCalledWith('design', 'bx-palette');
  });

  it('salvar sem mudar o nome só fecha o modal', async () => {
    const usuario = userEvent.setup();
    const { aoSalvar, aoCancelar } = montar(categorias[1]);

    await usuario.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(aoCancelar).toHaveBeenCalledTimes(1);
    expect(aoSalvar).not.toHaveBeenCalled();
  });
});
