import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();

  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored) : null;
  const isAdmin =
    user && Array.isArray(user.roles)
      ? user.roles.some((r) => r.name === "ADMIN")
      : false;

  useEffect(() => {
    if (!isAdmin) navigate("/");
  }, [isAdmin, navigate]);

  const [isMobile, setIsMobile] = useState(false);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [features, setFeatures] = useState([]);
  const [featureName, setFeatureName] = useState("");
  const [featureIcon, setFeatureIcon] = useState("");
  const [savingFeature, setSavingFeature] = useState(false);
  const [featureError, setFeatureError] = useState("");

  const [categories, setCategories] = useState([]);
  const [catName, setCatName] = useState("");
  const [catImage, setCatImage] = useState("");
  const [savingCategory, setSavingCategory] = useState(false);
  const [catError, setCatError] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [durationMin, setDurationMin] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (window.innerWidth < 768) setIsMobile(true);
    loadProducts();
    loadFeatures();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/products");
      setProducts(data || []);
      setErr("");
    } catch {
      setErr("No se pudieron cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  const loadFeatures = async () => {
    try {
      const { data } = await api.get("/api/features");
      setFeatures(data || []);
    } catch {}
  };

  const loadCategories = async () => {
    try {
      const { data } = await api.get("/api/categories");
      setCategories(data || []);
    } catch {}
  };

  const handleSaveFeature = async (e) => {
    e.preventDefault();
    setFeatureError("");

    if (!featureName.trim() || !featureIcon.trim()) {
      setFeatureError("Nombre e ícono son obligatorios");
      return;
    }

    try {
      setSavingFeature(true);
      await api.post("/api/features", {
        name: featureName.trim(),
        icon: featureIcon.trim(),
      });
      setFeatureName("");
      setFeatureIcon("");
      await loadFeatures();
    } catch (e) {
      const msg =
        e.response?.data?.message || "Error al guardar característica";
      setFeatureError(msg);
    } finally {
      setSavingFeature(false);
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setCatError("");

    if (!catName.trim() || !catImage.trim()) {
      setCatError("Nombre e imagen son obligatorios");
      return;
    }

    try {
      setSavingCategory(true);
      await api.post("/api/categories", {
        name: catName.trim(),
        image: catImage.trim(),
      });
      setCatName("");
      setCatImage("");
      await loadCategories();
    } catch (e) {
      const msg =
        e.response?.data?.message || "Error al guardar categoría";
      setCatError(msg);
    } finally {
      setSavingCategory(false);
    }
  };

  const toggleFeatureSelection = (id) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!name.trim()) {
      setFormError("El nombre es obligatorio");
      return;
    }

    const body = {
      name: name.trim(),
      description: description.trim(),
      durationMin: durationMin ? Number(durationMin) : null,
      priceFrom: priceFrom ? Number(priceFrom) : null,
      categoryId: categoryId ? Number(categoryId) : null,
      featureIds: selectedFeatures,
    };

    try {
      setSaving(true);
      await api.post("/api/products", body);
      setName("");
      setDescription("");
      setDurationMin("");
      setPriceFrom("");
      setCategoryId("");
      setSelectedFeatures([]);
      await loadProducts();
    } catch (e) {
      const msg = e.response?.data?.message || "Error al guardar el producto";
      setFormError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar producto?")) return;
    try {
      await api.delete(`/api/products/${id}`);
      await loadProducts();
    } catch {
      alert("No se pudo eliminar el producto");
    }
  };

  if (isMobile) {
    return (
      <main className="bg-gray-100 min-h-screen pt-16 pb-10">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-2xl font-bold mb-4">Panel de administración</h1>
          <p className="text-sm text-gray-700">
            El panel de administración no está disponible en dispositivos
            móviles.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-100 min-h-screen pt-16 pb-10">
      <div className="max-w-5xl mx-auto px-4 space-y-6">
        <h1 className="text-2xl font-bold mb-2">Panel de administración</h1>

        <nav className="bg-white p-3 rounded shadow text-sm mb-2">
          <span className="font-semibold mr-4">Funciones:</span>
          <span className="mr-3">Lista de productos</span>
          <span className="mr-3">Agregar producto</span>
          <span className="mr-3">Características</span>
          <span>Categorías</span>
        </nav>

        <section className="bg-white p-4 rounded shadow space-y-3">
          <h2 className="text-lg font-semibold">Agregar producto</h2>

          {formError && <p className="text-sm text-red-600">{formError}</p>}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre *</label>
              <input
                className="border rounded px-2 py-1 w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <textarea
                className="border rounded px-2 py-1 w-full text-sm"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Duración (min)
                </label>
                <input
                  type="number"
                  className="border rounded px-2 py-1 w-full"
                  value={durationMin}
                  onChange={(e) => setDurationMin(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Precio desde
                </label>
                <input
                  type="number"
                  className="border rounded px-2 py-1 w-full"
                  value={priceFrom}
                  onChange={(e) => setPriceFrom(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Categoría
                </label>
                <select
                  className="border rounded px-2 py-1 w-full text-sm"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">Sin categoría</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <p className="block text-sm font-medium mb-1">
                Características incluidas
              </p>
              <div className="flex flex-wrap gap-2 text-sm">
                {features.length === 0 && (
                  <span className="text-gray-500">
                    Primero creá características en la sección de abajo.
                  </span>
                )}
                {features.map((f) => (
                  <label
                    key={f.id}
                    className="inline-flex items-center gap-1 border rounded-full px-3 py-1 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="mr-1"
                      checked={selectedFeatures.includes(f.id)}
                      onChange={() => toggleFeatureSelection(f.id)}
                    />
                    <span>{f.icon}</span>
                    <span>{f.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-1 rounded text-sm disabled:opacity-60"
            >
              {saving ? "Guardando..." : "Guardar producto"}
            </button>
          </form>
        </section>

        <section className="bg-white p-4 rounded shadow space-y-3">
          <h2 className="text-lg font-semibold">Características</h2>

          {featureError && (
            <p className="text-sm text-red-600">{featureError}</p>
          )}

          <form onSubmit={handleSaveFeature} className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre *</label>
              <input
                className="border rounded px-2 py-1 w-full"
                value={featureName}
                onChange={(e) => setFeatureName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Ícono *</label>
              <input
                className="border rounded px-2 py-1 w-full"
                value={featureIcon}
                onChange={(e) => setFeatureIcon(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={savingFeature}
              className="bg-blue-600 text-white px-4 py-1 rounded text-sm disabled:opacity-60"
            >
              {savingFeature ? "Guardando..." : "Agregar característica"}
            </button>
          </form>

          <div className="pt-3">
            <h3 className="font-semibold mb-2">Lista de características</h3>

            {features.length === 0 && (
              <p className="text-sm text-gray-500">
                No hay características registradas.
              </p>
            )}

            {features.length > 0 && (
              <ul className="space-y-2">
                {features.map((f) => (
                  <li
                    key={f.id}
                    className="border rounded px-3 py-2 flex justify-between items-center"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{f.icon}</span>
                      {f.name}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="bg-white p-4 rounded shadow space-y-3">
          <h2 className="text-lg font-semibold">Categorías</h2>

          {catError && <p className="text-sm text-red-600">{catError}</p>}

          <form onSubmit={handleSaveCategory} className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre *</label>
              <input
                className="border rounded px-2 py-1 w-full"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                URL Imagen *
              </label>
              <input
                className="border rounded px-2 py-1 w-full"
                value={catImage}
                onChange={(e) => setCatImage(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={savingCategory}
              className="bg-blue-600 text-white px-4 py-1 rounded text-sm disabled:opacity-60"
            >
              {savingCategory ? "Guardando..." : "Agregar categoría"}
            </button>
          </form>

          <div className="pt-3">
            <h3 className="font-semibold mb-2">Lista de categorías</h3>

            {categories.length === 0 && (
              <p className="text-sm text-gray-500">
                No hay categorías registradas.
              </p>
            )}

            {categories.length > 0 && (
              <ul className="space-y-2">
                {categories.map((c) => (
                  <li
                    key={c.id}
                    className="border rounded px-3 py-2 flex justify-between items-center"
                  >
                    <span>{c.name}</span>
                    <img
                      src={c.image}
                      alt=""
                      className="w-10 h-10 object-cover rounded"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-3">Lista de productos</h2>

          {err && <p className="text-sm text-red-600 mb-2">{err}</p>}
          {loading && <p className="text-sm text-gray-500">Cargando...</p>}

          {!loading && products.length === 0 && (
            <p className="text-sm text-gray-500">
              No hay productos registrados.
            </p>
          )}

          {!loading && products.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Id</th>
                    <th className="text-left p-2">Nombre</th>
                    <th className="text-left p-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b">
                      <td className="p-2">{p.id}</td>
                      <td className="p-2">{p.name}</td>
                      <td className="p-2">
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-red-600 hover:underline"
                        >
                          Eliminar producto
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}





