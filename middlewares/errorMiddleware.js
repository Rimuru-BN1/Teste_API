module.exports = (error, req, res, next) => {
  console.error(error);

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      sucesso: false,
      erro: 'Erro de validação.',
      detalhes: error.message
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({
      sucesso: false,
      erro: 'ID inválido.'
    });
  }

  return res.status(error.status || 500).json({
    sucesso: false,
    erro: error.message || 'Erro interno do servidor'
  });
};
