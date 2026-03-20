package com.insureai.service;

import com.insureai.model.Payment;
import com.insureai.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentService {
    private final PaymentRepository repo;

    public PaymentService(PaymentRepository repo) {
        this.repo = repo;
    }

    // ✅ Process and save a new payment
    public Payment process(Payment payment) {
        payment.setStatus("SUCCESS");              // default status
        payment.setPaidAt(LocalDateTime.now());    // set timestamp
        return repo.save(payment);
    }
    public long countPaymentsByEmployee(String email) {
        return repo.countByUserEmail(email);
    
}
    // ✅ Get all payments
    public List<Payment> findAll() {
        return repo.findAll();
    }

    // ✅ Get payments by user email
    public List<Payment> findByUserEmail(String email) {
        return repo.findByUserEmail(email);
    }

    // ✅ Get payment by ID
    public Payment findById(Long id) {
        return repo.findById(id)
                   .orElseThrow(() -> new RuntimeException("Payment not found: " + id));
    }

    // ✅ Delete payment
    public void delete(Long id) {
        repo.deleteById(id);
    }
}
