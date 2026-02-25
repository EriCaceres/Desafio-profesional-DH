import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);

  const load = () => {
    try {
      const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
      setFavorites(favs);
    } catch {
      setFavorites([]);
    }
  };

  useEffect(() => {
    load();
    // Escuchar cambios de storage (si el usuario marca/desmarca desde otra tab)
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  const handleRemove = (productId) => {
    const updated = favorites.filter((f) => f.id !== productId);
    localStorage.setItem("favorites", JSON.stringify(updated));
    setFavorites(updated);
  };

  return (
    <main className="min-h-screen bg-gray-100 pt-8 pb-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mis favoritos</h1>
          <Link to="/" className="text-sm text-orange-500 hover:underline">
            ← Volver al inicio
          </Link>
        </div>

        {favorites.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-10 text-center">
            <p className="text-gray-500 text-lg mb-4">
              Todavía no tenés servicios favoritos.
            </p>
            <Link
              to="/"
              className="bg-orange-500 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-orange-600"
            >
              Explorar servicios
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              {favorites.length} {favorites.length === 1 ? "servicio guardado" : "servicios guardados"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} />
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="mt-1 w-full text-xs text-red-500 hover:text-red-700 hover:underline text-center"
                  >
                    Quitar de favoritos
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
