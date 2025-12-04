import React, { useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import { api } from "../services/api";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function BookingCalendar({ productId }) {
  const [bookings, setBookings] = useState([]);
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
      try {
        const { data } = await api.get(`/api/bookings/product/${productId}`);
        setBookings(data || []);
      } catch (e) {
        console.error("Error cargando reservas del producto", e);
      }
    };
    load();
  }, [productId]);

  const disabledDates = bookings
    .filter((b) => !!b.date)
    .map((b) => new Date(b.date));

  const handleChange = (item) => {
    setRange([item.selection]);
  };

  return (
    <section className="bg-white rounded shadow p-5 space-y-3">
      <h2 className="text-lg font-semibold">Disponibilidad</h2>
      <p className="text-sm text-gray-600">
        Seleccioná un rango de fechas para tu reserva. Las fechas ocupadas aparecen bloqueadas.
      </p>

      <DateRange
        ranges={range}
        onChange={handleChange}
        disabledDates={disabledDates}
        minDate={new Date()}
        moveRangeOnFirstSelection={false}
      />
    </section>
  );
}

