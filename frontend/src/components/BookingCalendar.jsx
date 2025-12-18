import React, { useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import { api } from "../services/api";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "../styles/BookingCalendar.css";

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

  const disabledDates =
    bookings?.filter((b) => !!b.date).map((b) => new Date(b.date)) || [];

  const handleChange = (item) => {
    const newRange = [item.selection];
    setRange(newRange);

    // 👉 Guardamos el rango en localStorage para usarlo en BookingForm
    const selection = newRange[0];
    localStorage.setItem(
      "selectedBookingRange",
      JSON.stringify({
        startDate: selection.startDate,
        endDate: selection.endDate,
      })
    );
  };

  return (
    <div className="bc">
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



