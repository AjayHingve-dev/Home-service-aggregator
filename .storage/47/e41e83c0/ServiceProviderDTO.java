package com.homeservice.aggregator.payload.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import javax.validation.constraints.Size;

import com.homeservice.aggregator.model.ServiceProvider;

public class ServiceProviderDTO {
    
    private Long id;
    
    @NotNull(message = "User ID is required")
    private Long userId;
    
    private String userName;
    private String email;
    private String phone;
    
    @Size(min = 10, message = "Description must be at least 10 characters")
    private String description;
    
    @Positive(message = "Hourly rate must be positive")
    private BigDecimal hourlyRate;
    
    private Boolean available;
    private Double rating;
    private Integer reviewCount;
    
    @Size(min = 1, message = "At least one service is required")
    private List<Long> serviceIds = new ArrayList<>();
    
    private List<String> serviceNames = new ArrayList<>();
    
    @Size(min = 1, message = "At least one qualification is required")
    private List<String> qualifications = new ArrayList<>();
    
    private String profileImageUrl;
    private Double latitude;
    private Double longitude;
    private String address;

    public ServiceProviderDTO() {
    }
    
    public ServiceProviderDTO(ServiceProvider provider) {
        this.id = provider.getId();
        this.userId = provider.getUser().getId();
        this.userName = provider.getUser().getFirstName() + " " + provider.getUser().getLastName();
        this.email = provider.getUser().getEmail();
        this.phone = provider.getUser().getPhone();
        this.description = provider.getDescription();
        this.hourlyRate = provider.getHourlyRate();
        this.available = provider.getAvailable();
        this.rating = provider.getRating();
        this.reviewCount = provider.getReviewCount();
        this.profileImageUrl = provider.getProfileImageUrl();
        this.latitude = provider.getLatitude();
        this.longitude = provider.getLongitude();
        this.address = provider.getAddress();
        
        if (provider.getServices() != null) {
            this.serviceIds = provider.getServices().stream()
                    .map(service -> service.getId())
                    .collect(Collectors.toList());
            
            this.serviceNames = provider.getServices().stream()
                    .map(service -> service.getName())
                    .collect(Collectors.toList());
        }
        
        this.qualifications = provider.getQualifications();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getHourlyRate() {
        return hourlyRate;
    }

    public void setHourlyRate(BigDecimal hourlyRate) {
        this.hourlyRate = hourlyRate;
    }

    public Boolean getAvailable() {
        return available;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(Integer reviewCount) {
        this.reviewCount = reviewCount;
    }

    public List<Long> getServiceIds() {
        return serviceIds;
    }

    public void setServiceIds(List<Long> serviceIds) {
        this.serviceIds = serviceIds;
    }

    public List<String> getServiceNames() {
        return serviceNames;
    }

    public void setServiceNames(List<String> serviceNames) {
        this.serviceNames = serviceNames;
    }

    public List<String> getQualifications() {
        return qualifications;
    }

    public void setQualifications(List<String> qualifications) {
        this.qualifications = qualifications;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}