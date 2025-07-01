const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");
const cookieParser = require("cookie-parser");
const app = express();
const path = require("path");

// Carregar variáveis de ambiente
require("dotenv").config({ path: path.join(__dirname, ".env") });

app.use(cors({ 
    origin: true, // Ou especifique a origem do frontend se necessário
    credentials: true 
}));
app.use(express.json());
app.use(cookieParser());

// --- Define Diretórios --- 
const backendDir = __dirname;
const publicDir = path.join(backendDir, "public"); // **Novo diretório público**

// --- Servir Arquivos Estáticos da Pasta Public --- 
// **Principal mudança: Servir tudo da pasta 'public'**
// Isso permite acesso direto a /login.html, /css/style.css, /javaScript/script.js, etc.
app.use(express.static(publicDir));

// --- ROTAS PARA PÁGINAS HTML (Amigáveis - Opcional, mas mantém compatibilidade) --- 
// **Importante:** Estas rotas agora buscam arquivos DENTRO da pasta 'public'
app.get("/", (req, res) => { 
    res.sendFile(path.join(publicDir, "index.html")); 
});
app.get("/login", (req, res) => { 
    res.sendFile(path.join(publicDir, "login.html")); 
});
app.get("/cursos", (req, res) => { 
    res.sendFile(path.join(publicDir, "cursos.html")); 
});
app.get("/professores", (req, res) => { 
    res.sendFile(path.join(publicDir, "professores.html")); 
});
app.get("/calendario", (req, res) => { 
    res.sendFile(path.join(publicDir, "calendario.html")); 
});
app.get("/contato", (req, res) => { 
    res.sendFile(path.join(publicDir, "contatoechat.html")); 
});
app.get("/chat", (req, res) => { // Alias
    res.sendFile(path.join(publicDir, "contatoechat.html")); 
});

// --- Conexão com MongoDB --- 
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/escola_musica";
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})
.then(() => console.log("✅ Conectado ao MongoDB com sucesso!"))
.catch(err => console.error("❌ Erro ao conectar ao MongoDB:", err.message));

// Listeners de conexão (mantidos)
mongoose.connection.on("connected", () => console.log("🟢 Mongoose conectado ao DB"));
mongoose.connection.on("error", (err) => console.error("🔴 Erro na conexão do Mongoose:", err));
mongoose.connection.on("disconnected", () => console.log("🟡 Mongoose desconectado do DB"));
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("⏏️ Conexão com MongoDB encerrada");
  process.exit(0);
});

// --- ROTAS DA API --- 
app.use("/api/auth", require("./routes/authRoutes"));
app.use('/feriados', cors());

app.get('/feriados/:ano', async (req, res) => {
    const ano = req.params.ano;
    try {
        const response = await axios.get(`https://brasilapi.com.br/api/feriados/v1/${ano}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar feriados' });
    }
});

// --- Tratamento de Erro 404 (Final) ---
app.use((req, res) => {
    console.log(`⚠️ Rota não encontrada: ${req.method} ${req.originalUrl}`);
    // Tenta servir o index.html como fallback para SPAs (Single Page Applications)
    // Se não for uma SPA, pode comentar ou remover esta parte
    if (req.accepts('html')) {
        res.status(404).sendFile(path.join(publicDir, "index.html"));
        return;
    }
    res.status(404).send(`Recurso não encontrado: ${req.originalUrl}`);
});


// --- Inicia o servidor --- 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📡 Estado do MongoDB: ${mongoose.connection.readyState === 1 ? "🟢 Conectado" : "🔴 Desconectado"}`);
});
