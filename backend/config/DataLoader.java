package com.dgcars.backend.config;

import com.dgcars.backend.category.Category;
import com.dgcars.backend.category.CategoryRepository;
import com.dgcars.backend.product.Product;
import com.dgcars.backend.product.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

//@Component//
public class DataLoader implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public DataLoader(CategoryRepository categoryRepository,
                      ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        System.out.println(">>> DataLoader: inicio");

        // Si ya hay productos, no vuelvo a cargar
        if (productRepository.count() > 0) {
            System.out.println(">>> DataLoader: ya hay productos, no hago nada");
            return;
        }

        // ---------- Categorías ----------
        Category lavadoExterior = new Category();
        lavadoExterior.setName("Lavado exterior");

        Category interior = new Category();
        interior.setName("Detail interior");

        Category fullService = new Category();
        fullService.setName("Full service");

        categoryRepository.save(lavadoExterior);
        categoryRepository.save(interior);
        categoryRepository.save(fullService);

        // ---------- Productos ----------
        Product p1 = new Product();
        p1.setName("Lavado Premium");
        p1.setDescription("Exterior + Interior");
        p1.setDurationMin(90);
        p1.setPriceFrom(20000);
        p1.setCategory(fullService);

        Product p2 = new Product();
        p2.setName("Lavado Express");
        p2.setDescription("Lavado exterior rápido");
        p2.setDurationMin(30);
        p2.setPriceFrom(8000);
        p2.setCategory(lavadoExterior);

        Product p3 = new Product();
        p3.setName("Detail Interior");
        p3.setDescription("Limpieza profunda de tapizados y plásticos");
        p3.setDurationMin(150);
        p3.setPriceFrom(55000);
        p3.setCategory(interior);

        Product p4 = new Product();
        p4.setName("Lavado Completo");
        p4.setDescription("Exterior + Interior con aspirado");
        p4.setDurationMin(60);
        p4.setPriceFrom(15000);
        p4.setCategory(fullService);

        productRepository.save(p1);
        productRepository.save(p2);
        productRepository.save(p3);
        productRepository.save(p4);

        System.out.println(">>> DataLoader: datos cargados");
    }
}

