package com.dgcars.backend.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Historial por usuario
    List<Booking> findByUserId(Long userId);

    // Reservas por producto
    List<Booking> findByProductId(Long productId);

    // Reservas de un producto dentro de un rango de fechas
    List<Booking> findByProductIdAndDateBetween(Long productId, LocalDate startDate, LocalDate endDate);

    // Horarios ya ocupados en una fecha (todo el taller, sin importar el producto)
    @Query("SELECT b.time FROM Booking b WHERE b.date = :date")
    List<String> findOccupiedTimesByDate(@Param("date") LocalDate date);

    // Verificar si ya existe una reserva en esa fecha y horario (cualquier producto)
    boolean existsByDateAndTime(LocalDate date, String time);
}
