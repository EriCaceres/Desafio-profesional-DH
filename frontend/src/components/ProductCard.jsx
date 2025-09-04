import { Link } from "react-router-dom";

export default function ProductCard({ p }) {
  return (
    <Link to={`/products/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
        <h3 style={{ margin: 0 }}>{p.name}</h3>
        <p style={{ color: "#555" }}>{p.description || "Sin descripción"}</p>
        <small>
          {p.durationMin ? `${p.durationMin} min · ` : ""}
          {p.priceFrom ? `desde $${p.priceFrom}` : ""}
        </small>
      </div>
    </Link>
  );
}

