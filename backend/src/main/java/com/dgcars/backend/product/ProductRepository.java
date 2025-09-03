package com.dgcars.backend.product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    boolean existsByNameIgnoreCase(String name);

    // H2: RAND(); (cuando pasemos a Postgres cambia a RANDOM())
    @Query(value = "SELECT * FROM products ORDER BY RAND() LIMIT ?1", nativeQuery = true)
    List<Product> random(int limit);
}
