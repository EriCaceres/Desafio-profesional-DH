package com.dgcars.backend.reservation;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*")
public class ReservationController {

    private final ReservationService service;

    public ReservationController(ReservationService service) {
        this.service = service;
    }

    // POST /api/reservations  — Crear reserva (#32)
    @PostMapping
    public ResponseEntity<?> create(@RequestBody ReservationDTO.Request req) {
        try {
            ReservationDTO.Response response = service.create(req);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Error inesperado al crear la reserva. Intentá de nuevo."));
        }
    }

    // GET /api/reservations/user/{userId}  — Historial del usuario (#33)
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReservationDTO.Response>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getByUser(userId));
    }

    // GET /api/reservations/blocked/{productId}  — Fechas bloqueadas para calendario (#30)
    @GetMapping("/blocked/{productId}")
    public ResponseEntity<List<ReservationDTO.BlockedDates>> getBlockedDates(@PathVariable Long productId) {
        return ResponseEntity.ok(service.getBlockedDates(productId));
    }
}
