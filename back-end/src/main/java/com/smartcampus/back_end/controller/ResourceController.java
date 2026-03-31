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
}
