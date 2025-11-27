import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // estados del formulario "Agregar producto"
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [durationMin, setDurationMin] = useState("");
  const [priceFrom, setPriceFrom] = useState("");

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // para bloquear uso en mobile (como pide la consigna)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // detectar ancho de pantalla
    const w = window.innerWidth;
    if (w < 768) {
      setIsMobile(true);
    }

    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/products");
      setProducts(data || []);
      setErr("");
    } catch (e) {
      console.error(e);
      setErr("No se pudieron cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar producto?")) return;
    try {
      await api.delete(`/api/products/${id}`);
      await loadProducts();
    } catch (e) {
      console.error(e);
      alert("No se pudo eliminar el producto");
    }
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
    };

    try {
      setSaving(true);
      await api.post("/api/products", body);
      // limpiar form y recargar lista
      setName("");
      setDescription("");
      setDurationMin("");
      setPriceFrom("");
      await loadProducts();
    } catch (e) {
      console.error(e);
      if (e.response?.data?.message) {
        setFormError(e.response.data.message);
      } else {
        setFormError("Error al guardar el producto");
      }
    } finally {
      setSaving(false);
    }
  };

  if (isMobile) {
    return (
      <main className="bg-gray-100 min-h-screen pt-16 pb-10">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-2xl font-bold mb-4">Panel de administración</h1>
          <p className="text-sm text-gray-700">
            El panel de administración no está disponible en dispositivos
            móviles. Accedé desde una computadora de escritorio.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-100 min-h-screen pt-16 pb-10">
      <div className="max-w-5xl mx-auto px-4 space-y-6">
        <h1 className="text-2xl font-bold mb-2">Panel de administración</h1>

        {/* Menú simple */}
        <nav className="bg-white p-3 rounded shadow text-sm mb-2">
          <span className="font-semibold mr-4">Funciones:</span>
          <span className="mr-3">Lista de productos</span>
          <span>Agregar producto</span>
        </nav>

        {/* Formulario: Agregar producto */}
        <section className="bg-white p-4 rounded shadow space-y-3">
          <h2 className="text-lg font-semibold">Agregar producto</h2>

          {formError && (
            <p className="text-sm text-red-600">{formError}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nombre *
              </label>
              <input
                type="text"
                className="border rounded px-2 py-1 w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Lavado Premium"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Descripción
              </label>
              <textarea
                className="border rounded px-2 py-1 w-full text-sm"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripción del servicio..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

        {/* Lista de productos */}
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



