import { useEffect, useState } from "react";
import Navbar from "../componentes/Navbar";
import API from "../api";
import CardTurno from "../componentes/CardTurno";
import CrearTurnoForm from "./CrearTurnoForm";

export default function ClientePanel() {
  const nombre = localStorage.getItem("nombre");
  const [turnos, setTurnos] = useState([]);

  async function cargarTurnos() {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const payload = JSON.parse(atob(token.split(".")[1]));
      const idUsuario = payload.id;
      
      const res = await API.get(`/turnos/cliente/${idUsuario}`);
      setTurnos(res.data);
    } catch (error) {
      console.error("Error al obtener turnos:", error);
      setTurnos([]);
    }
  }

  useEffect(() => {
    cargarTurnos();
  }, []);

  return (
    <div>
      <Navbar nombre={nombre} />
      <h2 className="p-4 text-xl font-semibold">Mis Turnos</h2>

      <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
        {turnos.length === 0 ? (
          <p className="text-center text-gray-600 col-span-full">
            No tienes turnos registrados aún.
          </p>
        ) : (
          turnos.map((turno) => (
            <CardTurno
              key={turno._id}
              id={turno._id}
              cliente={turno.usuario?.nombre || turno.correoCliente || "Anónimo"}
              hora={turno.hora}
              servicio={turno.servicio}
              estado={turno.estado}
              esEmpleado={false}
            />
          ))
        )}
      </div>

      <div className="px-4">
        <h3 className="text-lg font-semibold mb-2">Agendar un nuevo turno</h3>
        <CrearTurnoForm onNuevoTurno={cargarTurnos} />
      </div>
    </div>
  );
}