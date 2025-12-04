import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [searchActive, setSearchActive] = useState(false);

  // Cargar productos iniciales
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/api/products");
        setProducts(data || []);
        setFiltered(data || []);
        setErr("");
      } catch (e) {
        console.error(e);
        setErr("No se pudieron cargar los servicios.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleRangeChange = (item) => {
    setRange([item.selection]);
  };

  const handleSearch = async () => {
    try {
      const start = format(range[0].startDate, "yyyy-MM-dd");
      const end = format(range[0].endDate, "yyyy-MM-dd");

      const { data } = await api.get("/api/products/available", {
        params: {
          startDate: start,
          endDate: end,
        },
      });

      setFiltered(data || []);
      setSearchActive(true);
    } catch (e) {
      console.error(e);
      setErr("No se pudo realizar la búsqueda.");
    }
  };

  const clearSearch = () => {
    setFiltered(products);
    setSearchActive(false);
  };

  return (
    <main className="pt-16 bg-gray-100 min-h-screen pb-10">
      <div className="max-w-6xl mx-auto px-4 space-y-8 mt-4">
        {/* Bloque de búsqueda con rango de fechas (US #22) */}
        <section className="bg-white rounded shadow p-5 grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <h1 className="text-2xl font-bold">Buscá tu turno</h1>
            <p className="text-sm text-gray-600">
              Elegí el rango de fechas en el que querés reservar y te mostramos solo los servicios disponibles.
            </p>

            <div className="flex flex-wrap gap-3 items-center">
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                Buscar disponibilidad
              </button>

              {searchActive && (
                <button
                  onClick={clearSearch}
                  className="px-3 py-2 border rounded text-sm text-gray-700 hover:bg-gray-100"
                >
                  Limpiar búsqueda
                </button>
              )}
            </div>
          </div>

          <div className="justify-self-end">
            <DateRange
              ranges={range}
              onChange={handleRangeChange}
              minDate={new Date()}
              moveRangeOnFirstSelection={false}
            />
          </div>
        </section>

        {/* Mensajes de estado */}
        {loading && <p className="text-sm text-gray-600">Cargando servicios...</p>}
        {err && <p className="text-sm text-red-600">{err}</p>}

        {/* Resultados de productos */}
        <section className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {searchActive ? "Resultados de la búsqueda" : "Servicios recomendados"}
            </h2>
            <p className="text-xs text-gray-500">
              Mostrando {filtered.length} servicio(s)
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {filtered.map((p) => (
              <article
                key={p.id}
                className="bg-white rounded shadow p-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg truncate">{p.name}</h3>
                  {p.category && (
                    <p className="text-xs text-gray-500">
                      {p.category.name}
                    </p>
                  )}
                  {p.description && (
                    <p className="text-xs text-gray-600 line-clamp-3">
                      {p.description}
                    </p>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between text-sm text-gray-700">
                  {p.durationMin != null && (
                    <span>⏱ {p.durationMin} min</span>
                  )}
                  {p.priceFrom != null && (
                    <span>💲 Desde ${p.priceFrom}</span>
                  )}
                </div>

                <div className="mt-4">
                  <Link
                    to={`/product/${p.id}`}
                    className="inline-block w-full text-center px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Ver detalle
                  </Link>
                </div>
              </article>
            ))}

            {!loading && filtered.length === 0 && (
              <p className="text-sm text-gray-600">
                No encontramos servicios disponibles en ese rango de fechas.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

