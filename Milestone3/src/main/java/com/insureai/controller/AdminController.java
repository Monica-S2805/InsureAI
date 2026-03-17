package com.insureai.controller;

import com.insureai.model.Claim;
import com.insureai.model.Appointment;
import com.insureai.model.Plan;
import com.insureai.service.ClaimService;
import com.insureai.service.PlanService;
import com.insureai.service.UserService;
import com.insureai.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final PlanService planService;
    private final UserService userService;
    private final AppointmentService appointmentService;
    private final ClaimService claimService;

    public AdminController(PlanService planService,
                           UserService userService,
                           AppointmentService appointmentService,
                           ClaimService claimService) {
        this.planService = planService;
        this.userService = userService;
        this.appointmentService = appointmentService;
        this.claimService = claimService;
    }

    // ✅ Dashboard metrics
    @GetMapping("/metrics")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Map<String, String>> getMetrics() {
        long totalPlans = planService.countPlans();
        long activePlans = planService.countByStatus("Active");
        long inactivePlans = planService.countByStatus("Inactive");
        long totalUsers = userService.countUsers();
        long totalAppointments = appointmentService.countAppointments();

        return List.of(
                Map.of("label", "Total Plans", "value", String.valueOf(totalPlans)),
                Map.of("label", "Active Plans", "value", String.valueOf(activePlans)),
                Map.of("label", "Inactive Plans", "value", String.valueOf(inactivePlans)),
                Map.of("label", "Total Users", "value", String.valueOf(totalUsers)),
                Map.of("label", "Total Appointments", "value", String.valueOf(totalAppointments))
        );
    }

    // ✅ Manage policies
    @PostMapping("/policies")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Plan> createPolicy(@RequestBody Plan plan) {
        Plan savedPlan = planService.savePlan(plan);
        return ResponseEntity.ok(savedPlan);
    }

    @GetMapping("/policies")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Plan> getAllPolicies() {
        return planService.getAllPlans();
    }

    @GetMapping("/policies/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Plan getPolicyById(@PathVariable Long id) {
        return planService.getPlanById(id);
    }

    @PutMapping("/policies/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Plan updatePolicy(@PathVariable Long id, @RequestBody Plan plan) {
        return planService.updatePlan(id, plan);
    }

    @DeleteMapping("/policies/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deletePolicy(@PathVariable Long id) {
        planService.deletePlan(id);
        return ResponseEntity.ok("Policy " + id + " deleted successfully");
    }

    // ✅ Manage claims
    @GetMapping("/claims")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Claim> getAllClaims() {
        return claimService.getAllClaims();
    }

    @GetMapping("/claims/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Claim getClaimById(@PathVariable Long id) {
        return claimService.getClaimById(id);
    }

    @PutMapping("/claims/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public Claim updateClaimStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return claimService.updateStatus(id, body.get("status"));
    }

    @DeleteMapping("/claims/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteClaim(@PathVariable Long id) {
        claimService.deleteClaim(id);
    }

    // ✅ Manage appointments
    @GetMapping("/appointments")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @GetMapping("/appointments/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Appointment getAppointmentById(@PathVariable Long id) {
        return appointmentService.getAppointmentById(id);
    }

    // 🔑 Approval workflow
    @PostMapping("/appointments/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> approveAppointment(@PathVariable Long id) {
        appointmentService.updateStatus(id, "APPROVED");
        return ResponseEntity.ok("Appointment " + id + " approved successfully");
    }

    @PostMapping("/appointments/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> rejectAppointment(@PathVariable Long id) {
        appointmentService.updateStatus(id, "REJECTED");
        return ResponseEntity.ok("Appointment " + id + " rejected successfully");
    }

    @PostMapping("/appointments/{id}/cancel")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> cancelAppointment(@PathVariable Long id) {
        appointmentService.updateStatus(id, "CANCELLED");
        return ResponseEntity.ok("Appointment " + id + " cancelled successfully");
    }

    @PutMapping("/appointments/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public Appointment updateAppointmentStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return appointmentService.updateStatus(id, body.get("status"));
    }

    @DeleteMapping("/appointments/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.ok("Appointment " + id + " deleted successfully");
    }
}
