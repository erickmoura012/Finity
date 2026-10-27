import { createContext, useContext } from 'react';
import type { Status, Tarefa } from '../../js/script/tarefas';

// Ações que os componentes de tarefa (card, coluna, tabela...) podem chamar.
// O App fornece essas funções uma vez só, e qualquer componente dentro dele
// pega direto com o useAcoesTarefa, sem precisar receber por props.
export interface AcoesTarefa {
  editar: (tarefa: Tarefa) => void;
  duplicar: (tarefa: Tarefa) => void;
  excluir: (tarefa: Tarefa) => void;
  mover: (id: string, status: Status) => void;
  novaTarefa: (status?: Status, categoria?: string) => void;
}

export const AcoesTarefaContext = createContext<AcoesTarefa | null>(null);

export function useAcoesTarefa() {
  const acoes = useContext(AcoesTarefaContext);

  // se esquecer de colocar o componente dentro do contexto, o erro já diz o que é
  if (!acoes) {
    throw new Error('useAcoesTarefa precisa ser usado dentro do AcoesTarefaContext');
  }

  return acoes;
}
