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

