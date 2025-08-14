package com.homeservice.aggregator.payload.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import javax.validation.constraints.Size;

import com.homeservice.aggregator.model.Service;
import com.homeservice.aggregator.model.ServiceProvider;

public class ServiceDTO {
    
    private Long id;
    
    @NotBlank(message = "Service name is required")
    @Size(min = 3, max = 50, message = "Name must be between 3 and 50 characters")
    private String name;
    
    @NotBlank(message = "Description is required")
    @Size(min = 10, message = "Description must be at least 10 characters")
    private String description;
    
    @NotNull(message = "Base price is required")
    @Positive(message = "Base price must be positive")
    private BigDecimal basePrice;
    
    private String category;
    private String imageUrl;
    private List<ServiceProviderDTO> providers = new ArrayList<>();
    private Boolean active;

    public ServiceDTO() {
    }
    
    public ServiceDTO(Service service) {
        this.id = service.getId();
        this.name = service.getName();
        this.description = service.getDescription();
        this.basePrice = service.getBasePrice();
        this.category = service.getCategory();
        this.imageUrl = service.getImageUrl();
        this.active = service.getActive();
        
        if (service.getProviders() != null) {
            this.providers = service.getProviders().stream()
                    .map(ServiceProviderDTO::new)
                    .collect(Collectors.toList());
        }
    }

    // Constructor without providers to prevent circular references when needed
    public ServiceDTO(Service service, boolean includeProviders) {
        this.id = service.getId();
        this.name = service.getName();
        this.description = service.getDescription();
        this.basePrice = service.getBasePrice();
        this.category = service.getCategory();
        this.imageUrl = service.getImageUrl();
        this.active = service.getActive();
        
        if (includeProviders && service.getProviders() != null) {
            this.providers = service.getProviders().stream()
                    .map(provider -> {
                        ServiceProviderDTO dto = new ServiceProviderDTO();
                        dto.setId(provider.getId());
                        dto.setUserId(provider.getUser().getId());
                        dto.setUserName(provider.getUser().getFirstName() + " " + provider.getUser().getLastName());
                        dto.setRating(provider.getRating());
                        dto.setHourlyRate(provider.getHourlyRate());
                        dto.setAvailable(provider.getAvailable());
                        return dto;
                    })
                    .collect(Collectors.toList());
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(BigDecimal basePrice) {
        this.basePrice = basePrice;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public List<ServiceProviderDTO> getProviders() {
        return providers;
    }

    public void setProviders(List<ServiceProviderDTO> providers) {
        this.providers = providers;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}