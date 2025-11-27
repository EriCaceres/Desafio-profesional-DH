import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/api/products/${id}`);
        setProduct(data);
      } catch (e) {
        console.error(e);
        setErr("No se pudo cargar el producto");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <main className="bg-gray-100 min-h-screen pt-16 pb-10">
        <div className="max-w-6xl mx-auto px-4">
          <p>Cargando producto...</p>
        </div>
      </main>
    );
  }

  if (err || !product) {
    return (
      <main className="bg-gray-100 min-h-screen pt-16 pb-10">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-red-600">{err || "Producto no encontrado"}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-100 min-h-screen pt-16 pb-10">
      <div className="max-w-6xl mx-auto px-4 space-y-6">

        <header className="flex items-center justify-between bg-white px-6 py-4 rounded shadow mt-4">
          <h1 className="text-2xl font-bold">{product.name}</h1>

          <button
            onClick={() => window.history.back()}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Volver
          </button>
        </header>


        <section className="bg-white p-4 rounded shadow">
          <div className="grid md:grid-cols-2 gap-3">

            <div className="h-48 bg-gray-200 flex items-center justify-center rounded">
              <span className="text-sm text-gray-600">Imagen principal</span>
            </div>

            <div className="grid grid-cols-2 grid-rows-2 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-gray-200 flex items-center justify-center rounded text-xs text-gray-600"
                >
                  Imagen {i + 1}
                </div>
              ))}
            </div>
          </div>

          <div className="text-right mt-2">
            <button className="text-blue-600 text-sm hover:underline">
              Ver más
            </button>
          </div>
        </section>

        <section className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Descripción</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            {product.description || "Este servicio no tiene descripción cargada aún."}
          </p>
        </section>

      </div>
    </main>
  );
}

