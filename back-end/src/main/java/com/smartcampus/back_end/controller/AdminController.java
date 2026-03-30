package com.smartcampus.back_end.controller;

import com.smartcampus.back_end.model.Role;
import com.smartcampus.back_end.model.User;
import com.smartcampus.back_end.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;

    public AdminController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/users")
    public List<Map<String, Object>> listUsers() {
        return userRepository.findAll().stream()
                .map(u -> Map.<String, Object>of(
                        "id", u.getId(),
                        "email", u.getEmail(),
                        "name", u.getName(),
                        "picture", u.getPicture() != null ? u.getPicture() : "",
                        "role", u.getRole().name()
                ))
                .toList();
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<Map<String, Object>> assignRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal String adminEmail) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + id));

        // Prevent admin from demoting themselves
        if (user.getEmail().equals(adminEmail)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "You cannot change your own role."));
        }

        Role newRole;
        try {
            newRole = Role.valueOf(body.get("role").toUpperCase());
        } catch (IllegalArgumentException | NullPointerException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid role. Valid values: USER, ADMIN, TECHNICIAN"));
        }

        user.setRole(newRole);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "role", user.getRole().name()
        ));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Long id,
            @AuthenticationPrincipal String adminEmail) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + id));

        // Prevent admin from deleting themselves
        if (user.getEmail().equals(adminEmail)) {
            return ResponseEntity.badRequest().build();
        }

        userRepository.delete(user);
        return ResponseEntity.noContent().build();
    }
}
