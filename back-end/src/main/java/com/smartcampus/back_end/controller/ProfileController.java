package com.smartcampus.back_end.controller;

import com.smartcampus.back_end.model.User;
import com.smartcampus.back_end.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserRepository userRepository;

    private static final String UPLOAD_DIR = "uploads/avatars/";

    @PatchMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> updateProfile(
            @AuthenticationPrincipal String email,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) MultipartFile photo,
            @RequestParam(required = false, defaultValue = "false") boolean removePhoto
    ) throws IOException {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (name != null && !name.isBlank()) {
            user.setName(name.trim());
        }

        user.setPhone(phone != null ? phone.trim() : null);
        user.setAddress(address != null ? address.trim() : null);

        if (removePhoto) {
            deleteOldAvatar(user.getPicture());
            user.setPicture(null);
        } else if (photo != null && !photo.isEmpty()) {
            deleteOldAvatar(user.getPicture());
            String pictureUrl = savePhoto(photo);
            user.setPicture(pictureUrl);
        }

        userRepository.save(user);

        Map<String, Object> result = new HashMap<>();
        result.put("id", user.getId());
        result.put("email", user.getEmail());
        result.put("name", user.getName());
        result.put("picture", user.getPicture() != null ? user.getPicture() : "");
        result.put("role", user.getRole().name());
        result.put("phone", user.getPhone() != null ? user.getPhone() : "");
        result.put("address", user.getAddress() != null ? user.getAddress() : "");

        return ResponseEntity.ok(result);
    }

    private String savePhoto(MultipartFile photo) throws IOException {
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFilename = photo.getOriginalFilename();
        String extension = (originalFilename != null && originalFilename.contains("."))
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : ".jpg";
        String filename = UUID.randomUUID() + extension;

        Path filePath = uploadPath.resolve(filename);
        Files.copy(photo.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return "/uploads/avatars/" + filename;
    }

    private void deleteOldAvatar(String pictureUrl) {
        if (pictureUrl == null || !pictureUrl.startsWith("/uploads/avatars/")) return;
        try {
            Path old = Paths.get(pictureUrl.substring(1)); // strip leading /
            Files.deleteIfExists(old);
        } catch (IOException ignored) {}
    }
}
