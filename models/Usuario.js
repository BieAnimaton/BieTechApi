const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UsuarioSchema = new Schema({
  nome: {
    type: String,
    required: true
  },
  sobrenome: {
    type: String,
  },
  email: {
    type: String,
    required: true
  },
  senha: {
    type: String,
    required: true
  },
  sexo: {
    type: String,
  },
  dataNascimento: {
    type: Date,
  },
  paisAtual: {
    type: String,
  },
  mensagensUsuario: {
    type: Schema.Types.ObjectId,
    ref: "menssagens"
  },
  amigosUsuario: {
    type: Schema.Types.ObjectId,
    ref: "amigos"
  },
  fotoPerfil: {
    type: Buffer
  },
  dataCriacao: {
    type: Date,
    default: Date.now
  }
});

module.exports = Usuario = mongoose.model("usuarios", UsuarioSchema);