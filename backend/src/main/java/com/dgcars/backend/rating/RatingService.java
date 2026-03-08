package com.dgcars.backend.rating;

import com.dgcars.backend.product.Product;
import com.dgcars.backend.product.ProductRepository;
import com.dgcars.backend.user.User;
import com.dgcars.backend.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class RatingService {

    private final RatingRepository ratingRepo;
    private final ProductRepository productRepo;
    private final UserRepository userRepo;

    public RatingService(RatingRepository ratingRepo,
                         ProductRepository productRepo,
                         UserRepository userRepo) {
        this.ratingRepo = ratingRepo;
        this.productRepo = productRepo;
        this.userRepo = userRepo;
    }

    public Map<String, Object> getByProduct(Long productId) {
        List<Rating> ratings = ratingRepo.findByProductIdOrderByDateDesc(productId);
        double average = ratingRepo.findAverageStarsByProductId(productId).orElse(0.0);
        average = Math.round(average * 10.0) / 10.0;
        return Map.of("ratings", ratings, "average", average, "total", ratings.size());
    }

    public Map<String, Boolean> canRate(Long productId, Long userId) {
        boolean hasBooking = ratingRepo.userHasBookingForProduct(productId, userId);
        boolean alreadyRated = ratingRepo.existsByProductIdAndUserId(productId, userId);
        return Map.of("canRate", hasBooking && !alreadyRated, "alreadyRated", alreadyRated);
    }

    public Rating create(RatingRequest req) {
        if (req.productId == null || req.userId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Faltan datos");
        }
        if (req.stars < 1 || req.stars > 5) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Las estrellas deben ser entre 1 y 5");
        }

        Product product = productRepo.findById(req.productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));

        User user = userRepo.findById(req.userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        if (!ratingRepo.userHasBookingForProduct(req.productId, req.userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Solo podés calificar servicios que hayas reservado");
        }

        if (ratingRepo.existsByProductIdAndUserId(req.productId, req.userId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya calificaste este servicio");
        }

        Rating r = new Rating();
        r.setProduct(product);
        r.setUser(user);
        r.setStars(req.stars);
        r.setComment(req.comment);
        r.setDate(LocalDate.now());

        return ratingRepo.save(r);
    }
}
