import React, { useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import { api } from "../services/api";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "../styles/BookingCalendar.css";

// Fix timezone: "2025-03-18" parseado como UTC da el día anterior en UTC-3
// Parseamos la fecha como local (año, mes, día) para evitar el desfase
const parseLocalDate = (dateStr) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export default function BookingCalendar({ productId }) {
  const [bookings, setBookings] = useState([]);
  const [loadError, setLoadError] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const loadBookings = async () => {
    if (!productId) return;
    setLoadError(false);
    try {
      const { data } = await api.get(`/api/bookings/product/${productId}`);
      setBookings(data || []);
    } catch (e) {
      console.error("Error cargando reservas del producto", e);
      setLoadError(true);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [productId]);

  // Fechas con reserva — usando parseLocalDate para evitar desfase de timezone
  const disabledDates =
    bookings?.filter((b) => !!b.date).map((b) => parseLocalDate(b.date)) || [];

  // Deshabilitar domingos (día 0) — los sábados se aceptan pero solo 9:00 y 11:00
  const disabledDay = (date) => date.getDay() === 0;

  const handleChange = (item) => {
    const newRange = [item.selection];
    setRange(newRange);

    const selection = newRange[0];
    localStorage.setItem(
      "selectedBookingRange",
      JSON.stringify({
        startDate: selection.startDate,
        endDate: selection.endDate,
      })
    );
  };

  if (loadError) {
    return (
      <div className="bc bc--error">
        <p className="bc__error-msg">
          No se pudo obtener la disponibilidad en este momento.
        </p>
        <button className="bc__retry-btn" onClick={loadBookings}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="bc">
      <div className="bc__legend-row">
        {disabledDates.length > 0 && (
          <span className="bc__legend">
            <span className="bc__legend-dot bc__legend-dot--taken" /> Fecha ocupada
          </span>
        )}
        <span className="bc__legend">
          <span className="bc__legend-dot bc__legend-dot--closed" /> Cerrado
        </span>
      </div>
      <DateRange
        ranges={range}
        onChange={handleChange}
        disabledDates={disabledDates}
        disabledDay={disabledDay}
        minDate={new Date()}
        moveRangeOnFirstSelection={false}
      />
    </div>
  );
}
