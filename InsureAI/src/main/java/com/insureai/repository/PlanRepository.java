package com.insureai.repository;

import com.insureai.model.Plan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlanRepository extends JpaRepository<Plan, Long> {
    Optional<Plan> findByPolicyNumber(String policyNumber);

    long countByStatus(String status);
    long countByUsers_EmailAndStatus(String email, String status);
    long countByUsers_Email(String email);
    long countByAgentEmail(String email);
}
