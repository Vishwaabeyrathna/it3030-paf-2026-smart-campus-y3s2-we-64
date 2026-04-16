
package com.smartcampus.back_end.controller;

import com.smartcampus.back_end.model.Resource;
import com.smartcampus.back_end.repository.ResourceRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "*") // Update based on frontend URL
public class ResourceController {

    @Autowired
    private ResourceRepository resourceRepository;

    @GetMapping
    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    @PostMapping
    public Resource createResource(@Valid @RequestBody Resource resource) {
        return resourceRepository.save(resource);
    }

    @GetMapping("/{id}")
    public Resource getResourceById(@PathVariable Long id) {
        return resourceRepository.findById(id).orElseThrow(() -> new RuntimeException("Resource not found"));
    }

    @PutMapping("/{id}")
    public Resource updateResource(@PathVariable Long id, @Valid @RequestBody Resource resourceDetails) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        resource.setName(resourceDetails.getName());
        resource.setType(resourceDetails.getType());
        resource.setCapacity(resourceDetails.getCapacity());
        resource.setStatus(resourceDetails.getStatus());

        return resourceRepository.save(resource);
    }

    @DeleteMapping("/{id}")
    public void deleteResource(@PathVariable Long id) {
        resourceRepository.deleteById(id);
    }

    @GetMapping("/{id}/availability")
    public java.util.Map<String, Object> checkAvailability(@PathVariable Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));
        
        boolean isAvailable = "Available".equalsIgnoreCase(resource.getStatus());
        String reason;
        
        if (isAvailable) {
            reason = "This resource is currently marked as Available and is ready for booking or allocation.";
        } else {
            reason = "This resource is currently unavailable. Current status: " + resource.getStatus() + ". Please check back later.";
        }
        
        return java.util.Map.of(
            "available", isAvailable,
            "status", resource.getStatus(),
            "reason", reason
        );
    }
}

