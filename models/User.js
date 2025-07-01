// backend/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: [true, 'Username é obrigatório'], 
    unique: true,
    trim: true,
    minlength: [3, 'Username deve ter pelo menos 3 caracteres'],
    maxlength: [30, 'Username deve ter no máximo 30 caracteres']
  },
  email: { 
    type: String, 
    required: false, 
    unique: false,
    trim: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: [true, 'Senha é obrigatória'],
    minlength: [6, 'Senha deve ter pelo menos 6 caracteres']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  }
});

// Middleware para hash da senha antes de salvar
userSchema.pre("save", async function (next) {
  // Só faz hash se a senha foi modificada
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // Gera salt e hash da senha
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar senha
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Erro ao comparar senhas');
  }
};

// Método para atualizar último login
userSchema.methods.updateLastLogin = function () {
  this.lastLogin = new Date();
  return this.save();
};

// Método para retornar dados públicos do usuário
userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    role: this.role,
    isActive: this.isActive,
    createdAt: this.createdAt,
    lastLogin: this.lastLogin
  };
};

module.exports = mongoose.model("User", userSchema);

