import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Admin() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      const { data } = await api.get("/api/products");
      setItems(data);
    } catch {
      setErr("No se pudo cargar la lista");
    }
  };

  const removeOne = async (id) => {
    if (!confirm("¿Eliminar este producto?")) return;
    await api.delete(`/api/products/${id}`);
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  useEffect(() => { load(); }, []);

  if (err) return <div className="p-4 text-red-600">{err}</div>;

  return (
    <div className="p-4" style={{ maxWidth: 900, margin: "0 auto" }}>
      <h1 className="text-2xl font-bold mb-3">Admin — Productos</h1>
      {items.length === 0 && <p>No hay productos.</p>}
      <ul style={{ display: "grid", gap: 8 }}>
        {items.map((p) => (
          <li key={p.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12,
                                   display: "flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <strong>{p.name}</strong>
              <div className="text-sm text-gray-600">
                {p.durationMin ? `${p.durationMin} min · ` : ""}
                {p.priceFrom ? `desde $${p.priceFrom}` : ""}
              </div>
            </div>
            <button onClick={() => removeOne(p.id)} className="bg-red-600 text-white px-3 py-1 rounded">
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}


