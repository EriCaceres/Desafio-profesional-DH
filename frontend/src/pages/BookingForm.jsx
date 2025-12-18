import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../services/api";
import "../styles/BookingForm.css";

export default function BookingForm() {
  const { id } = useParams(); // productId
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Cargar datos del producto
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/products/${id}`);
        setProduct(data);
        setError("");
      } catch (e) {
        console.error(e);
        setError("No se pudo cargar el servicio.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Intentar precargar fecha desde el calendario (localStorage)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("selectedBookingRange");
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (parsed?.startDate) {
        const d = new Date(parsed.startDate);
        // yyyy-mm-dd
        const iso = d.toISOString().slice(0, 10);
        setDate(iso);
      }
    } catch {
      // ignoramos si falla
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!date || !time) {
      setError("Seleccioná fecha y horario para la reserva.");
      return;
    }

    try {
      setSaving(true);

let userId = null;
try {
  const rawUser = localStorage.getItem("user");
  if (rawUser) {
    const user = JSON.parse(rawUser);
    userId = user.id;
  }
} catch (e) {
  console.error("No se pudo leer el usuario de localStorage", e);
}

if (!userId) {
  setError("Tenés que iniciar sesión para reservar un turno.");
  setSaving(false);
  return;
}

// Payload que espera el backend (BookingRequest)
const payload = {
  productId: Number(id),
  userId,
  date,
  time,
  notes,
};

await api.post("/api/bookings", payload);

      setSuccess(true);
    } catch (e) {
      console.error(e);
      setError("No se pudo confirmar la reserva. Probá de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="bk">
        <div className="bk__container">
          <p className="bk__info">Cargando servicio...</p>
        </div>
      </main>
    );
  }

  if (error && !product && !success) {
    return (
      <main className="bk">
        <div className="bk__container bk__container--center">
          <p className="bk__error">{error}</p>
          <Link to="/" className="bk__link-back">
            ← Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  // Vista de éxito
  if (success) {
    return (
      <main className="bk">
        <div className="bk__container bk__container--center">
          <h1 className="bk__title">¡Reserva confirmada!</h1>
          <p className="bk__info">
            Tu turno para <strong>{product?.name}</strong> fue registrado.
          </p>
          <p className="bk__info">
            Recibirás novedades por correo cuando el administrador la procese.
          </p>
          <button
            type="button"
            className="bk__btn-primary"
            onClick={() => navigate("/")}
          >
            Volver al inicio
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="bk">
      <div className="bk__container">
        {/* Volver */}
        <div className="bk__top-bar">
          <Link to={`/products/${id}`} className="bk__link-back">
            ← Volver al detalle
          </Link>
        </div>

        {/* Layout en dos columnas */}
        <section className="bk__layout">
          {/* Resumen del servicio */}
          <aside className="bk__summary">
            <h2 className="bk__section-title">Detalle del servicio</h2>
            <p className="bk__service-name">{product?.name}</p>
            {product?.description && (
              <p className="bk__service-desc">{product.description}</p>
            )}
            <ul className="bk__service-meta">
              {product?.durationMin != null && (
                <li>⏱ {product.durationMin} min</li>
              )}
              {product?.priceFrom != null && (
                <li>💲 Desde ${product.priceFrom}</li>
              )}
            </ul>
          </aside>

          {/* Formulario */}
          <section className="bk__form-card">
            <h1 className="bk__title">Confirmar reserva</h1>
            <p className="bk__subtitle">
              Completá los datos para reservar tu turno. La fecha seleccionada
              viene del calendario, pero podés modificarla.
            </p>

            {error && <p className="bk__error">{error}</p>}

            <form className="bk__form" onSubmit={handleSubmit}>
              <div className="bk__field">
                <label htmlFor="date">Fecha</label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="bk__field">
                <label htmlFor="time">Horario</label>
                <input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>

              <div className="bk__field">
                <label htmlFor="notes">Notas (opcional)</label>
                <textarea
                  id="notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: auto muy sucio, pelos de mascota, etc."
                />
              </div>

              <button
                type="submit"
                className="bk__btn-primary"
                disabled={saving}
              >
                {saving ? "Guardando..." : "Confirmar reserva"}
              </button>
            </form>
          </section>
        </section>
      </div>
    </main>
  );
}
