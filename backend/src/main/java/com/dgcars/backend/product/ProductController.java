package com.dgcars.backend.product;

import com.dgcars.backend.category.Category;
import com.dgcars.backend.category.CategoryRepository;
import com.dgcars.backend.feature.Feature;
import com.dgcars.backend.feature.FeatureRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/products")
@CrossOrigin
public class ProductController {

    private final ProductRepository productRepo;
    private final CategoryRepository categoryRepo;
    private final FeatureRepository featureRepo;

    public ProductController(
            ProductRepository productRepo,
            CategoryRepository categoryRepo,
            FeatureRepository featureRepo
    ) {
        this.productRepo = productRepo;
        this.categoryRepo = categoryRepo;
        this.featureRepo = featureRepo;
    }

    @GetMapping
    public List<Product> list() {
        return productRepo.findAll();
    }
    @GetMapping("/search")
    public List<Product> search(@RequestParam String query) {
        if (query == null || query.trim().isEmpty()) {
            return productRepo.findAll();
        }

        String q = query.trim().toLowerCase();

        return productRepo.findAll().stream()
                .filter(p ->
                        (p.getName() != null && p.getName().toLowerCase().contains(q)) ||
                                (p.getDescription() != null && p.getDescription().toLowerCase().contains(q))
                )
                .toList();
    }

    @GetMapping("/{id}")
    public Product get(@PathVariable Long id) {
        return productRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Product create(@RequestBody ProductRequest request) {
        if (request.name == null || request.name.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre es obligatorio");
        }

        Product p = new Product();
        p.setName(request.name.trim());
        p.setDescription(request.description != null ? request.description.trim() : null);
        p.setDurationMin(request.durationMin);
        p.setPriceFrom(request.priceFrom);

        if (request.categoryId != null) {
            Category category = categoryRepo.findById(request.categoryId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Categoría no encontrada"));
            p.setCategory(category);
        }

        if (request.featureIds != null && !request.featureIds.isEmpty()) {
            List<Feature> features = featureRepo.findAllById(request.featureIds);
            Set<Feature> featureSet = new HashSet<>(features);
            p.getFeatures().addAll(featureSet);
        }

        return productRepo.save(p);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!productRepo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado");
        }
        productRepo.deleteById(id);
    }
}
