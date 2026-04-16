package com.smartcampus.back_end.service;

import com.smartcampus.back_end.model.Resource;
import com.smartcampus.back_end.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    public Page<Resource> getAllResources(Pageable pageable) {
        return resourceRepository.findAll(pageable);
    }

    public Page<Resource> searchResources(String query, Pageable pageable) {
        return resourceRepository.findByNameContainingIgnoreCaseOrLocationContainingIgnoreCase(query, query, pageable);
    }

    public Page<Resource> filterResources(String type, String status, Pageable pageable) {
        if (type != null && status != null) {
            return resourceRepository.findByTypeAndStatus(type, status, pageable);
        } else if (type != null) {
            return resourceRepository.findByType(type, pageable);
        } else if (status != null) {
            return resourceRepository.findByStatus(status, pageable);
        } else {
            return resourceRepository.findAll(pageable);
        }
    }

    public Optional<Resource> getResourceById(Long id) {
        return resourceRepository.findById(id);
    }

    public Resource createResource(Resource resource) {
        return resourceRepository.save(resource);
    }

    public Resource updateResource(Long id, Resource resourceDetails) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));
        
        resource.setName(resourceDetails.getName());
        resource.setType(resourceDetails.getType());
        resource.setCapacity(resourceDetails.getCapacity());
        resource.setLocation(resourceDetails.getLocation());
        resource.setStatus(resourceDetails.getStatus());
        
        return resourceRepository.save(resource);
    }

    public void deleteResource(Long id) {
        resourceRepository.deleteById(id);
    }
}
