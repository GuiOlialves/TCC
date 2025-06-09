// src/controllers/petController.js

const Usuario = require("../models/usuario");
const bcrypt = require("bcryptjs"); // Importa a biblioteca de criptografia

// Função para renderizar a página de login
exports.renderLogin = (req, res) => {
  // Passamos uma variável de erro nula para a primeira vez que a página é carregada
  res.render("index", { error: null }); 
};

// Função para renderizar a página de cadastro
exports.renderCadastro = (req, res) => {
  res.render("cadastro", { error: null });
};

// --- NOVA FUNÇÃO DE CADASTRO ---
exports.registerUser = async (req, res) => {
  const { user, password, passwordConfirm } = req.body;

  // Validação básica
  if (!user || !password || !passwordConfirm) {
    return res.render("cadastro", { error: "Todos os campos são obrigatórios." });
  }
  if (password !== passwordConfirm) {
    return res.render("cadastro", { error: "As senhas não coincidem." });
  }

  try {
    // Verifica se o usuário já existe
    const existingUser = await Usuario.findOne({ user: user });
    if (existingUser) {
      return res.render("cadastro", { error: "Este nome de usuário já está em uso." });
    }

    // Criptografa a senha antes de salvar
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Cria e salva o novo usuário no banco de dados
    const novoUsuario = new Usuario({
      user: user,
      password: hashedPassword, // Salva a senha criptografada
    });
    await novoUsuario.save();

    // Redireciona para a página de login após o sucesso
    res.redirect("/");

  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    res.render("cadastro", { error: "Ocorreu um erro inesperado. Tente novamente." });
  }
};


// --- FUNÇÃO DE LOGIN ATUALIZADA E SEGURA ---
exports.loginUser = async (req, res) => {
  const { user, password } = req.body;

  try {
    // 1. Encontra o usuário no banco de dados
    const foundUser = await Usuario.findOne({ user: user });
    if (!foundUser) {
      // Se o usuário não existe, renderiza a página de login com uma mensagem de erro
      return res.render("index", { error: "Usuário ou senha inválidos." });
    }

    // 2. Compara a senha enviada com a senha criptografada no banco
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      // Se a senha não bate, renderiza a página de login com uma mensagem de erro
      return res.render("index", { error: "Usuário ou senha inválidos." });
    }

    // 3. Se tudo estiver correto, redireciona para a agenda
    // (Em um sistema real, aqui você criaria uma sessão de usuário)
    res.redirect("/agenda");

  } catch (error) {
    console.error("Erro no login:", error);
    res.render("index", { error: "Ocorreu um erro inesperado." });
  }
};
