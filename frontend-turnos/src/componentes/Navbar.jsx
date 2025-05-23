import { useNavigate } from "react-router-dom";

export default function Navbar({ nombre }) {
  const navigate = useNavigate();
  const rol = localStorage.getItem("rol");

  function cerrarSesion() {
    localStorage.clear();
    navigate("/");
  }

  return (
    <header className="bg-gray-900 text-white flex justify-between items-center px-6 py-4 shadow">
      <h1 className="text-lg font-semibold">
        Bienvenido, <span className="text-blue-300">{nombre}</span>
      </h1>

      <div className="flex items-center gap-4">
        {/* Botón visible solo para empleados */}
        {rol === "empleado" && (
          <button
            onClick={() => navigate("/escanear")}
            className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 text-sm rounded"
          >
            Escanear QR
          </button>
        )}

        <button
          onClick={cerrarSesion}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 text-sm rounded"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}