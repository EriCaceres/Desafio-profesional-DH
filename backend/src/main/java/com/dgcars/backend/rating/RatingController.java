package com.dgcars.backend.rating;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ratings")
@CrossOrigin
public class RatingController {

    private final RatingService service;

    public RatingController(RatingService service) {
        this.service = service;
    }

    @GetMapping("/product/{productId}")
    public Map<String, Object> getByProduct(@PathVariable Long productId) {
        return service.getByProduct(productId);
    }

    @GetMapping("/can-rate")
    public Map<String, Boolean> canRate(@RequestParam Long productId, @RequestParam Long userId) {
        return service.canRate(productId, userId);
    }

    @PostMapping
    public Rating create(@RequestBody RatingRequest req) {
        return service.create(req);
    }
}
