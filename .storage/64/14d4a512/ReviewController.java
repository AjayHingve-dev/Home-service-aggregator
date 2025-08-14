package com.homeservice.aggregator.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.homeservice.aggregator.model.Review;
import com.homeservice.aggregator.model.ServiceProvider;
import com.homeservice.aggregator.model.ServiceRequest;
import com.homeservice.aggregator.model.User;
import com.homeservice.aggregator.payload.dto.ReviewDTO;
import com.homeservice.aggregator.payload.request.ReviewSubmitRequest;
import com.homeservice.aggregator.payload.response.MessageResponse;
import com.homeservice.aggregator.repository.ReviewRepository;
import com.homeservice.aggregator.repository.ServiceProviderRepository;
import com.homeservice.aggregator.repository.ServiceRequestRepository;
import com.homeservice.aggregator.repository.UserRepository;
import com.homeservice.aggregator.security.services.UserDetailsImpl;
import com.homeservice.aggregator.service.NotificationService;

import org.springframework.messaging.simp.SimpMessagingTemplate;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ServiceProviderRepository serviceProviderRepository;
    
    @Autowired
    private ServiceRequestRepository serviceRequestRepository;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @Autowired
    private NotificationService notificationService;
    
    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByProvider(@PathVariable Long providerId) {
        List<Review> reviews = reviewRepository.findByServiceProviderId(providerId);
        
        List<ReviewDTO> reviewDTOs = reviews.stream()
                .map(ReviewDTO::new)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(reviewDTOs);
    }
    
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<ReviewDTO>> getReviewsByUser(@PathVariable Long userId) {
        // Ensure users can only access their own reviews unless admin
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        if (!userDetails.getId().equals(userId) && !userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(null);
        }
        
        List<Review> reviews = reviewRepository.findByUserId(userId);
        
        List<ReviewDTO> reviewDTOs = reviews.stream()
                .map(ReviewDTO::new)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(reviewDTOs);
    }
    
    @PostMapping("/submit")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> submitReview(@Valid @RequestBody ReviewSubmitRequest request) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Error: User not found"));
        
        ServiceProvider serviceProvider = serviceProviderRepository.findById(request.getServiceProviderId())
                .orElseThrow(() -> new RuntimeException("Error: Service provider not found"));
        
        ServiceRequest serviceRequest = serviceRequestRepository.findById(request.getServiceRequestId())
                .orElseThrow(() -> new RuntimeException("Error: Service request not found"));
        
        // Check if the service request is completed
        if (!serviceRequest.getStatus().equals("COMPLETED")) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Can only review completed service requests"));
        }
        
        // Check if user is the requester of the service request
        if (!serviceRequest.getUser().getId().equals(user.getId())) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("Error: You can only review your own service requests"));
        }
        
        // Check if the review already exists
        if (reviewRepository.existsByServiceRequestAndUser(serviceRequest, user)) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: You have already reviewed this service request"));
        }
        
        // Create and save the review
        Review review = new Review();
        review.setUser(user);
        review.setServiceProvider(serviceProvider);
        review.setServiceRequest(serviceRequest);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setCreatedAt(LocalDateTime.now());
        
        reviewRepository = reviewRepository.save(review);
        
        // Update provider rating
        Double averageRating = reviewRepository.getAverageRatingByProvider(serviceProvider);
        Integer reviewCount = reviewRepository.getReviewCountByProvider(serviceProvider);
        
        serviceProvider.setRating(averageRating != null ? averageRating : 0.0);
        serviceProvider.setReviewCount(reviewCount != null ? reviewCount : 0);
        serviceProviderRepository.save(serviceProvider);
        
        // Send WebSocket notification to the provider
        WebSocketMessage wsMessage = new WebSocketMessage();
        wsMessage.setType("NEW_REVIEW");
        wsMessage.setSenderId(user.getId());
        wsMessage.setReceiverId(serviceProvider.getUser().getId());
        wsMessage.setContent("You received a new " + request.getRating() + "-star review");
        wsMessage.setEntityId(review.getId());
        wsMessage.setTimestamp(LocalDateTime.now());
        
        messagingTemplate.convertAndSend("/topic/notifications/" + serviceProvider.getUser().getId(), wsMessage);
        
        return ResponseEntity.ok(new ReviewDTO(review));
    }
    
    @DeleteMapping("/{reviewId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteReview(@PathVariable Long reviewId) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Error: Review not found"));
        
        // Check if the user is the owner of the review or an admin
        if (!review.getUser().getId().equals(userDetails.getId()) && !userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("Error: You are not authorized to delete this review"));
        }
        
        // Delete the review
        reviewRepository.delete(review);
        
        // Update provider rating
        ServiceProvider serviceProvider = review.getServiceProvider();
        Double averageRating = reviewRepository.getAverageRatingByProvider(serviceProvider);
        Integer reviewCount = reviewRepository.getReviewCountByProvider(serviceProvider);
        
        serviceProvider.setRating(averageRating != null ? averageRating : 0.0);
        serviceProvider.setReviewCount(reviewCount != null ? reviewCount : 0);
        serviceProviderRepository.save(serviceProvider);
        
        return ResponseEntity.ok(new MessageResponse("Review deleted successfully"));
    }
}