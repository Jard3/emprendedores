const mongoose = require("mongoose");

const turnoSchema = new mongoose.Schema({
  // Solo obligatorio si se genera desde una cuenta
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: false
  },

  // Requerido para turnos públicos (sin login)
  correoCliente: {
    type: String,
    required: function () {
      return !this.usuario;
    }
  },

  telefono: {
    type: String,
    required: function () {
      return !this.usuario;
    }
  },

  negocio: {
    type: String,
    required: true
  },

  fecha: {
    type: String,
    required: true
  },

  hora: {
    type: String,
    required: true
  },

  trabajador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trabajador",
    required: true
  },

  estado: {
    type: String,
    enum: ["pendiente", "confirmado", "cancelado"],
    default: "pendiente"
  },

  llegada: {
    type: Date
  },

  nota: {
    type: String
  }
});

module.exports = mongoose.model("Turno", turnoSchema);