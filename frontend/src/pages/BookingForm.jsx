import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../services/api";
import "../styles/BookingForm.css";

export default function BookingForm() {
  const { id } = useParams(); // productId
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Cargar usuario desde localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) setUser(JSON.parse(raw));
    } catch {
      setUser(null);
    }
  }, []);

  // Cargar producto
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/products/${id}`);
        setProduct(data);
        setError("");
      } catch (e) {
        console.error(e);
        setError("No se pudo cargar el servicio. Intentá de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Precargar fecha desde el calendario (localStorage)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("selectedBookingRange");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.startDate) {
        setDate(new Date(parsed.startDate).toISOString().slice(0, 10));
      }
    } catch {
      // ignoramos si falla
    }
  }, []);

  const getErrorMessage = (e) => {
    const status = e.response?.status;
    const msg    = e.response?.data?.message;

    if (msg) return msg;
    if (status === 400) return "Los datos ingresados no son válidos. Revisá la fecha y el horario.";
    if (status === 401 || status === 403) return "Tu sesión expiró. Volvé a iniciar sesión.";
    if (status === 409) return "Esa fecha y horario ya están reservados. Elegí otro turno.";
    if (status >= 500) return "Error del servidor. Intentá de nuevo en unos minutos.";
    return "No se pudo confirmar la reserva. Verificá tu conexión y probá de nuevo.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!user?.id) {
      setError("Tenés que iniciar sesión para reservar un turno.");
      return;
    }
    if (!date) {
      setError("Seleccioná una fecha para la reserva.");
      return;
    }
    if (!time) {
      setError("Seleccioná un horario para la reserva.");
      return;
    }

    try {
      setSaving(true);
      await api.post("/api/bookings", {
        productId: Number(id),
        userId: user.id,
        date,
        time,
        notes,
      });
      setSuccess(true);
    } catch (e) {
      console.error(e);
      setError(getErrorMessage(e));
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

  if (error && !product) {
    return (
      <main className="bk">
        <div className="bk__container bk__container--center">
          <p className="bk__error">{error}</p>
          <Link to="/" className="bk__link-back">← Volver al inicio</Link>
        </div>
      </main>
    );
  }

  // #32 — Página de confirmación
  if (success) {
    return (
      <main className="bk">
        <div className="bk__container bk__container--center">
          <div className="bk__success-icon">✅</div>
          <h1 className="bk__title">¡Reserva confirmada!</h1>
          <p className="bk__info">
            Tu turno para <strong>{product?.name}</strong> fue registrado exitosamente.
          </p>
          <div className="bk__success-detail">
            <p><strong>Fecha:</strong> {date}</p>
            <p><strong>Horario:</strong> {time}</p>
            {notes && <p><strong>Notas:</strong> {notes}</p>}
          </div>
          <p className="bk__info">
            Recibirás un correo con los detalles de tu reserva.
          </p>
          <div className="bk__success-actions">
            <button
              type="button"
              className="bk__btn-primary"
              onClick={() => navigate("/")}
            >
              Volver al inicio
            </button>
            <button
              type="button"
              className="bk__btn-secondary"
              onClick={() => navigate("/mis-reservas")}
            >
              Ver mis reservas
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bk">
      <div className="bk__container">
        <div className="bk__top-bar">
          <Link to={`/products/${id}`} className="bk__link-back">
            ← Volver al detalle
          </Link>
        </div>

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

            {/* #31 — Datos del usuario */}
            {user && (
              <div className="bk__user-info">
                <h2 className="bk__section-title">Tus datos</h2>
                <p><span className="bk__label">Nombre:</span> {user.firstName} {user.lastName}</p>
                <p><span className="bk__label">Email:</span> {user.email}</p>
              </div>
            )}
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
                  min={new Date().toISOString().slice(0, 10)}
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