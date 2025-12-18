import { Link } from "react-router-dom";

export default function ProductCard({ product, p }) {
  // Soporta ambas props: product (correcta) y p (legacy)
  const data = product || p;

  // Defensa total: si no hay producto válido, no renderiza nada
  if (!data || !data.id) return null;

  return (
    <Link
      to={`/products/${data.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 12,
        }}
      >
        <h3 style={{ margin: 0 }}>{data.name}</h3>

        <p style={{ color: "#555" }}>
          {data.description || "Sin descripción"}
        </p>

        <small>
          {data.durationMin ? `${data.durationMin} min · ` : ""}
          {data.priceFrom ? `desde $${data.priceFrom}` : ""}
        </small>
      </div>
    </Link>
  );
}

