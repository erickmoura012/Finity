import { useState, type FormEvent } from 'react';
import { ICONES_PROJETO, validarProjeto, type Categoria } from '../../js/script/tarefas';

interface FormProjetoProps {
  categorias: Categoria[];
  projetoEditando: Categoria | null; // null = projeto novo
  aoCancelar: () => void;
  aoSalvar: (nome: string, icone: string) => void;
}

function FormProjeto({ categorias, projetoEditando, aoCancelar, aoSalvar }: FormProjetoProps) {
  // ao editar, o nome e o ícone já começam com os de hoje
  const [nome, setNome] = useState(projetoEditando ? projetoEditando.nome : '');
  // projeto novo começa com o primeiro ícone da lista (a pasta)
  const [icone, setIcone] = useState(projetoEditando ? projetoEditando.icone : ICONES_PROJETO[0].icone);
  const [erro, setErro] = useState('');

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const nomeLimpo = nome.trim();

    // editar sem mudar nada é a mesma coisa que cancelar
    if (projetoEditando && nomeLimpo === projetoEditando.nome && icone === projetoEditando.icone) {
      aoCancelar();
      return;
    }

    // a validação também confere se já existe um projeto com esse nome
    const mensagem = validarProjeto(nomeLimpo, categorias, projetoEditando?.nome);

    if (mensagem) {
      setErro(mensagem);
      return;
    }

    aoSalvar(nomeLimpo, icone);
  }

  return (
    <>
      <div className="modal-topo">
        <h2 id="tituloModalProjeto">{projetoEditando ? 'Editar projeto' : 'Novo projeto'}</h2>
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

          <div className="campo">
            <span className="campo-rotulo" id="rotuloIconeProjeto">Ícone</span>
            <div className="seletor-icones" role="group" aria-labelledby="rotuloIconeProjeto">
              {ICONES_PROJETO.map(opcao => (
                <button
                  key={opcao.icone}
                  type="button"
                  className={opcao.icone === icone ? 'opcao-icone selecionado' : 'opcao-icone'}
                  title={opcao.nome}
                  aria-label={'Ícone ' + opcao.nome}
                  aria-pressed={opcao.icone === icone}
                  onClick={() => setIcone(opcao.icone)}
                >
                  <i className={'bx ' + opcao.icone}></i>
                </button>
              ))}
            </div>
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
