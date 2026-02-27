package com.dgcars.backend.booking;

import com.dgcars.backend.product.Product;
import com.dgcars.backend.user.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;

    private String time;

    @Column(columnDefinition = "TEXT")
    private String notes;

    // ✅ Evita recursión infinita: no serializa las reservas del producto
    @ManyToOne(optional = false)
    @JoinColumn(name = "product_id")
    @JsonIgnoreProperties({"features", "bookings"})
    private Product product;

    // ✅ Evita recursión infinita: no serializa las reservas ni la contraseña del usuario
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"bookings", "roles", "password"})
    private User user;

    public Booking() {}

    public Long getId() { return id; }
    public LocalDate getDate() { return date; }
    public String getTime() { return time; }
    public String getNotes() { return notes; }
    public Product getProduct() { return product; }
    public User getUser() { return user; }

    public void setDate(LocalDate date) { this.date = date; }
    public void setTime(String time) { this.time = time; }
    public void setNotes(String notes) { this.notes = notes; }
    public void setProduct(Product product) { this.product = product; }
    public void setUser(User user) { this.user = user; }
}
