import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { api } from "../services/api";
import ProductCard from "../components/ProductCard";
import "../styles/Home.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [searchError, setSearchError] = useState("");
  const [searching, setSearching] = useState(false);

  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  // Carga inicial: categorías + productos
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setErrorMsg("");

      try {
        const [catRes, prodRes] = await Promise.all([
          api.get("/api/categories"),
          api.get("/api/products"),
        ]);

        if (!mounted) return;

        const cats = Array.isArray(catRes.data) ? catRes.data : [];
        const prods = Array.isArray(prodRes.data) ? prodRes.data : [];

        setCategories(cats);
        setProducts(prods);
      } catch (e) {
        if (!mounted) return;
        setErrorMsg("No se pudieron cargar los servicios. Probá de nuevo más tarde.");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Lista “visible” según categoría seleccionada
  const visibleProducts = useMemo(() => {
    let base = products;

    if (selectedCategoryId) {
      base = base.filter((p) => p?.category?.id === selectedCategoryId);
    }

    // Sprint/Home: recomendados (máximo 10)
    return base.slice(0, 10);
  }, [products, selectedCategoryId]);

  const handleSearchAvailability = async () => {
    setSearching(true);
    setSearchError("");

    try {
      const from = range[0].startDate.toISOString().slice(0, 10);
      const to = range[0].endDate.toISOString().slice(0, 10);

      // Endpoint esperado (si tu backend lo tiene así)
      // Si tu endpoint real es otro, decime cuál es y lo ajustamos.
      const res = await api.get(`/api/products/available?from=${from}&to=${to}`);
      const data = Array.isArray(res.data) ? res.data : [];

      setProducts(data);

      // Importante: al buscar disponibilidad, normalmente conviene resetear categoría
      // porque si no, te puede dejar “1 solo” por el filtro anterior.
      setSelectedCategoryId(null);
    } catch (e) {
      setSearchError("No se pudo buscar disponibilidad. Probá de nuevo.");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="home">
      {/* Header simple (si ya tenés uno global, podés eliminar esto) */}
      <div className="home__top">
        <h2>Reservá tu turno de detailing</h2>
        <div className="home__auth">
          <Link to="/register">Crear cuenta</Link>
          <Link to="/login">Iniciar sesión</Link>
        </div>
      </div>

      <section className="home__calendar">
        <DateRange
          ranges={range}
          onChange={(item) => setRange([item.selection])}
          moveRangeOnFirstSelection={false}
        />

        <button
          className="btn-primary"
          onClick={handleSearchAvailability}
          disabled={searching}
        >
          {searching ? "Buscando..." : "Buscar disponibilidad"}
        </button>

        {searchError && <p className="error">{searchError}</p>}
      </section>

      <section className="home__categories">
        <h3>Categorías</h3>

        {loading ? (
          <p>Cargando categorías...</p>
        ) : categories.length === 0 ? (
          <p>No hay categorías configuradas</p>
        ) : (
          <div className="home__categoryList">
            <button
              className={`chip ${selectedCategoryId === null ? "chip--active" : ""}`}
              onClick={() => setSelectedCategoryId(null)}
            >
              Todas
            </button>

            {categories.map((c) => (
              <button
                key={c.id}
                className={`chip ${selectedCategoryId === c.id ? "chip--active" : ""}`}
                onClick={() => setSelectedCategoryId(c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="home__recommended">
        <div className="home__recommendedHeader">
          <h3>Servicios recomendados</h3>
          <span>Mostrando {visibleProducts.length} servicio(s)</span>
        </div>

        {errorMsg && <p className="error">{errorMsg}</p>}

        {!loading && !errorMsg && visibleProducts.length === 0 && (
          <p>No hay servicios para mostrar.</p>
        )}

        <div className="home__grid">
          {visibleProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <footer className="home__footer">© 2025 ShineLab. Todos los derechos reservados.</footer>
    </div>
  );
}
