package com.dgcars.backend.booking;

import com.dgcars.backend.email.EmailService;
import com.dgcars.backend.product.Product;
import com.dgcars.backend.product.ProductRepository;
import com.dgcars.backend.user.User;
import com.dgcars.backend.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepo;
    private final ProductRepository productRepo;
    private final UserRepository userRepo;
    private final EmailService emailService;

    public BookingService(BookingRepository bookingRepo,
                          ProductRepository productRepo,
                          UserRepository userRepo,
                          EmailService emailService) {
        this.bookingRepo = bookingRepo;
        this.productRepo = productRepo;
        this.userRepo = userRepo;
        this.emailService = emailService;
    }

    public Booking create(BookingRequest req) {
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

        if (bookingRepo.existsByDateAndTime(date, req.time)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "El horario " + req.time + " del " + req.date + " ya está reservado. Elegí otro turno.");
        }

        Booking b = new Booking();
        b.setProduct(product);
        b.setUser(user);
        b.setDate(date);
        b.setTime(req.time);
        b.setNotes(req.notes);

        Booking saved = bookingRepo.save(b);
        emailService.sendBookingConfirmation(saved);
        return saved;
    }

    public List<String> getOccupiedTimes(LocalDate date) {
        return bookingRepo.findOccupiedTimesByDate(date);
    }

    public List<Booking> getByUser(Long userId) {
        return bookingRepo.findByUserId(userId);
    }

    public List<Booking> getByProduct(Long productId) {
        return bookingRepo.findByProductId(productId);
    }
}
