import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import API from "../api";

export default function EscanearQR() {
  const [mensaje, setMensaje] = useState("");
  const [confirmado, setConfirmado] = useState(false);
  const navigate = useNavigate();

  // Confirmar llegada con el ID leído del QR
  async function confirmarLlegada(turnoId) {
    try {
      await API.patch(`/turnos/seguimiento/${turnoId}`, {
        atendidoHora: new Date().toISOString(),
        nota: "Confirmado por QR"
      });
      setMensaje("✅ Turno confirmado correctamente");
      setConfirmado(true);
      setTimeout(() => navigate("/"), 3000);
    } catch (error) {
      console.error("Error al confirmar:", error);
      setMensaje("❌ Error al confirmar el turno");
      setConfirmado(false);
    }
  }

  // Inicializar escaneo al cargar
  useEffect(() => {
    const scanner = new Html5Qrcode("qr-box");

    scanner
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (text) => {
          const turnoId = text.trim();
          scanner.stop().then(() => {
            confirmarLlegada(turnoId);
          });
        },
        (error) => {
          console.warn("Error escaneando:", error);
        }
      )
      .catch((err) => {
        console.error("No se pudo iniciar la cámara:", err);
        setMensaje("❌ No se pudo acceder a la cámara");
      });

    return () => {
      scanner.stop().catch(() => {});
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-4">Escanea tu código QR</h1>

      <div
        id="qr-box"
        className="w-full max-w-xs bg-white shadow-md rounded overflow-hidden mb-4"
        style={{ height: "300px" }}
      ></div>

      {mensaje && (
        <p
          className={`text-center text-lg font-semibold ${
            confirmado ? "text-green-600" : "text-red-600"
          }`}
        >
          {mensaje}
        </p>
      )}

      <button
        onClick={() => navigate("/")}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Volver al inicio
      </button>
    </div>
  );
}