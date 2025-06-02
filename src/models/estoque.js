const mongoose = require("mongoose");

const EstoqueSchema = new mongoose.Schema({
  newItemCategory: String,
  newItemName: String,
  newItemPrice: Number,
  newItemQuantity: Number,
});

module.exports = mongoose.model("Estoque", EstoqueSchema);
