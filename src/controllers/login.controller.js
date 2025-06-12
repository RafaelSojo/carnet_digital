const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');

const generarToken = (usuarioId) => {
  const jwtExpires = process.env.JWT_EXPIRES;
  const refreshExpires = process.env.REFRESH_EXPIRES;

  const jwtMs = parseDuration(jwtExpires);
  const refreshMs = parseDuration(refreshExpires);

  if (jwtMs == null || refreshMs == null) {
    throw new Error('❌ Formato inválido en JWT_EXPIRES o REFRESH_EXPIRES. Usa 5m, 1h, etc.');
  }

  if (refreshMs <= jwtMs) {
    throw new Error('❌ REFRESH_EXPIRES debe ser mayor que JWT_EXPIRES');
  }

  const access_token = jwt.sign(
    { usuarioId, tipo: 'access' },  // 👈 Agregamos el claim tipo
    process.env.JWT_SECRET,
    { expiresIn: jwtExpires }
  );

  const refresh_token = jwt.sign(
    { usuarioId, tipo: 'refresh' }, // 👈 Agregamos el claim tipo
    process.env.JWT_SECRET,
    { expiresIn: refreshExpires }
  );

  return {
    expires_in: new Date(Date.now() + jwtMs).toLocaleString('es-CR', { timeZone: 'America/Costa_Rica' }),
    access_token,
    refresh_token,
    usuarioID: usuarioId,
  };
};

const generarRefreshToken = (usuarioId) => {
  const jwtExpires = process.env.JWT_EXPIRES;
  const refreshExpires = process.env.REFRESH_EXPIRES;

  const jwtMs = parseDuration(jwtExpires);
  const refreshMs = parseDuration(refreshExpires);

  if (jwtMs == null || refreshMs == null) {
    throw new Error('❌ Formato inválido en JWT_EXPIRES o REFRESH_EXPIRES. Usa 5m, 1h, etc.');
  }

  if (refreshMs <= jwtMs) {
    throw new Error('❌ REFRESH_EXPIRES debe ser mayor que JWT_EXPIRES');
  }


  const access_token = jwt.sign(
    { usuarioId, tipo: 'access' },  // 👈 Agregamos el claim tipo
    process.env.JWT_SECRET,
    { expiresIn: jwtExpires }
  );

  const refresh_token = jwt.sign(
    { usuarioId, tipo: 'refresh' }, // 👈 Agregamos el claim tipo
    process.env.JWT_SECRET,
    { expiresIn: refreshExpires }
  );
  return {
    expires_in: new Date(Date.now() + jwtMs).toLocaleString('es-CR', { timeZone: 'America/Costa_Rica' }),
    access_token,
    refresh_token,
  };
};


  // Función para convertir "5m", "1h", etc., a milisegundos
  const parseDuration = (str) => {
    const match = str.match(/^(\d+)([smhd])$/);
    if (!match) return null;
    const value = parseInt(match[1], 10);
    const unit = match[2];
    const multipliers = {
      s: 1000,
      m: 60000,
      h: 3600000,
      d: 86400000,
    };
    return value * multipliers[unit];
  };

// --------------------------
// LOGIN
// --------------------------
exports.login = async (req, res) => {
  const usuario = req.headers['usuario'];
  const contrasena = req.headers['contrasena'];
  const tipoUsuario = req.headers['tipousuario'];

  if (!usuario || !contrasena || !tipoUsuario)
    return res.status(400).json({ message: 'Todos los datos son requeridos y no pueden ser nulos o blancos' });

  try {
    const user = await Usuario.findOne({ where: { usuario, tipo_usuario: tipoUsuario } });

    if (!user)
      return res.status(401).json({ message: 'Usuario y/o contraseña incorrectos' });

    const passwordOk = await bcrypt.compare(contrasena, user.contrasena);
    if (!passwordOk)
      return res.status(401).json({ message: 'Usuario y/o contraseña incorrectos' });

    const tokens = generarToken(user.usuarioId);
    return res.status(201).json(tokens);

  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

// --------------------------
// REFRESH
// --------------------------
exports.refresh = (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token)
    return res.status(400).json({ message: 'refresh_token requerido' });

  try {
    const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET);

    if (decoded.tipo !== 'refresh') {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const tokens = generarRefreshToken(decoded.usuarioId);
    return res.status(201).json(tokens);
  } catch (err) {
    return res.status(401).json({ message: 'No autorizado' });
  }
};

// --------------------------
// VALIDATE
// --------------------------
exports.validate = (req, res) => {
  const { token } = req.body;

  if (!token)
    return res.status(401).json();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.tipo !== 'access') {
      return res.status(401).json();
    }

    return res.status(200).json(true);
  } catch {
    return res.sendStatus(401);
  }
};
