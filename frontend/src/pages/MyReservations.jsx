import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";
import "../styles/MyReservations.css";

export default function MyReservations() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      navigate("/login", { state: { mandatory: true, from: "/mis-reservas" } });
      return;
    }
    const user = JSON.parse(stored);
    const load = async () => {
      try {
        const { data } = await api.get(`/api/bookings/user/${user.id}`);
        setReservations(data);
      } catch {
        setError("No se pudieron cargar tus reservas.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [navigate]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const isUpcoming = (date) => new Date(date) >= new Date();

  return (
    <main className="mr">
      <div className="mr__container">
        <div className="mr__top-bar">
          <Link to="/" className="mr__link-back">← Volver al inicio</Link>
        </div>

        <h1 className="mr__title">Mis reservas</h1>

        {!loading && !error && (
          <p className="mr__subtitle">
            {reservations.length === 0
              ? "No tenés reservas todavía."
              : `${reservations.length} reserva${reservations.length !== 1 ? "s" : ""} registrada${reservations.length !== 1 ? "s" : ""}`}
          </p>
        )}

        {loading && <p className="mr__info">Cargando tus reservas...</p>}
        {error && <p className="mr__error">{error}</p>}

        {!loading && !error && reservations.length === 0 && (
          <div className="mr__empty">
            <Link to="/" className="mr__btn mr__btn--primary">Explorar servicios</Link>
          </div>
        )}

        {!loading && reservations.length > 0 && (
          <div className="mr__list">
            {reservations.map((r) => (
              <article
                key={r.id}
                className={`mr__card ${isUpcoming(r.date) ? "mr__card--upcoming" : "mr__card--past"}`}
              >
                <div className="mr__card-header">
                  <h2 className="mr__product-name">{r.product?.name || "Servicio"}</h2>
                  <span className={`mr__badge ${isUpcoming(r.date) ? "mr__badge--upcoming" : "mr__badge--past"}`}>
                    {isUpcoming(r.date) ? "Próxima" : "Finalizada"}
                  </span>
                </div>

                <div className="mr__card-body">
                  <div className="mr__info-row">
                    <span className="mr__info-label">📅 Fecha</span>
                    <span className="mr__info-value">{formatDate(r.date)}</span>
                  </div>
                  {r.time && (
                    <div className="mr__info-row">
                      <span className="mr__info-label">🕐 Horario</span>
                      <span className="mr__info-value">{r.time}</span>
                    </div>
                  )}
                  {r.product?.priceFrom && (
                    <div className="mr__info-row">
                      <span className="mr__info-label">💲 Precio desde</span>
                      <span className="mr__info-value">${r.product.priceFrom.toLocaleString()}</span>
                    </div>
                  )}
                  {r.product?.durationMin && (
                    <div className="mr__info-row">
                      <span className="mr__info-label">⏱ Duración</span>
                      <span className="mr__info-value">{r.product.durationMin} min</span>
                    </div>
                  )}
                  {r.notes && (
                    <div className="mr__info-row">
                      <span className="mr__info-label">📝 Notas</span>
                      <span className="mr__info-value">{r.notes}</span>
                    </div>
                  )}
                </div>

                <div className="mr__card-footer">
                  <Link to={`/products/${r.product?.id}`} className="mr__btn mr__btn--secondary">
                    Ver servicio
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
