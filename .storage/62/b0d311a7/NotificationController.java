package com.homeservice.aggregator.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.homeservice.aggregator.model.Notification;
import com.homeservice.aggregator.model.User;
import com.homeservice.aggregator.payload.dto.NotificationDTO;
import com.homeservice.aggregator.payload.response.MessageResponse;
import com.homeservice.aggregator.repository.NotificationRepository;
import com.homeservice.aggregator.repository.UserRepository;
import com.homeservice.aggregator.security.services.UserDetailsImpl;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('PROVIDER') or hasRole('ADMIN')")
    public ResponseEntity<List<NotificationDTO>> getUserNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Error: User not found"));
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Notification> notificationPage = notificationRepository.findByUserOrderByCreatedAtDesc(user, pageable);
        
        List<NotificationDTO> notificationDTOs = notificationPage.getContent().stream()
                .map(NotificationDTO::new)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(notificationDTOs);
    }
    
    @GetMapping("/unread")
    @PreAuthorize("hasRole('USER') or hasRole('PROVIDER') or hasRole('ADMIN')")
    public ResponseEntity<List<NotificationDTO>> getUnreadNotifications() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Error: User not found"));
        
        List<Notification> notifications = notificationRepository.findByUserAndReadOrderByCreatedAtDesc(user, false);
        
        List<NotificationDTO> notificationDTOs = notifications.stream()
                .map(NotificationDTO::new)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(notificationDTOs);
    }
    
    @GetMapping("/count")
    @PreAuthorize("hasRole('USER') or hasRole('PROVIDER') or hasRole('ADMIN')")
    public ResponseEntity<Long> getUnreadCount() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Error: User not found"));
        
        long unreadCount = notificationRepository.countByUserAndRead(user, false);
        
        return ResponseEntity.ok(unreadCount);
    }
    
    @PostMapping("/{id}/read")
    @PreAuthorize("hasRole('USER') or hasRole('PROVIDER') or hasRole('ADMIN')")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Notification not found"));
        
        // Ensure the notification belongs to the current user
        if (!notification.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: You are not authorized to access this notification"));
        }
        
        if (!notification.isRead()) {
            notificationRepository.markAsRead(id);
        }
        
        return ResponseEntity.ok(new MessageResponse("Notification marked as read"));
    }
    
    @PostMapping("/read-all")
    @PreAuthorize("hasRole('USER') or hasRole('PROVIDER') or hasRole('ADMIN')")
    public ResponseEntity<?> markAllAsRead() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        notificationRepository.markAllAsRead(userDetails.getId());
        
        return ResponseEntity.ok(new MessageResponse("All notifications marked as read"));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('PROVIDER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteNotification(@PathVariable Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Notification not found"));
        
        // Ensure the notification belongs to the current user
        if (!notification.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: You are not authorized to delete this notification"));
        }
        
        notificationRepository.delete(notification);
        
        return ResponseEntity.ok(new MessageResponse("Notification deleted successfully"));
    }
    
    // Service method to create notifications internally
    public Notification createNotification(User user, String title, String message, 
            String notificationType, String entityType, Long entityId) {
        
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setNotificationType(notificationType);
        notification.setEntityType(entityType);
        notification.setEntityId(entityId);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setRead(false);
        
        return notificationRepository.save(notification);
    }
}