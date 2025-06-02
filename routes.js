const express = require("express");
const router = express.Router();
const petController = require("./src/controllers/petController");
const agendaController = require("./src/controllers/agendaController");
const listapetController = require("./src/controllers/lista-petController");
const estoqueController = require("./src/controllers/estoqueController");
const financeiroController = require("./src/controllers/financeiroController");
const relatorioController = require("./src/controllers/relatorioController");

router.get("/", petController.index);
router.post("/", petController.entrar);
router.get("/agenda", agendaController.agenda);
router.post("/agenda", agendaController.criar);
router.post("/agendamentos/delete/:id", agendaController.deletarAgendamento);
router.put("/agendamentos/edit/:id", agendaController.editarAgendamento);
router.get("/lista-pets", listapetController.index);
router.get("/estoque", estoqueController.index);
router.post("/estoque", estoqueController.adicionar);
router.put("/estoque/:id", estoqueController.editar);
router.get("/financeiro", financeiroController.financeiro);
router.get("/relatorios", relatorioController.relatorio);

module.exports = router;
