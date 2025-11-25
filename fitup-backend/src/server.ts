import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Configurações básicas
app.use(cors()); // Permite acesso externo (Front-end)
app.use(express.json()); // Permite ler JSON no corpo das requisições

// Rota de teste
app.get("/", (req, res) => {
  res.json({ message: "FitUP API is running 🚀" });
});

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
