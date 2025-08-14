package com.homeservice.aggregator.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.homeservice.aggregator.model.Service;
import com.homeservice.aggregator.repository.ServiceProviderRepository;
import com.homeservice.aggregator.repository.ServiceRepository;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/services")
public class ServiceController {

    @Autowired
    private ServiceRepository serviceRepository;
    
    @Autowired
    private ServiceProviderRepository serviceProviderRepository;
    
    @GetMapping
    public ResponseEntity<List<Service>> getAllServices() {
        List<Service> services = serviceRepository.findAll();
        return ResponseEntity.ok(services);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Service> getServiceById(@PathVariable Long id) {
        return serviceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Service>> getServicesByCategory(@PathVariable String category) {
        List<Service> services = serviceRepository.findByCategory(category);
        return ResponseEntity.ok(services);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Service> createService(@RequestBody Service service) {
        Service savedService = serviceRepository.save(service);
        return ResponseEntity.ok(savedService);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Service> updateService(@PathVariable Long id, @RequestBody Service serviceDetails) {
        return serviceRepository.findById(id)
                .map(existingService -> {
                    existingService.setName(serviceDetails.getName());
                    existingService.setDescription(serviceDetails.getDescription());
                    existingService.setCategory(serviceDetails.getCategory());
                    existingService.setBasePrice(serviceDetails.getBasePrice());
                    Service updatedService = serviceRepository.save(existingService);
                    return ResponseEntity.ok(updatedService);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<Service>> getServicesByProvider(@PathVariable Long providerId) {
        return serviceProviderRepository.findById(providerId)
                .map(provider -> {
                    List<Service> services = serviceRepository.findByServiceProviders(provider);
                    return ResponseEntity.ok(services);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}