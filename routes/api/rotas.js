const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

const UsuarioControlador = require("../../controladores/UsuariosControlador");

// Load input validation
const validateLoginInput = require("../../validation/entrar");



// ROTAS
// Rota api/usuarios/listar -- Listar usuários -- Acesso público
router.get("/listar", UsuarioControlador.index);

// Rota api/usuarios/listar/:id -- Listar usuário pelo ID -- Acesso público
router.get("/listar/:id", UsuarioControlador.index_by_id);

// Rpta api/usuario/registrar -- Registrar novo usuário -- Rota pública
router.post("/registrar", UsuarioControlador.create);

// Rpta api/usuario/alterar/:id -- Alterar usuário do sistema pelo ID -- Rota pública
router.put("/alterar/:id", UsuarioControlador.update);

// Rpta api/usuario/delete/:id -- Deletar usuário do sistema pelo ID -- Rota pública
router.delete("/deletar/:id", UsuarioControlador.delete);




// @route POST api/usuarios/entrar
// @desc Login user and return JWT token
// @access Public
router.post("/entrar", (req, res) => {
  // Form validation

  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const senha = req.body.senha;

  // Find user by email
  Usuario.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }

    // Check password
    bcrypt.compare(password, user.senha).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.nome
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

module.exports = router;
