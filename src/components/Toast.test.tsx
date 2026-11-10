// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import Toast from './Toast';

afterEach(cleanup);

describe('Toast', () => {
  it('mostra a mensagem com a classe visivel', () => {
    render(<Toast toast={{ mensagem: 'Tarefa criada com sucesso', tipo: 'sucesso', visivel: true }} />);

    // role="status" é o que faz o leitor de tela ler a mensagem
    const toast = screen.getByRole('status');
    expect(toast.textContent).toContain('Tarefa criada com sucesso');
    expect(toast.className).toBe('toast sucesso visivel');
  });

  it('o erro usa outra classe e outro ícone', () => {
    render(<Toast toast={{ mensagem: 'Erro ao salvar', tipo: 'erro', visivel: true }} />);

    const toast = screen.getByRole('status');
    expect(toast.classList.contains('erro')).toBe(true);
    expect(toast.querySelector('.bx-error-circle')).toBeTruthy();
  });

  it('escondido continua na tela, só sem a classe visivel', () => {
    render(<Toast toast={{ mensagem: 'Tarefa excluída', tipo: 'sucesso', visivel: false }} />);

    // assim a animação de saída ainda mostra o texto
    const toast = screen.getByRole('status');
    expect(toast.classList.contains('visivel')).toBe(false);
    expect(toast.textContent).toContain('Tarefa excluída');
  });
});
