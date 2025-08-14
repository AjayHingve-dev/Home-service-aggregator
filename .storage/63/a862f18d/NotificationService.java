package com.homeservice.aggregator.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.homeservice.aggregator.model.Notification;
import com.homeservice.aggregator.model.ServiceProvider;
import com.homeservice.aggregator.model.ServiceRequest;
import com.homeservice.aggregator.model.User;
import com.homeservice.aggregator.payload.dto.NotificationDTO;
import com.homeservice.aggregator.payload.websocket.WebSocketMessage;
import com.homeservice.aggregator.repository.NotificationRepository;

@Service
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    /**
     * Create a notification and send it via WebSocket
     */
    public Notification createAndSendNotification(User user, String title, String message, 
            String notificationType, String entityType, Long entityId, Long senderId) {
        
        // Create database notification
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setNotificationType(notificationType);
        notification.setEntityType(entityType);
        notification.setEntityId(entityId);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setRead(false);
        
        notification = notificationRepository.save(notification);
        
        // Send WebSocket notification
        WebSocketMessage wsMessage = new WebSocketMessage();
        wsMessage.setType(notificationType);
        wsMessage.setSenderId(senderId);
        wsMessage.setReceiverId(user.getId());
        wsMessage.setContent(message);
        wsMessage.setEntityId(entityId);
        wsMessage.setTimestamp(LocalDateTime.now());
        
        messagingTemplate.convertAndSend("/topic/notifications/" + user.getId(), wsMessage);
        
        return notification;
    }
    
    /**
     * Notify about service request status changes
     */
    public void notifyServiceRequestStatusChange(ServiceRequest request, String oldStatus, String newStatus, User updatedBy) {
        String title = "Service Request Status Update";
        String message = "Your service request #" + request.getId() + " has been updated from " + oldStatus + " to " + newStatus;
        
        // Notify the requester
        createAndSendNotification(
            request.getUser(),
            title,
            message,
            "SERVICE_REQUEST_STATUS_UPDATE",
            "SERVICE_REQUEST",
            request.getId(),
            updatedBy.getId()
        );
        
        // If assigned to a provider, notify them as well
        if (request.getServiceProvider() != null && !request.getServiceProvider().getUser().getId().equals(updatedBy.getId())) {
            createAndSendNotification(
                request.getServiceProvider().getUser(),
                title,
                message,
                "SERVICE_REQUEST_STATUS_UPDATE",
                "SERVICE_REQUEST",
                request.getId(),
                updatedBy.getId()
            );
        }
    }
    
    /**
     * Notify about new service request
     */
    public void notifyNewServiceRequest(ServiceRequest request, ServiceProvider provider) {
        createAndSendNotification(
            provider.getUser(),
            "New Service Request",
            "You have received a new service request #" + request.getId() + " for " + request.getServiceType(),
            "NEW_SERVICE_REQUEST",
            "SERVICE_REQUEST",
            request.getId(),
            request.getUser().getId()
        );
    }
    
    /**
     * Notify about service request assignment
     */
    public void notifyServiceRequestAssignment(ServiceRequest request) {
        // Notify the client
        createAndSendNotification(
            request.getUser(),
            "Service Provider Assigned",
            "A service provider has been assigned to your request #" + request.getId(),
            "SERVICE_PROVIDER_ASSIGNED",
            "SERVICE_REQUEST",
            request.getId(),
            request.getServiceProvider().getUser().getId()
        );
    }
    
    /**
     * Notify about new review
     */
    public void notifyNewReview(User reviewer, ServiceProvider provider, Long reviewId, Integer rating) {
        createAndSendNotification(
            provider.getUser(),
            "New Review",
            "You received a new " + rating + "-star review",
            "NEW_REVIEW",
            "REVIEW",
            reviewId,
            reviewer.getId()
        );
    }
    
    /**
     * Notify about provider arrival
     */
    public void notifyProviderArrival(ServiceRequest request) {
        createAndSendNotification(
            request.getUser(),
            "Provider Arriving",
            "Your service provider is arriving for request #" + request.getId(),
            "PROVIDER_ARRIVAL",
            "SERVICE_REQUEST",
            request.getId(),
            request.getServiceProvider().getUser().getId()
        );
    }
    
    /**
     * Notify about service completion
     */
    public void notifyServiceCompletion(ServiceRequest request) {
        createAndSendNotification(
            request.getUser(),
            "Service Completed",
            "Your service request #" + request.getId() + " has been completed. Please leave a review!",
            "SERVICE_COMPLETED",
            "SERVICE_REQUEST",
            request.getId(),
            request.getServiceProvider().getUser().getId()
        );
    }
}