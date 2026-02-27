import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../services/api";
import "../styles/BookingForm.css";

const HORARIOS_SEMANA = ["09:00", "11:00", "13:00", "15:00", "17:00"];
const HORARIOS_SABADO = ["09:00", "11:00"];

const getHorariosPorDia = (dateStr) => {
  if (!dateStr) return HORARIOS_SEMANA;
  const [y, m, d] = dateStr.split("-").map(Number);
  const dia = new Date(y, m - 1, d).getDay();
  if (dia === 0) return [];         // Domingo: cerrado
  if (dia === 6) return HORARIOS_SABADO; // Sábado: 9 y 11
  return HORARIOS_SEMANA;
};

const parseLocalDateStr = (raw) => {
  try {
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
    const d = new Date(raw);
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  } catch {
    return "";
  }
};

export default function BookingForm() {
  const { id } = useParams();
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

  // Horarios ocupados ese día en todo el taller
  const [horariosOcupados, setHorariosOcupados] = useState([]);
  const [loadingHorarios, setLoadingHorarios] = useState(false);

  // Cargar usuario
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) setUser(JSON.parse(raw));
    } catch { setUser(null); }
  }, []);

  // Cargar producto
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/products/${id}`);
        setProduct(data);
      } catch (e) {
        console.error(e);
        setError("No se pudo cargar el servicio.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Precargar fecha desde calendario
  useEffect(() => {
    try {
      const raw = localStorage.getItem("selectedBookingRange");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.startDate) {
        const fechaStr = parseLocalDateStr(parsed.startDate);
        setDate(fechaStr);
      }
    } catch {}
  }, []);

  // Consultar horarios ocupados cada vez que cambia la fecha
  useEffect(() => {
    if (!date || esDomingo(date)) {
      setHorariosOcupados([]);
      return;
    }
    const fetchOcupados = async () => {
      setLoadingHorarios(true);
      try {
        const { data } = await api.get(`/api/bookings/occupied?date=${date}`);
        setHorariosOcupados(Array.isArray(data) ? data : []);
      } catch {
        setHorariosOcupados([]); // Si falla, no bloqueamos nada
      } finally {
        setLoadingHorarios(false);
      }
    };
    fetchOcupados();
  }, [date]);

  const esDomingo = (dateStr) => {
    if (!dateStr) return false;
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d).getDay() === 0;
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    setTime(""); // resetear horario al cambiar fecha
  };

  const horariosPorDia = getHorariosPorDia(date);
  const esDom = esDomingo(date);

  // Cantidad de turnos libres para mostrar en el hint
  const turnosLibres = horariosPorDia.filter(h => !horariosOcupados.includes(h)).length;

  const getErrorMessage = (e) => {
    const status = e.response?.status;
    const msg = e.response?.data?.message;
    if (msg) return msg;
    if (status === 400) return "Los datos ingresados no son válidos.";
    if (status === 401 || status === 403) return "Tu sesión expiró. Volvé a iniciar sesión.";
    if (status === 409) return "Ese horario ya fue reservado. Elegí otro turno.";
    if (status >= 500) return "Error del servidor. Intentá de nuevo en unos minutos.";
    return "No se pudo confirmar la reserva. Verificá tu conexión.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!user?.id) { setError("Tenés que iniciar sesión para reservar."); return; }
    if (!date)     { setError("Seleccioná una fecha."); return; }
    if (esDom)     { setError("No trabajamos los domingos."); return; }
    if (!time)     { setError("Seleccioná un horario."); return; }
    if (horariosOcupados.includes(time)) {
      setError("Ese horario ya fue reservado. Elegí otro turno.");
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

  // ── Estados de carga / error ──────────────────────────────────────────────

  if (loading) return (
    <main className="bk"><div className="bk__container"><p className="bk__info">Cargando servicio...</p></div></main>
  );

  if (error && !product) return (
    <main className="bk">
      <div className="bk__container bk__container--center">
        <p className="bk__error">{error}</p>
        <Link to="/" className="bk__link-back">← Volver al inicio</Link>
      </div>
    </main>
  );

  if (success) return (
    <main className="bk">
      <div className="bk__container bk__container--center">
        <div className="bk__success-icon">✅</div>
        <h1 className="bk__title">¡Reserva confirmada!</h1>
        <p className="bk__info">Tu turno para <strong>{product?.name}</strong> fue registrado.</p>
        <div className="bk__success-detail">
          <p><strong>Fecha:</strong> {date}</p>
          <p><strong>Horario:</strong> {time} hs</p>
          {notes && <p><strong>Notas:</strong> {notes}</p>}
        </div>
        <p className="bk__info">Recibirás un correo con los detalles.</p>
        <div className="bk__success-actions">
          <button type="button" className="bk__btn-primary" onClick={() => navigate("/")}>Volver al inicio</button>
          <button type="button" className="bk__btn-secondary" onClick={() => navigate("/mis-reservas")}>Ver mis reservas</button>
        </div>
      </div>
    </main>
  );

  // ── Formulario principal ──────────────────────────────────────────────────

  return (
    <main className="bk">
      <div className="bk__container">
        <div className="bk__top-bar">
          <Link to={`/products/${id}`} className="bk__link-back">← Volver al detalle</Link>
        </div>

        <section className="bk__layout">
          {/* Panel lateral */}
          <aside className="bk__summary">
            <h2 className="bk__section-title">Detalle del servicio</h2>
            <p className="bk__service-name">{product?.name}</p>
            {product?.description && <p className="bk__service-desc">{product.description}</p>}
            <ul className="bk__service-meta">
              {product?.durationMin != null && <li>⏱ {product.durationMin} min</li>}
              {product?.priceFrom != null && <li>💲 Desde ${product.priceFrom}</li>}
            </ul>

            {user && (
              <div className="bk__user-info">
                <h2 className="bk__section-title">Tus datos</h2>
                <p><span className="bk__label">Nombre:</span> {user.firstName} {user.lastName}</p>
                <p><span className="bk__label">Email:</span> {user.email}</p>
              </div>
            )}

            <div className="bk__schedule-info">
              <h2 className="bk__section-title">Horarios del taller</h2>
              <p className="bk__schedule-row">🗓 Lun–Vie: 9:00 · 11:00 · 13:00 · 15:00 · 17:00</p>
              <p className="bk__schedule-row">🗓 Sábado: 9:00 · 11:00</p>
              <p className="bk__schedule-row bk__schedule-closed">✖ Domingo: cerrado</p>
            </div>
          </aside>

          {/* Formulario */}
          <section className="bk__form-card">
            <h1 className="bk__title">Confirmar reserva</h1>
            <p className="bk__subtitle">
              Un turno por horario. Si el horario aparece deshabilitado, ya fue reservado ese día.
            </p>

            {error && <p className="bk__error">{error}</p>}

            <form className="bk__form" onSubmit={handleSubmit}>

              {/* Fecha */}
              <div className="bk__field">
                <label htmlFor="date">Fecha</label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={handleDateChange}
                  required
                />
                {esDom && (
                  <span className="bk__field-hint bk__field-hint--error">
                    No trabajamos los domingos
                  </span>
                )}
              </div>

              {/* Horario */}
              <div className="bk__field">
                <label htmlFor="time">Horario</label>
                <select
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  disabled={!date || esDom || loadingHorarios}
                >
                  <option value="">
                    {loadingHorarios ? "Verificando disponibilidad..." : "-- Seleccioná un horario --"}
                  </option>
                  {horariosPorDia.map((h) => {
                    const ocupado = horariosOcupados.includes(h);
                    return (
                      <option key={h} value={h} disabled={ocupado}>
                        {h} hs {ocupado ? "— ocupado" : ""}
                      </option>
                    );
                  })}
                </select>

                {date && !esDom && !loadingHorarios && (
                  <span className={`bk__field-hint ${turnosLibres === 0 ? "bk__field-hint--error" : ""}`}>
                    {turnosLibres === 0
                      ? "No hay turnos disponibles este día"
                      : `${turnosLibres} turno${turnosLibres !== 1 ? "s" : ""} disponible${turnosLibres !== 1 ? "s" : ""}`}
                  </span>
                )}
              </div>

              {/* Notas */}
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
                disabled={saving || esDom || turnosLibres === 0}
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
