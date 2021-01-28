const express = require("express");
const router = express.Router();
const passport = require("passport");

const UsuarioControlador = require("../../controladores/UsuariosControlador");

// ROTAS
// Rota api/usuarios/listar -- Listar usuários -- Acesso público
router.get("/listar", UsuarioControlador.index);

// Rota api/usuarios/listar/:id -- Listar usuário pelo ID -- Acesso público
router.get("/listar/:id", UsuarioControlador.index_by_id);

// Rota api/usuario/registrar -- Registrar novo usuário -- Rota pública
router.post("/registrar", UsuarioControlador.create);

// Rpta api/usuario/alterar/:id -- Alterar usuário do sistema pelo ID -- Rota pública
router.put("/alterar/:id", UsuarioControlador.update);

// Rota api/usuario/delete/:id -- Deletar usuário do sistema pelo ID -- Rota pública
router.delete("/deletar/:id", UsuarioControlador.delete);

// Rpta api/usuario/enter -- Entrar com email e senha do usuário -- Rota pública
router.post("/entrar", UsuarioControlador.enter);

module.exports = router;
