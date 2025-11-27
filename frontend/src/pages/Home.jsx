import { useEffect, useState } from "react";
import { api } from "../services/api";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [randomItems, setRandomItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // paginación
  const [page, setPage] = useState(1);
  const pageSize = 4; // máx 4 por página (menos de 10 = ok)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setErr("");


        const randomReq = api.get("/api/products/random", {
          params: { limit: 10 },
        });


        const allReq = api.get("/api/products");

        const [randomRes, allRes] = await Promise.all([randomReq, allReq]);

        setRandomItems(randomRes.data || []);
        setAllItems(allRes.data || []);
        setPage(1); // volver a página 1 por las dudas
      } catch (e) {
        console.error(e);
        setErr("No se pudieron cargar los productos");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const totalPages = Math.max(1, Math.ceil(allItems.length / pageSize));
  const start = (page - 1) * pageSize;
  const currentPageItems = allItems.slice(start, start + pageSize);

  const goFirst = () => setPage(1);
  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8 mt-4">
      {/* BLOQUE 1 – BUSCADOR */}
      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-1">Buscá tu servicio</h2>
        <p className="text-sm text-gray-500 mb-3">
          Elegí el servicio y la fecha que mejor se adapte a vos.
        </p>
        <div className="flex flex-col md:flex-row gap-2">
          <input
            className="border rounded px-2 py-1 flex-1"
            placeholder="¿Qué servicio estás buscando?"
          />
          <button className="bg-blue-600 text-white px-4 py-1 rounded">
            Buscar
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Categorías</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {["Lavado rápido", "Detailing completo", "Pulido", "Cerámico"].map(
            (cat) => (
              <div
                key={cat}
                className="bg-white p-3 rounded shadow text-sm text-center"
              >
                {cat}
              </div>
            )
          )}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Recomendaciones</h2>
        {loading && <p className="text-sm text-gray-500">Cargando...</p>}
        {err && <p className="text-sm text-red-600">{err}</p>}

        {!loading && !err && randomItems.length === 0 && (
          <p className="text-sm text-gray-500">
            No hay productos para mostrar.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {randomItems.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>


      <section className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-3">Todos los servicios</h2>

        {loading && <p className="text-sm text-gray-500">Cargando...</p>}
        {err && <p className="text-sm text-red-600">{err}</p>}

        {!loading && allItems.length === 0 && !err && (
          <p className="text-sm text-gray-500">
            No hay productos registrados todavía.
          </p>
        )}

        {!loading && allItems.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {currentPageItems.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>

            {/* Controles de paginación */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <button
                onClick={goFirst}
                disabled={page === 1}
                className="px-2 py-1 border rounded disabled:opacity-50"
              >
                « Inicio
              </button>
              <button
                onClick={goPrev}
                disabled={page === 1}
                className="px-2 py-1 border rounded disabled:opacity-50"
              >
                ‹ Anterior
              </button>

              <span className="px-2">
                Página {page} de {totalPages}
              </span>

              <button
                onClick={goNext}
                disabled={page === totalPages}
                className="px-2 py-1 border rounded disabled:opacity-50"
              >
                Siguiente ›
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}


