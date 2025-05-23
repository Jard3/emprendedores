import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginView from "./vistas/LoginView";
import AdminDashboard from "./vistas/AdminDashboard";
import EmpleadoPanel from "./vistas/EmpleadoPanel";
import ClientePanel from "./vistas/ClientePanel";
import CrearTurnoForm from "./vistas/CrearTurnoForm";
import InicioView from "./vistas/InicioView";
import EscanearQR from "./vistas/EscanearQR";
import ConfirmarTurnoView from "./vistas/ConfirmarTurnoView"; // ✅ NUEVO
import { RutaPrivada } from "./rutasProtegidas";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Página de inicio con las 3 opciones */}
        <Route path="/" element={<InicioView />} />

        {/* Crear cita sin login */}
        <Route path="/crear-cita" element={<CrearTurnoForm />} />

        {/* Login */}
        <Route path="/login" element={<LoginView />} />

        {/* Panel del admin */}
        <Route
          path="/admin"
          element={
            <RutaPrivada rolPermitido="admin">
              <AdminDashboard />
            </RutaPrivada>
          }
        />

        {/* Panel del empleado */}
        <Route
          path="/empleado"
          element={
            <RutaPrivada rolPermitido="empleado">
              <EmpleadoPanel />
            </RutaPrivada>
          }
        />

        {/* Panel del cliente */}
        <Route
          path="/cliente"
          element={
            <RutaPrivada rolPermitido="cliente">
              <ClientePanel />
            </RutaPrivada>
          }
        />

        {/* Escaneo QR – vista pública */}
        <Route path="/escanear" element={<EscanearQR />} />

        {/* ✅ Confirmación de turno vía QR */}
        <Route path="/confirmar-turno/:id" element={<ConfirmarTurnoView />} />
        
      </Routes>
    </BrowserRouter>
  );
}