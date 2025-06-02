// Em models/Pet.js (novo arquivo)
const mongoose = require("mongoose");

const PetSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  especie: { type: String, required: true }, // Ex: "Cachorro", "Gato"
  raca: String,
  sexo: String,
  anoNascimento: Number, // Ou data de nascimento completa
  peso: String, // Ou Number
  alergias: String,
  statusVacinas: String,
  tutorNome: { type: String, required: true },
  tutorCpf: { type: String, unique: true }, // Pode ser útil para identificar/evitar duplicidade de tutores
  tutorTelefone: String,
  tutorEndereco: String,
  // Adicione um campo para o ID do usuário/veterinário que cadastrou, se aplicável
  // createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

// Para evitar duplicidade de pets (mesmo nome, mesma espécie, mesmo tutor)
// PetSchema.index({ nome: 1, especie: 1, tutorCpf: 1 }, { unique: true }); // Adapte conforme necessidade

module.exports = mongoose.model("Pet", PetSchema);
