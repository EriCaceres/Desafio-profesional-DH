package com.dgcars.backend.booking;

import com.dgcars.backend.email.EmailService;
import com.dgcars.backend.product.Product;
import com.dgcars.backend.product.ProductRepository;
import com.dgcars.backend.user.User;
import com.dgcars.backend.user.UserRepository;
import org.springframework.format.annotation.DateTimeFormat;
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
    private final EmailService emailService;

    public BookingController(
            BookingRepository bookingRepo,
            ProductRepository productRepo,
            UserRepository userRepo,
            EmailService emailService
    ) {
        this.bookingRepo = bookingRepo;
        this.productRepo = productRepo;
        this.userRepo = userRepo;
        this.emailService = emailService;
    }

    // ================== CREAR RESERVA ==================
    @PostMapping
    public Booking create(@RequestBody BookingRequest req) {
        if (req.productId == null || req.userId == null || req.date == null || req.date.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Faltan datos obligatorios de la reserva");
        }
        if (req.time == null || req.time.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El horario es obligatorio");
        }

        Product product = productRepo.findById(req.productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Producto no encontrado"));

        User user = userRepo.findById(req.userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Usuario no encontrado"));

        LocalDate date;
        try {
            date = LocalDate.parse(req.date);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Fecha inválida (usar formato yyyy-MM-dd)");
        }

        // ✅ Validar que el horario no esté ocupado ese día (todo el taller)
        if (bookingRepo.existsByDateAndTime(date, req.time)) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "El horario " + req.time + " del " + req.date + " ya está reservado. Elegí otro turno."
            );
        }

        Booking b = new Booking();
        b.setProduct(product);
        b.setUser(user);
        b.setDate(date);
        b.setTime(req.time);
        b.setNotes(req.notes);

        Booking saved = bookingRepo.save(b);

        // Enviar email de confirmación (no interrumpe si falla)
        emailService.sendBookingConfirmation(saved);

        return saved;
    }

    // ================== HORARIOS OCUPADOS EN UNA FECHA ==================
    // Usado por el frontend para deshabilitar horarios ya tomados
    // Público: no requiere autenticación
    @GetMapping("/occupied")
    public List<String> getOccupiedTimes(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return bookingRepo.findOccupiedTimesByDate(date);
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
