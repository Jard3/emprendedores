const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  email: { 
    type: String,
    required: true,
    unique: true
  },
  telefono: {
    type: String,
    required: true
  },
  contrasena: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    required: true,
    enum: ["admin", "empleado", "cliente"]
  }
});

module.exports = mongoose.model("Usuario", usuarioSchema);