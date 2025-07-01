// backend/middleware/auth.js - VERSÃO CONSOLIDADA E CORRIGIDA
const { verifyAccessToken } = require("../utils/jwt");
const User = require("../models/User");

// Middleware para verificar autenticação
const authenticateToken = async (req, res, next) => {
  try {
    // Buscar token no cookie ou header Authorization
    let token = req.cookies.accessToken;
    
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token de acesso não fornecido",
        error: "no_token"
      });
    }

    // Verificar e decodificar o token
    const decoded = verifyAccessToken(token);
    
    // Buscar usuário no banco
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Usuário não encontrado ou inativo",
        error: "user_not_found"
      });
    }

    // Adicionar usuário ao request
    req.user = user;
    req.userId = user._id; // Para compatibilidade
    next();

  } catch (error) {
    console.error("Erro na autenticação:", error.message);
    
    if (error.message.includes("expirado") || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Token expirado",
        error: "token_expired"
      });
    }

    return res.status(401).json({
      success: false,
      message: "Token inválido",
      error: "invalid_token"
    });
  }
};

// Middleware para verificar se é admin
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: "Acesso negado. Privilégios de administrador necessários.",
      error: "admin_required"
    });
  }
  next();
};

// Middleware opcional - não falha se não houver token
const optionalAuth = async (req, res, next) => {
  try {
    let token = req.cookies.accessToken;
    
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (token) {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.userId);
      if (user && user.isActive) {
        req.user = user;
        req.userId = user._id;
      }
    }
  } catch (error) {
    // Ignora erros de token em auth opcional
    console.log("Auth opcional - token inválido:", error.message);
  }
  
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  optionalAuth
};

