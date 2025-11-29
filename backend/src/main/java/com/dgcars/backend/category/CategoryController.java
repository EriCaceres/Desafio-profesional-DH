package com.dgcars.backend.category;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin
public class CategoryController {

    private final CategoryRepository repo;

    public CategoryController(CategoryRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Category> list() {
        return repo.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Category create(@RequestBody Category c) {
        if (repo.findByName(c.getName()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nombre de categoría ya existe");
        }
        return repo.save(c);
    }
}
