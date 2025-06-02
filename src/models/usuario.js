const mongoose = require("mongoose")
const userModel = mongoose.Schema({
    user:String,
    password:String,
})
module.exports = mongoose.model("usuario", userModel);