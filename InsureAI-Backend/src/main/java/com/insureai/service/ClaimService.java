package com.insureai.service;

import com.insureai.model.Claim;
import com.insureai.model.User;
import com.insureai.repository.ClaimRepository;
import com.insureai.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final UserRepository userRepository;

    public ClaimService(ClaimRepository claimRepository, UserRepository userRepository) {
        this.claimRepository = claimRepository;
        this.userRepository = userRepository;
    }

    public long countClaimsByEmployee(String email) {
        return claimRepository.countByEmployeeEmail(email);
    }

    public long countByEmployeeAndStatus(String email, String status) {
        return claimRepository.countByEmployeeEmailAndStatus(email, status);
    }
    // 🔹 Generic CRUD
    public List<Claim> getAllClaims() {
        return claimRepository.findAll();
    }
    public List<Claim> getClaimsByEmployee(String email) {
        return claimRepository.findByEmployeeEmail(email);
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

    // 🔹 Admin reporting
    public long countClaims() {
        return claimRepository.count();
    }

    public long countByStatus(String status) {
        return claimRepository.countByStatus(status);
    }

    // 🔹 Employee reporting

    public long countClaimsByEmployeeAndStatus(String email, String status) {
        return claimRepository.countByEmployeeEmailAndStatus(email, status);
    }

    public List<Claim> findClaimsByEmployee(String email) {
        return claimRepository.findByEmployeeEmail(email);
    }

    // 🔹 Create claim tied to employee
    public Claim createClaimForEmployee(String email, Claim claim) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        claim.setEmployee(user);
        claim.setEmployeeEmail(email);
        claim.setStatus("Pending");

        if (claim.getClaimNumber() == null || claim.getClaimNumber().isEmpty()) {
            String generatedNumber = "CLM-" + System.currentTimeMillis();
            claim.setClaimNumber(generatedNumber);
        }

        return claimRepository.save(claim);
    }
}
