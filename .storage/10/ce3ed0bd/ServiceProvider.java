package com.homeservice.aggregator.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@Table(name = "service_providers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceProvider {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @NotBlank
    @Size(max = 200)
    private String description;

    @Column(name = "is_available")
    private Boolean isAvailable = false;

    private Double averageRating = 0.0;
    private Integer totalRatings = 0;

    @Size(max = 500)
    private String qualifications;

    @Size(max = 500)
    private String experiences;

    public ServiceProvider(User user, String description, String qualifications, String experiences) {
        this.user = user;
        this.description = description;
        this.qualifications = qualifications;
        this.experiences = experiences;
    }
}