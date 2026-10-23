import { useEffect, useState } from 'react';
import { listarTarefas, listarCategorias } from '../../js/script/api';
import type { Tarefa, Categoria } from '../../js/script/tarefas';

// Carrega as tarefas e os projetos e guarda no estado do React.
// Usa as mesmas funções do api.ts da versão sem React.
export function useTarefas() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  async function carregarDados() {
    try {
      // as duas buscas não dependem uma da outra, então rodam juntas
      const [listaCategorias, listaTarefas] = await Promise.all([
        listarCategorias(),
        listarTarefas()
      ]);

      setCategorias(listaCategorias);
      setTarefas(listaTarefas);
      setErro('');
    } catch (e) {
      console.error(e);
      setErro('Não foi possível carregar os dados');
    } finally {
      setCarregando(false);
    }
  }

  // [] = roda só uma vez, quando o componente aparece na tela
  useEffect(() => {
    carregarDados();
  }, []);

  // recarregar vai ser usado depois de criar, editar ou excluir uma tarefa
  return { tarefas, categorias, carregando, erro, recarregar: carregarDados };
}
