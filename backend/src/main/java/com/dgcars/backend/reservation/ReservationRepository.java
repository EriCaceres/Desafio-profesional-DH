package com.dgcars.backend.reservation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // Todas las reservas de un usuario
    List<Reservation> findByUserIdOrderByStartDateDesc(Long userId);

    // Todas las reservas de un producto (para validar disponibilidad)
    List<Reservation> findByProductId(Long productId);

    // Verificar si hay solapamiento de fechas para un producto
    @Query("""
        SELECT COUNT(r) > 0 FROM Reservation r
        WHERE r.product.id = :productId
        AND r.startDate < :endDate
        AND r.endDate > :startDate
    """)
    boolean existsOverlap(
        @Param("productId") Long productId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );

    // Fechas ocupadas de un producto (para mostrar en el calendario)
    @Query("""
        SELECT r FROM Reservation r
        WHERE r.product.id = :productId
        AND r.endDate >= :today
    """)
    List<Reservation> findUpcomingByProductId(
        @Param("productId") Long productId,
        @Param("today") LocalDate today
    );
}
