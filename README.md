# API de Gestão de Alunos

Tarefa de desenvolvimento de uma API REST em Node.js + Express para gerenciar alunos.
Esta versão usa MongoDB com Mongoose para persistência dos dados.

## Endpoints

- `POST /login` - autentica um administrador e retorna um token JWT
- `GET /alunos` - lista todos os alunos
- `GET /alunos/:id` - obtém um aluno por ID
- `POST /alunos` - cria um novo aluno
- `PUT /alunos/:id` - atualiza um aluno existente
- `DELETE /alunos/:id` - remove um aluno

## Executar

1. Certifique-se de que o MongoDB esteja rodando localmente ou use uma URI de conexão válida.
2. Instale dependências:

```bash
npm install
```

3. Execute a API:

```bash
npm start
```

4. Ou defina a URI do MongoDB explicitamente:

```bash
MONGODB_URI="mongodb://127.0.0.1:27017/alunosdb" npm start
```

## Exemplo de payload para criação/atualização

```json
{
  "nome": "Aristóteles Barbosa",
  "curso": "Engenharia Informática",
  "ano": 2
}
```
