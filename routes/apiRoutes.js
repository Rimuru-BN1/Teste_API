const express = require('express');
const { body, validationResult } = require('express-validator');
const authController = require('../controllers/authController');
const alunoController = require('../controllers/alunoController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

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
router.post(
  '/login',
  body('email').isEmail().withMessage('Email inválido.'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres.'),
  validarCampos,
  authController.login
);

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
router.get('/alunos', alunoController.listAlunos);

router.get('/alunos/:id', alunoController.getAlunoById);

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
router.post(
  '/alunos',
  authMiddleware,
  body('nome').trim().isLength({ min: 2 }).withMessage('Nome deve ter pelo menos 2 caracteres.'),
  body('curso').trim().isLength({ min: 2 }).withMessage('Curso deve ter pelo menos 2 caracteres.'),
  body('ano').isInt({ min: 1 }).withMessage('Ano deve ser um número inteiro positivo.'),
  validarCampos,
  alunoController.createAluno
);

router.put(
  '/alunos/:id',
  authMiddleware,
  body('nome').trim().isLength({ min: 2 }).withMessage('Nome deve ter pelo menos 2 caracteres.'),
  body('curso').trim().isLength({ min: 2 }).withMessage('Curso deve ter pelo menos 2 caracteres.'),
  body('ano').isInt({ min: 1 }).withMessage('Ano deve ser um número inteiro positivo.'),
  validarCampos,
  alunoController.updateAluno
);

router.delete('/alunos/:id', authMiddleware, alunoController.deleteAluno);

module.exports = router;
