import { useEffect, useState } from 'react';
import { listarTarefas, listarCategorias } from '../../js/script/api';
import type { Tarefa, Categoria } from '../../js/script/tarefas';

// as duas buscas não dependem uma da outra, então rodam juntas
async function buscarDados() {
  const [categorias, tarefas] = await Promise.all([listarCategorias(), listarTarefas()]);
  return { categorias, tarefas };
}

// Carrega as tarefas e os projetos e guarda no estado do React.
// Usa as mesmas funções do api.ts.
export function useTarefas() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  // [] = roda só uma vez, quando o componente aparece na tela
  useEffect(() => {
    // se o componente sair da tela antes da busca terminar, não mexe mais no estado
    let cancelado = false;

    buscarDados()
      .then(dados => {
        if (cancelado) return;
        setCategorias(dados.categorias);
        setTarefas(dados.tarefas);
      })
      .catch(e => {
        if (cancelado) return;
        console.error(e);
        setErro('Não foi possível carregar os dados');
      })
      .finally(() => {
        if (!cancelado) setCarregando(false);
      });

    return () => {
      cancelado = true;
    };
  }, []);

  // usado depois de criar, editar ou excluir uma tarefa
  async function recarregar() {
    try {
      const dados = await buscarDados();
      setCategorias(dados.categorias);
      setTarefas(dados.tarefas);
      setErro('');
    } catch (e) {
      console.error(e);
      setErro('Não foi possível carregar os dados');
    }
  }

  return { tarefas, categorias, carregando, erro, recarregar };
}
