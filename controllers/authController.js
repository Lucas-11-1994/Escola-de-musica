// backend/controllers/authController.js
const User = require("../models/User");
const { generateTokenPair, verifyRefreshToken } = require("../utils/jwt");
require("dotenv").config();

// Configurações de cookie
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  maxAge: 15 * 60 * 1000 // 15 minutos para access token
};

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias para refresh token
};

const authController = {
  // Registro de usuário
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Validação básica
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: "Username e senha são obrigatórios"
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Senha deve ter pelo menos 6 caracteres"
        });
      }

      // Verificar se usuário já existe
      const existingUser = await User.findOne({ username: username.toLowerCase() });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Username já está em uso"
        });
      }

      // Criar novo usuário
      const user = new User({
        username: username.toLowerCase(),
        email: email ? email.toLowerCase() : undefined,
        password
      });

      await user.save();

      // Gerar tokens
      const { accessToken, refreshToken } = generateTokenPair(user._id);

      // Configurar cookies
      res.cookie("accessToken", accessToken, cookieOptions);
      res.cookie("refreshToken", refreshToken, refreshCookieOptions);

      // Atualizar último login
      await user.updateLastLogin();

      res.status(201).json({
        success: true,
        message: "Usuário criado com sucesso",
        user: user.toPublicJSON()
      });

    } catch (error) {
      console.error("Erro no registro:", error);
      
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          message: messages.join(', ')
        });
      }

      res.status(500).json({
        success: false,
        message: "Erro interno do servidor"
      });
    }
  },

  // Login de usuário
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Validação básica
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: "Username e senha são obrigatórios"
        });
      }

      // Buscar usuário
      const user = await User.findOne({ username: username.toLowerCase() });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Credenciais inválidas"
        });
      }

      // Verificar se usuário está ativo
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: "Conta desativada. Entre em contato com o suporte."
        });
      }

      // Verificar senha
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Credenciais inválidas"
        });
      }

      // Gerar tokens
      const { accessToken, refreshToken } = generateTokenPair(user._id);

      // Configurar cookies
      res.cookie("accessToken", accessToken, cookieOptions);
      res.cookie("refreshToken", refreshToken, refreshCookieOptions);

      // Atualizar último login
      await user.updateLastLogin();

      res.json({
        success: true,
        message: "Login realizado com sucesso",
        user: user.toPublicJSON()
      });

    } catch (error) {
      console.error("Erro no login:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor"
      });
    }
  },

  // Logout
  logout: (req, res) => {
    try {
      // Limpar cookies
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      res.json({
        success: true,
        message: "Logout realizado com sucesso"
      });

    } catch (error) {
      console.error("Erro no logout:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor"
      });
    }
  },

  // Refresh token
  refreshToken: async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: "Refresh token não fornecido"
        });
      }

      // Verificar refresh token
      const decoded = verifyRefreshToken(refreshToken);
      
      // Buscar usuário
      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: "Usuário não encontrado ou inativo"
        });
      }

      // Gerar novos tokens
      const tokens = generateTokenPair(user._id);

      // Configurar novos cookies
      res.cookie("accessToken", tokens.accessToken, cookieOptions);
      res.cookie("refreshToken", tokens.refreshToken, refreshCookieOptions);

      res.json({
        success: true,
        message: "Tokens renovados com sucesso",
        user: user.toPublicJSON()
      });

    } catch (error) {
      console.error("Erro no refresh:", error);
      
      // Limpar cookies em caso de erro
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      res.status(401).json({
        success: false,
        message: "Refresh token inválido ou expirado"
      });
    }
  },

  // Verificar status de autenticação
  me: async (req, res) => {
    try {
      // req.user já foi definido pelo middleware authenticateToken
      res.json({
        success: true,
        user: req.user.toPublicJSON()
      });
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor"
      });
    }
  }
};

module.exports = authController;

