const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

let alunos = [
  { id: 1, nome: 'Aristoteels Barbosa', curso: 'Engenharia', ano: 2 },
  { id: 2, nome: 'Denilson Antonio', curso: 'Engenharia', ano: 2 }
];
let proximoId = 3;

app.get('/alunos', (req, res) => {
  res.json(alunos);
});

app.get('/alunos/:id', (req, res) => {
  const id = Number(req.params.id);
  const aluno = alunos.find(a => a.id === id);
  if (!aluno) {
    return res.status(404).json({ erro: 'Aluno não encontrado' });
  }
  res.json(aluno);
});

app.post('/alunos', (req, res) => {
  const { nome, curso, ano } = req.body;
  if (!nome || !curso || typeof ano !== 'number') {
    return res.status(400).json({ erro: 'Dados inválidos. Informe nome, curso e ano (número).' });
  }

  const novoAluno = { id: proximoId++, nome, curso, ano };
  alunos.push(novoAluno);
  res.status(201).json(novoAluno);
});

app.put('/alunos/:id', (req, res) => {
  const id = Number(req.params.id);
  const alunoIndex = alunos.findIndex(a => a.id === id);
  if (alunoIndex === -1) {
    return res.status(404).json({ erro: 'Aluno não encontrado' });
  }

  const { nome, curso, ano } = req.body;
  if (!nome || !curso || typeof ano !== 'number') {
    return res.status(400).json({ erro: 'Dados inválidos. Informe nome, curso e ano (número).' });
  }

  alunos[alunoIndex] = { id, nome, curso, ano };
  res.json(alunos[alunoIndex]);
});

app.delete('/alunos/:id', (req, res) => {
  const id = Number(req.params.id);
  const alunoIndex = alunos.findIndex(a => a.id === id);
  if (alunoIndex === -1) {
    return res.status(404).json({ erro: 'Aluno não encontrado' });
  }

  alunos.splice(alunoIndex, 1);
  res.status(204).send();
});

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

app.listen(port, () => {
  console.log(`API de alunos rodando em http://localhost:${port}`);
});
