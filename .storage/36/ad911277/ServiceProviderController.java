package com.homeservice.aggregator.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.homeservice.aggregator.model.Service;
import com.homeservice.aggregator.model.ServiceProvider;
import com.homeservice.aggregator.model.User;
import com.homeservice.aggregator.repository.ServiceProviderRepository;
import com.homeservice.aggregator.repository.ServiceRepository;
import com.homeservice.aggregator.repository.UserRepository;
import com.homeservice.aggregator.security.services.UserDetailsImpl;
import com.homeservice.aggregator.controller.WebSocketController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/providers")
public class ServiceProviderController {
    
    @Autowired
    private ServiceProviderRepository serviceProviderRepository;
    
    @Autowired
    private ServiceRepository serviceRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private WebSocketController webSocketController;
    
    @GetMapping
    public ResponseEntity<List<ServiceProvider>> getAllProviders() {
        List<ServiceProvider> providers = serviceProviderRepository.findAll();
        return ResponseEntity.ok(providers);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ServiceProvider> getProviderById(@PathVariable Long id) {
        return serviceProviderRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/service/{serviceId}")
    public ResponseEntity<List<ServiceProvider>> getProvidersByService(@PathVariable Long serviceId) {
        return serviceRepository.findById(serviceId)
                .map(service -> {
                    List<ServiceProvider> providers = serviceProviderRepository.findByServicesOffered(service);
                    return ResponseEntity.ok(providers);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/available")
    public ResponseEntity<List<ServiceProvider>> getAvailableProviders() {
        List<ServiceProvider> providers = serviceProviderRepository.findByAvailabilityStatus(true);
        return ResponseEntity.ok(providers);
    }
    
    @GetMapping("/profile")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ServiceProvider> getProviderProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        return serviceProviderRepository.findByUserId(userDetails.getId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/register")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> registerAsProvider(@Valid @RequestBody ServiceProvider providerDetails) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        // Check if user is already a provider
        Optional<ServiceProvider> existingProvider = serviceProviderRepository.findByUserId(userDetails.getId());
        if (existingProvider.isPresent()) {
            return ResponseEntity.badRequest()
                    .body("You are already registered as a service provider");
        }
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        providerDetails.setUser(user);
        providerDetails.setRating(0.0);
        providerDetails.setReviewCount(0);
        providerDetails.setAvailabilityStatus(true); // Default to available
        
        ServiceProvider savedProvider = serviceProviderRepository.save(providerDetails);
        return ResponseEntity.ok(savedProvider);
    }
    
    @PutMapping("/update-profile")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<?> updateProviderProfile(@Valid @RequestBody ServiceProvider providerDetails) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        return serviceProviderRepository.findByUserId(userDetails.getId())
                .map(existingProvider -> {
                    // Update provider details
                    existingProvider.setDescription(providerDetails.getDescription());
                    existingProvider.setQualifications(providerDetails.getQualifications());
                    existingProvider.setExperience(providerDetails.getExperience());
                    
                    ServiceProvider updatedProvider = serviceProviderRepository.save(existingProvider);
                    return ResponseEntity.ok(updatedProvider);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/availability")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<?> updateAvailability(@RequestBody Map<String, Boolean> status) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        if (!status.containsKey("available")) {
            return ResponseEntity.badRequest().body("Status field 'available' is required");
        }
        
        boolean available = status.get("available");
        
        return serviceProviderRepository.findByUserId(userDetails.getId())
                .map(provider -> {
                    provider.setAvailabilityStatus(available);
                    ServiceProvider updatedProvider = serviceProviderRepository.save(provider);
                    return ResponseEntity.ok(updatedProvider);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/location")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<?> updateLocation(@RequestBody Map<String, Object> locationData) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        return serviceProviderRepository.findByUserId(userDetails.getId())
                .map(provider -> {
                    // Update location data in the provider entity
                    if (locationData.containsKey("latitude") && locationData.containsKey("longitude")) {
                        provider.setCurrentLatitude((Double) locationData.get("latitude"));
                        provider.setCurrentLongitude((Double) locationData.get("longitude"));
                        ServiceProvider updatedProvider = serviceProviderRepository.save(provider);
                        
                        // Broadcast location update via WebSocket
                        webSocketController.broadcastLocationUpdate(updatedProvider.getId(), locationData);
                        
                        return ResponseEntity.ok(updatedProvider);
                    } else {
                        return ResponseEntity.badRequest().body("Latitude and longitude are required");
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/{providerId}/services/{serviceId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> assignServiceToProvider(@PathVariable Long providerId, @PathVariable Long serviceId) {
        ServiceProvider provider = serviceProviderRepository.findById(providerId)
                .orElseThrow(() -> new RuntimeException("Provider not found"));
        
        Service service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found"));
        
        provider.getServicesOffered().add(service);
        ServiceProvider updatedProvider = serviceProviderRepository.save(provider);
        
        return ResponseEntity.ok(updatedProvider);
    }
}