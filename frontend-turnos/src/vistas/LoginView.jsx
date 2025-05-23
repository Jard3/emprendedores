import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function LoginView() {
  const [form, setForm] = useState({ email: "", contrasena: "" }); // CAMBIO: usamos 'email'
  const [error, setError] = useState("");
  const [rolSeleccionado, setRolSeleccionado] = useState("admin");
  const navigate = useNavigate();

  function manejarCambio(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function manejarRol(e) {
    setRolSeleccionado(e.target.value);
  }

  async function manejarSubmit(e) {
    e.preventDefault();
    try {
      const ruta = rolSeleccionado === "admin" ? "/login/admin" : "/login/trabajador";

      const res = await API.post(ruta, form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("rol", res.data.rol);
      localStorage.setItem("nombre", res.data.nombre);

      navigate(`/${res.data.rol}`);
    } catch (error) {
      if (error.response?.status === 401) {
        setError("❌ Credenciales inválidas");
      } else {
        setError("❌ Error inesperado al iniciar sesión");
      }
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={manejarSubmit} className="flex flex-col gap-4 w-80 bg-white shadow p-6 rounded">
        <h2 className="text-2xl font-bold text-center">Iniciar sesión</h2>

        <select value={rolSeleccionado} onChange={manejarRol} className="border p-2 rounded">
          <option value="admin">Administrador</option>
          <option value="empleado">Empleado</option>
        </select>

        <input
          type="email"
          name="email" // CAMBIO: debe coincidir con el backend
          placeholder="Correo"
          value={form.email}
          onChange={manejarCambio}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          name="contrasena"
          placeholder="Contraseña"
          value={form.contrasena}
          onChange={manejarCambio}
          className="border p-2 rounded"
          required
        />

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Ingresar
        </button>
      </form>
    </div>
  );
}