package com.dgcars.backend.product;

import org.springframework.http.HttpStatus;

public class ResponseStatusException extends Throwable {
    public ResponseStatusException(HttpStatus badRequest, String s) {
    }
}
