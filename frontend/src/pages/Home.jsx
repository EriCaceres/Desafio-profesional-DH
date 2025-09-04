import { useEffect, useState } from "react";
import { api } from "../services/api";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const fetchRandom = async () => {
      try {
        const { data } = await api.get("/api/products/random", {
          params: { limit: 10 },
        });
        // El backend devuelve un array
        setItems(data);
      } catch (e) {
        setErr("No se pudieron cargar los servicios");
      } finally {
        setLoading(false);
      }
    };
    fetchRandom();
  }, []);

  if (loading) return <div className="p-4">Cargando...</div>;
  if (err) return <div className="p-4" style={{ color: "crimson" }}>{err}</div>;

  return (
    <div className="p-4" style={{ maxWidth: 1000, margin: "0 auto" }}>
      <h1 className="text-2xl" style={{ marginBottom: 12 }}>Servicios recomendados</h1>

      {items.length === 0 && <p>No hay servicios disponibles.</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 12,
        }}
      >
        {items.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </div>
  );
}
