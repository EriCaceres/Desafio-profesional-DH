import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../services/api";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/products/${id}`);
        setProduct(data);
        setErr("");
      } catch (e) {
        console.error(e);
        setErr("No se pudo cargar el servicio.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <main className="pt-16 bg-gray-100 min-h-screen pb-10">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-sm text-gray-600 mt-4">Cargando servicio...</p>
        </div>
      </main>
    );
  }

  if (err || !product) {
    return (
      <main className="pt-16 bg-gray-100 min-h-screen pb-10">
        <div className="max-w-4xl mx-auto px-4 space-y-3 mt-4">
          <p className="text-sm text-red-600">{err || "Servicio no encontrado."}</p>
          <Link to="/" className="text-sm text-blue-600 hover:underline">
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  const hasFeatures = Array.isArray(product.features) && product.features.length > 0;

  return (
    <main className="pt-16 bg-gray-100 min-h-screen pb-10">
      <div className="max-w-4xl mx-auto px-4 space-y-6 mt-4">
        <Link to="/" className="text-sm text-blue-600 hover:underline">
          ← Volver al inicio
        </Link>

        <section className="bg-white rounded shadow p-5 space-y-3">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            {product.category && (
              <p className="text-sm text-gray-600">
                Categoría: <span className="font-medium">{product.category.name}</span>
              </p>
            )}
          </div>

          {product.description && (
            <p className="text-sm text-gray-700">{product.description}</p>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-gray-700 mt-2">
            {product.durationMin != null && (
              <span className="inline-flex items-center gap-1">
                ⏱ {product.durationMin} min
              </span>
            )}
            {product.priceFrom != null && (
              <span className="inline-flex items-center gap-1">
                💲 Desde ${product.priceFrom}
              </span>
            )}
          </div>
        </section>

        {hasFeatures && (
          <section className="bg-white rounded shadow p-5 space-y-3">
            <h2 className="text-lg font-semibold">Incluye</h2>
            <ul className="flex flex-wrap gap-2">
              {product.features.map((f) => (
                <li
                  key={f.id}
                  className="border rounded-full px-3 py-1 text-sm flex items-center gap-2"
                >
                  <span>{f.icon}</span>
                  <span>{f.name}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}


