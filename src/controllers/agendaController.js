// controllers/agendaController.js
const Agendamento = require("../models/agendamento");
const Pet = require("../models/listaPet");

// Mapa centralizado de preços
const precosConsultas = {
    "Consulta de Rotina": 120.00,
    "Primeira Consulta": 150.00,
    "Consulta Especializada": 200.00,
    "Vacinação": 80.00,
    "Emergência": 350.00,
};

// Rota para a página de agenda (GET)
exports.agenda = async (req, res) => {
  try {
    const agendamentos = await Agendamento.find()
      .populate("pet")
      .sort({ dataConsulta: 1, horario: 1 });
    res.render("agenda", { agendamentos });
  } catch (err) {
    console.error("Erro ao buscar agendamentos:", err);
    res.status(500).send("Erro ao buscar agendamentos. Detalhes: " + err.message);
  }
};

// --- FUNÇÃO DE CRIAR ATUALIZADA ---
exports.criar = async (req, res) => {
  try {
    const {
      petNome, especie, petRaca, sexo, petAnoNascimento, petPeso, alergiasPet,
      petVacinas, tutorNome, cpf, telefone, endereco,
      tipoConsulta, dataConsulta, horario, doutor,
    } = req.body;

    if (!petNome || !especie || !tutorNome || !dataConsulta || !horario || !tipoConsulta) {
      return res.status(400).send("Campos obrigatórios não foram preenchidos.");
    }
    
    // --- CORREÇÃO: Usamos .trim() para remover espaços extras ---
    const tipoConsultaLimpo = tipoConsulta.trim();
    const precoDaConsulta = precosConsultas[tipoConsultaLimpo] || 0;
    
    // Log para depuração
    // console.log(`Tipo de Consulta Recebido: "${tipoConsulta}", Preço Definido: ${precoDaConsulta}`);

    // Lógica para encontrar ou criar o Pet
    let petExistente;
    if (cpf) {
      petExistente = await Pet.findOne({ nome: petNome, especie: especie, tutorCpf: cpf });
    } else {
      petExistente = await Pet.findOne({ nome: petNome, especie: especie, tutorNome: tutorNome });
    }

    let petId;
    if (!petExistente) {
      const novoPet = new Pet({
        nome: petNome, especie: especie, raca: petRaca, sexo: sexo, anoNascimento: petAnoNascimento,
        peso: petPeso, alergias: alergiasPet, statusVacinas: petVacinas, tutorNome: tutorNome,
        tutorCpf: cpf, tutorTelefone: telefone, tutorEndereco: endereco,
      });
      const petSalvo = await novoPet.save();
      petId = petSalvo._id;
    } else {
      petId = petExistente._id;
    }

    const novoAgendamento = new Agendamento({
      pet: petId, dataConsulta, horario, doutor,
      tipoConsulta: tipoConsultaLimpo, // Salva o tipo de consulta limpo
      preco: precoDaConsulta,
    });

    await novoAgendamento.save();
    res.redirect("/agenda");
  } catch (err) {
    console.error("Erro ao salvar agendamento:", err);
    res.status(500).send("Erro ao salvar agendamento: " + err.message);
  }
};

// --- FUNÇÃO DE EDITAR ATUALIZADA ---
exports.editarAgendamento = async (req, res) => {
  const agendamentoId = req.params.id;
  const { dataConsulta, horario, tipoConsulta, doutor } = req.body;

  if (!dataConsulta || !horario || !tipoConsulta || !doutor) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios para edição." });
  }

  // --- CORREÇÃO: Usamos .trim() para remover espaços extras ---
  const tipoConsultaLimpo = tipoConsulta.trim();
  const precoDaConsulta = precosConsultas[tipoConsultaLimpo] || 0;

  try {
    const agendamentoAtualizado = await Agendamento.findByIdAndUpdate(
      agendamentoId,
      {
        dataConsulta, horario, doutor,
        tipoConsulta: tipoConsultaLimpo, // Salva o tipo de consulta limpo
        preco: precoDaConsulta,
      },
      { new: true, runValidators: true }
    );

    if (!agendamentoAtualizado) {
      return res.status(404).json({ message: "Agendamento não encontrado." });
    }
    res.status(200).json({ message: "Agendamento atualizado com sucesso!", agendamento: agendamentoAtualizado });

  } catch (err) {
    console.error("Erro ao atualizar agendamento:", err);
    res.status(500).json({ message: "Erro interno ao atualizar agendamento." });
  }
};

// Rota para DELETAR um agendamento (sem alterações)
exports.deletarAgendamento = async (req, res) => {
  try {
    const agendamentoId = req.params.id;
    const agendamentoDeletado = await Agendamento.findByIdAndDelete(agendamentoId);

    if (!agendamentoDeletado) {
      return res.status(404).send("Agendamento não encontrado para exclusão.");
    }
    res.redirect("/agenda");
  } catch (err) {
    console.error("Erro ao deletar agendamento:", err);
    res.status(500).send("Erro ao deletar agendamento. Detalhes: " + err.message);
  }
};
exports.finalizarAgendamento = async (req, res) => {
  try {
    const agendamentoId = req.params.id;
    const agendamentoAtualizado = await Agendamento.findByIdAndUpdate(
      agendamentoId,
      { status: "Finalizado" }, // A única coisa que fazemos é mudar o status
      { new: true }
    );

    if (!agendamentoAtualizado) {
      return res.status(404).send("Agendamento não encontrado para finalizar.");
    }
    
    // Responde com sucesso. O frontend irá recarregar a página.
    res.status(200).json({ message: "Agendamento finalizado com sucesso!" });

  } catch (err) {
    console.error("Erro ao finalizar agendamento:", err);
    res.status(500).send("Erro ao finalizar agendamento.");
  }
};