package com.dgcars.backend.feature;

import jakarta.persistence.*;

@Entity
@Table(name = "features")
public class Feature {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false, unique=true)
    private String name;

    @Column(nullable=false)
    private String icon;

    public Feature() {}

    public Feature(String name, String icon) {
        this.name = name;
        this.icon = icon;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getIcon() { return icon; }

    public void setName(String name) { this.name = name; }
    public void setIcon(String icon) { this.icon = icon; }
}
