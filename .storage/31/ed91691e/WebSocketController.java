package com.homeservice.aggregator.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.homeservice.aggregator.model.ServiceRequest;
import com.homeservice.aggregator.payload.websocket.WebSocketMessage;

@Controller
public class WebSocketController {
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @MessageMapping("/send-notification")
    @SendTo("/topic/public")
    public WebSocketMessage sendNotification(WebSocketMessage message) {
        // Simply relays the received message to subscribers
        return message;
    }
    
    /**
     * Method to send notifications about service request updates
     * This is called from other services to notify users
     */
    public void notifyServiceRequestUpdate(ServiceRequest serviceRequest) {
        WebSocketMessage message = new WebSocketMessage("SERVICE_REQUEST_UPDATE", serviceRequest);
        
        // Send to specific user
        messagingTemplate.convertAndSend("/topic/user/" + serviceRequest.getUser().getId(), message);
        
        // If provider exists, also send to them
        if (serviceRequest.getServiceProvider() != null) {
            messagingTemplate.convertAndSend("/topic/provider/" + serviceRequest.getServiceProvider().getId(), message);
        }
        
        // Send to admin topic for monitoring
        messagingTemplate.convertAndSend("/topic/admin/service-requests", message);
    }
    
    /**
     * Method to broadcast location updates from service providers
     */
    public void broadcastLocationUpdate(Long providerId, Object locationData) {
        WebSocketMessage message = new WebSocketMessage("LOCATION_UPDATE", locationData);
        messagingTemplate.convertAndSend("/topic/location/" + providerId, message);
    }
}