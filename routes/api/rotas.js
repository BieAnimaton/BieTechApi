const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const UsuarioControlador = require("../../controladores/UsuariosControlador");

function verificarJWT(req, res, next) {
  const token = req.headers['x-access-token'];
  jwt.verify(token, require("../../config/keys").secretOrKey, (err, decoded) => {
    if (err) return res.status(401).end();

    req.usuarioNome = decoded.usuarioNome;
    next();
  })
}

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

router.get("/obterUsuario", (req, res, next) => {
  const token = req.headers['x-access-token'];

  try {
    const decoded = jwt.verify(token, require("../../config/keys").secretOrKey);
    req.usuarioInfo = decoded;
    next()
    res.json({"Token": "válido", "nome": decoded})
  } catch {
    res.json("Token inválido ou expirado");
  }
})

module.exports = router;
