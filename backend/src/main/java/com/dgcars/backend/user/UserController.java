package com.dgcars.backend.user;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping
    public List<UserResponseDTO> listAll() {
        return service.findAll();
    }

    @PostMapping("/{userId}/roles/admin")
    public UserResponseDTO grantAdmin(@PathVariable Long userId) {
        return service.grantAdmin(userId);
    }

    @DeleteMapping("/{userId}/roles/admin")
    public UserResponseDTO revokeAdmin(@PathVariable Long userId) {
        return service.revokeAdmin(userId);
    }
}
