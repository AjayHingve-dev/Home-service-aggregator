package com.homeservice.aggregator.repository;

import com.homeservice.aggregator.model.Role;
import com.homeservice.aggregator.model.Role.ERole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(ERole name);
}