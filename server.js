const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const routes = require("./routes");
const app = express();
const connectionString = "mongodb+srv://guiolialves2:183928@tcc.2yzzdam.mongodb.net/?retryWrites=true&w=majority&appName=tcc"

//banquinho de dados
mongoose
  .connect(connectionString, {})
  .then(() => console.log("MongoDB Atlas conectado!")) // Mensagem atualizada
  .catch((err) => console.error("Erro ao conectar no MongoDB Atlas:", err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //arquivos json
app.use(express.static(path.join(__dirname, "public"))); //caminho absoluto

//paginas onde os ejs(views) estão e vão ser renderizados
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs"); // renderiza as views como ejs
app.use("/", routes); //rotas ae

//servidors
app.listen(3000, () => {
  console.log("Acessar http://localhost:3000");
});
