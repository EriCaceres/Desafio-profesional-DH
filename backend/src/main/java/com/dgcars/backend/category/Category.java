package com.dgcars.backend.category;

import jakarta.persistence.*;

@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false, unique=true, length = 100)
    private String name;

    @Column(nullable=false)
    private String image; // URL de la foto de la categoría (Sprint 4 se mejora)

    public Category() {}

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getImage() { return image; }

    public void setName(String name) { this.name = name; }
    public void setImage(String image) { this.image = image; }
}
