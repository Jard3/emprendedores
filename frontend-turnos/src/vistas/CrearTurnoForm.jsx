import { useState } from "react";
import API from "../api";
import { QRCodeCanvas } from "qrcode.react";

export default function CrearTurnoForm({ onNuevoTurno }) {
  const [form, setForm] = useState({
    correoCliente: "",
    telefono: "",
    servicio: "",
    fecha: "",
    hora: "",
    negocio: ""
  });

  const [mensaje, setMensaje] = useState("");
  const [idTurno, setIdTurno] = useState(null);

  function manejarCambio(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function manejarSubmit(e) {
    e.preventDefault();

    const campos = ["correoCliente", "telefono", "servicio", "fecha", "hora", "negocio"];
    const camposVacios = campos.filter(campo => !form[campo]?.trim());

    if (camposVacios.length > 0) {
      setMensaje("❌ Todos los campos son obligatorios.");
      return;
    }

    try {
      const res = await API.post("/turnos", form);
      setMensaje("✅ Turno agendado correctamente");
      setForm({
        correoCliente: "",
        telefono: "",
        servicio: "",
        fecha: "",
        hora: "",
        negocio: ""
      });
      setIdTurno(res.data._id || res.data.turno?._id);
      if (onNuevoTurno) onNuevoTurno();
      setTimeout(() => setMensaje(""), 4000);
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al agendar el turno.");
    }
  }

  return (
    <form onSubmit={manejarSubmit} className="bg-white p-6 rounded shadow space-y-4 max-w-md mx-auto mt-4">
      <h2 className="text-xl font-semibold text-center">Asignar turno manualmente</h2>

      <input type="email" name="correoCliente" placeholder="Correo del cliente" required value={form.correoCliente} onChange={manejarCambio} className="w-full border p-2 rounded" />
      <input type="text" name="telefono" placeholder="Teléfono del cliente" required value={form.telefono} onChange={manejarCambio} className="w-full border p-2 rounded" />
      <input type="text" name="servicio" placeholder="Servicio" required value={form.servicio} onChange={manejarCambio} className="w-full border p-2 rounded" />
      <input type="date" name="fecha" required value={form.fecha} onChange={manejarCambio} className="w-full border p-2 rounded" />
      <input type="time" name="hora" required value={form.hora} onChange={manejarCambio} className="w-full border p-2 rounded" />
      <input type="text" name="negocio" placeholder="Negocio" required value={form.negocio} onChange={manejarCambio} className="w-full border p-2 rounded" />

      <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">
        Crear Turno Manual
      </button>

      {mensaje && <p className="text-center text-sm mt-2">{mensaje}</p>}

      {idTurno && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">Escanea este código para confirmar tu llegada:</p>
          <div className="flex justify-center mt-2 bg-white p-2 rounded shadow inline-block">
            <QRCodeCanvas value={`http://localhost:5173/confirmar-turno/${idTurno}`} size={160} />
          </div>
        </div>
      )}
    </form>
  );
}