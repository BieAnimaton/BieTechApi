const mongoose = require("mongoose");

// Carregando modelo
const UsuarioSchema = require("../models/Usuario");

// Conectando à tabela
const Usuario = mongoose.model("usuarios");

const bcrypt = require("bcryptjs");

// Load input validation
const validateRegisterInput = require("../validation/registrar");

module.exports = {

    // Rota api/usuarios/listar -- Listar usuários -- Acesso público
    async index (req, res) {
        const usuarios = await Usuario.find({});

        return res.json(usuarios);
    },

    // Rota api/usuarios/listar/:id -- Listar usuário pelo ID -- Acesso público
    async index_by_id (req, res) {
        const usuarios = await Usuario.findById( req.params.id );

        return res.json(usuarios);
    },

    // Rpta api/usuario/registrar -- Registrar novo usuário -- Rota pública
    async create (req, res) {
        // Form validation
      
        const { errors, isValid } = validateRegisterInput(req.body);
      
        // Check validation
        if (!isValid) {
          return res.status(400).json(errors);
        }
      
        await Usuario.findOne({ email: req.body.email }).then(user => {
          if (user) {
            return res.status(400).json({ email: "Email already exists" });
          } else {
            const newUser = new Usuario({
              nome: req.body.nome,
              email: req.body.email,
              senha: req.body.senha
            });
      
            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.senha, salt, (err, hash) => {
                if (err) throw err;
                newUser.senha = hash;
                newUser
                  .save()
                  .then(user => res.json(user))
                  .catch(err => console.log(err));
              });
            });
          }
        });
    },

    // Rpta api/usuario/alterar/:id -- Alterar usuário do sistema pelo ID -- Rota pública
    async update (req, res) {
        const usuarios = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true} );

        return res.json(usuarios);
    },

    // Rpta api/usuario/delete/:id -- Deletar usuário do sistema pelo ID -- Rota pública
    async delete (req, res) {
      await Usuario.findByIdAndRemove( req.params.id );

      return res.json({"sucesso": "usuário deletado"});
  }
}