const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Carregar as validações de Entrada
const validateRegisterInput = require("../validation/registrar");
const validateLoginInput = require("../validation/entrar");

// Carregando modelo
const UsuarioSchema = require("../models/Usuario");

// Conectando à tabela
const Usuario = mongoose.model("usuarios");

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

    // Rpta api/usuarios/registrar -- Registrar novo usuário -- Rota pública
    async create (req, res) {

        // Validação do Formulário
        const { errors, isValid } = validateRegisterInput(req.body);

        // Checar validação
        if (!isValid) {
            return res.status(400).json(errors);
        }

        Usuario.findOne({ email: req.body.email }).then(user => {
            if (user) {
                return res.status(400).json({ email: 'Email já existente' });
            } else {
                const newUser = new Usuario ({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                });

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

    async enter (req, res) {
      const email = req.body.email;
      const senha = req.body.senha;

      // Encontrando email no banco de dados
      Usuario.findOne({ email }).then(user => {
        // Conferindo se existe
        if (!user) {
          return res.status(404).json({ emailnotfound: "Email não encontrado" });
        }

        // Conferindo senha
        bcrypt.compare(senha, user.senha).then(isMatch => {
          if (isMatch) {
            } else {
              return res
                .status(400)
                .json({ passwordincorrect: 'Senha incorreta' });
            }

            // Criando payload
            const payload = {
              id: user.id,
              nome: user.nome
            }

            const token = jwt.sign((payload), require("../config/keys").secretOrKey, { expiresIn: 300 });
            return res.json({auth: true, "estado": "conectado com sucesso!", "token": token})
        });
      });
    },

    // Rpta api/usuarios/obterUsuario -- Obtém dados do usuário no token JWT -- Rota particular
    async obterDados (req, res, next) {
      const token = req.headers['x-access-token'];
    
      try {
        const decoded = jwt.verify(token, require("../../config/keys").secretOrKey);
        req.usuarioInfo = decoded;
        next()
        res.json({"Token": "válido", "dados": decoded})
      } catch {
        res.json("Token inválido ou expirado");
      }
    },

    // Rpta api/usuarios/alterar/:id -- Alterar usuário do sistema pelo ID -- Rota pública
    async update (req, res) {
        const usuarios = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true} );

        return res.json(usuarios);
    },

    // Rpta api/usuarios/delete/:id -- Deletar usuário do sistema pelo ID -- Rota pública
    async delete (req, res) {
      await Usuario.findByIdAndRemove( req.params.id );

      return res.status(200).json({"sucesso": "usuário deletado"});
  }
}