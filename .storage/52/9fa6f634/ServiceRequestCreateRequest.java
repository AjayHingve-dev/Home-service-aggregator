package com.homeservice.aggregator.payload.request;

import java.time.LocalDateTime;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class ServiceRequestCreateRequest {
    
    @NotNull(message = "Service ID is required")
    private Long serviceId;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    @NotBlank(message = "Address is required")
    private String address;
    
    private Double latitude;
    private Double longitude;
    
    @NotNull(message = "Requested date is required")
    private LocalDateTime requestedDate;
    
    private Long preferredProviderId;

    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public LocalDateTime getRequestedDate() {
        return requestedDate;
    }

    public void setRequestedDate(LocalDateTime requestedDate) {
        this.requestedDate = requestedDate;
    }

    public Long getPreferredProviderId() {
        return preferredProviderId;
    }

    public void setPreferredProviderId(Long preferredProviderId) {
        this.preferredProviderId = preferredProviderId;
    }
}