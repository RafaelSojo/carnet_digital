const jwt = require('jsonwebtoken');

exports.validateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json();

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //  Validacion que sea un access token
    if (decoded.tipo !== 'access') {
      return res.status(401).json();
    }

    req.usuarioId = decoded.usuarioId;
    next();
  } catch (error) {
    return res.status(401).json();
  }
};