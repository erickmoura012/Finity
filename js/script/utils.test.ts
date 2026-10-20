import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  dataDeHoje,
  somarDias,
  formatarData,
  calcularPorcentagem,
  escaparHTML
} from './utils.ts';

describe('datas', () => {
  // fixa o "hoje" em 20/10/2026 pra o teste não depender do dia em que roda
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 20));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('dataDeHoje devolve no formato do input date', () => {
    expect(dataDeHoje()).toBe('2026-10-20');
  });

  it('somarDias soma e subtrai dias, trocando de mês', () => {
    expect(somarDias(3)).toBe('2026-10-23');
    expect(somarDias(12)).toBe('2026-11-01');
    expect(somarDias(-20)).toBe('2026-09-30');
  });
});

describe('formatarData', () => {
  it('troca AAAA-MM-DD por DD/MM/AAAA', () => {
    expect(formatarData('2026-10-15')).toBe('15/10/2026');
  });

  it('mostra um traço quando não tem data', () => {
    expect(formatarData('')).toBe('-');
  });
});

describe('calcularPorcentagem', () => {
  it('arredonda a porcentagem', () => {
    expect(calcularPorcentagem(1, 3)).toBe(33);
    expect(calcularPorcentagem(2, 2)).toBe(100);
  });

  it('não divide por zero', () => {
    expect(calcularPorcentagem(0, 0)).toBe(0);
  });
});

describe('escaparHTML', () => {
  it('não deixa o texto virar HTML', () => {
    expect(escaparHTML('<b>"oi"</b>')).toBe('&lt;b&gt;&quot;oi&quot;&lt;/b&gt;');
  });

  it('devolve texto vazio quando não recebe nada', () => {
    expect(escaparHTML('')).toBe('');
    expect(escaparHTML(undefined)).toBe('');
  });
});
