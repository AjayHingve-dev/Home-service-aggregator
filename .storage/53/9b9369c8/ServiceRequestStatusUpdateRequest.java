package com.homeservice.aggregator.payload.request;

import javax.validation.constraints.NotBlank;

public class ServiceRequestStatusUpdateRequest {
    
    @NotBlank(message = "Status is required")
    private String status;
    
    private String comment;
    
    private Long serviceProviderId;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Long getServiceProviderId() {
        return serviceProviderId;
    }

    public void setServiceProviderId(Long serviceProviderId) {
        this.serviceProviderId = serviceProviderId;
    }
}