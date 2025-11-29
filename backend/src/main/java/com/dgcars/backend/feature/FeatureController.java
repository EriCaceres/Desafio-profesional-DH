package com.dgcars.backend.feature;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/features")
@CrossOrigin
public class FeatureController {

    private final FeatureRepository repo;

    public FeatureController(FeatureRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Feature> list() {
        return repo.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Feature create(@RequestBody Feature f) {
        if (repo.findByName(f.getName()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nombre de característica ya existe");
        }
        return repo.save(f);
    }
}
