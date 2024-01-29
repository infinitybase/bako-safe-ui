- quando clica em "create vault" e fecha o dialog, redireciona para home do vault single que nao deveria existir.
  - solucao: adicionar workspaceId nos routePrams

Corrigir os redirects nos ActionButtons na tela de listagem de vaults do workspace

- Pagina de vaults de um workspaces abre mesmo não tendo vaults..

  - Solucao, desabilitar o botão de vaults na home do workspace

- Quando acessa a home depois de uma listagem de vaults de workspace, carrega vaults do workspace e nao atualiza com os dados do workspace single como era o esperado

- Validar se existe algum risco em retornar address book dentro da resposta do vaultFindById dentro de um workspace
