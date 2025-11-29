import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");

  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [ok, setOk]               = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOk(false);

    if (!firstName || !lastName || !email || !password) {
      setError("Todos los campos son obligatorios");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      setLoading(true);

      const body = { firstName, lastName, email, password };
      const { data } = await api.post("/api/auth/register", body);


      localStorage.setItem("user", JSON.stringify(data));

      setOk(true);


      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (e) {
      console.error(e);
      const msg =
        e.response?.data?.message || "No se pudo registrar el usuario";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-gray-100 min-h-screen pt-16 pb-10">
      <div className="max-w-md mx-auto bg-white rounded shadow p-6 mt-6 space-y-4">
        <h1 className="text-xl font-bold">Crear cuenta</h1>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {ok && (
          <p className="text-sm text-green-700">
            Registro exitoso. Redirigiendo...
          </p>
        )}

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">
              Nombre
            </label>
            <input
              className="border rounded px-2 py-1 w-full"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Apellido
            </label>
            <input
              className="border rounded px-2 py-1 w-full"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              className="border rounded px-2 py-1 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Contraseña
            </label>
            <input
              type="password"
              className="border rounded px-2 py-1 w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Repetir contraseña
            </label>
            <input
              type="password"
              className="border rounded px-2 py-1 w-full"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-1 rounded text-sm w-full disabled:opacity-60"
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>
      </div>
    </main>
  );
}
