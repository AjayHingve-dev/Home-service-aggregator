package com.homeservice.aggregator.repository;

import com.homeservice.aggregator.model.ServiceRequest;
import com.homeservice.aggregator.model.ServiceRequest.RequestStatus;
import com.homeservice.aggregator.model.User;
import com.homeservice.aggregator.model.ServiceProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {
    List<ServiceRequest> findByUser(User user);
    List<ServiceRequest> findByUserOrderByRequestedDateTimeDesc(User user);
    List<ServiceRequest> findByServiceProvider(ServiceProvider provider);
    List<ServiceRequest> findByServiceProviderOrderByRequestedDateTimeDesc(ServiceProvider provider);
    List<ServiceRequest> findByStatus(RequestStatus status);
    List<ServiceRequest> findByUserAndStatus(User user, RequestStatus status);
    List<ServiceRequest> findByServiceProviderAndStatus(ServiceProvider provider, RequestStatus status);
}