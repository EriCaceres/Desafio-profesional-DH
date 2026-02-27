import { useEffect, useState } from "react";
import { api } from "../services/api";
import BookingCalendar from "../components/BookingCalendar";
import ShareButton from "../components/ShareButton";
import ShareModal from "../components/ShareModal";
import "../styles/ProductDetail.css";
import { useNavigate, useParams, Link } from "react-router-dom";

const POLICIES = [
  { title: "Cancelación", description: "Podés cancelar tu reserva hasta 24 horas antes del turno sin cargo. Las cancelaciones tardías pueden tener un costo del 50% del servicio." },
  { title: "Puntualidad", description: "Te pedimos llegar 10 minutos antes del turno. Si el retraso supera los 15 minutos, el turno puede ser reasignado." },
  { title: "Estado del vehículo", description: "El vehículo debe estar vacío de objetos personales de valor. No nos responsabilizamos por objetos olvidados dentro del auto." },
  { title: "Garantía del servicio", description: "Si no quedás conforme con el resultado, contactanos dentro de las 48 horas y lo revisamos sin costo adicional." },
  { title: "Métodos de pago", description: "Aceptamos efectivo, transferencia bancaria y tarjetas de débito/crédito. El pago se realiza al finalizar el servicio." },
  { title: "Seguridad", description: "Trabajamos con productos certificados y seguros para la pintura y tapizados de tu vehículo." },
];

// Componente de estrellas interactivo
function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="pd__star-picker">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          className={`pd__star-btn ${s <= (hover || value) ? "pd__star-btn--active" : ""}`}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(s)}
          aria-label={`${s} estrella${s !== 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
      {value > 0 && (
        <span className="pd__star-label">{value} / 5</span>
      )}
    </div>
  );
}

// Mostrar estrellas estáticas
function StarDisplay({ stars, size = "md" }) {
  return (
    <span className={`pd__stars pd__stars--${size}`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= stars ? "pd__star--filled" : "pd__star--empty"}>★</span>
      ))}
    </span>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Reseñas
  const [ratings, setRatings] = useState([]);
  const [average, setAverage] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loadingRatings, setLoadingRatings] = useState(true);

  // Formulario de reseña
  const [canRate, setCanRate] = useState(false);
  const [alreadyRated, setAlreadyRated] = useState(false);
  const [newStars, setNewStars] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ratingError, setRatingError] = useState("");
  const [ratingSuccess, setRatingSuccess] = useState(false);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")); }
    catch { return null; }
  })();

  // Cargar producto
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/products/${id}`);
        setProduct(data);
      } catch (e) {
        console.error(e);
        setErr("No se pudo cargar el servicio.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Cargar reseñas
  const loadRatings = async () => {
    try {
      setLoadingRatings(true);
      const { data } = await api.get(`/api/ratings/product/${id}`);
      setRatings(data.ratings || []);
      setAverage(data.average || 0);
      setTotalRatings(data.total || 0);
    } catch (e) {
      console.error("Error cargando reseñas:", e);
    } finally {
      setLoadingRatings(false);
    }
  };

  useEffect(() => { loadRatings(); }, [id]);

  // Verificar si el usuario puede calificar
  useEffect(() => {
    if (!user?.id) return;
    const check = async () => {
      try {
        const { data } = await api.get(`/api/ratings/can-rate?productId=${id}&userId=${user.id}`);
        setCanRate(data.canRate);
        setAlreadyRated(data.alreadyRated);
      } catch (e) {
        console.error("Error verificando permiso de calificación:", e);
      }
    };
    check();
  }, [id, user?.id]);

  const handleReserve = () => {
    if (!localStorage.getItem("user")) {
      navigate("/login", { state: { mandatory: true, from: `/products/${id}/booking` } });
      return;
    }
    navigate(`/products/${id}/booking`);
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    setRatingError("");

    if (newStars === 0) { setRatingError("Seleccioná una puntuación."); return; }

    try {
      setSubmitting(true);
      await api.post("/api/ratings", {
        productId: Number(id),
        userId: user.id,
        stars: newStars,
        comment: newComment,
      });
      setRatingSuccess(true);
      setNewStars(0);
      setNewComment("");
      setCanRate(false);
      setAlreadyRated(true);
      await loadRatings(); // refrescar lista
    } catch (e) {
      const msg = e.response?.data?.message;
      setRatingError(msg || "No se pudo enviar la reseña. Intentá de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Estados de carga ──────────────────────────────────────────────────────

  if (loading) return (
    <main className="pd"><div className="pd__container"><p className="pd__info">Cargando servicio...</p></div></main>
  );

  if (err || !product) return (
    <main className="pd">
      <div className="pd__container pd__container--center">
        <p className="pd__error">{err || "Servicio no encontrado."}</p>
        <Link to="/" className="pd__link-back">← Volver al inicio</Link>
      </div>
    </main>
  );

  const hasFeatures = Array.isArray(product.features) && product.features.length > 0;

  return (
    <main className="pd">
      <div className="pd__container">
        <div className="pd__top-bar">
          <Link to="/" className="pd__link-back">← Volver al inicio</Link>
          <ShareButton onClick={() => setShareModalOpen(true)} />
        </div>

        {/* HEADER */}
        <section className="pd__header">
          <span className="pd__badge">Servicio de detailing</span>
          <h1 className="pd__title">{product.name}</h1>
          <div className="pd__meta">
            {product.durationMin != null && <span>⏱ {product.durationMin} min</span>}
            {product.priceFrom != null && <span>💲 Desde ${product.priceFrom}</span>}
            {totalRatings > 0 && (
              <span className="pd__meta-rating">
                <StarDisplay stars={Math.round(average)} size="sm" />
                <span>{average} ({totalRatings} reseña{totalRatings !== 1 ? "s" : ""})</span>
              </span>
            )}
          </div>
        </section>

        {/* CONTENIDO */}
        <section className="pd__content">
          <div className="pd__left">

            {/* Descripción */}
            <section className="pd__card">
              <h2 className="pd__card-title">Descripción del servicio</h2>
              <p className="pd__card-text">{product.description}</p>
            </section>

            {/* RESEÑAS */}
            <section className="pd__card">
              <div className="pd__reviews-header">
                <h2 className="pd__card-title">Reseñas</h2>
                {totalRatings > 0 && (
                  <div className="pd__reviews-summary">
                    <span className="pd__reviews-avg">{average}</span>
                    <StarDisplay stars={Math.round(average)} size="lg" />
                    <span className="pd__reviews-count">{totalRatings} reseña{totalRatings !== 1 ? "s" : ""}</span>
                  </div>
                )}
              </div>

              {/* Lista de reseñas */}
              {loadingRatings ? (
                <p className="pd__info">Cargando reseñas...</p>
              ) : ratings.length === 0 ? (
                <p className="pd__info pd__info--muted">
                  Todavía no hay reseñas para este servicio. ¡Sé el primero en calificar!
                </p>
              ) : (
                <div className="pd__reviews-list">
                  {ratings.map((r) => (
                    <article key={r.id} className="pd__review-card">
                      <div className="pd__review-header">
                        <span className="pd__review-user">
                          {r.user?.firstName} {r.user?.lastName}
                        </span>
                        <span className="pd__review-date">
                          {new Date(r.date).toLocaleDateString("es-AR", { month: "short", year: "numeric" })}
                        </span>
                      </div>
                      <StarDisplay stars={r.stars} size="md" />
                      {r.comment && <p className="pd__review-text">{r.comment}</p>}
                    </article>
                  ))}
                </div>
              )}

              {/* Formulario de reseña */}
              {!user && (
                <p className="pd__info pd__info--muted">
                  <Link to="/login">Iniciá sesión</Link> para dejar tu reseña.
                </p>
              )}

              {user && alreadyRated && (
                <p className="pd__rating-done">✅ Ya calificaste este servicio.</p>
              )}

              {user && ratingSuccess && (
                <p className="pd__rating-done">✅ ¡Gracias por tu reseña!</p>
              )}

              {user && canRate && !ratingSuccess && (
                <form className="pd__rating-form" onSubmit={handleSubmitRating}>
                  <h3 className="pd__rating-form-title">Calificá este servicio</h3>

                  <div className="pd__field">
                    <label>Puntuación</label>
                    <StarPicker value={newStars} onChange={setNewStars} />
                  </div>

                  <div className="pd__field">
                    <label htmlFor="comment">Comentario (opcional)</label>
                    <textarea
                      id="comment"
                      rows={3}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Contanos tu experiencia..."
                    />
                  </div>

                  {ratingError && <p className="pd__error">{ratingError}</p>}

                  <button
                    type="submit"
                    className="pd__btn-rating"
                    disabled={submitting || newStars === 0}
                  >
                    {submitting ? "Enviando..." : "Enviar reseña"}
                  </button>
                </form>
              )}

              {user && !canRate && !alreadyRated && !ratingSuccess && (
                <p className="pd__info pd__info--muted">
                  Solo podés calificar servicios que hayas reservado.
                </p>
              )}
            </section>

            {/* CARACTERÍSTICAS */}
            {hasFeatures && (
              <section className="pd__card">
                <h2 className="pd__card-title">Incluye</h2>
                <ul className="pd__features">
                  {product.features.map((f) => (
                    <li key={f.id} className="pd__feature-item">
                      <span className="pd__feature-dot">•</span>
                      <span>{f.name}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* POLÍTICAS */}
            <section className="pd__card pd__policies">
              <h2 className="pd__card-title pd__policies-title">Políticas del servicio</h2>
              <div className="pd__policies-grid">
                {POLICIES.map((pol) => (
                  <div key={pol.title} className="pd__policy-item">
                    <h3 className="pd__policy-name">{pol.title}</h3>
                    <p className="pd__policy-desc">{pol.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Columna derecha */}
          <aside className="pd__right">
            <section className="pd__card pd__card--sticky">
              <h2 className="pd__card-title">Disponibilidad</h2>
              <p className="pd__card-text">Seleccioná el rango de fechas para ver los turnos disponibles.</p>
              <div className="pd__calendar-wrapper">
                <BookingCalendar productId={product.id} />
              </div>
              <button type="button" className="pd__btn-reserve" onClick={handleReserve}>
                Reservar este servicio
              </button>
            </section>
          </aside>
        </section>
      </div>

      <ShareModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} product={product} />
    </main>
  );
}
