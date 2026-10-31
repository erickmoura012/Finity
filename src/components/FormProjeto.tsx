import { useState, type FormEvent } from 'react';
import { validarProjeto, type Categoria } from '../../js/script/tarefas';

interface FormProjetoProps {
  categorias: Categoria[];
  projetoEditando: Categoria | null; // null = projeto novo
  aoCancelar: () => void;
  aoSalvar: (nome: string) => void;
}

function FormProjeto({ categorias, projetoEditando, aoCancelar, aoSalvar }: FormProjetoProps) {
  // ao renomear, o campo já começa com o nome de hoje
  const [nome, setNome] = useState(projetoEditando ? projetoEditando.nome : '');
  const [erro, setErro] = useState('');

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const nomeLimpo = nome.trim();

    // renomear sem mudar nada é a mesma coisa que cancelar
    if (projetoEditando && nomeLimpo === projetoEditando.nome) {
      aoCancelar();
      return;
    }

    // a validação também confere se já existe um projeto com esse nome
    const mensagem = validarProjeto(nomeLimpo, categorias, projetoEditando?.nome);

    if (mensagem) {
      setErro(mensagem);
      return;
    }

    aoSalvar(nomeLimpo);
  }

  return (
    <>
      <div className="modal-topo">
        <h2 id="tituloModalProjeto">{projetoEditando ? 'Renomear projeto' : 'Novo projeto'}</h2>
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
          <button type="submit" className="btn btn-primario">
            {projetoEditando ? 'Salvar' : 'Criar projeto'}
          </button>
        </div>
      </form>
    </>
  );
}

export default FormProjeto;
