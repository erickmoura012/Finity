import { useState, type FormEvent } from 'react';
import { validarTarefa, type Categoria, type DadosTarefa, type Tarefa } from '../../js/script/tarefas';
import { formatarDataCriacao } from '../../js/script/utils';

interface FormTarefaProps {
  valoresIniciais: DadosTarefa;
  categorias: Categoria[];
  tarefaEditando: Tarefa | null; // null = tarefa nova
  aoCancelar: () => void;
  aoSalvar: (dados: DadosTarefa) => void;
}

function FormTarefa({ valoresIniciais, categorias, tarefaEditando, aoCancelar, aoSalvar }: FormTarefaProps) {
  // um objeto só com todos os campos do formulário
  const [dados, setDados] = useState<DadosTarefa>(valoresIniciais);
  const [erro, setErro] = useState('');

  function mudarCampo(campo: keyof DadosTarefa, valor: string) {
    setDados({ ...dados, [campo]: valor });
  }

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const dadosLimpos = { ...dados, titulo: dados.titulo.trim(), descricao: dados.descricao.trim() };
    const mensagem = validarTarefa(dadosLimpos);

    if (mensagem) {
      setErro(mensagem);
      return;
    }

    aoSalvar(dadosLimpos);
  }

  // depois de tentar salvar com erro, marca de vermelho os campos com problema
  const tituloInvalido = erro !== '' && dados.titulo.trim().length < 3;
  const dataInvalida = erro !== '' && !dados.dataLimite;

  return (
    <>
      <div className="modal-topo">
        <h2 id="tituloModalTarefa">{tarefaEditando ? 'Editar tarefa' : 'Nova tarefa'}</h2>
        <button className="btn-icone" title="Fechar" onClick={aoCancelar}>
          <i className="bx bx-x"></i>
        </button>
      </div>

      <form onSubmit={enviar} noValidate>
        <div className="modal-corpo">
          <div className="campo">
            <label htmlFor="campoTitulo">Título</label>
            <input
              type="text"
              id="campoTitulo"
              className={tituloInvalido ? 'input invalido' : 'input'}
              placeholder="Ex: Criar tela de login"
              maxLength={80}
              autoFocus={!tarefaEditando}
              value={dados.titulo}
              onChange={evento => mudarCampo('titulo', evento.target.value)}
            />
          </div>

          <div className="campo">
            <label htmlFor="campoDescricao">Descrição</label>
            <textarea
              id="campoDescricao"
              className="input"
              placeholder="Detalhes da tarefa (opcional)"
              value={dados.descricao}
              onChange={evento => mudarCampo('descricao', evento.target.value)}
            />
          </div>

          <div className="campos-linha">
            <div className="campo">
              <label htmlFor="campoPrioridade">Prioridade</label>
              <select
                id="campoPrioridade"
                className="input"
                value={dados.prioridade}
                onChange={evento => mudarCampo('prioridade', evento.target.value)}
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>
            </div>

            <div className="campo">
              <label htmlFor="campoCategoria">Categoria</label>
              <select
                id="campoCategoria"
                className="input"
                value={dados.categoria}
                onChange={evento => mudarCampo('categoria', evento.target.value)}
              >
                {categorias.map(categoria => (
                  <option key={categoria.nome} value={categoria.nome}>{categoria.nome}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="campos-linha">
            <div className="campo">
              <label htmlFor="campoDataLimite">Data limite</label>
              <input
                type="date"
                id="campoDataLimite"
                className={dataInvalida ? 'input invalido' : 'input'}
                value={dados.dataLimite}
                onChange={evento => mudarCampo('dataLimite', evento.target.value)}
              />
            </div>

            <div className="campo">
              <label htmlFor="campoStatus">Status</label>
              <select
                id="campoStatus"
                className="input"
                value={dados.status}
                onChange={evento => mudarCampo('status', evento.target.value)}
              >
                <option value="a_fazer">A Fazer</option>
                <option value="em_andamento">Em andamento</option>
                <option value="concluido">Concluído</option>
              </select>
            </div>
          </div>

          <p className={erro ? 'form-erro visivel' : 'form-erro'}>{erro}</p>
        </div>

        <div className="modal-rodape">
          <span className="modal-info">
            {tarefaEditando && 'Criada em ' + formatarDataCriacao(tarefaEditando.dataCriacao)}
          </span>
          <button type="button" className="btn btn-secundario" onClick={aoCancelar}>Cancelar</button>
          <button type="submit" className="btn btn-primario">
            {tarefaEditando ? 'Salvar alterações' : 'Criar tarefa'}
          </button>
        </div>
      </form>
    </>
  );
}

export default FormTarefa;
