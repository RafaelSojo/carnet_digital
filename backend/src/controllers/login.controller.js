const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');

const generarToken = (usuarioId, nombre_completo) => {
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
    { usuarioId, tipo: 'refresh', nombre_completo}, // 👈 Agregamos el claim tipo
    process.env.JWT_SECRET,
    { expiresIn: refreshExpires }
  );

  return {
    expires_in: new Date(Date.now() + jwtMs).toLocaleString('es-CR', {
  timeZone: 'America/Costa_Rica',
  hour12: false,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
}),
    access_token,
    refresh_token,
    usuarioID: usuarioId,
    nombre_completo: nombre_completo, // 👈 Agregamos el nombre completo del usuario
  };
};

const generarRefreshToken = (usuarioId, nombre_completo) => {
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
    { usuarioId, tipo: 'refresh', nombre_completo}, // 👈 Agregamos el claim tipo
    process.env.JWT_SECRET,
    { expiresIn: refreshExpires }
  );
  return {
    expires_in: new Date(Date.now() + jwtMs).toLocaleString('es-CR', {
  timeZone: 'America/Costa_Rica',
  hour12: false,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
}),
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

  //Validacion de todos los campos llenos
  if (!usuario || !contrasena || !tipoUsuario)
    return res.status(400).json({ error: 'Todos los datos son requeridos y no pueden ser nulos o blancos' });

  try {
    const user = await Usuario.findOne({ where: { usuario, tipo_usuario: tipoUsuario } });

    if (!user)
      return res.status(401).json({ error: 'Usuario y/o contraseña incorrectos' });

    // Verificar si el usuario está bloqueado
    if (user.bloqueado)
      return res.status(423).json({ error: 'Usuario bloqueado por múltiples intentos fallidos' });

    const passwordOk = await bcrypt.compare(contrasena, user.contrasena);
    
    if (!passwordOk) {
      // Incrementar contador de intentos fallidos
      const intentosFallidos = (user.intentos_fallidos || 0) + 1;
      
      // Actualizar contador de intentos fallidos
      await user.update({ intentos_fallidos: intentosFallidos });
      
      // Verificar si debe bloquearse DESPUÉS de actualizar
      if (intentosFallidos >= 3) {
        // Bloquear usuario al tercer intento
        await user.update({ bloqueado: true });
        return res.status(423).json({ error: 'Usuario bloqueado por múltiples intentos fallidos' });
      } else {
        return res.status(401).json({ 
          error: 'Usuario y/o contraseña incorrectos',
          //intentosRestantes: 3 - intentosFallidos
        });
      }
    }

    // Login exitoso: resetear contador de intentos fallidos
    if (user.intentos_fallidos > 0) {
      await user.update({ intentos_fallidos: 0 });
    }

    const tokens = generarToken(user.usuarioId, user.nombre_completo);
    return res.status(201).json(tokens);

  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
};

// --------------------------
// REFRESH
// --------------------------
exports.refresh = (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(400).json({ message: 'No autorizado' });

  const refresh_token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET);

    if (decoded.tipo !== 'refresh') {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const tokens = generarRefreshToken(decoded.usuarioId, decoded.nombre_completo);
    return res.status(201).json(tokens);
  } catch {
    return res.status(401).json({ message: 'No autorizado' });
  }
};

// --------------------------
// VALIDATE
// --------------------------
exports.validate = (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.sendStatus(401);

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.tipo !== 'access') {
      return res.sendStatus(401);
    }

    return res.status(200).json(true);
  } catch {
    return res.sendStatus(401);
  }
};
