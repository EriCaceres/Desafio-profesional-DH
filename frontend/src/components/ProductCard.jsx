import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function isFavorite(productId) {
  try {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    return favs.some((f) => f.id === productId);
  } catch {
    return false;
  }
}

function toggleFavorite(product) {
  try {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    const exists = favs.some((f) => f.id === product.id);
    const updated = exists
      ? favs.filter((f) => f.id !== product.id)
      : [...favs, product];
    localStorage.setItem("favorites", JSON.stringify(updated));
    return !exists;
  } catch {
    return false;
  }
}

export default function ProductCard({ product, p }) {
  const data = product || p;
  if (!data || !data.id) return null;

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  })();

  const [fav, setFav] = useState(() => isFavorite(data.id));

  useEffect(() => {
    setFav(isFavorite(data.id));
  }, [data.id]);

  const handleFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert("Iniciá sesión para guardar favoritos");
      return;
    }
    const newState = toggleFavorite(data);
    setFav(newState);
  };

  return (
    <Link
      to={`/products/${data.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="relative border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow bg-white">
        {/* Botón favorito */}
        <button
          onClick={handleFav}
          className="absolute top-2 right-2 text-xl leading-none focus:outline-none"
          title={fav ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          {fav ? (
            <span className="text-red-500">♥</span>
          ) : (
            <span className="text-gray-300 hover:text-red-400">♡</span>
          )}
        </button>

        <h3 className="font-semibold text-gray-900 pr-6">{data.name}</h3>
        <p className="text-sm text-gray-500 mt-1">
          {data.description || "Sin descripción"}
        </p>
        <small className="text-gray-400 text-xs mt-2 block">
          {data.durationMin ? `${data.durationMin} min · ` : ""}
          {data.priceFrom ? `desde $${data.priceFrom}` : ""}
        </small>

        {data.category && (
          <span className="inline-block mt-2 text-xs bg-orange-100 text-orange-700 rounded-full px-2 py-0.5">
            {data.category.name}
          </span>
        )}
      </div>
    </Link>
  );
}

