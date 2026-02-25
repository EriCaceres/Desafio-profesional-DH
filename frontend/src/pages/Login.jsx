import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { api } from "../services/api";

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const navigate  = useNavigate();
  const location  = useLocation();

  // Si venimos desde /products/:id/booking (o cualquier otra ruta), volvemos ahí
  const from      = location.state?.from || "/";
  const mandatory = !!location.state?.mandatory; // true cuando el login es obligatorio

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email y contraseña son obligatorios");
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("user", JSON.stringify(data));
      navigate(from, { replace: true });
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-gray-100 min-h-screen pt-16 pb-10">
      <div className="max-w-md mx-auto bg-white rounded shadow p-6 mt-6 space-y-4">

        {/* Mensaje obligatorio (#30) */}
        {mandatory && (
          <div className="bg-amber-50 border border-amber-300 rounded p-3 text-sm text-amber-800">
            <strong>Iniciá sesión para continuar.</strong> Para realizar una reserva
            necesitás estar registrado. Si no tenés cuenta,{" "}
            <Link to="/register" className="underline font-semibold">
              registrate aquí
            </Link>
            .
          </div>
        )}

        <h1 className="text-xl font-bold">Iniciar sesión</h1>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="border rounded px-2 py-1 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contraseña</label>
            <input
              type="password"
              className="border rounded px-2 py-1 w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-1 rounded text-sm w-full disabled:opacity-60"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="text-sm text-center text-slate-500">
          ¿No tenés cuenta?{" "}
          <Link to="/register" className="underline font-semibold text-blue-600">
            Registrate
          </Link>
        </p>
      </div>
    </main>
  );
}
