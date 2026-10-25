import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topo from './components/Topo';
import Indicadores from './components/Indicadores';
import Quadro from './components/Quadro';
import Toast from './components/Toast';
import Modal from './components/Modal';
import FormTarefa from './components/FormTarefa';
import ModalExcluir from './components/ModalExcluir';
import { useTema } from './hooks/useTema';
import { useTarefas } from './hooks/useTarefas';
import { useToast } from './hooks/useToast';
import { PAGINAS, type Pagina } from './paginas';
import { atualizarTarefa, criarTarefa, excluirTarefa, type NovaTarefa } from '../js/script/api';
import { STATUS, type Status, type DadosTarefa, type Tarefa } from '../js/script/tarefas';
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
  // a tarefa continua guardada depois de fechar, pra o nome não sumir durante a animação
  const [exclusao, setExclusao] = useState<{ aberto: boolean; tarefa: Tarefa | null }>({
    aberto: false,
    tarefa: null
  });

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

  function abrirNovaTarefa(status: Status = 'a_fazer') {
    setModalTarefa(atual => ({
      aberto: true,
      tarefa: null,
      vez: atual.vez + 1,
      valores: {
        ...FORMULARIO_VAZIO,
        status: status,
        categoria: categorias[0]?.nome || '',
        dataLimite: dataDeHoje()
      }
    }));
  }

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

  function fecharExclusao() {
    setExclusao(atual => ({ ...atual, aberto: false }));
  }

  async function confirmarExclusao() {
    if (!exclusao.tarefa) return;

    try {
      await excluirTarefa(exclusao.tarefa.id);
      fecharExclusao();
      await recarregar();
      mostrarToast('Tarefa excluída');
    } catch (e) {
      console.error(e);
      mostrarToast('Erro ao excluir a tarefa', 'erro');
    }
  }

  const pagina = PAGINAS[paginaAtual];

  return (
    <div className="app">
      <Sidebar paginaAtual={paginaAtual} aberta={menuAberto} aoMudarPagina={mudarPagina} />

      {/* fundo escuro atrás do menu no celular */}
      <div className={menuAberto ? 'overlay visivel' : 'overlay'} onClick={() => setMenuAberto(false)}></div>

      <main className="conteudo">
        <Topo
          titulo={pagina.titulo}
          subtitulo={pagina.subtitulo}
          textoBotao={paginaAtual === 'projetos' ? 'Novo projeto' : 'Nova tarefa'}
          temaEscuro={escuro}
          aoAbrirMenu={() => setMenuAberto(true)}
          aoTrocarTema={trocarTema}
          aoClicarAdicionar={() => {
            // o modal de novo projeto vem junto com a página de projetos
            if (paginaAtual !== 'projetos') abrirNovaTarefa();
          }}
        />

        {/* a key faz a animação de entrada rodar de novo a cada troca de página */}
        <section className="pagina ativa" key={paginaAtual}>
          {carregando && <p className="resultado">Carregando tarefas...</p>}
          {erro && <p className="resultado">{erro}</p>}

          {!carregando && !erro && paginaAtual === 'dashboard' && (
            <>
              <Indicadores tarefas={tarefas} />
              <Quadro
                tarefas={tarefas}
                aoMoverTarefa={moverTarefa}
                aoNovaTarefa={abrirNovaTarefa}
                aoEditarTarefa={abrirEdicao}
                aoDuplicarTarefa={duplicarTarefa}
                aoExcluirTarefa={tarefa => setExclusao({ aberto: true, tarefa: tarefa })}
              />
            </>
          )}

          {!carregando && !erro && paginaAtual !== 'dashboard' && (
            <p className="resultado">Página em construção ({tarefas.length} tarefas carregadas)</p>
          )}
        </section>
      </main>

      <Modal aberto={modalTarefa.aberto} aoFechar={fecharModalTarefa}>
        <FormTarefa
          key={modalTarefa.vez}
          valoresIniciais={modalTarefa.valores}
          categorias={categorias}
          tarefaEditando={modalTarefa.tarefa}
          aoCancelar={fecharModalTarefa}
          aoSalvar={salvarTarefa}
        />
      </Modal>

      <ModalExcluir
        aberto={exclusao.aberto}
        tarefa={exclusao.tarefa}
        aoCancelar={fecharExclusao}
        aoConfirmar={confirmarExclusao}
      />

      <Toast toast={toast} />
    </div>
  );
}

export default App;
