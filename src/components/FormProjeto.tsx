import { useState, type FormEvent } from 'react';
import { validarProjeto, type Categoria } from '../../js/script/tarefas';

interface FormProjetoProps {
  categorias: Categoria[];
  aoCancelar: () => void;
  aoSalvar: (nome: string) => void;
}

function FormProjeto({ categorias, aoCancelar, aoSalvar }: FormProjetoProps) {
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState('');

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const nomeLimpo = nome.trim();
    // a validação também confere se já existe um projeto com esse nome
    const mensagem = validarProjeto(nomeLimpo, categorias);

    if (mensagem) {
      setErro(mensagem);
      return;
    }

    aoSalvar(nomeLimpo);
  }

  return (
    <>
      <div className="modal-topo">
        <h2 id="tituloModalProjeto">Novo projeto</h2>
        <button className="btn-icone" title="Fechar" onClick={aoCancelar}>
          <i className="bx bx-x"></i>
        </button>
      </div>

      <form onSubmit={enviar} noValidate>
        <div className="modal-corpo">
          <div className="campo">
            <label htmlFor="campoNomeProjeto">Nome do projeto</label>
            <input
              type="text"
              id="campoNomeProjeto"
              className={erro ? 'input invalido' : 'input'}
              placeholder="Ex: Faculdade"
              maxLength={40}
              autoFocus
              value={nome}
              onChange={evento => setNome(evento.target.value)}
            />
          </div>

          <p className={erro ? 'form-erro visivel' : 'form-erro'}>{erro}</p>
        </div>

        <div className="modal-rodape">
          <button type="button" className="btn btn-secundario" onClick={aoCancelar}>Cancelar</button>
          <button type="submit" className="btn btn-primario">Criar projeto</button>
        </div>
      </form>
    </>
  );
}

export default FormProjeto;
