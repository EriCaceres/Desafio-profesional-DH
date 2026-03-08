import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

const ICON_MAP = {
  vacuum: "🧹", shield: "🛡️", hand: "🤚", star: "⭐", layers: "🧴", tool: "🔧",
};
const iconDisplay = (icon) => ICON_MAP[icon] || icon;

export default function Admin() {
  const navigate = useNavigate();

  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored) : null;
  const isAdmin = user && Array.isArray(user.roles)
    ? user.roles.some((r) => r === "ADMIN" || r?.name === "ADMIN" || r?.authority === "ADMIN")
    : false;

  useEffect(() => { if (!isAdmin) navigate("/"); }, [isAdmin, navigate]);

  const [isMobile, setIsMobile] = useState(false);

  // Productos
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [durationMin, setDurationMin] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Características
  const [features, setFeatures] = useState([]);
  const [featureName, setFeatureName] = useState("");
  const [featureIcon, setFeatureIcon] = useState("");
  const [savingFeature, setSavingFeature] = useState(false);
  const [featureError, setFeatureError] = useState("");
  const [editingFeature, setEditingFeature] = useState(null);

  // Categorías
  const [categories, setCategories] = useState([]);
  const [catName, setCatName] = useState("");
  const [catImage, setCatImage] = useState("");
  const [savingCategory, setSavingCategory] = useState(false);
  const [catError, setCatError] = useState("");

  // Usuarios (#16)
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState("");
  const [togglingUserId, setTogglingUserId] = useState(null);

  useEffect(() => {
    if (window.innerWidth < 768) setIsMobile(true);
    loadProducts(); loadFeatures(); loadCategories(); loadUsers();
  }, []);

  const loadProducts  = async () => { try { setLoading(true); const { data } = await api.get("/api/products"); setProducts(data || []); setErr(""); } catch { setErr("No se pudieron cargar los productos"); } finally { setLoading(false); } };
  const loadFeatures  = async () => { try { const { data } = await api.get("/api/features"); setFeatures(data || []); } catch {} };
  const loadCategories = async () => { try { const { data } = await api.get("/api/categories"); setCategories(data || []); } catch {} };
  const loadUsers     = async () => { try { setLoadingUsers(true); const { data } = await api.get("/api/users"); setUsers(data || []); setUsersError(""); } catch { setUsersError("No se pudieron cargar los usuarios."); } finally { setLoadingUsers(false); } };

  // ── Características ───────────────────────────────────────────────────────
  const handleSaveFeature = async (e) => {
    e.preventDefault(); setFeatureError("");
    if (!featureName.trim()) { setFeatureError("El nombre es obligatorio"); return; }
    if (!featureIcon.trim()) { setFeatureError("El ícono es obligatorio"); return; }
    try {
      setSavingFeature(true);
      if (editingFeature) {
        await api.put(`/api/features/${editingFeature.id}`, { name: featureName.trim(), icon: featureIcon.trim() });
        setEditingFeature(null);
      } else {
        await api.post("/api/features", { name: featureName.trim(), icon: featureIcon.trim() });
      }
      setFeatureName(""); setFeatureIcon("");
      await loadFeatures();
    } catch (e) { setFeatureError(e.response?.data?.message || "Error al guardar característica"); }
    finally { setSavingFeature(false); }
  };
  const handleEditFeature = (f) => { setEditingFeature(f); setFeatureName(f.name); setFeatureIcon(f.icon); setFeatureError(""); };
  const handleCancelFeature = () => { setEditingFeature(null); setFeatureName(""); setFeatureIcon(""); setFeatureError(""); };
  const handleDeleteFeature = async (f) => {
    if (!window.confirm(`¿Eliminar la característica "${f.name}"?`)) return;
    try { await api.delete(`/api/features/${f.id}`); await loadFeatures(); await loadProducts(); }
    catch { alert("No se pudo eliminar. Puede estar asociada a productos."); }
  };

  // ── Categorías ────────────────────────────────────────────────────────────
  const handleSaveCategory = async (e) => {
    e.preventDefault(); setCatError("");
    if (!catName.trim())  { setCatError("El nombre es obligatorio"); return; }
    if (!catImage.trim()) { setCatError("La imagen es obligatoria"); return; }
    try {
      setSavingCategory(true);
      await api.post("/api/categories", { name: catName.trim(), image: catImage.trim() });
      setCatName(""); setCatImage("");
      await loadCategories();
    } catch (e) { setCatError(e.response?.data?.message || "Error al guardar categoría"); }
    finally { setSavingCategory(false); }
  };
  const handleDeleteCategory = async (cat) => {
    if (!window.confirm(`¿Eliminar la categoría "${cat.name}"?\n\nPuede afectar productos asociados.`)) return;
    try { await api.delete(`/api/categories/${cat.id}`); await loadCategories(); await loadProducts(); }
    catch { alert("No se pudo eliminar la categoría. Puede tener productos asociados."); }
  };

  // ── Productos ─────────────────────────────────────────────────────────────
  const toggleFeatureSelection = (id) =>
    setSelectedFeatures((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setName(product.name || ""); setDescription(product.description || "");
    setDurationMin(product.durationMin || ""); setPriceFrom(product.priceFrom || "");
    setCategoryId(product.category?.id || "");
    setSelectedFeatures(product.features?.map((f) => f.id) || []);
    setFormError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleCancelEdit = () => {
    setEditingProduct(null); setName(""); setDescription(""); setDurationMin("");
    setPriceFrom(""); setCategoryId(""); setSelectedFeatures([]); setFormError("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); setFormError("");
    if (!name.trim())  { setFormError("El nombre es obligatorio"); return; }
    if (!categoryId)   { setFormError("Seleccioná una categoría"); return; }
    if (durationMin !== "" && Number(durationMin) <= 0) { setFormError("La duración debe ser mayor a 0"); return; }
    if (priceFrom !== "" && Number(priceFrom) < 0)      { setFormError("El precio no puede ser negativo"); return; }
    const body = {
      name: name.trim(), description: description.trim(),
      durationMin: durationMin ? Number(durationMin) : null,
      priceFrom: priceFrom ? Number(priceFrom) : null,
      categoryId: Number(categoryId), featureIds: selectedFeatures,
    };
    try {
      setSaving(true);
      if (editingProduct) { await api.put(`/api/products/${editingProduct.id}`, body); }
      else                { await api.post("/api/products", body); }
      handleCancelEdit(); await loadProducts();
    } catch (e) { setFormError(e.response?.data?.message || "Error al guardar el producto"); }
    finally { setSaving(false); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este producto?")) return;
    try { await api.delete(`/api/products/${id}`); await loadProducts(); }
    catch { alert("No se pudo eliminar el producto."); }
  };

  // ── Usuarios (#16) ────────────────────────────────────────────────────────
  const handleToggleAdmin = async (u) => {
    const uIsAdmin = u.roles?.includes("ADMIN");
    const action = uIsAdmin ? "quitar" : "otorgar";
    if (!window.confirm(`¿${action} permisos de administrador a ${u.firstName} ${u.lastName}?`)) return;
    try {
      setTogglingUserId(u.id);
      if (uIsAdmin) { await api.delete(`/api/users/${u.id}/roles/admin`); }
      else          { await api.post(`/api/users/${u.id}/roles/admin`); }
      await loadUsers();
    } catch { alert("No se pudo cambiar el rol del usuario."); }
    finally { setTogglingUserId(null); }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  if (isMobile) return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 p-8">
      <div className="bg-white rounded shadow p-6 max-w-sm text-center">
        <p className="text-lg font-semibold text-gray-700">Panel no disponible en dispositivos móviles</p>
        <p className="text-sm text-gray-500 mt-2">Accedé desde una computadora para administrar el sitio.</p>
      </div>
    </main>
  );
  if (!isAdmin) return null;

  return (
    <main className="bg-gray-100 min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Panel de administración</h1>

        {/* ── PRODUCTOS ── */}
        <section className="bg-white p-4 rounded shadow space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{editingProduct ? `Editando: ${editingProduct.name}` : "Agregar producto"}</h2>
            {editingProduct && <button type="button" onClick={handleCancelEdit} className="text-sm text-gray-500 hover:text-gray-700 underline">Cancelar edición</button>}
          </div>
          {editingProduct && <div className="bg-amber-50 border border-amber-200 rounded px-3 py-2 text-sm text-amber-800">✏️ Estás editando un producto existente.</div>}
          {formError && <p className="text-sm text-red-600">{formError}</p>}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div><label className="block text-sm font-medium mb-1">Nombre *</label><input className="border rounded px-2 py-1 w-full" value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div><label className="block text-sm font-medium mb-1">Descripción</label><textarea className="border rounded px-2 py-1 w-full text-sm" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} /></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div><label className="block text-sm font-medium mb-1">Duración (min)</label><input type="number" min="1" className="border rounded px-2 py-1 w-full" value={durationMin} onChange={(e) => setDurationMin(e.target.value)} /></div>
              <div><label className="block text-sm font-medium mb-1">Precio desde</label><input type="number" min="0" className="border rounded px-2 py-1 w-full" value={priceFrom} onChange={(e) => setPriceFrom(e.target.value)} /></div>
              <div><label className="block text-sm font-medium mb-1">Categoría *</label>
                <select className="border rounded px-2 py-1 w-full text-sm" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                  <option value="">-- Seleccioná una categoría --</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <p className="block text-sm font-medium mb-1">Características incluidas</p>
              <div className="flex flex-wrap gap-2 text-sm">
                {features.length === 0 && <span className="text-gray-500">Primero creá características abajo.</span>}
                {features.map((f) => (
                  <label key={f.id} className="inline-flex items-center gap-1 border rounded-full px-3 py-1 cursor-pointer">
                    <input type="checkbox" className="mr-1" checked={selectedFeatures.includes(f.id)} onChange={() => toggleFeatureSelection(f.id)} />
                    <span>{iconDisplay(f.icon)}</span><span>{f.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <button type="submit" disabled={saving}
              className={`text-white px-4 py-1 rounded text-sm disabled:opacity-60 ${editingProduct ? "bg-orange-500 hover:bg-orange-600" : "bg-blue-600 hover:bg-blue-700"}`}>
              {saving ? "Guardando..." : editingProduct ? "Guardar cambios" : "Guardar producto"}
            </button>
          </form>
        </section>

        {/* ── CARACTERÍSTICAS ── */}
        <section className="bg-white p-4 rounded shadow space-y-3">
          <h2 className="text-lg font-semibold">Características</h2>
          {featureError && <p className="text-sm text-red-600">{featureError}</p>}
          <form onSubmit={handleSaveFeature} className="space-y-3">
            {editingFeature && (
              <div className="bg-amber-50 border border-amber-200 rounded px-3 py-2 text-sm text-amber-800 flex justify-between items-center">
                <span>✏️ Editando: <strong>{editingFeature.name}</strong></span>
                <button type="button" onClick={handleCancelFeature} className="underline text-gray-600 text-xs">Cancelar</button>
              </div>
            )}
            <div><label className="block text-sm font-medium mb-1">Nombre *</label><input className="border rounded px-2 py-1 w-full" value={featureName} onChange={(e) => setFeatureName(e.target.value)} /></div>
            <div><label className="block text-sm font-medium mb-1">Ícono (emoji o clave) *</label><input className="border rounded px-2 py-1 w-full" placeholder="Ej: 🧹" value={featureIcon} onChange={(e) => setFeatureIcon(e.target.value)} /></div>
            <button type="submit" disabled={savingFeature}
              className={`text-white px-4 py-1 rounded text-sm disabled:opacity-60 ${editingFeature ? "bg-orange-500 hover:bg-orange-600" : "bg-blue-600 hover:bg-blue-700"}`}>
              {savingFeature ? "Guardando..." : editingFeature ? "Guardar cambios" : "Agregar característica"}
            </button>
          </form>
          <div className="pt-3">
            <h3 className="font-semibold mb-2">Lista de características</h3>
            {features.length === 0 && <p className="text-sm text-gray-500">No hay características registradas.</p>}
            <ul className="space-y-2">
              {features.map((f) => (
                <li key={f.id} className={`border rounded px-3 py-2 flex justify-between items-center ${editingFeature?.id === f.id ? "bg-amber-50" : ""}`}>
                  <span className="flex items-center gap-2"><span className="text-lg">{iconDisplay(f.icon)}</span>{f.name}</span>
                  <div className="flex gap-3">
                    <button onClick={() => handleEditFeature(f)} className="text-blue-600 hover:underline text-sm">Editar</button>
                    <button onClick={() => handleDeleteFeature(f)} className="text-red-600 hover:underline text-sm">Eliminar</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── CATEGORÍAS ── */}
        <section className="bg-white p-4 rounded shadow space-y-3">
          <h2 className="text-lg font-semibold">Categorías</h2>
          {catError && <p className="text-sm text-red-600">{catError}</p>}
          <form onSubmit={handleSaveCategory} className="space-y-3">
            <div><label className="block text-sm font-medium mb-1">Nombre *</label><input className="border rounded px-2 py-1 w-full" value={catName} onChange={(e) => setCatName(e.target.value)} /></div>
            <div><label className="block text-sm font-medium mb-1">URL Imagen *</label><input className="border rounded px-2 py-1 w-full" placeholder="https://..." value={catImage} onChange={(e) => setCatImage(e.target.value)} /></div>
            <button type="submit" disabled={savingCategory} className="bg-blue-600 text-white px-4 py-1 rounded text-sm disabled:opacity-60">
              {savingCategory ? "Guardando..." : "Agregar categoría"}
            </button>
          </form>
          <div className="pt-3">
            <h3 className="font-semibold mb-2">Lista de categorías</h3>
            {categories.length === 0 && <p className="text-sm text-gray-500">No hay categorías registradas.</p>}
            <ul className="space-y-2">
              {categories.map((c) => (
                <li key={c.id} className="border rounded px-3 py-2 flex justify-between items-center">
                  <span className="text-sm font-medium">{c.name}</span>
                  <button onClick={() => handleDeleteCategory(c)} className="text-red-600 hover:underline text-sm">Eliminar</button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── GESTIÓN DE USUARIOS (#16) ── */}
        <section className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-3">Gestión de usuarios</h2>
          <p className="text-sm text-gray-500 mb-3">Otorgá o quitá permisos de administrador a los usuarios registrados.</p>
          {usersError && <p className="text-sm text-red-600">{usersError}</p>}
          {loadingUsers && <p className="text-sm text-gray-500">Cargando usuarios...</p>}
          {!loadingUsers && users.length === 0 && <p className="text-sm text-gray-500">No hay usuarios registrados.</p>}
          {!loadingUsers && users.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-2">Id</th>
                    <th className="text-left p-2">Nombre</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Roles</th>
                    <th className="text-left p-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const uIsAdmin = u.roles?.includes("ADMIN");
                    const isToggling = togglingUserId === u.id;
                    return (
                      <tr key={u.id} className="border-b">
                        <td className="p-2 text-gray-500">{u.id}</td>
                        <td className="p-2 font-medium">{u.firstName} {u.lastName}</td>
                        <td className="p-2 text-gray-500">{u.email}</td>
                        <td className="p-2">
                          <div className="flex gap-1 flex-wrap">
                            {u.roles?.map((r) => (
                              <span key={r} className={`text-xs px-2 py-0.5 rounded-full font-semibold ${r === "ADMIN" ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-600"}`}>
                                {r}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-2">
                          <button
                            onClick={() => handleToggleAdmin(u)}
                            disabled={isToggling}
                            className={`text-sm px-3 py-1 rounded disabled:opacity-50 ${uIsAdmin ? "bg-red-100 text-red-700 hover:bg-red-200" : "bg-green-100 text-green-700 hover:bg-green-200"}`}
                          >
                            {isToggling ? "..." : uIsAdmin ? "Quitar admin" : "Dar admin"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ── LISTA DE PRODUCTOS ── */}
        <section className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-3">Lista de productos</h2>
          {err && <p className="text-sm text-red-600 mb-2">{err}</p>}
          {loading && <p className="text-sm text-gray-500">Cargando...</p>}
          {!loading && products.length === 0 && <p className="text-sm text-gray-500">No hay productos registrados.</p>}
          {!loading && products.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-2">Id</th>
                    <th className="text-left p-2">Nombre</th>
                    <th className="text-left p-2">Categoría</th>
                    <th className="text-left p-2">Precio</th>
                    <th className="text-left p-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className={`border-b ${editingProduct?.id === p.id ? "bg-amber-50" : ""}`}>
                      <td className="p-2 text-gray-500">{p.id}</td>
                      <td className="p-2 font-medium">{p.name}</td>
                      <td className="p-2 text-gray-500">{p.category?.name || "—"}</td>
                      <td className="p-2 text-gray-500">{p.priceFrom ? `$${p.priceFrom.toLocaleString()}` : "—"}</td>
                      <td className="p-2 flex gap-3">
                        <button onClick={() => handleEditProduct(p)} className="text-blue-600 hover:underline">Editar</button>
                        <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline">Eliminar</button>
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
