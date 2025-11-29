import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Link } from "react-router-dom";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  useEffect(() => {
    api.get("/api/categories").then((res) => {
      setCategories(res.data || []);
    });

    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      const { data } = await api.get("/api/products");
      setProducts(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingProducts(false);
    }
  };

  const filteredProducts = activeCategoryId
    ? products.filter(
        (p) => p.category && p.category.id === activeCategoryId
      )
    : products;

  const handleCategoryClick = (id) => {
    setActiveCategoryId((prev) => (prev === id ? null : id));
  };

  return (
    <main className="pt-16 bg-gray-100 min-h-screen pb-10">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((c) => (
            <button
              type="button"
              key={c.id}
              onClick={() => handleCategoryClick(c.id)}
              className={
                "bg-white rounded shadow hover:shadow-lg transition p-1 text-left " +
                (activeCategoryId === c.id ? "ring-2 ring-blue-500" : "")
              }
            >
              <img
                src={c.image}
                alt={c.name}
                className="w-full h-32 object-cover rounded"
              />
              <p className="text-center text-sm font-medium mt-1">
                {c.name}
              </p>
            </button>
          ))}

          {categories.length === 0 && (
            <p className="text-sm text-gray-500 col-span-full">
              No hay categorías disponibles.
            </p>
          )}
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Servicios disponibles</h2>
            <p className="text-xs text-gray-600">
              Mostrando {filteredProducts.length} de {products.length} servicios
            </p>
          </div>

          {activeCategoryId && (
            <button
              type="button"
              onClick={() => setActiveCategoryId(null)}
              className="text-xs text-blue-600 hover:underline"
            >
              Limpiar filtro
            </button>
          )}

          {loadingProducts && (
            <p className="text-sm text-gray-600">Cargando servicios...</p>
          )}

          {!loadingProducts && filteredProducts.length === 0 && (
            <p className="text-sm text-gray-500">
              No hay productos para esta categoría.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((p) => (
              <Link
                to={`/products/${p.id}`}
                key={p.id}
                className="bg-white rounded shadow hover:shadow-lg transition p-4 flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-semibold text-lg mb-2">{p.name}</h3>
                  {p.category && (
                    <p className="text-xs text-gray-500 mb-1">
                      {p.category.name}
                    </p>
                  )}
                  {p.description && (
                    <p className="text-sm text-gray-600 mb-3">
                      {p.description}
                    </p>
                  )}
                </div>

                <div className="mt-auto">
                  {p.priceFrom !== null && (
                    <p className="text-blue-600 font-medium">
                      Desde ${p.priceFrom}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

