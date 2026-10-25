import { useEffect } from 'react';

// Executa a ação quando a tecla é apertada, se o atalho estiver ativo.
// Ex: useAtalho('n', abrirNovaTarefa, !algumModalAberto)
export function useAtalho(tecla: string, acao: () => void, ativo: boolean) {
  useEffect(() => {
    if (!ativo) return;

    function aoApertarTecla(evento: KeyboardEvent) {
      if (evento.key.toLowerCase() !== tecla) return;

      // deixa o Ctrl+N, Cmd+N etc. com o navegador
      if (evento.ctrlKey || evento.metaKey || evento.altKey) return;

      // não atrapalha quem está digitando em algum campo
      const alvo = evento.target;
      if (alvo instanceof Element && alvo.closest('input, textarea, select')) return;

      // sem isso a letra acaba sendo digitada no campo que recebe o foco
      evento.preventDefault();
      acao();
    }

    document.addEventListener('keydown', aoApertarTecla);
    return () => document.removeEventListener('keydown', aoApertarTecla);
  }, [tecla, acao, ativo]);
}
