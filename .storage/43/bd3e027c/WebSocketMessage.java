package com.homeservice.aggregator.payload.websocket;

import java.util.Map;

public class WebSocketMessage {
    private String type;
    private Object payload;
    private String senderId;
    private String recipientId;
    private String timestamp;

    public WebSocketMessage() {
    }

    public WebSocketMessage(String type, Object payload) {
        this.type = type;
        this.payload = payload;
        this.timestamp = String.valueOf(System.currentTimeMillis());
    }
    
    public WebSocketMessage(String type, Object payload, String senderId, String recipientId) {
        this.type = type;
        this.payload = payload;
        this.senderId = senderId;
        this.recipientId = recipientId;
        this.timestamp = String.valueOf(System.currentTimeMillis());
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Object getPayload() {
        return payload;
    }

    public void setPayload(Object payload) {
        this.payload = payload;
    }

    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public String getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(String recipientId) {
        this.recipientId = recipientId;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    @Override
    public String toString() {
        return "WebSocketMessage{" +
                "type='" + type + '\'' +
                ", payload=" + payload +
                ", senderId='" + senderId + '\'' +
                ", recipientId='" + recipientId + '\'' +
                ", timestamp='" + timestamp + '\'' +
                '}';
    }
}