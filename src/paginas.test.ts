import { describe, expect, it } from 'vitest';
import { PAGINAS, paginaDoCaminho, type Pagina } from './paginas';

describe('paginaDoCaminho', () => {
  it('descobre a página pelo caminho da URL', () => {
    expect(paginaDoCaminho('/')).toBe('dashboard');
    expect(paginaDoCaminho('/projetos')).toBe('projetos');
    expect(paginaDoCaminho('/tarefas')).toBe('tarefas');
    expect(paginaDoCaminho('/concluidas')).toBe('concluidas');
  });

  it('devolve null pra caminho que não existe', () => {
    expect(paginaDoCaminho('/nada')).toBeNull();
    expect(paginaDoCaminho('/tarefas/')).toBeNull();
  });

  it('cada página tem um caminho diferente', () => {
    const paginas = Object.keys(PAGINAS) as Pagina[];
    const caminhos = paginas.map(pagina => PAGINAS[pagina].caminho);
    expect(new Set(caminhos).size).toBe(caminhos.length);
  });
});
