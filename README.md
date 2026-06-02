# API de Gestão de Alunos

Tarefa de desenvolvimento de uma API REST em Node.js + Express para gerenciar alunos.

## Endpoints

- `GET /alunos` - lista todos os alunos
- `GET /alunos/:id` - obtém um aluno por ID
- `POST /alunos` - cria um novo aluno
- `PUT /alunos/:id` - atualiza um aluno existente
- `DELETE /alunos/:id` - remove um aluno

## Executar

```bash
npm install
npm start
```

## Exemplo de payload para criação/atualização

```json
{
  "nome": "Aristóteles Barbosa",
  "curso": "Engenharia Informática",
  "ano": 2
}
```
