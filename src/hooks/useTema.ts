import { useEffect, useState } from 'react';

// mesma chave da versão sem React, então a escolha vale pras duas
const CHAVE_TEMA = 'finity_tema';

function temaSalvoEscuro(): boolean {
  const temaSalvo = localStorage.getItem(CHAVE_TEMA);

  if (temaSalvo) {
    return temaSalvo === 'escuro';
  }

  // se a pessoa ainda não escolheu, segue o tema do computador dela
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function useTema() {
  // passando a função (sem chamar), o React só lê o LocalStorage na primeira vez
  const [escuro, setEscuro] = useState(temaSalvoEscuro);

  // a classe fica no body porque o CSS das cores está no body.tema-escuro
  useEffect(() => {
    document.body.classList.toggle('tema-escuro', escuro);
  }, [escuro]);

  function trocarTema() {
    const novoEscuro = !escuro;
    setEscuro(novoEscuro);
    localStorage.setItem(CHAVE_TEMA, novoEscuro ? 'escuro' : 'claro');
  }

  return { escuro, trocarTema };
}
