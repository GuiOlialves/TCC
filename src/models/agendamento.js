// Em models/agendamento.js (modificar o existente)
const mongoose = require("mongoose");

const AgendamentoSchema = new mongoose.Schema({
  pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true }, // Referência ao Pet
  dataConsulta: { type: Date, required: true },
  horario: { type: String, required: true },
  tipoConsulta: String,
  doutor: String, // Nome do doutor ou referência a um schema de Doutor
  status: { type: String, default: "Confirmado" }, // Confirmado, Cancelado, Realizado
  sala: { type: String, default: "Consultório 2" }, // Ou qualquer outra lógica de sala
  observacoes: String, // Campo opcional para anotações do agendamento
  // createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Agendamento", AgendamentoSchema);
