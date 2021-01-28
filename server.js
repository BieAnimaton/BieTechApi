const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
//const morgan = require('morgan');

// Rotas
const rotas = require("./routes/api/rotas");

const app = express();

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
app.use(cors());
//morgan('dev');

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true,
      useUnifiedTopology: true }
  )
  .then(() => console.log("Conectado ao banco MongoDB"))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Routes
app.use("/api/usuarios", rotas);
app.get("/", (req, res) => {
  res.json({ "mensagem": "parece que o servidor está funcionando!" });
});
app.use("*", (req, res) => {
  res.json({ "mensagem":"rota não encontrado" });
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Servidor rodando na porta ${port} !`));
