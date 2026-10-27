# Finity

Sistema de gerenciamento de tarefas no estilo Kanban, feito com React e TypeScript.
Os dados ficam salvos no LocalStorage do navegador.

## Tecnologias

- **React 19** com componentes, hooks próprios e Context API
- **TypeScript**
- **SASS** (partials, variáveis, mixins e aninhamento)
- **Vite** para o servidor de desenvolvimento e o build
- **Vitest** para os testes
- **ESLint** com as regras do TypeScript e dos hooks do React
- **Docker** com Nginx para rodar o build em container

## Funcionalidades

- Criar, editar, duplicar e excluir tarefas
- Atalho `N` para criar uma tarefa nova
- Mover as tarefas entre as colunas (A Fazer, Em andamento e Concluído) arrastando os cards
- Pesquisar por título ou descrição
- Filtrar por prioridade, categoria e status
- Ordenar as tabelas clicando no nome da coluna
- Indicadores com o total de tarefas, pendentes, em andamento e concluídas
- Página "Meus projetos", com as tarefas agrupadas por categoria e o progresso de cada uma
- Criar novos projetos (categorias) e adicionar tarefas direto neles
- Lista com todas as tarefas e outra só com as concluídas
- Destaque em vermelho para tarefas atrasadas
- Tema claro e escuro (a escolha fica salva no navegador)
- Exportar as tarefas para um arquivo JSON e importar de volta (serve de backup)
- Layout responsivo (no celular o menu vira uma gaveta e o quadro rola para o lado)

## Como rodar

Precisa ter o [Node.js](https://nodejs.org) instalado.

```bash
npm install
npm run dev
```

Depois é só abrir o endereço que aparecer no terminal (normalmente `http://localhost:5173`).

Outros comandos:

| Comando             | O que faz                                       |
| ------------------- | ----------------------------------------------- |
| `npm run build`     | Gera a versão final na pasta `dist`             |
| `npm run preview`   | Abre a versão da pasta `dist` para conferir     |
| `npm test`          | Roda os testes                                  |
| `npm run typecheck` | Confere os tipos do TypeScript                  |
| `npm run lint`      | Procura problemas no código com o ESLint        |

Na primeira vez que o sistema abre, ele cria algumas tarefas de exemplo. Para começar do zero,
é só abrir o DevTools (F12) > Application > Local Storage e apagar as chaves `finity_tarefas`
e `finity_categorias`.

### Com Docker

```bash
docker build -t finity .
docker run -p 8080:80 finity
```

O site fica em `http://localhost:8080`.

## Estrutura de pastas

```
Finity/
├── index.html
├── Dockerfile
├── src/
│   ├── main.tsx                 ponto de entrada do React
│   ├── App.tsx                  estado da página, modais e ações das tarefas
│   ├── paginas.ts               títulos e ícones de cada página
│   ├── arquivos.ts              baixar o arquivo do exportar
│   ├── components/              Sidebar, Topo, Filtros, Indicadores, Quadro, Coluna, Card,
│   │                            Tabela, Projetos, Modal, FormTarefa, FormProjeto, ModalExcluir, Toast
│   ├── hooks/
│   │   ├── useTarefas.ts        carrega as tarefas e os projetos
│   │   ├── useTema.ts           tema claro e escuro
│   │   ├── useToast.ts          mensagens de aviso
│   │   └── useAtalho.ts         atalhos de teclado
│   └── contexts/
│       └── AcoesTarefaContext.ts   ações das tarefas (editar, duplicar, excluir, mover...)
├── js/
│   └── script/
│       ├── tarefas.ts           tipos, filtros, ordenação e validações (sem React)
│       ├── utils.ts             funções de ajuda (datas, porcentagem...)
│       ├── api.ts               salvar e buscar os dados (hoje usa o LocalStorage)
│       ├── tarefas.test.ts      testes das regras das tarefas
│       └── utils.test.ts        testes do utils
└── css/
    └── style/
        ├── main.scss            junta todos os partials
        ├── _mixins.scss         tamanhos de tela e mixins do responsivo
        ├── _base.scss           variáveis de cores, tema escuro, reset, botões, campos e tags
        ├── _layout.scss         menu lateral, topo, filtros e páginas
        ├── _componentes.scss    indicadores, quadro, cards, tabela, projetos, modal e toast
        └── _responsivo.scss     ajustes para tablet e celular
```

As regras das tarefas ficaram separadas do React (em `js/script`), por isso dá pra testar
elas sem precisar montar nenhum componente.

## Formato de uma tarefa

```json
{
  "id": "1759600000000123",
  "titulo": "Configurar servidor com Express",
  "descricao": "Criar as primeiras rotas da API",
  "prioridade": "media",
  "categoria": "Desenvolvimento",
  "dataLimite": "2026-10-11",
  "status": "a_fazer",
  "dataCriacao": "2026-10-04T15:30:00.000Z"
}
```

- `prioridade`: `alta`, `media` ou `baixa`
- `status`: `a_fazer`, `em_andamento` ou `concluido`

## Histórico

O Finity começou em HTML, CSS e JavaScript puro. Depois ganhou módulos ES, SASS, TypeScript e
testes, e por último foi migrado para React. A migração foi feita aos poucos, com a versão em
React crescendo do lado da antiga até fazer tudo que ela fazia.

A versão sem framework ficou guardada na tag [`v1.0.0`](https://github.com/erickmoura012/Finity/tree/v1.0.0).

## Próximos passos

- [ ] Publicar na Vercel

Depois, a ideia é transformar o projeto em full stack:

- [ ] Backend com Node.js e Express
- [ ] API REST
- [ ] Banco de dados PostgreSQL
- [ ] Cadastro e login de usuários

Toda a parte de dados está no `js/script/api.ts` (`listarTarefas`, `criarTarefa`,
`atualizarTarefa` e `excluirTarefa`). Essas funções já são `async`, então quando a API existir é só
trocar o LocalStorage por `fetch` dentro delas, sem mexer no resto do código.

Rotas que pretendo criar:

| Método | Rota               | O que faz                 |
| ------ | ------------------ | ------------------------- |
| GET    | /api/tarefas       | Lista as tarefas          |
| POST   | /api/tarefas       | Cria uma tarefa           |
| PUT    | /api/tarefas/:id   | Edita uma tarefa          |
| DELETE | /api/tarefas/:id   | Exclui uma tarefa         |
| GET    | /api/categorias    | Lista os projetos         |
| POST   | /api/categorias    | Cria um projeto           |
| POST   | /api/auth/login    | Login do usuário          |
| POST   | /api/auth/cadastro | Cadastro de novo usuário  |
