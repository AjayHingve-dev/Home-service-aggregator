package com.homeservice.aggregator.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.homeservice.aggregator.model.ServiceRequest;
import com.homeservice.aggregator.payload.websocket.WebSocketMessage;

@Controller
public class WebSocketController {
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @MessageMapping("/send")
    public void processMessage(@Payload WebSocketMessage message) {
        if (message.getRecipientId() != null) {
            // Send to a specific user
            messagingTemplate.convertAndSendToUser(
                    message.getRecipientId(), "/queue/private", message);
        } else {
            // Broadcast to all subscribers
            messagingTemplate.convertAndSend("/topic/public", message);
        }
    }
    
    // Called from other controllers to notify about service request updates
    public void notifyServiceRequestUpdate(ServiceRequest request) {
        WebSocketMessage message = new WebSocketMessage(
                "SERVICE_REQUEST_UPDATE", 
                request, 
                "SYSTEM", 
                request.getUser().getId().toString());
        
        // Notify the user who created the request
        messagingTemplate.convertAndSendToUser(
                request.getUser().getId().toString(), 
                "/queue/private", 
                message);
        
        // If a provider is assigned, notify them as well
        if (request.getServiceProvider() != null) {
            WebSocketMessage providerMessage = new WebSocketMessage(
                    "SERVICE_REQUEST_UPDATE", 
                    request, 
                    "SYSTEM", 
                    request.getServiceProvider().getUser().getId().toString());
            
            messagingTemplate.convertAndSendToUser(
                    request.getServiceProvider().getUser().getId().toString(), 
                    "/queue/private", 
                    providerMessage);
        }
        
        // Also broadcast to admin topic
        messagingTemplate.convertAndSend("/topic/admin/requests", message);
    }
    
    // Called to broadcast provider location updates
    public void broadcastLocationUpdate(Long providerId, Map<String, Object> locationData) {
        WebSocketMessage message = new WebSocketMessage(
                "PROVIDER_LOCATION_UPDATE", 
                Map.of(
                    "providerId", providerId,
                    "latitude", locationData.get("latitude"),
                    "longitude", locationData.get("longitude"),
                    "timestamp", System.currentTimeMillis()
                ));
        
        messagingTemplate.convertAndSend("/topic/locations", message);
    }
    
    // Called when a new service is added or updated
    public void broadcastServiceUpdate(String action, Object serviceData) {
        WebSocketMessage message = new WebSocketMessage(
                "SERVICE_" + action, 
                serviceData);
        
        messagingTemplate.convertAndSend("/topic/services", message);
    }
    
    // Called when a new provider registers or updates their profile
    public void broadcastProviderUpdate(String action, Object providerData) {
        WebSocketMessage message = new WebSocketMessage(
                "PROVIDER_" + action, 
                providerData);
        
        messagingTemplate.convertAndSend("/topic/providers", message);
    }
}