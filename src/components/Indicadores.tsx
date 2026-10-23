import { contarTarefas, type Tarefa } from '../../js/script/tarefas';
import { calcularPorcentagem } from '../../js/script/utils';

interface IndicadoresProps {
  tarefas: Tarefa[];
}

function Indicadores({ tarefas }: IndicadoresProps) {
  const contagem = contarTarefas(tarefas);

  function porcentagem(parte: number) {
    return calcularPorcentagem(parte, contagem.total) + '% do total';
  }

  // os 4 cartões são iguais, só mudam os textos, a cor e o ícone
  const itens = [
    { titulo: 'Total de tarefas', numero: contagem.total, info: 'tarefas cadastradas', cor: 'icone-azul', icone: 'bx-layer' },
    { titulo: 'Pendentes', numero: contagem.pendentes, info: porcentagem(contagem.pendentes), cor: 'icone-cinza', icone: 'bx-time-five' },
    { titulo: 'Em andamento', numero: contagem.andamento, info: porcentagem(contagem.andamento), cor: 'icone-amarelo', icone: 'bx-loader-circle' },
    { titulo: 'Concluídas', numero: contagem.concluidas, info: porcentagem(contagem.concluidas), cor: 'icone-verde', icone: 'bx-check-double' }
  ];

  return (
    <div className="indicadores">
      {itens.map(item => (
        <div className="indicador" key={item.titulo}>
          <div>
            <p className="indicador-titulo">{item.titulo}</p>
            <p className="indicador-numero">{item.numero}</p>
            <p className="indicador-info">{item.info}</p>
          </div>
          <div className={'indicador-icone ' + item.cor}>
            <i className={'bx ' + item.icone}></i>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Indicadores;
