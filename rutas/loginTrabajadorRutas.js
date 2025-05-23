const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Usuario = require("../modelos/Usuario");

router.post("/", async (req, res) => {
  const { email, contrasena } = req.body; // CAMBIO: usamos 'email' igual que en frontend

  try {
    const usuario = await Usuario.findOne({ email, rol: "empleado" });

    if (!usuario || usuario.contrasena.trim() !== contrasena.trim()) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
      process.env.JWT_SECRETO,
      { expiresIn: "3h" }
    );

    res.json({
      mensaje: "Empleado autenticado",
      token,
      rol: usuario.rol,
      nombre: usuario.nombre,
    });
  } catch (error) {
    console.error("❌ Error en login trabajador:", error);
    res.status(500).json({ mensaje: "Error en login trabajador", error });
  }
});

module.exports = router;