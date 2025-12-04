package com.dgcars.backend.product;

import com.dgcars.backend.booking.Booking;
import com.dgcars.backend.booking.BookingRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@CrossOrigin
public class ProductAvailabilityController {

    private final ProductRepository productRepo;
    private final BookingRepository bookingRepo;

    public ProductAvailabilityController(ProductRepository productRepo, BookingRepository bookingRepo) {
        this.productRepo = productRepo;
        this.bookingRepo = bookingRepo;
    }

    @GetMapping("/available")
    public List<Product> getAvailableProducts(
            @RequestParam String startDate,
            @RequestParam String endDate
    ) {
        LocalDate start;
        LocalDate end;

        try {
            start = LocalDate.parse(startDate);
            end = LocalDate.parse(endDate);
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Fechas inválidas. Usá formato yyyy-MM-dd"
            );
        }

        if (end.isBefore(start)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La fecha final no puede ser anterior a la inicial"
            );
        }

        List<Product> allProducts = productRepo.findAll();

        return allProducts.stream()
                .filter(p -> isProductAvailableInRange(p.getId(), start, end))
                .collect(Collectors.toList());
    }

    private boolean isProductAvailableInRange(Long productId, LocalDate start, LocalDate end) {
        List<Booking> bookings = bookingRepo.findByProductIdAndDateBetween(productId, start, end);

        // Si NO hay reservas en ese rango, el producto está disponible
        return bookings.isEmpty();
    }
}
