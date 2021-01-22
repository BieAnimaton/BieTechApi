module.exports = {
  mongoURI: process.env.MONGO_URL || "mongodb+srv://user:user@cluster0.uvjzi.mongodb.net/bie_tech?retryWrites=true&w=majority",
  secretOrKey: process.env.SECRET_KEY || "2021.bie"
};