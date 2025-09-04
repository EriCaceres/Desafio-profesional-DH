import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../services/api";

export default function ProductDetail() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/api/products/${id}`);
        setP(data);
      } catch {
        setErr("No se pudo cargar el producto");
      }
    })();
  }, [id]);

  if (err) return <div className="p-4 text-red-600">{err}</div>;
  if (!p) return <div className="p-4">Cargando...</div>;

  return (
    <div className="p-4" style={{ maxWidth: 900, margin: "0 auto" }}>
      <Link to="/" className="text-blue-600">← Volver</Link>
      <h1 className="text-3xl font-bold mt-2 mb-2">{p.name}</h1>
      <p className="text-gray-700 mb-2">{p.description || "Sin descripción"}</p>
      <div className="text-sm text-gray-600">
        {p.durationMin ? `Duración: ${p.durationMin} min` : ""}
        {p.priceFrom ? ` · Desde $${p.priceFrom}` : ""}
      </div>
    </div>
  );
}
