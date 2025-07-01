// backend/config/db.js
const mongoose = require("mongoose");
require("dotenv").config(); // Carrega o .env automaticamente

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/escola_musica";

async function connectDB() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log("✅ Conectado ao MongoDB com sucesso!");
  } catch (err) {
    console.error("❌ Erro ao conectar ao MongoDB:", err.message);
    process.exit(1);
  }

  mongoose.connection.on("connected", () => {
    console.log("🟢 Mongoose conectado ao DB");
  });
  mongoose.connection.on("error", (err) => {
    console.error("🔴 Erro na conexão do Mongoose:", err);
  });
  mongoose.connection.on("disconnected", () => {
    console.log("🟡 Mongoose desconectado do DB");
  });
}

module.exports = connectDB;
