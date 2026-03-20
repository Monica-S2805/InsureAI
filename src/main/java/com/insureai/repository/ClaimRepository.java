package com.insureai.repository;

import com.insureai.model.Claim;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ClaimRepository extends JpaRepository<Claim, Long> {
    long countByStatus(String status);
    List<Claim> findByEmployeeEmail(String email);
   
   // matches the actual field
    long countByEmployeeEmailAndStatus(String email, String status); // if you want to filter by status too
   
    
        long countByEmployeeEmail(String email);
    }
       
    
   


