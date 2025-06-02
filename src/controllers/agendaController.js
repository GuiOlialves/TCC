// controllers/agendaController.js
const Agendamento = require("../models/agendamento");
const Pet = require("../models/listaPet"); // Importar o novo modelo Pet

// Rota para a página de agenda (GET)
exports.agenda = async (req, res) => {
  try {
    const agendamentos = await Agendamento.find()
      .populate("pet") // <--- AQUI! Popula os dados do pet referenciado
      .sort({ dataConsulta: 1, horario: 1 });
    res.render("agenda", { agendamentos }); // Em agenda.ejs, acesse via appointment.pet.nome, etc.
  } catch (err) {
    console.error("Erro ao buscar agendamentos:", err);
    res
      .status(500)
      .send("Erro ao buscar agendamentos. Detalhes: " + err.message);
  }
};

exports.criar = async (req, res) => {
  try {
    const {
      // Dados do Pet e Tutor (vindos do formulário)
      petNome, // Nome do pet
      especie, // Espécie selecionada (ex: "Cachorro", "Gato")
      petRaca, // Raça do pet
      sexo, // Sexo do pet
      petAnoNascimento, // Idade ou ano
      petPeso,
      alergiasPet,
      petVacinas,
      tutorNome,
      cpf, // CPF do tutor
      telefone,
      endereco,

      // Dados do Agendamento
      tipoConsulta,
      dataConsulta,
      horario,
      doutor,
      // sala, status (se vierem do form, senão usar defaults do schema)
    } = req.body;

    // Validação básica (adicione mais conforme necessário)
    if (!petNome || !especie || !tutorNome || !dataConsulta || !horario) {
      return res
        .status(400)
        .send(
          "Campos obrigatórios para pet, tutor e agendamento não foram preenchidos."
        );
    }

    // 1. Encontrar ou Criar o Pet
    // Tentaremos encontrar um pet pelo nome E CPF do tutor para evitar duplicatas simples.
    // Ajuste esta lógica se necessário (ex: um tutor pode ter dois pets com mesmo nome).
    let petExistente;
    if (cpf) {
      // Se o CPF foi fornecido, use-o na busca
      petExistente = await Pet.findOne({
        nome: petNome,
        especie: especie,
        tutorCpf: cpf,
      });
    } else {
      // Se não há CPF, busque apenas por nome e tutorNome (menos preciso para evitar duplicatas)
      petExistente = await Pet.findOne({
        nome: petNome,
        especie: especie,
        tutorNome: tutorNome,
      });
    }

    let petId;

    if (!petExistente) {
      const novoPet = new Pet({
        nome: petNome,
        especie: especie,
        raca: petRaca,
        sexo: sexo,
        anoNascimento: petAnoNascimento,
        peso: petPeso,
        alergias: alergiasPet,
        statusVacinas: petVacinas,
        tutorNome: tutorNome,
        tutorCpf: cpf,
        tutorTelefone: telefone,
        tutorEndereco: endereco,
      });
      const petSalvo = await novoPet.save();
      petId = petSalvo._id;
    } else {
      // Opcional: Atualizar dados do pet se ele já existe e algo mudou.
      // Ex: petExistente.peso = petPeso; await petExistente.save();
      petId = petExistente._id;
    }

    // 2. Criar o Agendamento com a referência ao Pet
    const novoAgendamento = new Agendamento({
      pet: petId, // Associar o ID do pet
      dataConsulta: dataConsulta,
      horario: horario,
      tipoConsulta: tipoConsulta,
      doutor: doutor,
      // sala: req.body.sala || "Consultório Padrão", (se vier do form)
      // status: req.body.status || "Confirmado", (se vier do form)
    });

    await novoAgendamento.save();
    res.redirect("/agenda"); // Redireciona para a agenda após salvar
  } catch (err) {
    console.error("Erro ao salvar agendamento:", err);
    // Envie uma mensagem de erro mais detalhada se possível
    let mensagemErro = "Erro ao salvar agendamento.";
    if (err.name === "ValidationError") {
      mensagemErro =
        "Erro de validação: " +
        Object.values(err.errors)
          .map((e) => e.message)
          .join(", ");
    } else {
      mensagemErro = err.message;
    }
    res.status(500).send(mensagemErro);
  }
};
exports.editarAgendamento = async (req, res) => {
  const agendamentoId = req.params.id;
  const { dataConsulta, horario, tipoConsulta, doutor } = req.body;

  // Validação básica dos dados recebidos (opcional, mas recomendado)
  if (!dataConsulta || !horario || !tipoConsulta || !doutor) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios para edição." });
  }

  try {
    const agendamentoAtualizado = await Agendamento.findByIdAndUpdate(
      agendamentoId,
      {
        dataConsulta: dataConsulta,
        horario: horario,
        tipoConsulta: tipoConsulta,
        doutor: doutor,
        // Adicione aqui outros campos do agendamento que podem ser editados, se houver
        // Por exemplo: status: req.body.status, sala: req.body.sala
      },
      { new: true, runValidators: true } // new: true retorna o documento atualizado, runValidators: true garante que as validações do schema sejam aplicadas
    );

    if (!agendamentoAtualizado) {
      return res.status(404).json({ message: "Agendamento não encontrado para atualização." });
    }

    // Se chegou aqui, foi atualizado com sucesso
    // Você pode redirecionar ou enviar uma resposta JSON.
    // Para uma SPA-like behavior com fetch, JSON é melhor.
    res.status(200).json({ message: "Agendamento atualizado com sucesso!", agendamento: agendamentoAtualizado });

    // Se preferir redirecionar (menos comum com fetch, mas funciona se o JS tratar o redirect):
    // res.redirect("/agenda");

  } catch (err) {
    console.error("Erro ao atualizar agendamento:", err);
    let mensagemErro = "Erro ao atualizar agendamento.";
    if (err.name === 'ValidationError') {
        mensagemErro = "Erro de validação: " + Object.values(err.errors).map(e => e.message).join(', ');
    } else if (err.name === 'CastError') {
        mensagemErro = "ID do agendamento inválido ou formato de dado incorreto.";
    }
    res.status(500).json({ message: mensagemErro, error: err.message });
  }
};
// Rota para DELETAR um agendamento
exports.deletarAgendamento = async (req, res) => {
  try {
    const agendamentoId = req.params.id;
    const agendamentoDeletado = await Agendamento.findByIdAndDelete(
      agendamentoId
    );

    if (!agendamentoDeletado) {
      return res.status(404).send("Agendamento não encontrado para exclusão.");
    }

    // req.flash('success_msg', 'Agendamento excluído com sucesso!'); // Se usar connect-flash para mensagens
    res.redirect("/agenda");
  } catch (err) {
    console.error("Erro ao deletar agendamento:", err);
    // req.flash('error_msg', 'Erro ao excluir agendamento.'); // Se usar connect-flash
    res
      .status(500)
      .send("Erro ao deletar agendamento. Detalhes: " + err.message);
  }
};
