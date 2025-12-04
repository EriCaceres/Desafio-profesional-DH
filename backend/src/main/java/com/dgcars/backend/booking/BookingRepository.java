package com.dgcars.backend.booking;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Historial por usuario
    List<Booking> findByUserId(Long userId);

    // Reservas por producto
    List<Booking> findByProductId(Long productId);

    // Reservas de un producto dentro de un rango de fechas
    List<Booking> findByProductIdAndDateBetween(Long productId, LocalDate startDate, LocalDate endDate);
}


