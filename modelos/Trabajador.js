const mongoose = require("mongoose");

const horarioSchema = new mongoose.Schema({
  dia:     { type: String, required: true },
  entrada: { type: String, required: true },
  salida:  { type: String, required: true }
}, { _id: false });

const trabajadorSchema = new mongoose.Schema({
  nombre:   { type: String, required: true },
  puesto:   { type: String, required: true },
  email:    { type: String, required: true },  
  horarios: [horarioSchema]
});

module.exports = mongoose.model("Trabajador", trabajadorSchema);