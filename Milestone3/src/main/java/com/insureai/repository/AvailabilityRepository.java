package com.insureai.repository;

import com.insureai.model.Availability;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AvailabilityRepository extends JpaRepository<Availability, Long> {
    List<Availability> findByAgentEmail(String agentEmail);
    List<Availability> findByStatus(String status);
}
