import { useEffect, useState } from "react";
import { api } from "../services/api";
import BookingCalendar from "../components/BookingCalendar";
import ShareButton from "../components/ShareButton";
import ShareModal from "../components/ShareModal";
import "../styles/ProductDetail.css";
import { useNavigate, useParams, Link } from "react-router-dom";

const POLICIES = [
  {
    title: "Cancelación",
    description:
      "Podés cancelar tu reserva hasta 24 horas antes del turno sin cargo. Las cancelaciones tardías pueden tener un costo del 50% del servicio.",
  },
  {
    title: "Puntualidad",
    description:
      "Te pedimos llegar 10 minutos antes del turno. Si el retraso supera los 15 minutos, el turno puede ser reasignado.",
  },
  {
    title: "Estado del vehículo",
    description:
      "El vehículo debe estar vacío de objetos personales de valor. No nos responsabilizamos por objetos olvidados dentro del auto.",
  },
  {
    title: "Garantía del servicio",
    description:
      "Si no quedás conforme con el resultado, contactanos dentro de las 48 horas y lo revisamos sin costo adicional.",
  },
  {
    title: "Métodos de pago",
    description:
      "Aceptamos efectivo, transferencia bancaria y tarjetas de débito/crédito. El pago se realiza al finalizar el servicio.",
  },
  {
    title: "Seguridad",
    description:
      "Trabajamos con productos certificados y seguros para la pintura y tapizados de tu vehículo.",
  },
];

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/products/${id}`);
        setProduct(data);
        setErr("");
      } catch (e) {
        console.error(e);
        setErr("No se pudo cargar el servicio.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // #30 — chequeo de login al hacer clic en Reservar
  const handleReserve = () => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      // Redirigir a login con mensaje obligatorio y ruta de retorno
      navigate("/login", {
        state: {
          mandatory: true,
          from: `/products/${id}/booking`,
        },
      });
      return;
    }
    navigate(`/products/${id}/booking`);
  };

  // #27 — Abrir modal de compartir
  const handleShare = () => {
    setShareModalOpen(true);
  };

  if (loading) {
    return (
      <main className="pd">
        <div className="pd__container">
          <p className="pd__info">Cargando servicio...</p>
        </div>
      </main>
    );
  }

  if (err || !product) {
    return (
      <main className="pd">
        <div className="pd__container pd__container--center">
          <p className="pd__error">{err || "Servicio no encontrado."}</p>
          <Link to="/" className="pd__link-back">
            ← Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  const hasFeatures =
    Array.isArray(product.features) && product.features.length > 0;

  return (
    <main className="pd">
      <div className="pd__container">
        {/* Volver */}
        <div className="pd__top-bar">
          <Link to="/" className="pd__link-back">
            ← Volver al inicio
          </Link>
          {/* #27 - Botón compartir */}
          <ShareButton onClick={handleShare} />
        </div>

        {/* HEADER */}
        <section className="pd__header">
          <span className="pd__badge">Servicio de detailing</span>
          <h1 className="pd__title">{product.name}</h1>
          <div className="pd__meta">
            {product.durationMin != null && (
              <span>⏱ {product.durationMin} min</span>
            )}
            {product.priceFrom != null && (
              <span>💲 Desde ${product.priceFrom}</span>
            )}
          </div>
        </section>

        {/* CONTENIDO */}
        <section className="pd__content">
          {/* Columna izquierda */}
          <div className="pd__left">
            <section className="pd__card">
              <h2 className="pd__card-title">Descripción del servicio</h2>
              <p className="pd__card-text">{product.description}</p>
            </section>

            {/* RESEÑAS */}
            <section className="pd__card">
              <h2 className="pd__card-title">Reseñas</h2>
              <article className="pd__review-card">
                <div className="pd__review-header">
                  <span className="pd__review-user">Cliente frecuente</span>
                  <span className="pd__review-date">Nov 2025</span>
                </div>
                <div className="pd__review-rating">★★★★★</div>
                <p className="pd__review-text">
                  El auto quedó impecable, superaron mis expectativas.
                </p>
              </article>
              <article className="pd__review-card">
                <div className="pd__review-header">
                  <span className="pd__review-user">Nueva usuaria</span>
                  <span className="pd__review-date">Oct 2025</span>
                </div>
                <div className="pd__review-rating">★★★★☆</div>
                <p className="pd__review-text">
                  Muy buen servicio, volvería sin dudas.
                </p>
              </article>
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

            {/* POLÍTICAS (#26) */}
            <section className="pd__card pd__policies">
              <h2 className="pd__card-title pd__policies-title">
                Políticas del servicio
              </h2>
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
              <p className="pd__card-text">
                Seleccioná el rango de fechas para ver los turnos disponibles.
              </p>
              <div className="pd__calendar-wrapper">
                <BookingCalendar productId={product.id} />
              </div>
              <button
                type="button"
                className="pd__btn-reserve"
                onClick={handleReserve}
              >
                Reservar este servicio
              </button>
            </section>
          </aside>
        </section>
      </div>

      {/* #27 - Modal de compartir */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        product={product}
      />
    </main>
  );
}