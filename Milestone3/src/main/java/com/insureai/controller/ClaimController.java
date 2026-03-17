package com.insureai.controller;

import com.insureai.model.Claim;
import com.insureai.service.ClaimService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/claims")
@CrossOrigin(origins = "http://localhost:5173")
public class ClaimController {

    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    @GetMapping
    public List<Claim> getAllClaims() {
        return claimService.getAllClaims();
    }

    @GetMapping("/{id}")
    public Claim getClaimById(@PathVariable Long id) {
        return claimService.getClaimById(id);
    }

    @PostMapping
    public Claim createClaim(@RequestBody Claim claim) {
        return claimService.saveClaim(claim);
    }

    @PutMapping("/{id}/status")
    public Claim updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return claimService.updateStatus(id, body.get("status"));
    }

    @DeleteMapping("/{id}")
    public void deleteClaim(@PathVariable Long id) {
        claimService.deleteClaim(id);
    }

    // ✅ Request update
    @PostMapping("/{id}/request-update")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<String> requestUpdate(@PathVariable Long id, Authentication auth) {
        claimService.updateStatus(id, "REQUEST_UPDATE");
        return ResponseEntity.ok("Update request submitted for claim " + id);
    }

    // ✅ Withdraw claim
    @PostMapping("/{id}/withdraw")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<String> withdrawClaim(@PathVariable Long id, Authentication auth) {
        claimService.updateStatus(id, "WITHDRAWN");
        return ResponseEntity.ok("Claim " + id + " withdrawn successfully");
    }
}
