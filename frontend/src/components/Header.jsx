import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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

  const initials = user
    ? `${(user.firstName || "").charAt(0)}${(user.lastName || "").charAt(0)}`.toUpperCase()
    : "";

  const isAdmin =
    user && Array.isArray(user.roles) ? user.roles.some((r) => r.name === "ADMIN") : false;

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Logo + lema */}
        <Link
          to="/"
          className="flex flex-col gap-0.5 no-underline text-slate-900 hover:text-slate-900"
        >
          <span className="font-extrabold text-xl leading-none">ShineLab</span>
          <span className="text-xs text-slate-500 leading-none">
            Reservá tu turno de detailing
          </span>
        </Link>

        {/* Zona derecha */}
        {user ? (
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                to="/administración"
                className="text-sm font-semibold text-slate-700 hover:text-slate-900 hover:underline"
              >
                Panel admin
              </Link>
            )}

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">
                {initials || "U"}
              </div>
              <span className="text-sm text-slate-700">
                Hola, <span className="font-semibold">{user.firstName || "usuario"}</span>
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="border border-slate-300 px-3 py-1.5 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/register" className="no-underline">
              <button className="border border-slate-300 px-3 py-1.5 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Crear cuenta
              </button>
            </Link>
            <Link to="/login" className="no-underline">
              <button className="bg-orange-500 text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-orange-600">
                Iniciar sesión
              </button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}


