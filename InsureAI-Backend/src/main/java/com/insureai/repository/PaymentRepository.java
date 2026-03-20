package com.insureai.repository;

import com.insureai.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // ✅ Find all payments made by a specific user
    List<Payment> findByUserEmail(String email);
    long countByUserEmail(String email);
    // ✅ (Optional) Find payments by plan number
    List<Payment> findByPolicyNumber(String policyNumber);
}
