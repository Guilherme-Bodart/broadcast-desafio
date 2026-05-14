# Broadcast Desafio

## Desenvolvedor Full Stack

### Projeto prático Broadcast

O projeto deve ser feito com React e TypeScript, usando Firebase Auth, Firestore e Firebase Functions.

## O projeto deve conter

- Login/cadastro com Firebase Auth.
- Lista de conexões:
  - Uma conexão tem apenas o nome dela.
  - Deve ter CRUD.
- Lista de contatos:
  - Um contato possui nome e telefone.
  - Deve ter CRUD.
- Tela para enviar mensagens para contatos específicos:
  - Deve ser possível selecionar os contatos que receberão uma mensagem.
  - Não precisa disparar mensagem de fato, é apenas fake.
  - Deve ser possível agendar uma mensagem.
  - Deve ser possível filtrar mensagens enviadas e agendadas.
  - Mensagens agendadas devem mudar para o status enviado no horário do disparo usando Firebase Functions.
  - Deve ter CRUD.

## Requisitos importantes

1. O sistema precisa ser do tipo SaaS: cada cliente tem sua área de conexões, cada conexão tem sua área de contatos e mensagens.
2. Um cliente não pode acessar dados de outro cliente.
3. Usar Material UI para componentes e Tailwind CSS para estilização.
4. Aplicar código limpo e bem estruturado.
5. Não utilizar orientação a objeto; o código deve seguir o paradigma funcional.
6. O projeto deve usar o recurso de tempo real do Firestore.
7. Usar Vite, não React Scripts.
8. Não usar subcoleções no Firestore.
9. Separar as funções em uma pasta `functions` e o frontend em outra pasta chamada `web`.

## Status da implementação

- Autenticação com Firebase Auth implementada com login, cadastro, nome do usuário e logout.
- CRUD de conexões implementado com Firestore em tempo real.
- CRUD de contatos implementado por conexão, sem subcoleções.
- CRUD de mensagens implementado por conexão, com seleção de contatos.
- Filtros de mensagens enviadas e agendadas implementados.
- Agendamento de mensagens implementado no frontend e em Firebase Functions.
- Regras do Firestore configuradas para isolar os dados por usuário.
- Estrutura separada em `web` para o frontend e `functions` para as Firebase Functions.
- Firebase Hosting configurado para publicar o build do Vite em `web/dist`.

Observação: o deploy das Firebase Functions agendadas exige o plano Blaze no Firebase. Sem o Blaze, o frontend mantém um fallback que marca mensagens agendadas vencidas como enviadas enquanto a tela de mensagens estiver aberta.

## Como acessar e validar o projeto

O projeto foi preparado para ser avaliado pelo Firebase Hosting após o build. Não é necessário rodar o frontend localmente para revisar a aplicação publicada.

### 1. Instalar dependências

Caso seja necessário reconstruir o projeto, instale as dependências do frontend e das funções:

```bash
npm --prefix web install
npm --prefix functions install
```

### 2. Configurar variáveis do Firebase

Crie o arquivo `web/.env` com as variáveis do app web do Firebase:

```env
VITE_FIREBASE_API_KEY=chave_do_firebase
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=id_do_remetente
VITE_FIREBASE_APP_ID=id_do_app
VITE_FIREBASE_MEASUREMENT_ID=id_do_measurement
```

No Firebase Console, confirme que o provedor **E-mail/senha** está habilitado em Authentication e que o Firestore Database foi criado.

### 3. Validar build e lint

```bash
npm run build
npm --prefix web run lint
```

O comando `npm run build` compila o frontend e as Firebase Functions.

### 4. Selecionar o projeto Firebase

```bash
firebase login
firebase use broadcast-desafio
```

### 5. Publicar regras e índices do Firestore

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

### 6. Publicar o frontend no Firebase Hosting

```bash
npm --prefix web run build
firebase deploy --only hosting
```

### 7. Publicar as Firebase Functions

Se o projeto estiver no plano Blaze:

```bash
firebase deploy --only functions
```

Se o projeto estiver no plano Spark, esse deploy será bloqueado pelo Firebase por exigir billing habilitado.

### Rodar localmente, se necessário

Para desenvolvimento ou ajustes, o frontend pode ser executado localmente:

```bash
npm run dev:web
```

O Vite exibirá a URL local no terminal, normalmente `http://localhost:5173`.
