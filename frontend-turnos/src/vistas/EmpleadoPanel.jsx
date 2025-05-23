import { useEffect, useState } from "react";
import Navbar from "../componentes/Navbar";
import API from "../api";
import CardTurno from "../componentes/CardTurno";

export default function EmpleadoPanel() {
  const nombre = localStorage.getItem("nombre");
  const [turnos, setTurnos] = useState([]);

  async function cargarTurnos() {
    try {
      const token = localStorage.getItem("token");
      const payload = JSON.parse(atob(token.split(".")[1]));
      const idUsuario = payload.id;

      const res = await API.get(`/turnos/trabajador/${idUsuario}`);
      setTurnos(res.data);
    } catch (error) {
      console.error("Error al cargar turnos:", error);
      setTurnos([]);
    }
  }

  useEffect(() => {
    cargarTurnos();
  }, []);

  return (
    <div className="min-h-screen px-4 py-6 bg-gray-100">
      <Navbar nombre={nombre} />
      <h2 className="p-4 text-xl font-semibold">Turnos Asignados</h2>

      <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
        {turnos.length === 0 ? (
          <p className="text-center text-gray-600 col-span-full">
            No tienes turnos asignados aún.
          </p>
        ) : (
          turnos.map((turno) => {
            const cliente =
              turno.usuario?.nombre ||
              turno.correoCliente ||
              turno.telefono ||
              "Anónimo";

            return (
              <CardTurno
                key={turno._id}
                id={turno._id}
                cliente={cliente}
                hora={turno.hora}
                servicio={turno.servicio}
                estado={turno.estado}
                esEmpleado={true}
                onCambio={cargarTurnos}
              />
            );
          })
        )}
      </div>
    </div>
  );
}