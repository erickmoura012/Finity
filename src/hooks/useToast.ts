import { useEffect, useRef, useState } from 'react';

export type TipoToast = 'sucesso' | 'erro';

export interface EstadoToast {
  mensagem: string;
  tipo: TipoToast;
  visivel: boolean;
}

export function useToast() {
  const [toast, setToast] = useState<EstadoToast>({ mensagem: '', tipo: 'sucesso', visivel: false });

  // o useRef guarda o timer entre as renderizações sem fazer a tela atualizar
  const tempo = useRef<number | undefined>(undefined);

  function mostrarToast(mensagem: string, tipo: TipoToast = 'sucesso') {
    setToast({ mensagem, tipo, visivel: true });

    // se aparecer outra mensagem antes de sumir, recomeça os 3 segundos
    window.clearTimeout(tempo.current);
    tempo.current = window.setTimeout(() => {
      // só esconde, a mensagem continua pra não sumir no meio da animação
      setToast(atual => ({ ...atual, visivel: false }));
    }, 3000);
  }

  // limpa o timer se o componente sair da tela
  useEffect(() => {
    return () => window.clearTimeout(tempo.current);
  }, []);

  return { toast, mostrarToast };
}
