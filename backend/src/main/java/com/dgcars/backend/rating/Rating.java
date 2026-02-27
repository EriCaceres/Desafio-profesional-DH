package com.dgcars.backend.rating;

import com.dgcars.backend.product.Product;
import com.dgcars.backend.user.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "ratings")
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int stars; // 1 a 5

    @Column(columnDefinition = "TEXT")
    private String comment;

    private LocalDate date;

    @ManyToOne(optional = false)
    @JoinColumn(name = "product_id")
    @JsonIgnoreProperties({"features", "bookings", "ratings"})
    private Product product;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"bookings", "ratings", "roles", "password"})
    private User user;

    public Rating() {}

    public Long getId() { return id; }
    public int getStars() { return stars; }
    public String getComment() { return comment; }
    public LocalDate getDate() { return date; }
    public Product getProduct() { return product; }
    public User getUser() { return user; }

    public void setStars(int stars) { this.stars = stars; }
    public void setComment(String comment) { this.comment = comment; }
    public void setDate(LocalDate date) { this.date = date; }
    public void setProduct(Product product) { this.product = product; }
    public void setUser(User user) { this.user = user; }
}
