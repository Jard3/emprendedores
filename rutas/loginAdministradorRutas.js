const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Usuario = require("../modelos/Usuario");

router.post("/", async (req, res) => {
  const { email, contrasena } = req.body;

  try {
    // Buscar por correo electrónico
    const usuario = await Usuario.findOne({ email });

    // Validar existencia, rol y contraseña
    if (!usuario || usuario.rol !== "admin" || usuario.contrasena !== contrasena) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    // Crear el token JWT
    const token = jwt.sign(
      {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      },
      process.env.JWT_SECRETO,
      { expiresIn: "3h" }
    );

    // Responder con el token
    res.json({
      mensaje: "Administrador autenticado",
      token,
      rol: usuario.rol,
      nombre: usuario.nombre
    });
  } catch (error) {
    console.error("❌ Error en login admin:", error);
    res.status(500).json({ mensaje: "Error en login admin", error });
  }
});

module.exports = router;