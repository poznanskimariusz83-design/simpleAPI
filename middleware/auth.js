const jwt = require('jsonwebtoken');

/**
 * Middleware weryfikujący JWT token
 * Token powinien być w nagłówku: Authorization: Bearer <token>
 */
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'Brak tokenu autoryzacji',
        message: 'Wymagany nagłówek Authorization z tokenem Bearer'
      });
    }

    // Pobranie tokenu z nagłówka "Bearer <token>"
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    // Weryfikacja tokenu
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token wygasł',
        message: 'Proszę odświeżyć token używając refresh tokenu'
      });
    }
    
    return res.status(403).json({
      success: false,
      error: 'Niewalidny token',
      message: 'Token jest niewłaściwy lub uszkodzony'
    });
  }
};

/**
 * Middleware weryfikujący refresh token
 */
const verifyRefreshToken = (req, res, next) => {
  try {
    const refreshToken = req.body.refreshToken;
    
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Brak refresh tokenu',
        message: 'Refresh token jest wymagany'
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: 'Niewalidny refresh token',
      message: 'Nie można odświeżyć tokenu'
    });
  }
};

/**
 * Tworzy access token
 */
const generateAccessToken = (userId, username) => {
  return jwt.sign(
    { userId, username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );
};

/**
 * Tworzy refresh token
 */
const generateRefreshToken = (userId, username) => {
  return jwt.sign(
    { userId, username },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
};

module.exports = {
  verifyToken,
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken
};
