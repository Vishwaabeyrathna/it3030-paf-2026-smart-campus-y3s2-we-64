package com.smartcampus.back_end.config;

import com.smartcampus.back_end.model.Role;
import com.smartcampus.back_end.model.User;
import com.smartcampus.back_end.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final AdminProperties adminProperties;

    public DataSeeder(UserRepository userRepository, AdminProperties adminProperties) {
        this.userRepository = userRepository;
        this.adminProperties = adminProperties;
    }

    @Override
    public void run(ApplicationArguments args) {
        String email = adminProperties.getEmail();
        if (email == null || email.isBlank()) {
            log.warn("No superadmin email configured (app.admin.email) — skipping seed.");
            return;
        }

        userRepository.findByEmail(email).ifPresentOrElse(
            existing -> {
                if (existing.getRole() != Role.ADMIN) {
                    existing.setRole(Role.ADMIN);
                    userRepository.save(existing);
                    log.info("Promoted existing user {} to ADMIN.", email);
                } else {
                    log.info("Superadmin {} already exists — no action needed.", email);
                }
            },
            () -> {
                User admin = new User(email, adminProperties.getName(), null);
                admin.setRole(Role.ADMIN);
                userRepository.save(admin);
                log.info("Seeded superadmin: {}", email);
            }
        );
    }
}
