package com.dgcars.backend.user;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepo;
    private final RoleRepository roleRepo;

    public UserService(UserRepository userRepo, RoleRepository roleRepo) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
    }

    public List<UserResponseDTO> findAll() {
        return userRepo.findAll().stream()
            .map(UserResponseDTO::new)
            .toList();
    }

    public UserResponseDTO grantAdmin(Long userId) {
        User user = userRepo.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        Role adminRole = roleRepo.findByName("ADMIN")
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Rol ADMIN no encontrado"));

        user.addRole(adminRole);
        return new UserResponseDTO(userRepo.save(user));
    }

    public UserResponseDTO revokeAdmin(Long userId) {
        User user = userRepo.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        user.getRoles().removeIf(r -> r.getName().equals("ADMIN"));
        return new UserResponseDTO(userRepo.save(user));
    }
}
