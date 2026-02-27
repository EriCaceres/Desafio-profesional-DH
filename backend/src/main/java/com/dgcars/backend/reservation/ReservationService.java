package com.dgcars.backend.reservation;

import com.dgcars.backend.product.Product;
import com.dgcars.backend.product.ProductRepository;
import com.dgcars.backend.user.User;
import com.dgcars.backend.user.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepo;
    private final UserRepository userRepo;
    private final ProductRepository productRepo;

    public ReservationService(ReservationRepository reservationRepo,
                               UserRepository userRepo,
                               ProductRepository productRepo) {
        this.reservationRepo = reservationRepo;
        this.userRepo = userRepo;
        this.productRepo = productRepo;
    }

    // Crear reserva
    public ReservationDTO.Response create(ReservationDTO.Request req) {
        // Validaciones básicas
        if (req.getStartDate() == null || req.getEndDate() == null) {
            throw new IllegalArgumentException("Las fechas son obligatorias.");
        }
        if (!req.getStartDate().isBefore(req.getEndDate())) {
            throw new IllegalArgumentException("La fecha de inicio debe ser anterior a la fecha de fin.");
        }
        if (req.getStartDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("No se pueden reservar fechas pasadas.");
        }

        // Verificar solapamiento
        boolean overlap = reservationRepo.existsOverlap(
            req.getProductId(), req.getStartDate(), req.getEndDate()
        );
        if (overlap) {
            throw new IllegalStateException("El rango de fechas seleccionado ya está reservado. Por favor elegí otras fechas.");
        }

        User user = userRepo.findById(req.getUserId())
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado."));
        Product product = productRepo.findById(req.getProductId())
            .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado."));

        Reservation reservation = new Reservation(user, product, req.getStartDate(), req.getEndDate());
        Reservation saved = reservationRepo.save(reservation);
        return new ReservationDTO.Response(saved);
    }

    // Historial de un usuario (#33)
    public List<ReservationDTO.Response> getByUser(Long userId) {
        return reservationRepo.findByUserIdOrderByStartDateDesc(userId)
            .stream()
            .map(ReservationDTO.Response::new)
            .toList();
    }

    // Fechas bloqueadas de un producto (para el calendario)
    public List<ReservationDTO.BlockedDates> getBlockedDates(Long productId) {
        return reservationRepo.findUpcomingByProductId(productId, LocalDate.now())
            .stream()
            .map(r -> new ReservationDTO.BlockedDates(r.getStartDate(), r.getEndDate()))
            .toList();
    }
}
