import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { api } from "../services/api";
import ProductCard from "../components/ProductCard";
import "../styles/Home.css";

export default function Home() {
  const [searchText, setSearchText] = useState("");

  const [allProducts, setAllProducts] = useState([]); // BASE
  const [products, setProducts] = useState([]);       // VISTA

  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [searchError, setSearchError] = useState("");
  const [searching, setSearching] = useState(false);

  const [showCalendar, setShowCalendar] = useState(false);

  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("es-AR") : "";

  // CARGA INICIAL
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get("/api/categories"),
          api.get("/api/products"),
        ]);

        if (!mounted) return;

        const cats = Array.isArray(catRes.data) ? catRes.data : [];
        const prods = Array.isArray(prodRes.data) ? prodRes.data : [];

        setCategories(cats);
        setAllProducts(prods);
        setProducts(prods);
      } catch {
        if (!mounted) return;
        setErrorMsg("No se pudieron cargar los servicios.");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    load();
    return () => (mounted = false);
  }, []);

  // FILTRO POR CATEGORÍA + LIMITE 10
  const visibleProducts = useMemo(() => {
    let base = products;

    if (selectedCategoryId) {
      base = base.filter(
        (p) =>
          p?.category?.id === selectedCategoryId ||
          p?.categoryId === selectedCategoryId
      );
    }

    return base.slice(0, 10);
  }, [products, selectedCategoryId]);

  // BUSQUEDA
  const handleSearchAvailability = async () => {
    setSearching(true);
    setSearchError("");

    try {
      const from = range[0].startDate.toISOString().slice(0, 10);
      const to = range[0].endDate.toISOString().slice(0, 10);

      const url = searchText.trim()
        ? `/api/products/search?query=${encodeURIComponent(searchText)}`
        : `/api/products/available?startDate=${from}&endDate=${to}`;

      const res = await api.get(url);
      const data = Array.isArray(res.data) ? res.data : [];

      setProducts(data);
      setSelectedCategoryId(null);
      setShowCalendar(false);
    } catch {
      setSearchError("No se pudo realizar la búsqueda.");
    } finally {
      setSearching(false);
    }
  };

  // RESET
  const resetFilters = () => {
    setProducts(allProducts);
    setSelectedCategoryId(null);
    setSearchText("");
    setSearchError("");
  };

  return (
    <div className="home">
      <div className="home__top">
        <div className="home__top-inner">
          <h2 className="home__brand">ShineLab</h2>
          <div className="home__auth">
            <Link to="/register">Crear cuenta</Link>
            <Link to="/login">Iniciar sesión</Link>
          </div>
        </div>
      </div>

      <div className="home__container">
        {/* BUSCADOR */}
        <section className="home__search">
          <h1>Reservá tu turno de detailing</h1>
          <p>Buscá por servicio o por disponibilidad.</p>

          <input
            className="search-input"
            placeholder="Buscar servicio…"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <div className="search__controls">
            <button
              className="date-input"
              onClick={() => setShowCalendar((v) => !v)}
            >
              {formatDate(range[0].startDate)} -{" "}
              {formatDate(range[0].endDate)}
            </button>

            <button className="btn-primary" onClick={handleSearchAvailability}>
              Buscar
            </button>

            <button className="btn-secondary" onClick={resetFilters}>
              Limpiar
            </button>
          </div>

          {showCalendar && (
            <div className="calendar-popover">
              <DateRange
                ranges={range}
                onChange={(item) => setRange([item.selection])}
                minDate={new Date()}
              />
            </div>
          )}

          {searchError && <p className="error">{searchError}</p>}
        </section>

        {/* CATEGORIAS */}
        <section className="home__categories">
          <h3>Categorías</h3>
          <div className="home__categoryList">
            <button
              className={!selectedCategoryId ? "chip chip--active" : "chip"}
              onClick={() => setSelectedCategoryId(null)}
            >
              Todas
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                className={
                  selectedCategoryId === c.id ? "chip chip--active" : "chip"
                }
                onClick={() => setSelectedCategoryId(c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>
        </section>

        {/* RESULTADOS */}
        <section className="home__recommended">
          <h3>Servicios recomendados</h3>

          {visibleProducts.length === 0 ? (
            <p>No hay servicios para mostrar.</p>
          ) : (
            <div className="home__grid">
              {visibleProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>

      <footer className="home__footer">
      </footer>
    </div>
  );
}

