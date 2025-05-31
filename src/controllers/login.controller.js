const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Simulación de usuarios (remplazar luego con BD)
const usuarios = [
  {
    id: 1,
    email: 'juan@cuc.ac.cr',
    password: bcrypt.hashSync('1234', 10),
    tipoUsuario: 'funcionario',
  },
  {
    id: 2,
    email: 'ana@cuc.cr',
    password: bcrypt.hashSync('abcd', 10),
    tipoUsuario: 'estudiante',
  },
];

const generarToken = (usuarioId) => {
  const access_token = jwt.sign({ usuarioId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || '5m',
  });
  const refresh_token = jwt.sign({ usuarioId }, process.env.JWT_SECRET, {
    expiresIn: process.env.REFRESH_EXPIRES || '15m',
  });

  return {
    expires_in: new Date(Date.now() + 5 * 60000).toISOString(),
    access_token,
    refresh_token,
    usuarioID: usuarioId,
  };
};

exports.login = (req, res) => {
  const { email, password, tipoUsuario } = req.body;

  if (!email || !password || !tipoUsuario)
    return res.status(400).json({ message: 'Datos incompletos' });

  const user = usuarios.find(
    (u) => u.email === email && u.tipoUsuario === tipoUsuario
  );

  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ message: 'Usuario y/o contraseña incorrectos' });

  const tokens = generarToken(user.id);
  return res.status(201).json(tokens);
};

exports.refresh = (req, res) => {
  const { refresh_token } = req.body;

  try {
    const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET);
    const tokens = generarToken(decoded.usuarioId);
    return res.status(201).json(tokens);
  } catch (err) {
    return res.status(401).json({ message: 'No autorizado' });
  }
};

exports.validate = (req, res) => {
  const { token } = req.body;

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json(true);
  } catch {
    return res.status(401).json(false);
  }
};

