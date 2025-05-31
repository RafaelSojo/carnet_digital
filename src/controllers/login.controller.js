const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');

const generarToken = (usuarioId) => {
  const jwtExpires = process.env.JWT_EXPIRES || '5m';
  const refreshExpires = process.env.REFRESH_EXPIRES || '15m';

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

  const jwtMs = parseDuration(jwtExpires);
  const refreshMs = parseDuration(refreshExpires);

  if (jwtMs == null || refreshMs == null) {
    throw new Error('❌ Formato inválido en JWT_EXPIRES o REFRESH_EXPIRES. Usa 5m, 1h, etc.');
  }

  if (refreshMs <= jwtMs) {
    throw new Error('❌ REFRESH_EXPIRES debe ser mayor que JWT_EXPIRES');
  }

  const access_token = jwt.sign({ usuarioId }, process.env.JWT_SECRET, {
    expiresIn: jwtExpires,
  });

  const refresh_token = jwt.sign({ usuarioId }, process.env.JWT_SECRET, {
    expiresIn: refreshExpires,
  });

  return {
    expires_in: new Date(Date.now() + jwtMs).toLocaleString('es-CR', { timeZone: 'America/Costa_Rica' }),
    access_token,
    refresh_token,
    usuarioID: usuarioId,
  };
};

const generarRefreshToken = (usuarioId) => {
  const jwtExpires = process.env.JWT_EXPIRES || '5m';
  const refreshExpires = process.env.REFRESH_EXPIRES || '15m';

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

  const jwtMs = parseDuration(jwtExpires);
  const refreshMs = parseDuration(refreshExpires);

  if (jwtMs == null || refreshMs == null) {
    throw new Error('❌ Formato inválido en JWT_EXPIRES o REFRESH_EXPIRES. Usa 5m, 1h, etc.');
  }

  if (refreshMs <= jwtMs) {
    throw new Error('❌ REFRESH_EXPIRES debe ser mayor que JWT_EXPIRES');
  }

  const access_token = jwt.sign({ usuarioId }, process.env.JWT_SECRET, {
    expiresIn: jwtExpires,
  });

  const refresh_token = jwt.sign({ usuarioId }, process.env.JWT_SECRET, {
    expiresIn: refreshExpires,
  });

  return {
    expires_in: new Date(Date.now() + jwtMs).toLocaleString('es-CR', { timeZone: 'America/Costa_Rica' }),
    access_token,
    refresh_token,
  };
};


function parseDuration(durationStr) {
  const match = durationStr.match(/^(\d+)([smhd])$/); // soporta s, m, h, d

  if (!match) return null;

  const value = parseInt(match[1], 10);
  const unit = match[2];

  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return value * multipliers[unit];
}

// --------------------------
// LOGIN
// --------------------------
exports.login = async (req, res) => {
  const { email, password, tipoUsuario } = req.body;

  if (!email || !password || !tipoUsuario)
    return res.status(400).json({ message: 'Datos incompletos' });

  try {
    const user = await Usuario.findOne({ where: { email, tipo_usuario: tipoUsuario } });

    if (!user)
      return res.status(401).json({ message: 'Usuario y/o contraseña incorrectos' });

    const passwordOk = await bcrypt.compare(password, user.password);
    if (!passwordOk)
      return res.status(401).json({ message: 'Usuario y/o contraseña incorrectos' });

    const tokens = generarToken(user.id);
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
    return res.status(400).json({ message: 'token requerido' });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json(true);
  } catch {
    return res.status(401).json();
  }
};
