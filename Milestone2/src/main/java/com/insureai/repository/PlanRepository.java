package com.insureai.repository;

import com.insureai.model.Plan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanRepository extends JpaRepository<Plan, Long> {
	 long countByStatus(String status);
	 
}
