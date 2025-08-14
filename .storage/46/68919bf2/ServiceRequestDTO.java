package com.homeservice.aggregator.payload.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import com.homeservice.aggregator.model.ServiceRequest;

public class ServiceRequestDTO {
    
    private Long id;
    
    @NotNull(message = "Service ID is required")
    private Long serviceId;
    
    private Long userId;
    
    private Long serviceProviderId;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    @NotBlank(message = "Address is required")
    private String address;
    
    private Double latitude;
    private Double longitude;
    
    @NotNull(message = "Requested date is required")
    private LocalDateTime requestedDate;
    
    private LocalDateTime completedDate;
    
    @Positive(message = "Price must be positive")
    private BigDecimal price;
    
    private String status;
    
    private String serviceName;
    private String userName;
    private String providerName;
    private String userPhone;
    private String providerPhone;
    
    // For frontend display
    private boolean canCancel;
    private boolean canComplete;
    
    public ServiceRequestDTO() {
    }
    
    public ServiceRequestDTO(ServiceRequest request) {
        this.id = request.getId();
        this.serviceId = request.getService().getId();
        this.userId = request.getUser().getId();
        this.serviceName = request.getService().getName();
        this.description = request.getDescription();
        this.address = request.getAddress();
        this.latitude = request.getLatitude();
        this.longitude = request.getLongitude();
        this.requestedDate = request.getRequestedDate();
        this.completedDate = request.getCompletedDate();
        this.price = request.getPrice();
        this.status = request.getStatus();
        this.userName = request.getUser().getFirstName() + " " + request.getUser().getLastName();
        this.userPhone = request.getUser().getPhone();
        
        if (request.getServiceProvider() != null) {
            this.serviceProviderId = request.getServiceProvider().getId();
            this.providerName = request.getServiceProvider().getUser().getFirstName() + " " + 
                              request.getServiceProvider().getUser().getLastName();
            this.providerPhone = request.getServiceProvider().getUser().getPhone();
        }
        
        // Set permission flags
        this.canCancel = request.getStatus().equals("PENDING") || request.getStatus().equals("ACCEPTED");
        this.canComplete = request.getStatus().equals("IN_PROGRESS");
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getServiceProviderId() {
        return serviceProviderId;
    }

    public void setServiceProviderId(Long serviceProviderId) {
        this.serviceProviderId = serviceProviderId;
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

    public LocalDateTime getCompletedDate() {
        return completedDate;
    }

    public void setCompletedDate(LocalDateTime completedDate) {
        this.completedDate = completedDate;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getProviderName() {
        return providerName;
    }

    public void setProviderName(String providerName) {
        this.providerName = providerName;
    }

    public String getUserPhone() {
        return userPhone;
    }

    public void setUserPhone(String userPhone) {
        this.userPhone = userPhone;
    }

    public String getProviderPhone() {
        return providerPhone;
    }

    public void setProviderPhone(String providerPhone) {
        this.providerPhone = providerPhone;
    }

    public boolean isCanCancel() {
        return canCancel;
    }

    public void setCanCancel(boolean canCancel) {
        this.canCancel = canCancel;
    }

    public boolean isCanComplete() {
        return canComplete;
    }

    public void setCanComplete(boolean canComplete) {
        this.canComplete = canComplete;
    }
}