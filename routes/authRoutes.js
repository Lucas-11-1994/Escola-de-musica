// backend/routes/authRoutes.js - VERSÃO CORRIGIDA
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticateToken, optionalAuth } = require("../middleware/authMiddleware");

// Rotas públicas
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refreshToken);

// Rotas protegidas
router.get("/me", authenticateToken, authController.me);

// Rota para verificar status (opcional auth)
router.get("/status", optionalAuth, (req, res) => {
  res.json({
    success: true,
    authenticated: !!req.user,
    user: req.user ? req.user.toPublicJSON() : null
  });
});

module.exports = router;

