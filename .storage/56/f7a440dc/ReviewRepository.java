package com.homeservice.aggregator.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.homeservice.aggregator.model.Review;
import com.homeservice.aggregator.model.ServiceProvider;
import com.homeservice.aggregator.model.ServiceRequest;
import com.homeservice.aggregator.model.User;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    List<Review> findByServiceProviderId(Long serviceProviderId);
    
    List<Review> findByUserId(Long userId);
    
    Optional<Review> findByServiceRequestAndUser(ServiceRequest serviceRequest, User user);
    
    boolean existsByServiceRequestAndUser(ServiceRequest serviceRequest, User user);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.serviceProvider = :provider")
    Double getAverageRatingByProvider(@Param("provider") ServiceProvider provider);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.serviceProvider = :provider")
    Integer getReviewCountByProvider(@Param("provider") ServiceProvider provider);
}