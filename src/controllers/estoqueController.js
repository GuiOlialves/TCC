const EstoqueModel = require("../models/estoque");

exports.index = async (req, res) => {
  try {
    const estoque = await EstoqueModel.find(); // Busca agendamentos no banco de dados
    res.render("estoque", { estoque }); // Passa os agendamentos para o EJS
  } catch (err) {
    res.status(500).send("Erro ao buscar itens do estoque");
  }
};
exports.adicionar = async (req, res) => {
  try {
    const novoItem = new EstoqueModel({
      newItemCategory: req.body.newItemCategory,
      newItemName: req.body.newItemName,
      newItemPrice: req.body.newItemPrice,
      newItemQuantity: req.body.newItemQuantity,
    });
    await novoItem.save();
    res.redirect("/estoque");
  } catch (err) {
    res.status(500).send("erro ao adicionar");
  }
};
exports.editar = async (req, res) => {
  const id = req.params.id;
  const { name, category, price, quantity } = req.body;
  try {
    await EstoqueModel.findByIdAndUpdate(id, {
      newItemName: name,
      newItemCategory: category,
      newItemPrice: price,
      newItemQuantity: quantity,
    });
    res.status(200).json({ message: "Item editado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao editar item" });
  }
};
