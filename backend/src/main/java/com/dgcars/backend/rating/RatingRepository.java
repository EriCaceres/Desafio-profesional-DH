package com.dgcars.backend.rating;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    // Todas las reseñas de un producto
    List<Rating> findByProductIdOrderByDateDesc(Long productId);

    // Promedio de estrellas de un producto
    @Query("SELECT AVG(r.stars) FROM Rating r WHERE r.product.id = :productId")
    Optional<Double> findAverageStarsByProductId(@Param("productId") Long productId);

    // Verificar si el usuario ya calificó este producto
    boolean existsByProductIdAndUserId(Long productId, Long userId);

    // Verificar si el usuario tiene alguna reserva del producto (para habilitar el formulario)
    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.product.id = :productId AND b.user.id = :userId")
    boolean userHasBookingForProduct(@Param("productId") Long productId, @Param("userId") Long userId);
}
