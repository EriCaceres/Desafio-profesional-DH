package com.dgcars.backend.booking;

import com.dgcars.backend.product.Product;
import com.dgcars.backend.product.ProductRepository;
import com.dgcars.backend.user.User;
import com.dgcars.backend.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin
public class BookingController {

    private final BookingRepository bookingRepo;
    private final ProductRepository productRepo;
    private final UserRepository userRepo;

    public BookingController(
            BookingRepository bookingRepo,
            ProductRepository productRepo,
            UserRepository userRepo
    ) {
        this.bookingRepo = bookingRepo;
        this.productRepo = productRepo;
        this.userRepo = userRepo;
    }

    // ================== CREAR RESERVA ==================

    @PostMapping
    public Booking create(@RequestBody BookingRequest req) {
        if (req.productId == null || req.userId == null || req.date == null || req.date.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Faltan datos obligatorios de la reserva");
        }

        Product product = productRepo.findById(req.productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Producto no encontrado"));

        User user = userRepo.findById(req.userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Usuario no encontrado"));

        LocalDate date;
        try {
            date = LocalDate.parse(req.date);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Fecha de reserva inválida (usar formato yyyy-MM-dd)");
        }

        Booking b = new Booking();
        b.setProduct(product);
        b.setUser(user);
        b.setDate(date);
        b.setTime(req.time);
        b.setNotes(req.notes);

        return bookingRepo.save(b);
    }

    // ================== HISTORIAL POR USUARIO ==================

    @GetMapping("/user/{userId}")
    public List<Booking> listByUser(@PathVariable Long userId) {
        return bookingRepo.findByUserId(userId);
    }

    // ================== RESERVAS POR PRODUCTO ==================

    @GetMapping("/product/{productId}")
    public List<Booking> listByProduct(@PathVariable Long productId) {
        return bookingRepo.findByProductId(productId);
    }
}

