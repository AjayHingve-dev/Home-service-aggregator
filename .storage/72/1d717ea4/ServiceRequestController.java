package com.homeservice.aggregator.controller;

import java.util.List;

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

import com.homeservice.aggregator.model.ServiceProvider;
import com.homeservice.aggregator.model.ServiceRequest;
import com.homeservice.aggregator.model.User;
import com.homeservice.aggregator.repository.ServiceProviderRepository;
import com.homeservice.aggregator.repository.ServiceRequestRepository;
import com.homeservice.aggregator.repository.UserRepository;
import com.homeservice.aggregator.security.services.UserDetailsImpl;
import com.homeservice.aggregator.controller.WebSocketController;
import com.homeservice.aggregator.service.NotificationService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/requests")
public class ServiceRequestController {
    
    @Autowired
    private ServiceRequestRepository serviceRequestRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ServiceProviderRepository serviceProviderRepository;
    
    @Autowired
    private WebSocketController webSocketController;
    
    @Autowired
    private NotificationService notificationService;
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ServiceRequest>> getAllRequests() {
        List<ServiceRequest> requests = serviceRequestRepository.findAll();
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'PROVIDER', 'ADMIN')")
    public ResponseEntity<ServiceRequest> getRequestById(@PathVariable Long id) {
        return serviceRequestRepository.findById(id)
                .map(request -> {
                    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
                    
                    // Check if user is admin, request owner or assigned provider
                    boolean isAdmin = authentication.getAuthorities().stream()
                            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
                    boolean isRequestOwner = request.getUser().getId().equals(userDetails.getId());
                    boolean isAssignedProvider = request.getServiceProvider() != null && 
                            request.getServiceProvider().getUser().getId().equals(userDetails.getId());
                    
                    if (isAdmin || isRequestOwner || isAssignedProvider) {
                        return ResponseEntity.ok(request);
                    } else {
                        return ResponseEntity.status(403).build();
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/user")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<ServiceRequest>> getUserRequests() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<ServiceRequest> requests = serviceRequestRepository.findByUser(user);
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/provider")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<List<ServiceRequest>> getProviderRequests() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        ServiceProvider provider = serviceProviderRepository.findByUserId(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Service provider not found"));
        
        List<ServiceRequest> requests = serviceRequestRepository.findByServiceProvider(provider);
        return ResponseEntity.ok(requests);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ServiceRequest> createRequest(@Valid @RequestBody ServiceRequest serviceRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        serviceRequest.setUser(user);
        serviceRequest.setStatus("PENDING");
        
        ServiceRequest savedRequest = serviceRequestRepository.save(serviceRequest);
        
        // Send notification via WebSocket
        webSocketController.notifyServiceRequestUpdate(savedRequest);
        
        // If there's a specific service provider already assigned, notify them
        if (serviceRequest.getServiceProvider() != null) {
            notificationService.notifyNewServiceRequest(savedRequest, serviceRequest.getServiceProvider());
        }
        
        return ResponseEntity.ok(savedRequest);
    }
    
    @PutMapping("/{id}/accept")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ServiceRequest> acceptRequest(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        ServiceProvider provider = serviceProviderRepository.findByUserId(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Service provider not found"));
        
        return serviceRequestRepository.findById(id)
                .map(request -> {
                    if (!"PENDING".equals(request.getStatus())) {
                        return ResponseEntity.badRequest().build();
                    }
                    
                    request.setServiceProvider(provider);
                    request.setStatus("ACCEPTED");
                    ServiceRequest updatedRequest = serviceRequestRepository.save(request);
                    
                    // Send notification via WebSocket
                    webSocketController.notifyServiceRequestUpdate(updatedRequest);
                    
                    // Notify the client about service provider assignment
                    notificationService.notifyServiceRequestAssignment(updatedRequest);
                    
                    return ResponseEntity.ok(updatedRequest);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}/complete")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ServiceRequest> completeRequest(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        ServiceProvider provider = serviceProviderRepository.findByUserId(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Service provider not found"));
        
        return serviceRequestRepository.findById(id)
                .map(request -> {
                    if (!provider.getId().equals(request.getServiceProvider().getId()) || 
                            !"ACCEPTED".equals(request.getStatus())) {
                        return ResponseEntity.badRequest().build();
                    }
                    
                    request.setStatus("COMPLETED");
                    ServiceRequest updatedRequest = serviceRequestRepository.save(request);
                    
                    // Send notification via WebSocket
                    webSocketController.notifyServiceRequestUpdate(updatedRequest);
                    
                    // Notify the user that service is completed
                    notificationService.notifyServiceRequestCompletion(updatedRequest);
                    
                    return ResponseEntity.ok(updatedRequest);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('USER', 'PROVIDER')")
    public ResponseEntity<ServiceRequest> cancelRequest(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        return serviceRequestRepository.findById(id)
                .map(request -> {
                    // Check if user is the request owner or the assigned provider
                    boolean isRequestOwner = request.getUser().getId().equals(userDetails.getId());
                    boolean isAssignedProvider = request.getServiceProvider() != null && 
                            request.getServiceProvider().getUser().getId().equals(userDetails.getId());
                    
                    if (!isRequestOwner && !isAssignedProvider) {
                        return ResponseEntity.status(403).build();
                    }
                    
                    // Can't cancel completed requests
                    if ("COMPLETED".equals(request.getStatus())) {
                        return ResponseEntity.badRequest().build();
                    }
                    
                    request.setStatus("CANCELLED");
                    ServiceRequest updatedRequest = serviceRequestRepository.save(request);
                    
                    // Send notification via WebSocket
                    webSocketController.notifyServiceRequestUpdate(updatedRequest);
                    
                    return ResponseEntity.ok(updatedRequest);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}