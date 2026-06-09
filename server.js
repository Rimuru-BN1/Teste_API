const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const { body, validationResult } = require('express-validator');
const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/alunosdb';
const jwtSecret = process.env.JWT_SECRET || 'segredo-dev';
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1h';

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const alunoSchema = new mongoose.Schema({
  nome: { type: String, required: true, trim: true },
  curso: { type: String, required: true, trim: true },
  ano: { type: Number, required: true, min: 1 }
}, { versionKey: false });

const Aluno = mongoose.model('Aluno', alunoSchema);

const adminUser = {
  email: 'banana@gmail.com',
  password: '123456'
};

const isValidId = id => mongoose.Types.ObjectId.isValid(id);

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ erro: 'Token de acesso ausente.' });
  }

  try {
    const payload = jwt.verify(token, jwtSecret);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
};

const validarCampos = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      sucesso: false,
      erro: 'Dados inválidos.',
      detalhes: errors.array().map(err => ({ campo: err.path, mensagem: err.msg }))
    });
  }
  next();
};

/**
 * @openapi
 * /login:
 *   post:
 *     summary: Autenticação do administrador
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token gerado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Credenciais inválidas
 */
app.post('/login',
  body('email').isEmail().withMessage('Email inválido.'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres.'),
  validarCampos,
  (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ erro: 'Informe email e senha.' });
  }

  if (email !== adminUser.email || password !== adminUser.password) {
    return res.status(401).json({ erro: 'Credenciais inválidas.' });
  }

  const token = jwt.sign({ email }, jwtSecret, { expiresIn: jwtExpiresIn });

  return res.json({
    mensagem: 'Login realizado com sucesso.',
    token,
    expiresIn: jwtExpiresIn
  });
});

/**
 * @openapi
 * /alunos:
 *   get:
 *     summary: Listar alunos
 *     tags: [Alunos]
 *     responses:
 *       200:
 *         description: Lista de alunos
 */
app.get('/alunos', async (req, res, next) => {
  try {
    const alunos = await Aluno.find();
    res.json(alunos);
  } catch (error) {
    next(error);
  }
});

app.get('/alunos/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ erro: 'ID inválido.' });
    }

    const aluno = await Aluno.findById(id);
    if (!aluno) {
      return res.status(404).json({ erro: 'Aluno não encontrado' });
    }

    res.json(aluno);
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /alunos:
 *   post:
 *     summary: Criar aluno
 *     tags: [Alunos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, curso, ano]
 *             properties:
 *               nome:
 *                 type: string
 *               curso:
 *                 type: string
 *               ano:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Aluno criado
 *       401:
 *         description: Token ausente ou inválido
 */
app.post('/alunos', authMiddleware,
  body('nome').trim().isLength({ min: 2 }).withMessage('Nome deve ter pelo menos 2 caracteres.'),
  body('curso').trim().isLength({ min: 2 }).withMessage('Curso deve ter pelo menos 2 caracteres.'),
  body('ano').isInt({ min: 1 }).withMessage('Ano deve ser um número inteiro positivo.'),
  validarCampos,
  async (req, res, next) => {
  try {
    const { nome, curso, ano } = req.body;

    const novoAluno = await Aluno.create({ nome, curso, ano });
    res.status(201).json(novoAluno);
  } catch (error) {
    next(error);
  }
});

app.put('/alunos/:id', authMiddleware,
  body('nome').trim().isLength({ min: 2 }).withMessage('Nome deve ter pelo menos 2 caracteres.'),
  body('curso').trim().isLength({ min: 2 }).withMessage('Curso deve ter pelo menos 2 caracteres.'),
  body('ano').isInt({ min: 1 }).withMessage('Ano deve ser um número inteiro positivo.'),
  validarCampos,
  async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ erro: 'ID inválido.' });
    }

    const { nome, curso, ano } = req.body;

    const alunoAtualizado = await Aluno.findByIdAndUpdate(
      id,
      { nome, curso, ano },
      { returnDocument: 'after', runValidators: true }
    );

    if (!alunoAtualizado) {
      return res.status(404).json({ erro: 'Aluno não encontrado' });
    }

    res.json(alunoAtualizado);
  } catch (error) {
    next(error);
  }
});

app.delete('/alunos/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ erro: 'ID inválido.' });
    }

    const alunoRemovido = await Aluno.findByIdAndDelete(id);
    if (!alunoRemovido) {
      return res.status(404).json({ erro: 'Aluno não encontrado' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

app.use((error, req, res, next) => {
  console.error(error);

  if (error.name === 'ValidationError') {
    return res.status(400).json({ sucesso: false, erro: 'Erro de validação.', detalhes: error.message });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ sucesso: false, erro: 'ID inválido.' });
  }

  res.status(error.status || 500).json({
    sucesso: false,
    erro: error.message || 'Erro interno do servidor'
  });
});

mongoose.connect(mongoUri)
  .then(() => {
    console.log('Conectado ao MongoDB');
    app.listen(port, () => {
      console.log(`API de alunos rodando em http://localhost:${port}`);
    });
  })
  .catch(error => {
    console.error('Erro ao conectar ao MongoDB:', error.message);
    process.exit(1);
  });
