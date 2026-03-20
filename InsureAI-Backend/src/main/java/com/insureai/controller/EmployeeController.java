package com.insureai.controller;

import com.insureai.model.Plan;
import com.insureai.model.User;
import com.insureai.repository.UserRepository;
import com.insureai.service.PlanService;
import com.insureai.service.ClaimService;
import com.insureai.service.AppointmentService;
import com.insureai.service.PaymentService;
import com.insureai.model.Claim;
import com.insureai.model.Appointment;
import com.insureai.model.Availability;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.nio.charset.StandardCharsets;
import java.util.Collection;

@RestController
@RequestMapping("/api/employee")
public class EmployeeController {

    private final UserRepository userRepository;
    private final PlanService planService;
    private final ClaimService claimService;
    private final AppointmentService appointmentService;
    private final PaymentService paymentService;

    public EmployeeController(UserRepository userRepository,
                              PlanService planService,
                              ClaimService claimService,
                              AppointmentService appointmentService,
                              PaymentService paymentService) {
        this.userRepository = userRepository;
        this.planService = planService;
        this.claimService = claimService;
        this.appointmentService = appointmentService;
        this.paymentService = paymentService;
    }

    // ✅ Dashboard metrics
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(Authentication auth) {
        String email = auth.getName();
        Map<String, Object> data = new HashMap<>();
        data.put("myClaims", claimService.countClaimsByEmployee(email));
        data.put("pendingClaims", claimService.countClaimsByEmployeeAndStatus(email, "Pending"));
        data.put("upcomingAppointments", appointmentService.countUpcomingByEmployee(email));
        data.put("activePolicies", planService.countActiveByEmployee(email));
        data.put("paymentsMade", paymentService.countPaymentsByEmployee(email)); // ✅ FIXED
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

    @PostMapping("/appointments")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public Appointment requestAppointment(@RequestBody Appointment appointment, Authentication authentication) {
        String email = authentication.getName();
        appointment.setEmployeeEmail(email);
        appointment.setStatus("PENDING_APPROVAL");
        return appointmentService.saveAppointment(appointment);
    }

    @PostMapping("/appointments/{id}/cancel")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<String> cancelAppointment(@PathVariable Long id) {
        appointmentService.updateStatus(id, "CANCELLED");
        return ResponseEntity.ok("Appointment " + id + " cancelled successfully");
    }

    @GetMapping("/availability")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public List<Availability> getAllOpenSlots() {
        return appointmentService.findAllOpenAvailability();
    }

    // ============================
    // 🔹 EMPLOYEE REPORTS
    // ============================

    @GetMapping("/reports")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public Map<String, Object> getEmployeeReport(Authentication authentication) {
        String email = authentication.getName();
        return Map.ofEntries(
            Map.entry("claimsProcessed", claimService.countClaimsByEmployee(email)),
            Map.entry("appointmentsScheduled", appointmentService.countByEmployee(email)),
            Map.entry("activePolicies", planService.countActiveByEmployee(email)),
            Map.entry("paymentsMade", paymentService.countPaymentsByEmployee(email)) // ✅ FIXED
        );
    }

    @GetMapping("/reports/claims/export")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<byte[]> exportEmployeeClaims(Authentication authentication) {
        String csv = "ClaimId,Status,Amount\nE001,Approved,1200\nE002,Pending,800";
        byte[] bytes = csv.getBytes(StandardCharsets.UTF_8);
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=employee_claims.csv")
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .body(bytes);
    }

    // ============================
    // 🔹 EMPLOYEE PROFILE
    // ============================

    @GetMapping("/profile")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public User getProfile(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PutMapping("/profile/update")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public User updateProfile(@RequestBody User updated, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        user.setUsername(updated.getUsername());
        user.setStatus(updated.getStatus());

        return userRepository.save(user);
    }

    // ✅ Debugging authorities
    @GetMapping("/debug")
    public Collection<? extends GrantedAuthority> debugAuth(Authentication authentication) {
        return authentication.getAuthorities();
    }
}
