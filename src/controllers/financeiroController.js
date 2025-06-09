const Agendamento = require("../models/agendamento");
const Estoque = require("../models/estoque");

exports.financeiro = async (req, res) => {
  try {
    // --- MUDANÇA AQUI: Buscamos apenas os agendamentos com status "Finalizado" ---
    const agendamentosFinalizados = await Agendamento.find({ status: "Finalizado" });
    
    // O restante dos agendamentos para o contador geral
    const todosAgendamentos = await Agendamento.find({});
    const itensEstoque = await Estoque.find({});
    
    // --- MUDANÇA AQUI: Usamos a nova variável para o cálculo ---
    const faturamentoTotal = agendamentosFinalizados.reduce((acc, agendamento) => {
      return acc + (Number(agendamento.preco) || 0);
    }, 0);

    const valorTotalEstoque = itensEstoque.reduce((acc, item) => {
      const preco = Number(item.newItemPrice) || 0;
      const quantidade = Number(item.newItemQuantity) || 0;
      return acc + (preco * quantidade);
    }, 0);
    
    const totalConsultas = todosAgendamentos.length; // Mantém a contagem de todas as consultas
    const totalItensEstoque = itensEstoque.reduce((acc, item) => acc + (Number(item.newItemQuantity) || 0), 0);

    res.render("financeiro", {
      faturamentoTotal: faturamentoTotal,
      valorTotalEstoque: valorTotalEstoque,
      totalConsultas: totalConsultas,
      totalItensEstoque: totalItensEstoque,
    });
  } catch (err) {
    console.error("Erro ao carregar o painel financeiro:", err);
    res.status(500).send("Erro ao carregar dados financeiros.");
  }
};
