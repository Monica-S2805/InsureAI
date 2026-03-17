package com.insureai.service;

import com.insureai.model.Claim;
import com.insureai.repository.ClaimRepository;
import org.springframework.stereotype.Service;
import com.insureai.repository.UserRepository;
import com.insureai.model.User;
import java.util.List;

@Service
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final UserRepository userRepository;
    
    public ClaimService(ClaimRepository claimRepository, UserRepository userRepository) {
        this.claimRepository = claimRepository;
        this.userRepository = userRepository;
    }

    public List<Claim> getAllClaims() {
        return claimRepository.findAll();
    }

    public Claim getClaimById(Long id) {
        return claimRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Claim not found: " + id));
    }

    public Claim saveClaim(Claim claim) {
        return claimRepository.save(claim);
    }

    public Claim updateStatus(Long id, String status) {
        Claim claim = getClaimById(id);
        claim.setStatus(status);
        return claimRepository.save(claim);
    }

    public void deleteClaim(Long id) {
        claimRepository.deleteById(id);
    }

    public long countClaims() {
        return claimRepository.count();
    }

    public long countByStatus(String status) {
        return claimRepository.countByStatus(status);
    }

    public int countClaimsByEmployee(String email) {
        return claimRepository.countByEmployeeEmail(email);
    }

    public int countPendingClaimsByEmployee(String email) {
        return claimRepository.countByEmployeeEmailAndStatus(email, "Pending");
    }

    public List<Claim> findClaimsByEmployee(String email) {
        return claimRepository.findByEmployeeEmail(email);
    }

    public Claim createClaimForEmployee(String email, Claim claim) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ Attach both relationship and email
        claim.setEmployee(user);
        claim.setEmployeeEmail(email);
        claim.setStatus("PENDING");

        // ✅ Generate claim number if not provided
        if (claim.getClaimNumber() == null || claim.getClaimNumber().isEmpty()) {
            String generatedNumber = "CLM-" + System.currentTimeMillis();
            claim.setClaimNumber(generatedNumber);
        }

        return claimRepository.save(claim);
    }
}
