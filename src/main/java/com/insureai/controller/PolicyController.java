package com.insureai.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.insureai.service.PlanService;
import com.insureai.service.NotificationService;

@RestController
@RequestMapping("/api/policies")
public class PolicyController {

    private final PlanService planService;
    private final NotificationService notificationService;

    // Constructor injection
    public PolicyController(PlanService planService, NotificationService notificationService) {
        this.planService = planService;
        this.notificationService = notificationService;
    }

    @PostMapping("/{id}/subscribe")
    @PreAuthorize("hasAnyRole('EMPLOYEE','ADMIN')")
    public ResponseEntity<String> subscribePolicy(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();
        planService.subscribeEmployeeToPolicy(email, id);

        // 🔔 Notification
        notificationService.createNotification(email, "EMPLOYEE",
                "Subscribed to policy ID: " + id, "SUCCESS");

        return ResponseEntity.ok("User " + email + " subscribed to policy ID: " + id);
    }

    @PostMapping("/{id}/unsubscribe")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<?> unsubscribePolicy(@PathVariable Long id, Authentication auth) {
        String email = auth.getName();
        planService.unsubscribePolicy(email, id);

        // 🔔 Notification
        notificationService.createNotification(email, "EMPLOYEE",
                "Unsubscribed from policy ID: " + id, "INFO");

        return ResponseEntity.ok("Unsubscribed successfully");
    }

    @PostMapping("/{id}/request-info")
    @PreAuthorize("hasAnyRole('EMPLOYEE','ADMIN')")
    public ResponseEntity<String> requestInfo(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();

        // 🔔 Notification
        notificationService.createNotification(email, "EMPLOYEE",
                "Requested info for policy ID: " + id, "INFO");

        return ResponseEntity.ok("User " + email +
                " requested info for policy ID: " + id);
    }
}
 