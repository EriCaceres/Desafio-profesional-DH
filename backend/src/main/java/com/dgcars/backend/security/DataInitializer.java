package com.dgcars.backend.security;

import com.dgcars.backend.user.Role;
import com.dgcars.backend.user.RoleRepository;
import com.dgcars.backend.user.User;
import com.dgcars.backend.user.UserRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

// @Component — deshabilitado: datos cargados por data.sql
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepo,
                           RoleRepository roleRepo,
                           PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {

        // Crear rol ADMIN si no existe
        Role adminRole = roleRepo.findByName("ADMIN")
                .orElseGet(() -> roleRepo.save(new Role("ADMIN")));

        // Crear rol USER si no existe
        Role userRole = roleRepo.findByName("USER")
                .orElseGet(() -> roleRepo.save(new Role("USER")));

        // Crear admin si no existe
        if (userRepo.findByEmail("admin@shinelab.com").isEmpty()) {
            User admin = new User();
            admin.setFirstName("Admin");
            admin.setLastName("Shinelab");
            admin.setEmail("admin@shinelab.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.addRole(adminRole);
            admin.addRole(userRole);
            userRepo.save(admin);
            System.out.println("✅ Admin creado: admin@shinelab.com / admin123");
        }
    }
}
