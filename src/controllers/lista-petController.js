// src/controllers/lista-petController.js
const Pet = require("../models/listaPet"); // Ou Pet = require("../models/Pet") se você renomeou

exports.index = async (req, res) => {
  try {
    let query = {};
    if (req.query.search) {
      query = {
        $or: [
          { nome: { $regex: req.query.search, $options: "i" } },
          { tutorNome: { $regex: req.query.search, $options: "i" } },
          { raca: { $regex: req.query.search, $options: "i" } },
          { especie: { $regex: req.query.search, $options: "i" } },
        ],
      };
    }

    const pets = await Pet.find(query).sort({ nome: 1 });
    
    const highlightPetId = req.query.highlightPetId || null; // Pega o ID da URL
    console.log("lista-petController: highlightPetId recebido:", highlightPetId);

    res.render("lista-pets", {
      pets: pets,
      searchQuery: req.query.search || "",
      highlightPetId: highlightPetId // Passa para o template EJS
    });
  } catch (err) {
    console.error("Erro ao buscar pets:", err);
    res.status(500).send("Erro ao buscar pets. Detalhes: " + err.message);
  }
};
