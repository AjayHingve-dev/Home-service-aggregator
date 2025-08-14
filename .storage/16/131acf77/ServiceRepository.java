package com.homeservice.aggregator.repository;

import com.homeservice.aggregator.model.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    List<Service> findByNameContainingIgnoreCase(String name);
    
    @Query(value = "SELECT s.* FROM services s " +
           "JOIN provider_services ps ON s.id = ps.service_id " +
           "WHERE ps.provider_id = :providerId", nativeQuery = true)
    List<Service> findServicesByProviderId(@Param("providerId") Long providerId);
}