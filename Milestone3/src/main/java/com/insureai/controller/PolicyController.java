package com.insureai.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.insureai.service.PlanService;
import com.insureai.repository.UserRepository;
@RestController
@RequestMapping("/api/policies")
public class PolicyController {

    private final PlanService planService; // ✅ declare field

    // Constructor injection
    public PolicyController(PlanService planService) {
        this.planService = planService;
    }
    
	@PostMapping("/{id}/subscribe")
	@PreAuthorize("hasAnyRole('EMPLOYEE','ADMIN')")
	public ResponseEntity<String> subscribePolicy(
	        @PathVariable Long id,
	        Authentication authentication) {

	    String email = authentication.getName();
	    planService.subscribeEmployeeToPolicy(email, id); // correct order and types

	    return ResponseEntity.ok("User " + email + " subscribed to policy ID: " + id);
	}
	
	@PostMapping("/policies/{id}/unsubscribe")
	@PreAuthorize("hasRole('EMPLOYEE')")
	public ResponseEntity<?> unsubscribePolicy(@PathVariable Long id, Authentication auth) {
	    String email = auth.getName();
	    planService.unsubscribePolicy(email, id);
	    return ResponseEntity.ok("Unsubscribed successfully");
	}


    @PostMapping("/{id}/request-info")
    @PreAuthorize("hasAnyRole('EMPLOYEE','ADMIN')")
    public ResponseEntity<String> requestInfo(
            @PathVariable Long id,
            Authentication authentication) {

        return ResponseEntity.ok("User " + authentication.getName() +
                " requested info for policy ID: " + id);
    }
}


