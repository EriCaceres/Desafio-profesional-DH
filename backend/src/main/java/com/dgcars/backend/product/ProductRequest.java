package com.dgcars.backend.product;

import java.util.Set;

public class ProductRequest {
    public String name;
    public String description;
    public Integer durationMin;
    public Integer priceFrom;
    public Long categoryId;
    public Set<Long> featureIds;
}
