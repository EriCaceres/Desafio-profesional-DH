package com.dgcars.backend.booking;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin
public class BookingController {

    private final BookingService service;

    public BookingController(BookingService service) {
        this.service = service;
    }

    @PostMapping
    public Booking create(@RequestBody BookingRequest req) {
        return service.create(req);
    }

    @GetMapping("/occupied")
    public List<String> getOccupiedTimes(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return service.getOccupiedTimes(date);
    }

    @GetMapping("/user/{userId}")
    public List<Booking> listByUser(@PathVariable Long userId) {
        return service.getByUser(userId);
    }

    @GetMapping("/product/{productId}")
    public List<Booking> listByProduct(@PathVariable Long productId) {
        return service.getByProduct(productId);
    }
}
