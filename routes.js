const express = require("express");
const router = express.Router();
// Renomeamos para 'authController' para maior clareza, mas o arquivo continua sendo 'petController.js'
const authController = require("./src/controllers/petController");
const agendaController = require("./src/controllers/agendaController");
const listapetController = require("./src/controllers/lista-petController");
const estoqueController = require("./src/controllers/estoqueController");
const financeiroController = require("./src/controllers/financeiroController");
const relatorioController = require("./src/controllers/relatorioController");

// --- ROTAS DE AUTENTICAÇÃO ---
router.get("/", authController.renderLogin);       // Mostra a página de login
router.post("/", authController.loginUser);       // Processa o formulário de login

router.get("/cadastro", authController.renderCadastro); // Mostra a página de cadastro
router.post("/cadastro", authController.registerUser); // Processa o formulário de cadastro


// --- ROTAS DO SISTEMA ---
router.get("/agenda", agendaController.agenda);
router.post("/agenda", agendaController.criar);
router.put("/agendamentos/edit/:id", agendaController.editarAgendamento);
router.post("/agendamentos/delete/:id", agendaController.deletarAgendamento);
router.post("/agendamentos/finalizar/:id", agendaController.finalizarAgendamento);

router.get("/lista-pets", listapetController.index);
router.get("/estoque", estoqueController.index);
router.post("/estoque", estoqueController.adicionar);
router.put("/estoque/:id", estoqueController.editar);

router.get("/financeiro", financeiroController.financeiro);
router.get("/relatorios", relatorioController.relatorio);

module.exports = router;
