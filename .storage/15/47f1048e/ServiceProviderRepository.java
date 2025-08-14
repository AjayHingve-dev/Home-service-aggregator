package com.homeservice.aggregator.repository;

import com.homeservice.aggregator.model.ServiceProvider;
import com.homeservice.aggregator.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceProviderRepository extends JpaRepository<ServiceProvider, Long> {
    Optional<ServiceProvider> findByUser(User user);
    Optional<ServiceProvider> findByUserId(Long userId);
    
    @Query("SELECT sp FROM ServiceProvider sp WHERE sp.isAvailable = true")
    List<ServiceProvider> findAllAvailable();
    
    @Query(value = "SELECT sp.* FROM service_providers sp " +
           "JOIN provider_services ps ON sp.id = ps.provider_id " +
           "WHERE ps.service_id = :serviceId AND sp.is_available = true", nativeQuery = true)
    List<ServiceProvider> findAvailableProvidersByServiceId(@Param("serviceId") Long serviceId);
}