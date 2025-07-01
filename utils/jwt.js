// backend/utils/jwt.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET;
const JWT_REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error("JWT secrets não configurados no arquivo .env");
}

// Gerar Access Token (curta duração)
const generateAccessToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "15m", // 15 minutos
    issuer: "MakerMusic",
    audience: "MakerMusic-Users"
  });
};

// Gerar Refresh Token (longa duração)
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: "7d", // 7 dias
    issuer: "MakerMusic",
    audience: "MakerMusic-Users"
  });
};

// Verificar Access Token
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Token inválido ou expirado");
  }
};

// Verificar Refresh Token
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error("Refresh token inválido ou expirado");
  }
};

// Gerar par de tokens
const generateTokenPair = (userId) => {
  const payload = { userId, type: "access" };
  const refreshPayload = { userId, type: "refresh" };
  
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(refreshPayload)
  };
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateTokenPair
};

