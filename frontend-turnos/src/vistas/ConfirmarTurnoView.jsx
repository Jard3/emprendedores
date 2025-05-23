import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

export default function ConfirmarTurnoView() {
  const { id } = useParams();
  const [mensaje, setMensaje] = useState("Confirmando turno...");

  useEffect(() => {
    async function confirmarTurno() {
      try {
        await API.patch(`/turnos/confirmar/${id}`);
        setMensaje("✅ Tu turno ha sido confirmado correctamente.");
      } catch (error) {
        setMensaje("❌ No se pudo confirmar el turno. Tal vez ya fue confirmado o no existe.");
        console.error("Error al confirmar turno:", error);
      }
    }

    confirmarTurno();
  }, [id]);

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h2 className="text-xl font-bold text-center mb-4">Confirmación de Turno</h2>
      <p className="text-center text-gray-700">{mensaje}</p>
    </div>
  );
}