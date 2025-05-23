import API from "../api";

export default function CardTurno({
  cliente,
  hora,
  servicio,
  estado,
  id,
  esEmpleado,
  onCambio,
}) {
  async function marcarComoAtendido() {
    try {
      await API.patch(`/turnos/atendido/${id}`);
      if (onCambio) onCambio(); 
    } catch (error) {
      alert("❌ No se pudo marcar como atendido. Intenta de nuevo.");
      console.error("Error al marcar como atendido:", error);
    }
  }

  return (
    <div className="border rounded-lg shadow p-4 bg-white hover:shadow-lg transition-all space-y-2">
      <h3 className="text-lg font-semibold">👤 {cliente}</h3>
      <p className="text-sm text-gray-600">⏰ {hora}</p>
      <p className="text-sm text-gray-600">🛠️ {servicio}</p>

      <div className="flex items-center justify-between mt-2">
        <span
          className={
            estado === "completado"
              ? "text-green-600 font-medium"
              : "text-yellow-600 font-medium"
          }
        >
          {estado === "completado" ? "✅ Atendido" : "⏳ Pendiente"}
        </span>
      </div>

      {esEmpleado && estado !== "completado" && (
        <button
          onClick={marcarComoAtendido}
          className="bg-green-600 text-white text-sm px-3 py-1 rounded hover:bg-green-700"
        >
          Marcar como atendido
        </button>
      )}
    </div>
  );
}