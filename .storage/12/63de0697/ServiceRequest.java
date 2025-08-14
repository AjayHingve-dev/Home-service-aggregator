package com.homeservice.aggregator.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "service_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "provider_id")
    private ServiceProvider serviceProvider;

    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private RequestStatus status = RequestStatus.PENDING;

    private LocalDateTime requestedDateTime;
    private LocalDateTime scheduledDateTime;
    private LocalDateTime completedDateTime;

    @Size(max = 500)
    private String description;

    private Double userLatitude;
    private Double userLongitude;
    private String userAddress;

    @Column(precision = 10, scale = 2)
    private BigDecimal finalPrice;

    private Integer rating;

    @Size(max = 500)
    private String feedback;

    public enum RequestStatus {
        PENDING,
        ACCEPTED,
        REJECTED,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED
    }

    public ServiceRequest(User user, Service service, String description, LocalDateTime scheduledDateTime, 
                         Double userLatitude, Double userLongitude, String userAddress) {
        this.user = user;
        this.service = service;
        this.description = description;
        this.scheduledDateTime = scheduledDateTime;
        this.requestedDateTime = LocalDateTime.now();
        this.userLatitude = userLatitude;
        this.userLongitude = userLongitude;
        this.userAddress = userAddress;
    }
}