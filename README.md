# Finity

Sistema de gerenciamento de tarefas no estilo Kanban, feito com HTML, SASS, JavaScript e TypeScript,
sem nenhum framework. Os dados ficam salvos no LocalStorage do navegador.

## Tecnologias

- **HTML, JavaScript e TypeScript** (módulos ES, migrando para TypeScript aos poucos)
- **SASS** (partials, variáveis, mixins e aninhamento)
- **Vite** para o servidor de desenvolvimento e o build
- **Vitest** para os testes
- **Docker** com Nginx para rodar o build em container

## Funcionalidades

- Criar, editar e excluir tarefas
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
├── css/
│   └── style/
│       ├── main.scss           junta todos os partials
│       ├── _mixins.scss        tamanhos de tela e mixins do responsivo
│       ├── _base.scss          variáveis de cores, tema escuro, reset, botões, campos e tags
│       ├── _layout.scss        menu lateral, topo, filtros e páginas
│       ├── _componentes.scss   indicadores, quadro, cards, tabela, projetos, modal e toast
│       └── _responsivo.scss    ajustes para tablet e celular
└── js/
    └── script/
        ├── utils.ts            funções de ajuda (datas, porcentagem, escapar HTML)
        ├── tarefas.ts          tipos, status, prioridades, filtros, ordenação e validação
        ├── api.js              salvar e buscar os dados (hoje usa o LocalStorage)
        ├── interface.js        funções que montam o HTML na tela
        ├── tema.js             troca entre tema claro e escuro
        ├── app.js              eventos, navegação, modais e drag and drop
        ├── utils.test.ts       testes do utils
        └── tarefas.test.ts     testes das regras das tarefas
```

O `index.html` carrega só o `app.js`, e ele importa o que precisa dos outros arquivos.

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

## Próximos passos

- [ ] Terminar a migração dos arquivos para TypeScript
- [ ] Migrar a interface para React

Depois, a ideia é transformar o projeto em full stack:

- [ ] Backend com Node.js e Express
- [ ] API REST
- [ ] Banco de dados PostgreSQL
- [ ] Cadastro e login de usuários

Toda a parte de dados está no `js/script/api.js` (`listarTarefas`, `criarTarefa`,
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
