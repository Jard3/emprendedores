import { useState } from "react";
import API from "../api";
import Navbar from "../componentes/Navbar";

export default function CrearEmpleado() {
  const nombre = localStorage.getItem("nombre");
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
  });

  const [credenciales, setCredenciales] = useState(null);
  const [mensaje, setMensaje] = useState("");

  function manejarCambio(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function manejarSubmit(e) {
    e.preventDefault();
    setMensaje("");
    setCredenciales(null);

    if (!form.nombre || !form.email || !form.telefono) {
      setMensaje("❌ Todos los campos son obligatorios.");
      return;
    }

    try {
      const res = await API.post("/usuarios", {
        ...form,
        rol: "empleado", // Forzamos que sea rol empleado
      });

      setMensaje("✅ Empleado creado correctamente.");
      setCredenciales({
        email: res.data.email,
        contrasena: res.data.contrasena,
      });
      setForm({ nombre: "", email: "", telefono: "" });

    } catch (error) {
      setMensaje("❌ Error al crear el empleado.", error);
    }
  }

  return (
    <div>
      <Navbar nombre={nombre} />
      <h2 className="text-xl font-semibold text-center my-4">Crear nuevo empleado</h2>

      <form
        onSubmit={manejarSubmit}
        className="max-w-md mx-auto bg-white p-6 rounded shadow space-y-4"
      >
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del empleado"
          value={form.nombre}
          onChange={manejarCambio}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={manejarCambio}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="tel"
          name="telefono"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={manejarCambio}
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Crear Empleado
        </button>

        {mensaje && (
          <p className="text-center text-sm mt-2 text-gray-700">{mensaje}</p>
        )}

        {credenciales && (
          <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded text-sm">
            <p><strong>Usuario:</strong> {credenciales.email}</p>
            <p><strong>Contraseña:</strong> {credenciales.contrasena}</p>
          </div>
        )}
      </form>
    </div>
  );
}