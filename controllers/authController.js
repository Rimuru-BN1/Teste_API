const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET || 'segredo-dev';
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1h';

const adminUser = {
  email: 'banana@gmail.com',
  password: '123456'
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (email !== adminUser.email || password !== adminUser.password) {
    return res.status(401).json({ erro: 'Credenciais inválidas.' });
  }

  const token = jwt.sign({ email }, jwtSecret, { expiresIn: jwtExpiresIn });

  return res.json({
    mensagem: 'Login realizado com sucesso.',
    token,
    expiresIn: jwtExpiresIn
  });
};
