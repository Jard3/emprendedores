import { useNavigate } from "react-router-dom";

export default function InicioView() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10 px-4 py-10 bg-gray-50">
      <h1 className="text-3xl font-bold text-center">Bienvenido al Sistema de Turnos</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {/* Cliente */}
        <div className="bg-white shadow-md rounded p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Cliente</h2>
          <p className="text-gray-600 mb-4">
            Agenda una cita de manera rápida sin necesidad de registrarte.
          </p>
          <button
            onClick={() => navigate("/crear-cita")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Crear cita
          </button>
        </div>

        {/* Empleado */}
        <div className="bg-white shadow-md rounded p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Empleado</h2>
          <p className="text-gray-600 mb-4">
            Inicia sesión con tus credenciales para ver y gestionar turnos.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Iniciar sesión
          </button>
        </div>

        {/* Administrador */}
        <div className="bg-white shadow-md rounded p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Administrador</h2>
          <p className="text-gray-600 mb-4">
            Control total sobre usuarios, citas y empleados del sistema.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );
}