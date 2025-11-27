package com.dgcars.backend.product;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductRepository repo;

    public ProductController(ProductRepository repo) {
        this.repo = repo;
    }

    // Crear producto
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Product create(@RequestBody Product p) {
        if (p.getName() == null || p.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre es obligatorio");
        }
        String name = p.getName().trim();
        if (name.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre es obligatorio");
        }
        p.setName(name);
        if (repo.existsByNameIgnoreCase(name)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre ya está en uso");
        }
        try {
            return repo.save(p);
        } catch (DataIntegrityViolationException e) {
            // por si entró "Lavado Premium " o mayúsculas/minúsculas distintas, etc.
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre ya está en uso");
        }
    }


    // Listar
    @GetMapping
    public List<Product> list() {
        return repo.findAll();
    }

    // Aleatorios (máx 10)
    @GetMapping("/random")
    public List<Product> random(@RequestParam(defaultValue = "10") int limit) {
        if (limit > 10) limit = 10;
        return repo.random(limit);
    }

    // Detalle por id
    @GetMapping("/{id}")
    public Product get(@PathVariable Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No existe"));
    }

    // Eliminar
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
