package com.dgcars.backend.reservation;

import java.time.LocalDate;

public class ReservationDTO {

    // ---- REQUEST: lo que llega desde el frontend ----
    public static class Request {
        private Long userId;
        private Long productId;
        private LocalDate startDate;
        private LocalDate endDate;

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }

        public LocalDate getStartDate() { return startDate; }
        public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

        public LocalDate getEndDate() { return endDate; }
        public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    }

    // ---- RESPONSE: lo que devolvemos al frontend ----
    public static class Response {
        private Long id;
        private Long userId;
        private String userFirstName;
        private String userLastName;
        private String userEmail;
        private Long productId;
        private String productName;
        private Integer productPriceFrom;
        private Integer productDurationMin;
        private LocalDate startDate;
        private LocalDate endDate;
        private LocalDate createdAt;

        public Response(Reservation r) {
            this.id = r.getId();
            this.userId = r.getUser().getId();
            this.userFirstName = r.getUser().getFirstName();
            this.userLastName = r.getUser().getLastName();
            this.userEmail = r.getUser().getEmail();
            this.productId = r.getProduct().getId();
            this.productName = r.getProduct().getName();
            this.productPriceFrom = r.getProduct().getPriceFrom();
            this.productDurationMin = r.getProduct().getDurationMin();
            this.startDate = r.getStartDate();
            this.endDate = r.getEndDate();
            this.createdAt = r.getCreatedAt();
        }

        public Long getId() { return id; }
        public Long getUserId() { return userId; }
        public String getUserFirstName() { return userFirstName; }
        public String getUserLastName() { return userLastName; }
        public String getUserEmail() { return userEmail; }
        public Long getProductId() { return productId; }
        public String getProductName() { return productName; }
        public Integer getProductPriceFrom() { return productPriceFrom; }
        public Integer getProductDurationMin() { return productDurationMin; }
        public LocalDate getStartDate() { return startDate; }
        public LocalDate getEndDate() { return endDate; }
        public LocalDate getCreatedAt() { return createdAt; }
    }

    // ---- BLOCKED DATES: fechas ocupadas para un producto ----
    public static class BlockedDates {
        private LocalDate startDate;
        private LocalDate endDate;

        public BlockedDates(LocalDate startDate, LocalDate endDate) {
            this.startDate = startDate;
            this.endDate = endDate;
        }

        public LocalDate getStartDate() { return startDate; }
        public LocalDate getEndDate() { return endDate; }
    }
}
