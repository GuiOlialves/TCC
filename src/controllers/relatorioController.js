const Agendamento = require("../models/agendamento");
const Pet = require("../models/listaPet");

exports.relatorio = async (req, res) => {
  try {
    // 1. Relatório de Tipos de Consulta Mais Comuns
    const relatorioTipoConsulta = await Agendamento.aggregate([
      {
        $group: {
          _id: "$tipoConsulta", // Agrupa pelo campo tipoConsulta
          count: { $sum: 1 },    // Conta quantos documentos tem em cada grupo
        },
      },
      {
        $sort: { count: -1 }, // Ordena do mais comum para o menos comum
      },
    ]);

    // 2. Relatório de Quantidade de Pets por Espécie
    const relatorioEspecies = await Pet.aggregate([
      {
        $group: {
          _id: "$especie",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    res.render("relatorios", {
      relatorioTipoConsulta: relatorioTipoConsulta,
      relatorioEspecies: relatorioEspecies,
    });
  } catch (err) {
    console.error("Erro ao gerar relatórios:", err);
    res.status(500).send("Erro ao gerar relatórios.");
  }
};