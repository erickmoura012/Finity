import { useCallback, useMemo, useState } from 'react';
import Sidebar from './components/Sidebar';
import Topo from './components/Topo';
import Indicadores from './components/Indicadores';
import Quadro from './components/Quadro';
import Toast from './components/Toast';
import Modal from './components/Modal';
import FormTarefa from './components/FormTarefa';
import ModalExcluir from './components/ModalExcluir';
import Filtros, { type FiltrosTela } from './components/Filtros';
import Tabela, { type Ordem } from './components/Tabela';
import Projetos from './components/Projetos';
import FormProjeto from './components/FormProjeto';
import { useTema } from './hooks/useTema';
import { useTarefas } from './hooks/useTarefas';
import { useToast } from './hooks/useToast';
import { useAtalho } from './hooks/useAtalho';
import { PAGINAS, type Pagina } from './paginas';
import { baixarArquivoJSON } from './arquivos';
import { AcoesTarefaContext, type AcoesTarefa } from './contexts/AcoesTarefaContext';
import {
  atualizarTarefa,
  criarTarefa,
  excluirTarefa,
  criarCategoria,
  renomearCategoria,
  excluirCategoria,
  importarBackup,
  type NovaTarefa
} from '../js/script/api';
import {
  STATUS,
  filtrarTarefas,
  ordenarTarefas,
  textoResultado,
  validarBackup,
  type Backup,
  type CampoOrdem,
  type Categoria,
  type Status,
  type DadosTarefa,
  type Tarefa
} from '../js/script/tarefas';
import { dataDeHoje } from '../js/script/utils';

// Guarda se o modal de tarefa está aberto e com quais valores o formulário começa.
// A "vez" muda a cada abertura: ela é a key do FormTarefa, então o formulário
// é criado de novo e começa limpo toda vez que o modal abre.
interface ModalTarefaInfo {
  aberto: boolean;
  tarefa: Tarefa | null; // a tarefa sendo editada, ou null se for uma nova
  valores: DadosTarefa;
  vez: number;
}

const FORMULARIO_VAZIO: DadosTarefa = {
  titulo: '',
  descricao: '',
  prioridade: 'media',
  categoria: '',
  dataLimite: '',
  status: 'a_fazer'
};

const SEM_FILTROS: FiltrosTela = {
  busca: '',
  prioridade: '',
  categoria: '',
  status: ''
};

function App() {
  const [paginaAtual, setPaginaAtual] = useState<Pagina>('dashboard');
  const [menuAberto, setMenuAberto] = useState(false);
  const { escuro, trocarTema } = useTema();
  const { tarefas, categorias, carregando, erro, recarregar } = useTarefas();
  const { toast, mostrarToast } = useToast();
  const [modalTarefa, setModalTarefa] = useState<ModalTarefaInfo>({
    aberto: false,
    tarefa: null,
    valores: FORMULARIO_VAZIO,
    vez: 0
  });
  // O que está pra ser excluído: uma tarefa ou um projeto (o outro fica null).
  // Continua guardado depois de fechar, pra o nome não sumir durante a animação.
  const [exclusao, setExclusao] = useState<{ aberto: boolean; tarefa: Tarefa | null; projeto: Categoria | null }>({
    aberto: false,
    tarefa: null,
    projeto: null
  });
  // mesma ideia do modal de tarefa: a vez faz o formulário começar limpo
  // e o projeto é o que está sendo renomeado (null = projeto novo)
  const [modalProjeto, setModalProjeto] = useState<{ aberto: boolean; projeto: Categoria | null; vez: number }>({
    aberto: false,
    projeto: null,
    vez: 0
  });
  const [filtros, setFiltros] = useState<FiltrosTela>(SEM_FILTROS);
  // vale pras duas tabelas (campo vazio = ordem em que foram criadas)
  const [ordem, setOrdem] = useState<Ordem>({ campo: '', crescente: true });

  // Não precisa de useState pra isso: a lista filtrada sai das tarefas e dos filtros.
  // O useMemo guarda o resultado e só filtra de novo quando um dos dois muda.
  // Sem ele, abrir um modal ou mostrar um toast (que também renderizam o App)
  // fariam filtrar e ordenar tudo de novo sem necessidade.
  const tarefasFiltradas = useMemo(
    () => filtrarTarefas(tarefas, filtros),
    [tarefas, filtros]
  );

  // o quadro usa só a filtrada, as tabelas usam a ordenada
  const tarefasOrdenadas = useMemo(
    () => ordenarTarefas(tarefasFiltradas, ordem.campo, ordem.crescente),
    [tarefasFiltradas, ordem]
  );

  // o filtro de status só vale pra tabela da página Tarefas (no quadro as
  // colunas já separam por status, e Concluídas só tem um status)
  let tabelaTarefas = tarefasOrdenadas;
  if (filtros.status) {
    tabelaTarefas = tarefasOrdenadas.filter(t => t.status === filtros.status);
  }

  // a página Concluídas mostra "X de Y", onde Y é o total de concluídas
  const concluidasFiltradas = tarefasOrdenadas.filter(t => t.status === 'concluido');
  const totalConcluidas = tarefas.filter(t => t.status === 'concluido').length;

  function mudarPagina(pagina: Pagina) {
    setPaginaAtual(pagina);
    setMenuAberto(false); // no celular, fecha o menu depois de escolher
  }

  async function moverTarefa(id: string, novoStatus: Status) {
    const tarefa = tarefas.find(t => t.id === id);
    if (!tarefa || tarefa.status === novoStatus) return;

    try {
      await atualizarTarefa(id, { status: novoStatus });
      await recarregar();
      mostrarToast('Tarefa movida para "' + STATUS[novoStatus] + '"');
    } catch (e) {
      console.error(e);
      mostrarToast('Erro ao mover a tarefa', 'erro');
    }
  }

  // o useCallback mantém a mesma função entre as renderizações (só cria outra
  // quando as categorias ou o filtro de categoria mudam), assim o useAtalho não precisa
  // tirar e colocar o evento de teclado de novo a cada renderização
  const abrirNovaTarefa = useCallback((status: Status = 'a_fazer', categoria?: string) => {
    setModalTarefa(atual => ({
      aberto: true,
      tarefa: null,
      vez: atual.vez + 1,
      valores: {
        ...FORMULARIO_VAZIO,
        status: status,
        // a categoria vem do projeto clicado, ou do filtro de categoria, ou é a primeira
        categoria: categoria || filtros.categoria || categorias[0]?.nome || '',
        dataLimite: dataDeHoje()
      }
    }));
  }, [categorias, filtros.categoria]);

  // não depende de nada de fora, então o useCallback cria ela uma vez só
  const abrirNovoProjeto = useCallback(() => {
    setModalProjeto(atual => ({ aberto: true, projeto: null, vez: atual.vez + 1 }));
  }, []);

  function abrirRenomearProjeto(categoria: Categoria) {
    setModalProjeto(atual => ({ aberto: true, projeto: categoria, vez: atual.vez + 1 }));
  }

  function fecharModalProjeto() {
    setModalProjeto(atual => ({ ...atual, aberto: false }));
  }

  async function salvarProjeto(nome: string) {
    const projeto = modalProjeto.projeto;

    try {
      if (projeto) {
        await renomearCategoria(projeto.nome, nome);
        // se o filtro de categoria era esse projeto, ele acompanha o nome novo
        if (filtros.categoria === projeto.nome) {
          setFiltros({ ...filtros, categoria: nome });
        }
        mostrarToast('Projeto renomeado');
      } else {
        await criarCategoria(nome);
        mostrarToast('Projeto criado com sucesso');
      }

      fecharModalProjeto();
      await recarregar();
    } catch (e) {
      console.error(e);
      mostrarToast('Erro ao salvar o projeto', 'erro');
    }
  }

  // N faz o mesmo que o botão do topo: novo projeto na página de projetos
  // e nova tarefa nas outras. Não funciona com algum modal aberto.
  const algumModalAberto = modalTarefa.aberto || exclusao.aberto || modalProjeto.aberto;
  useAtalho('n', paginaAtual === 'projetos' ? abrirNovoProjeto : abrirNovaTarefa, !algumModalAberto);

  function abrirEdicao(tarefa: Tarefa) {
    setModalTarefa(atual => ({
      aberto: true,
      tarefa: tarefa,
      vez: atual.vez + 1,
      valores: {
        titulo: tarefa.titulo,
        descricao: tarefa.descricao,
        prioridade: tarefa.prioridade,
        categoria: tarefa.categoria,
        dataLimite: tarefa.dataLimite,
        status: tarefa.status
      }
    }));
  }

  function fecharModalTarefa() {
    // só fecha, os valores ficam pra o formulário não sumir no meio da animação
    setModalTarefa(atual => ({ ...atual, aberto: false }));
  }

  async function salvarTarefa(dados: DadosTarefa) {
    // a validação do formulário já garantiu que a prioridade e o status são válidos
    const dadosValidos = dados as NovaTarefa;

    try {
      if (modalTarefa.tarefa) {
        await atualizarTarefa(modalTarefa.tarefa.id, dadosValidos);
        mostrarToast('Tarefa atualizada');
      } else {
        await criarTarefa(dadosValidos);
        mostrarToast('Tarefa criada com sucesso');
      }

      fecharModalTarefa();
      await recarregar();
    } catch (e) {
      console.error(e);
      mostrarToast('Erro ao salvar a tarefa', 'erro');
    }
  }

  async function duplicarTarefa(tarefa: Tarefa) {
    // a cópia ganha id e data de criação novos (o criarTarefa já faz isso)
    // e sempre começa em "A Fazer"
    try {
      await criarTarefa({
        titulo: tarefa.titulo + ' (cópia)',
        descricao: tarefa.descricao,
        prioridade: tarefa.prioridade,
        categoria: tarefa.categoria,
        dataLimite: tarefa.dataLimite,
        status: 'a_fazer'
      });
      await recarregar();
      mostrarToast('Tarefa duplicada');
    } catch (e) {
      console.error(e);
      mostrarToast('Erro ao duplicar a tarefa', 'erro');
    }
  }

  // baixa um arquivo com todas as tarefas e projetos, pra guardar ou levar pra outro navegador
  function exportarTarefas() {
    baixarArquivoJSON('finity-' + dataDeHoje() + '.json', { tarefas, categorias });
    mostrarToast('Tarefas exportadas');
  }

  async function importarTarefas(arquivo: File) {
    let dados: unknown;

    try {
      dados = JSON.parse(await arquivo.text());
    } catch {
      mostrarToast('Não foi possível ler o arquivo', 'erro');
      return;
    }

    // o arquivo pode ter qualquer coisa dentro, então confere tudo antes de usar
    const mensagem = validarBackup(dados);
    if (mensagem) {
      mostrarToast(mensagem, 'erro');
      return;
    }

    const backup = dados as Backup;
    const confirmou = confirm(
      'As tarefas e projetos atuais vão ser trocados pelos do arquivo (' + backup.tarefas.length + ' tarefas). Continuar?'
    );
    if (!confirmou) return;

    try {
      await importarBackup(backup);
      await recarregar();
      mostrarToast('Tarefas importadas');
    } catch (e) {
      console.error(e);
      mostrarToast('Erro ao importar as tarefas', 'erro');
    }
  }

  // clicar num projeto mostra as tarefas dele na página Tarefas
  function abrirProjeto(categoria: string) {
    setFiltros({ ...SEM_FILTROS, categoria: categoria });
    mudarPagina('tarefas');
  }

  function ordenarPor(campo: CampoOrdem) {
    setOrdem(atual => {
      // clicar de novo na mesma coluna inverte a ordem
      if (atual.campo === campo) {
        return { campo: campo, crescente: !atual.crescente };
      }
      return { campo: campo, crescente: true };
    });
  }

  function abrirExclusao(tarefa: Tarefa) {
    setExclusao({ aberto: true, tarefa: tarefa, projeto: null });
  }

  function abrirExclusaoProjeto(categoria: Categoria) {
    // sem nenhum projeto não daria pra criar tarefa
    if (categorias.length === 1) {
      mostrarToast('Precisa ter pelo menos um projeto', 'erro');
      return;
    }
    setExclusao({ aberto: true, tarefa: null, projeto: categoria });
  }

  function fecharExclusao() {
    setExclusao(atual => ({ ...atual, aberto: false }));
  }

  async function confirmarExclusao() {
    try {
      if (exclusao.projeto) {
        await excluirCategoria(exclusao.projeto.nome);
        // o filtro não pode continuar apontando pra um projeto que não existe mais
        if (filtros.categoria === exclusao.projeto.nome) {
          setFiltros({ ...filtros, categoria: '' });
        }
        mostrarToast('Projeto excluído');
      } else if (exclusao.tarefa) {
        await excluirTarefa(exclusao.tarefa.id);
        mostrarToast('Tarefa excluída');
      }

      fecharExclusao();
      await recarregar();
    } catch (e) {
      console.error(e);
      mostrarToast('Erro ao excluir', 'erro');
    }
  }

  // título e texto do modal de exclusão, conforme o que está pra ser excluído
  let tituloExclusao = 'Excluir tarefa?';
  let mensagemExclusao = (
    <>A tarefa <strong>"{exclusao.tarefa?.titulo}"</strong> será removida e não poderá ser recuperada.</>
  );
  if (exclusao.projeto) {
    const nome = exclusao.projeto.nome;
    const quantidade = tarefas.filter(t => t.categoria === nome).length;
    tituloExclusao = 'Excluir projeto?';

    let fim = ' será removido e não poderá ser recuperado.';
    if (quantidade === 1) {
      fim = ' e a tarefa dele serão removidos e não poderão ser recuperados.';
    } else if (quantidade > 1) {
      fim = ' e as ' + quantidade + ' tarefas dele serão removidos e não poderão ser recuperados.';
    }
    mensagemExclusao = <>O projeto <strong>"{nome}"</strong>{fim}</>;
  }

  const pagina = PAGINAS[paginaAtual];

  // o que os componentes de tarefa vão pegar pelo useAcoesTarefa
  const acoes: AcoesTarefa = {
    editar: abrirEdicao,
    duplicar: duplicarTarefa,
    excluir: abrirExclusao,
    mover: moverTarefa,
    novaTarefa: abrirNovaTarefa
  };

  return (
    <div className="app">
      <Sidebar
        paginaAtual={paginaAtual}
        aberta={menuAberto}
        aoMudarPagina={mudarPagina}
        aoExportar={exportarTarefas}
        aoImportar={importarTarefas}
      />

      {/* fundo escuro atrás do menu no celular */}
      <div className={menuAberto ? 'overlay visivel' : 'overlay'} onClick={() => setMenuAberto(false)}></div>

      {/* no React 19 o próprio contexto funciona como Provider */}
      <AcoesTarefaContext value={acoes}>
        <main className="conteudo">
          <Topo
            titulo={pagina.titulo}
            subtitulo={pagina.subtitulo}
            textoBotao={paginaAtual === 'projetos' ? 'Novo projeto' : 'Nova tarefa'}
            temaEscuro={escuro}
            aoAbrirMenu={() => setMenuAberto(true)}
            aoTrocarTema={trocarTema}
            aoClicarAdicionar={() => {
              if (paginaAtual === 'projetos') {
                abrirNovoProjeto();
              } else {
                abrirNovaTarefa();
              }
            }}
          />

          {/* na página de projetos os filtros não fazem sentido */}
          {paginaAtual !== 'projetos' && (
            <Filtros
              filtros={filtros}
              categorias={categorias}
              mostrarStatus={paginaAtual === 'tarefas'}
              aoMudar={setFiltros}
              aoLimpar={() => setFiltros(SEM_FILTROS)}
            />
          )}

          {/* a key faz a animação de entrada rodar de novo a cada troca de página */}
          <section className="pagina ativa" key={paginaAtual}>
            {carregando && <p className="resultado">Carregando tarefas...</p>}
            {erro && <p className="resultado">{erro}</p>}

            {!carregando && !erro && paginaAtual === 'dashboard' && (
              <>
                <Indicadores tarefas={tarefas} />
                <Quadro tarefas={tarefasFiltradas} />
              </>
            )}

            {!carregando && !erro && paginaAtual === 'tarefas' && (
              <>
                <p className="resultado">{textoResultado(tabelaTarefas.length, tarefas.length)}</p>
                <Tabela
                  tarefas={tabelaTarefas}
                  mensagemVazia="Nenhuma tarefa encontrada."
                  ordem={ordem}
                  aoOrdenar={ordenarPor}
                />
              </>
            )}

            {!carregando && !erro && paginaAtual === 'concluidas' && (
              <>
                <p className="resultado">{textoResultado(concluidasFiltradas.length, totalConcluidas)}</p>
                <Tabela
                  tarefas={concluidasFiltradas}
                  mensagemVazia="Nenhuma tarefa concluída por enquanto."
                  ordem={ordem}
                  aoOrdenar={ordenarPor}
                />
              </>
            )}

            {!carregando && !erro && paginaAtual === 'projetos' && (
              <Projetos
                tarefas={tarefas}
                categorias={categorias}
                aoAbrirProjeto={abrirProjeto}
                aoRenomear={abrirRenomearProjeto}
                aoExcluir={abrirExclusaoProjeto}
              />
            )}
          </section>
        </main>
      </AcoesTarefaContext>

      <Modal aberto={modalTarefa.aberto} idTitulo="tituloModalTarefa" aoFechar={fecharModalTarefa}>
        <FormTarefa
          key={modalTarefa.vez}
          valoresIniciais={modalTarefa.valores}
          categorias={categorias}
          tarefaEditando={modalTarefa.tarefa}
          aoCancelar={fecharModalTarefa}
          aoSalvar={salvarTarefa}
        />
      </Modal>

      <Modal aberto={modalProjeto.aberto} pequeno idTitulo="tituloModalProjeto" aoFechar={fecharModalProjeto}>
        <FormProjeto
          key={modalProjeto.vez}
          categorias={categorias}
          projetoEditando={modalProjeto.projeto}
          aoCancelar={fecharModalProjeto}
          aoSalvar={salvarProjeto}
        />
      </Modal>

      <ModalExcluir
        aberto={exclusao.aberto}
        titulo={tituloExclusao}
        mensagem={mensagemExclusao}
        aoCancelar={fecharExclusao}
        aoConfirmar={confirmarExclusao}
      />

      <Toast toast={toast} />
    </div>
  );
}

export default App;
