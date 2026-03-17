# PR: Assistente — Caixa de e-mail unificada

## Resumo

Nova tela **Assistente** no dashboard que reúne várias contas de e-mail (Gmail e Outlook) em uma única caixa de entrada. O usuário pode conectar múltiplas contas de cada provedor, visualizar entrada/enviados/lixeira, ler e-mails e ser redirecionado para o app do provedor para responder.

---

## O que foi implementado

### Backend (Convex)

- **Tabela `emailAccounts`** no schema: armazena uma linha por conta conectada (`userId`, `provider`, `email`, tokens OAuth, `tokenExpiry`, etc.), com índices `by_user` e `by_user_email`.
- **Arquivo `emailAccounts.ts`**:
  - **Queries:** `getMyAccounts` — lista contas do usuário.
  - **Mutations:** `storeAccount`, `updateTokens`, `removeAccount` (e `internalUpdateTokens` para refresh nas actions).
  - **Actions:** `fetchEmails` (busca de todas as contas ou de uma específica, merge por data) e `fetchEmailDetail` (corpo completo do e-mail). Inclui refresh automático de tokens (Gmail e Outlook).
- **Internal queries** para as actions: `internalGetAccount`, `internalGetUserAccounts`.

### OAuth (Next.js API Routes)

- **Gmail:** `GET /api/email/gmail/auth` (redireciona para consent) e `GET /api/email/gmail/callback` (troca code por tokens, grava no Convex).
- **Outlook:** `GET /api/email/outlook/auth` e `GET /api/email/outlook/callback` (mesmo fluxo).
- Variáveis de ambiente usadas: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET`, `NEXT_PUBLIC_APP_URL`.

### Frontend

- **Rota:** `/assistant` (admin).
- **Página:** Server component com preload de contas; client component principal com tabs (Caixa de Entrada, Enviados, Lixeira), filtro por conta, botão “Conectar Conta” e “Atualizar”.
- **Lista de e-mails:** 7 itens por página, paginação numérica em grupos de 3 (ex.: 1, 2, 3 → Próxima → 4, 5, 6), com Anterior/Próxima.
- **Detalhe do e-mail:** Sheet lateral com assunto, remetente, data, corpo (HTML ou texto) e botão “Responder” (abre Gmail/Outlook no navegador).
- **Marcar como lido:** Botão (ícone) ao lado do horário; estado “lido” em memória (fundo branco, sem bolinha laranja).
- **Filtro “Não lidos”:** Botão acima da lista que filtra apenas e-mails não lidos; contador de não lidos no botão.
- **Dialog “Conectar Conta”:** Lista contas conectadas por provedor (Gmail/Outlook), botões para conectar nova conta e remover conta.

### Navegação e layout

- **Sidebar e bottom nav:** item “Assistente” (ícone Mail) adicionado.
- **Layout admin:** `SidebarInset` com `overflow-x-hidden` para evitar scroll horizontal no conteúdo.

### Configuração

- **Env:** `packages/env/src/server.ts` atualizado com variáveis opcionais para OAuth (Google/Microsoft) e `NEXT_PUBLIC_APP_URL`.
- **Documentação:** O usuário precisa configurar no Google Cloud Console e no Azure AD os clientes OAuth e adicionar as variáveis em `apps/web/.env.local` e `packages/backend/.env.local` (ver plano/README se houver).

---

## Como testar

1. Configurar `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (e opcionalmente Microsoft) em `apps/web/.env.local` e `packages/backend/.env.local`; definir `NEXT_PUBLIC_APP_URL` (ex.: `http://localhost:3001`).
2. No Google Cloud Console: criar OAuth 2.0 Client ID (Web), adicionar redirect URI `{NEXT_PUBLIC_APP_URL}/api/email/gmail/callback`, adicionar usuários de teste na tela de consentimento.
3. Rodar o app, ir em **Assistente**, clicar em **Conectar Conta** e conectar pelo menos uma conta Gmail (ou Outlook).
4. Verificar listagem por pasta (Entrada/Enviados/Lixeira), paginação, abrir e-mail no sheet, “Responder”, “Marcar como lido” e filtro “Não lidos”.

---

## Observações

- Tokens OAuth ficam apenas no backend (Convex); a leitura de e-mails é feita nas actions.
- Escopos usados: somente leitura (`gmail.readonly`, `Mail.Read`).
- Paginação da lista é em memória (client-side) após buscar um lote da API; não há paginação cursor-based no Convex para e-mails, pois a fonte são as APIs externas.
