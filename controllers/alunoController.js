const mongoose = require('mongoose');
const Aluno = require('../models/Aluno');

const isValidId = id => mongoose.Types.ObjectId.isValid(id);

exports.listAlunos = async (req, res, next) => {
  try {
    const alunos = await Aluno.find();
    return res.json(alunos);
  } catch (error) {
    return next(error);
  }
};

exports.getAlunoById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ erro: 'ID inválido.' });
    }

    const aluno = await Aluno.findById(id);
    if (!aluno) {
      return res.status(404).json({ erro: 'Aluno não encontrado' });
    }

    return res.json(aluno);
  } catch (error) {
    return next(error);
  }
};

exports.createAluno = async (req, res, next) => {
  try {
    const { nome, curso, ano } = req.body;
    const novoAluno = await Aluno.create({ nome, curso, ano });
    return res.status(201).json(novoAluno);
  } catch (error) {
    return next(error);
  }
};

exports.updateAluno = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ erro: 'ID inválido.' });
    }

    const { nome, curso, ano } = req.body;

    const alunoAtualizado = await Aluno.findByIdAndUpdate(
      id,
      { nome, curso, ano },
      { new: true, runValidators: true }
    );

    if (!alunoAtualizado) {
      return res.status(404).json({ erro: 'Aluno não encontrado' });
    }

    return res.json(alunoAtualizado);
  } catch (error) {
    return next(error);
  }
};

exports.deleteAluno = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ erro: 'ID inválido.' });
    }

    const alunoRemovido = await Aluno.findByIdAndDelete(id);
    if (!alunoRemovido) {
      return res.status(404).json({ erro: 'Aluno não encontrado' });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
