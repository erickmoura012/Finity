import Modal from './Modal';
import type { Tarefa } from '../../js/script/tarefas';

interface ModalExcluirProps {
  aberto: boolean;
  tarefa: Tarefa | null;
  aoCancelar: () => void;
  aoConfirmar: () => void;
}

function ModalExcluir({ aberto, tarefa, aoCancelar, aoConfirmar }: ModalExcluirProps) {
  return (
    <Modal aberto={aberto} pequeno idTitulo="tituloModalExcluir" aoFechar={aoCancelar}>
      <div className="modal-corpo modal-confirmacao">
        <div className="confirmacao-icone"><i className="bx bx-trash"></i></div>
        <h2 id="tituloModalExcluir">Excluir tarefa?</h2>
        <p>
          A tarefa <strong>"{tarefa?.titulo}"</strong> será removida e não poderá ser recuperada.
        </p>
      </div>

      <div className="modal-rodape">
        <button type="button" className="btn btn-secundario" onClick={aoCancelar}>Cancelar</button>
        <button type="button" className="btn btn-perigo" onClick={aoConfirmar}>Excluir</button>
      </div>
    </Modal>
  );
}

export default ModalExcluir;
