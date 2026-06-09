# API de Gestão de Alunos

API REST em Node.js + Express + MongoDB + Mongoose, com autenticação JWT, validação de dados e documentação Swagger.

## Funcionalidades atuais

- CRUD de alunos em MongoDB
- Autenticação com JWT (`POST /login`)
- Rotas privadas protegidas para escrita (`POST/PUT/DELETE /alunos`)
- Validação de entrada com `express-validator`
- Middleware global de erro com respostas padronizadas
- Documentação interativa via Swagger UI em `/api-docs`

## Endpoints principais

- `POST /login` — autentica o administrador e devolve um token JWT
- `GET /alunos` — lista todos os alunos
- `GET /alunos/:id` — obtém um aluno por ID
- `POST /alunos` — cria um aluno (requer token JWT)
- `PUT /alunos/:id` — atualiza um aluno (requer token JWT)
- `DELETE /alunos/:id` — remove um aluno (requer token JWT)

## Pré-requisitos

- Node.js 18+
- MongoDB em execução localmente (ou uma URI válida em `MONGODB_URI`)

## Instalação

```bash
npm install
```

## Execução

```bash
npm start
```

A API ficará disponível em:

```text
http://localhost:3000
```

A documentação Swagger estará em:

```text
http://localhost:3000/api-docs/
```

## Variáveis de ambiente

Você pode configurar estas variáveis antes de iniciar a API:

```bash
MONGODB_URI="mongodb://127.0.0.1:27017/alunosdb"
JWT_SECRET="segredo-dev"
JWT_EXPIRES_IN="1h"
```

## Exemplo de autenticação

1. Faça login com:

```json
{
  "email": "banana@gmail.com",
  "password": "123456"
}
```

2. Use o token retornado no cabeçalho:

```http
Authorization: Bearer <TOKEN>
```

## Exemplo de payload para criação/atualização

```json
{
  "nome": "Aristóteles Barbosa",
  "curso": "Engenharia Informática",
  "ano": 2
}
```
