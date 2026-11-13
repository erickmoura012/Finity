// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import NaoEncontrada from './NaoEncontrada';

afterEach(cleanup);

describe('NaoEncontrada', () => {
  it('avisa que a página não existe e tem um link pro dashboard', () => {
    // o Link do React Router só funciona dentro de um Router
    render(
      <MemoryRouter>
        <NaoEncontrada />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Página não encontrada' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Voltar pro dashboard' }).getAttribute('href')).toBe('/');
  });
});
