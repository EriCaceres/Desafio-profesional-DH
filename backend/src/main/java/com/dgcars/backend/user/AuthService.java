package com.dgcars.backend.user;

import com.dgcars.backend.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepo,
                       RoleRepository roleRepo,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public UserResponseDTO register(RegisterRequestDTO request) {
        if (userRepo.findByEmail(request.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email ya registrado");
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        Role roleUser = roleRepo.findByName("USER")
                .orElseGet(() -> roleRepo.save(new Role("USER")));
        user.addRole(roleUser);

        User saved = userRepo.save(user);
        return new UserResponseDTO(saved);
    }

    public AuthResponseDTO login(LoginRequestDTO request) {
        System.out.println("🔍 Buscando email: " + request.getEmail());
        System.out.println("🔍 Password recibido: " + request.getPassword());

        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    System.out.println("❌ Usuario no encontrado");
                    return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas");
                });

        System.out.println("✅ Usuario encontrado: " + user.getEmail());
        System.out.println("🔍 Hash en BD: " + user.getPassword());

        boolean matches = passwordEncoder.matches(request.getPassword(), user.getPassword());
        System.out.println("🔍 Password matches: " + matches);

        if (!matches) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponseDTO(token, new UserResponseDTO(user));
    }
}
