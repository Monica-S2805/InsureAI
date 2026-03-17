package com.insureai.controller;

import com.insureai.model.Plan;
import com.insureai.model.User;
import com.insureai.repository.UserRepository;
import com.insureai.service.PlanService;
import com.insureai.service.ClaimService;
import com.insureai.service.AppointmentService;
import com.insureai.model.Claim;
import com.insureai.model.Appointment;
import com.insureai.model.Availability;
import com.insureai.repository.AvailabilityRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Collection;

@RestController
@RequestMapping("/api/employee")
public class EmployeeController {

    private final UserRepository userRepository;
    private final PlanService planService;
    private final ClaimService claimService;
    private final AppointmentService appointmentService;

    public EmployeeController(UserRepository userRepository,
                              PlanService planService,
                              ClaimService claimService,
                              AppointmentService appointmentService) {
        this.userRepository = userRepository;
        this.planService = planService;
        this.claimService = claimService;
        this.appointmentService = appointmentService;
    }

    // ✅ Dashboard metrics
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(Authentication auth) {
        String email = auth.getName();
        Map<String, Object> data = new HashMap<>();
        data.put("myClaims", claimService.countClaimsByEmployee(email));
        data.put("pendingClaims", claimService.countPendingClaimsByEmployee(email));
        data.put("upcomingAppointments", appointmentService.countUpcomingByEmployee(email));
        data.put("activePolicies", planService.countActiveByEmployee(email));
        return ResponseEntity.ok(data);
    }

    // ✅ Policies
    @GetMapping("/my-policies")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public List<Plan> getMyPolicies(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getPlans();
    }

    // ✅ Claims
    @PostMapping("/claims")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public Claim createClaim(@RequestBody Claim claim, Authentication authentication) {
        String email = authentication.getName();
        return claimService.createClaimForEmployee(email, claim);
    }

    @PostMapping("/{id}/request-update")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<String> requestUpdate(@PathVariable Long id) {
        claimService.updateStatus(id, "REQUEST_UPDATE");
        return ResponseEntity.ok("Update request submitted for claim " + id);
    }

    @PostMapping("/{id}/withdraw")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<String> withdrawClaim(@PathVariable Long id) {
        claimService.updateStatus(id, "WITHDRAWN");
        claimService.deleteClaim(id);
        return ResponseEntity.ok("Claim " + id + " withdrawn successfully");
    }

    @GetMapping("/my-claims")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public List<Claim> getMyClaims(Authentication authentication) {
        String email = authentication.getName();
        return claimService.findClaimsByEmployee(email);
    }

    // ✅ Appointments
    @GetMapping("/my-appointments")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public List<Appointment> getMyAppointments(Authentication authentication) {
        String email = authentication.getName();
        return appointmentService.findAppointmentsByEmployee(email);
    }

    // Employee requests appointment → goes into PENDING_APPROVAL
    @PostMapping("/appointments")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public Appointment requestAppointment(@RequestBody Appointment appointment, Authentication authentication) {
        String email = authentication.getName();
        appointment.setEmployeeEmail(email);
        appointment.setStatus("PENDING_APPROVAL");
        return appointmentService.saveAppointment(appointment);
    }

    // Employee can cancel their own appointment
    @PostMapping("/appointments/{id}/cancel")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<String> cancelAppointment(@PathVariable Long id) {
        appointmentService.updateStatus(id, "CANCELLED");
        return ResponseEntity.ok("Appointment " + id + " cancelled successfully");
    }

 // ✅ Employees can view all open availability slots across agents
    @GetMapping("/availability")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public List<Availability> getAllOpenSlots() {
        return appointmentService.findAllOpenAvailability();
    }

    // ✅ Debugging authorities
    @GetMapping("/debug")
    public Collection<? extends GrantedAuthority> debugAuth(Authentication authentication) {
        return authentication.getAuthorities();
    }
}
