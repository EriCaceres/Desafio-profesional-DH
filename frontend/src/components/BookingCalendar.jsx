import React, { useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import { api } from "../services/api";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "../styles/BookingCalendar.css";

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

  useEffect(() => {
    const load = async () => {
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
    load();
  }, [productId]);

  const disabledDates =
    bookings?.filter((b) => !!b.date).map((b) => new Date(b.date)) || [];

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
        <button
          className="bc__retry-btn"
          onClick={() => {
            setLoadError(false);
            setBookings([]);
            // Re-trigger useEffect
            const load = async () => {
              try {
                const { data } = await api.get(`/api/bookings/product/${productId}`);
                setBookings(data || []);
              } catch {
                setLoadError(true);
              }
            };
            load();
          }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="bc">
      {disabledDates.length > 0 && (
        <p className="bc__legend">
          <span className="bc__legend-dot bc__legend-dot--taken" /> Fecha ocupada
        </p>
      )}
      <DateRange
        ranges={range}
        onChange={handleChange}
        disabledDates={disabledDates}
        minDate={new Date()}
        moveRangeOnFirstSelection={false}
      />
    </div>
  );
}



