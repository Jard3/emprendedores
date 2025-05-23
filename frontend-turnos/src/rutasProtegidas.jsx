import { Navigate } from "react-router-dom";

// Componente para proteger rutas según token y rol
export function RutaPrivada({ children, rolPermitido }) {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  // Si no hay sesión activa o el rol no tiene permiso, redirigir al inicio
  if (!token || rol !== rolPermitido) {
    return <Navigate to="/" replace />;
  }

  return children;
}