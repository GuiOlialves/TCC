const usuario = require("../models/usuario")
exports.index = async (req, res) => {
  try {
    const usuarios = await usuario.find()//procura usuarios no banco de dados
    res.render("index", { usuarios }); //renderiza os dados do banco de dados na pagina

  } catch (error) {
    res.status(500).send("erro ao buscar login");
  }
 
};
exports.entrar = async (req,res) =>{
try {
  const novoUsuario = new usuario({
    user: req.body.user,
    password: req.body.password,
  })
 
  if(novoUsuario.user === "etecia" && novoUsuario.password === "etecia"){
    return res.redirect("/agenda")
  }
} catch (error) {
  
}
}
// exports.agenda = (req, res) => {
//   res.render("agenda", { pets });
// };

// exports.addPet = (req, res) => {
//   // Recebe os dados do formulário
//   const pet = req.body;

//   // Adiciona o pet à fonte de dados (array)
//   pets.push(pet);

//   // Redireciona para a rota principal que renderiza a view atualizada
//   res.redirect("/");
// };
