import { useEffect, useState } from "react";
import Navbar from "../componentes/Navbar";
import API from "../api";

export default function AdminDashboard() {
  const nombre = localStorage.getItem("nombre");
  const [turnos, setTurnos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [estadisticas, setEstadisticas] = useState({});
  const [mensaje, setMensaje] = useState("");

  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre: "",
    email: "",
    telefono: ""
  });

  const [asignacion, setAsignacion] = useState({
    turnoId: "",
    trabajadorId: ""
  });

  async function cargarTodosTurnos() {
    try {
      const res = await API.get("/turnos/todos");
      setTurnos(res.data);
    } catch {
      setTurnos([]);
    }
  }

  async function cargarUsuarios() {
    try {
      const res = await API.get("/usuarios");
      setUsuarios(res.data);
    } catch {
      setUsuarios([]);
    }
  }

  async function cargarEstadisticas() {
    try {
      const res = await API.get("/turnos/estadisticas");
      setEstadisticas(res.data);
    } catch {
      setEstadisticas({});
    }
  }

  async function reenviarRecordatorio() {
    try {
      await API.post("/turnos/reenviar");
      setMensaje("📧 Recordatorios reenviados correctamente");
      setTimeout(() => setMensaje(""), 3000);
    } catch {
      setMensaje("❌ Error al reenviar recordatorios");
    }
  }

  async function eliminarTurno(id) {
    try {
      await API.delete(`/turnos/${id}`);
      setMensaje("🗑️ Turno eliminado correctamente");
      cargarTodosTurnos();
      setTimeout(() => setMensaje(""), 3000);
    } catch {
      setMensaje("❌ Error al eliminar turno");
    }
  }

  async function eliminarUsuario(id) {
    try {
      await API.delete(`/usuarios/${id}`);
      setMensaje("🗑️ Usuario eliminado correctamente");
      cargarUsuarios();
      setTimeout(() => setMensaje(""), 3000);
    } catch {
      setMensaje("❌ Error al eliminar usuario");
    }
  }

  async function crearEmpleado(e) {
    e.preventDefault();
    try {
      const res = await API.post("/usuarios", {
        ...nuevoEmpleado,
        rol: "empleado",
        contrasena: nuevoEmpleado.telefono
      });
      setMensaje(`✅ Empleado creado: ${res.data.email}`);
      setNuevoEmpleado({ nombre: "", email: "", telefono: "" });
      setTimeout(() => setMensaje(""), 5000);
      cargarUsuarios();
    } catch {
      setMensaje("❌ Error al crear empleado");
    }
  }

  async function asignarTrabajador(e) {
    e.preventDefault();
    const turnoSeleccionado = turnos.find(t => t._id === asignacion.turnoId);
    if (!turnoSeleccionado) {
      setMensaje("❌ Turno no válido.");
      return;
    }
    const usuarioId = turnoSeleccionado.usuario?._id;
    if (!usuarioId) {
      setMensaje("❌ El turno no tiene un cliente registrado.");
      return;
    }

    try {
      await API.patch(`/turnos/asignar/${asignacion.turnoId}`, {
        trabajador: asignacion.trabajadorId,
        fecha: turnoSeleccionado.fecha,
        hora: turnoSeleccionado.hora,
        negocio: turnoSeleccionado.negocio,
        usuario: usuarioId
      });
      setMensaje("✅ Turno asignado correctamente");
      cargarTodosTurnos();
      setAsignacion({ turnoId: "", trabajadorId: "" });
      setTimeout(() => setMensaje(""), 3000);
    } catch {
      setMensaje("❌ Error al asignar turno");
    }
  }

  useEffect(() => {
    cargarTodosTurnos();
    cargarUsuarios();
    cargarEstadisticas();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar nombre={nombre} />
      <h2 className="p-4 text-xl font-semibold">Panel del Administrador</h2>

      {/* MÉTRICAS */}
      <section className="px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-green-100 border-l-4 border-green-600 p-4 rounded">
          <p className="text-sm text-gray-600">Total de turnos</p>
          <h3 className="text-xl font-bold text-green-700">{estadisticas.total || 0}</h3>
        </div>
        <div className="bg-yellow-100 border-l-4 border-yellow-600 p-4 rounded">
          <p className="text-sm text-gray-600">Pendientes</p>
          <h3 className="text-xl font-bold text-yellow-700">{estadisticas.pendientes || 0}</h3>
        </div>
        <div className="bg-blue-100 border-l-4 border-blue-600 p-4 rounded">
          <p className="text-sm text-gray-600">Confirmados</p>
          <h3 className="text-xl font-bold text-blue-700">{estadisticas.confirmados || 0}</h3>
        </div>
        <div className="bg-indigo-100 border-l-4 border-indigo-600 p-4 rounded">
          <p className="text-sm text-gray-600">Completados</p>
          <h3 className="text-xl font-bold text-indigo-700">{estadisticas.completados || 0}</h3>
        </div>
      </section>

      {/* ASIGNACIÓN MANUAL */}
      <section className="p-4 bg-white shadow mb-6 max-w-2xl mx-auto rounded">
        <h3 className="font-semibold mb-2">Asignar trabajador a un turno</h3>
        <form onSubmit={asignarTrabajador} className="grid md:grid-cols-3 gap-4">
          <select
            className="border p-2 rounded"
            value={asignacion.turnoId}
            onChange={(e) => setAsignacion({ ...asignacion, turnoId: e.target.value })}
            required
          >
            <option value="">Selecciona un turno</option>
            {turnos.map((t) => (
              <option key={t._id} value={t._id}>
                {t.fecha} {t.hora} - {t.usuario?.nombre || t.correoCliente}
              </option>
            ))}
          </select>

          <select
            className="border p-2 rounded"
            value={asignacion.trabajadorId}
            onChange={(e) => setAsignacion({ ...asignacion, trabajadorId: e.target.value })}
            required
          >
            <option value="">Selecciona un trabajador</option>
            {usuarios.filter((u) => u.rol === "empleado").map((u) => (
              <option key={u._id} value={u._id}>
                {u.nombre}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-indigo-600 text-white rounded px-4 py-2 hover:bg-indigo-700"
          >
            Asignar
          </button>
        </form>
      </section>

      {/* FORMULARIO CREAR EMPLEADO */}
      <section className="p-4 mb-6 bg-white rounded shadow max-w-xl mx-auto">
        <h3 className="text-lg font-semibold mb-2">Crear nuevo empleado</h3>
        <form onSubmit={crearEmpleado} className="grid gap-4">
          <input type="text" placeholder="Nombre completo" className="border p-2 rounded" value={nuevoEmpleado.nombre} onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, nombre: e.target.value })} required />
          <input type="email" placeholder="Correo electrónico" className="border p-2 rounded" value={nuevoEmpleado.email} onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, email: e.target.value })} required />
          <input type="text" placeholder="Teléfono (también será su contraseña)" className="border p-2 rounded" value={nuevoEmpleado.telefono} onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, telefono: e.target.value })} required />
          <button type="submit" className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">Crear empleado</button>
        </form>
      </section>

      {mensaje && <p className="text-center text-sm text-blue-600">{mensaje}</p>}

      {/* TABLAS */}
      <div className="overflow-x-auto p-4">
        <h3 className="font-semibold mb-2">Usuarios registrados</h3>
        <table className="min-w-full table-auto border border-gray-300 mb-8">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Nombre</th>
              <th className="border px-4 py-2">Correo</th>
              <th className="border px-4 py-2">Rol</th>
              <th className="border px-4 py-2">Acción</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{u.nombre}</td>
                <td className="border px-4 py-2">{u.email}</td>
                <td className="border px-4 py-2">{u.rol}</td>
                <td className="border px-4 py-2 text-center">
                  <button onClick={() => eliminarUsuario(u._id)} className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="font-semibold mb-2">Turnos registrados</h3>
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Cliente</th>
              <th className="border px-4 py-2">Servicio</th>
              <th className="border px-4 py-2">Fecha</th>
              <th className="border px-4 py-2">Hora</th>
              <th className="border px-4 py-2">Estado</th>
              <th className="border px-4 py-2">Acción</th>
            </tr>
          </thead>
          <tbody>
            {turnos.map((t) => (
              <tr key={t._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{t.usuario?.nombre || t.correoCliente || "Anónimo"}</td>
                <td className="border px-4 py-2">{t.servicio || "-"}</td>
                <td className="border px-4 py-2">{t.fecha}</td>
                <td className="border px-4 py-2">{t.hora}</td>
                <td className="border px-4 py-2">{t.estado}</td>
                <td className="border px-4 py-2 flex gap-2 justify-center">
                  <button onClick={reenviarRecordatorio} className="bg-indigo-600 text-white px-3 py-1 text-sm rounded hover:bg-indigo-700">Reenviar</button>
                  <button onClick={() => eliminarTurno(t._id)} className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}