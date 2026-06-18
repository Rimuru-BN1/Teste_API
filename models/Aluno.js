const mongoose = require('mongoose');

const alunoSchema = new mongoose.Schema({
  nome: { type: String, required: true, trim: true },
  curso: { type: String, required: true, trim: true },
  ano: { type: Number, required: true, min: 1 }
}, { versionKey: false });

module.exports = mongoose.model('Aluno', alunoSchema);
