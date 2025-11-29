import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // leer usuario desde localStorage al cargar
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  // iniciales para el circulito
  const initials = user
    ? `${(user.firstName || "").charAt(0)}${(user.lastName || "").charAt(0)}`
        .toUpperCase()
    : "";

  // ¿es admin? (para el Sprint 2, cuando tengas rol ADMIN)
  const isAdmin =
    user && Array.isArray(user.roles)
      ? user.roles.some((r) => r.name === "ADMIN")
      : false;

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Logo + lema */}
        <Link to="/" className="flex flex-col">
          <span className="font-bold text-xl leading-tight">ShineLab</span>
          <span className="text-xs text-gray-500">
            Reservá tu turno de detailing
          </span>
        </Link>

        {/* Zona derecha */}
        {user ? (
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                to="/administración"
                className="text-sm text-blue-600 hover:underline"
              >
                Panel admin
              </Link>
            )}

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                {initials || "U"}
              </div>
              <span className="text-sm">
                Hola, {user.firstName || "usuario"}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="border px-3 py-1 rounded text-sm"
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/register">
              <button className="border px-3 py-1 rounded text-sm">
                Crear cuenta
              </button>
            </Link>
            <Link to="/login">
              <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                Iniciar sesión
              </button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

