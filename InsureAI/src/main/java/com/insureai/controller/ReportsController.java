package com.insureai.controller;

import com.insureai.model.Claim;
import com.insureai.service.PlanService;
import com.insureai.service.UserService;
import com.insureai.service.ClaimService;
import com.insureai.service.AppointmentService;
import com.insureai.service.PaymentService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/reports")
public class ReportsController {

    private final PlanService planService;
    private final UserService userService;
    private final ClaimService claimService;
    private final AppointmentService appointmentService;
    private final PaymentService paymentService;

    public ReportsController(PlanService planService,
                             UserService userService,
                             ClaimService claimService,
                             AppointmentService appointmentService,
                             PaymentService paymentService) {
        this.planService = planService;
        this.userService = userService;
        this.claimService = claimService;
        this.appointmentService = appointmentService;
        this.paymentService = paymentService;
    }

    // ============================
    // 🔹 EMPLOYEE REPORTS
    // ============================

    @GetMapping("/claims")
    public Map<String, Object> getEmployeeClaimsReport(@RequestParam String email) {
        return Map.ofEntries(
            Map.entry("totalClaims", claimService.countClaimsByEmployee(email)),
            Map.entry("approvedClaims", claimService.countByEmployeeAndStatus(email, "Approved")),
            Map.entry("pendingClaims", claimService.countByEmployeeAndStatus(email, "Pending")),
            Map.entry("rejectedClaims", claimService.countByEmployeeAndStatus(email, "Rejected"))
        );
    }

    @GetMapping("/appointments")
    public Map<String, Object> getEmployeeAppointmentsReport(@RequestParam String email) {
        return Map.ofEntries(
            Map.entry("totalAppointments", appointmentService.countByEmployee(email)),
            Map.entry("completedAppointments", appointmentService.countByEmployeeAndStatus(email, "Completed")),
            Map.entry("cancelledAppointments", appointmentService.countByEmployeeAndStatus(email, "Cancelled"))
        );
    }

    @GetMapping("/policies")
    public Map<String, Object> getEmployeePoliciesReport(@RequestParam String email) {
        return Map.ofEntries(
            Map.entry("totalPolicies", planService.countPlansByEmployee(email)),
            Map.entry("activePolicies", planService.countActiveByEmployee(email))
        );
    }

    @GetMapping("/payments")
    public Map<String, Object> getEmployeePaymentsReport(@RequestParam String email) {
        return Map.ofEntries(
            Map.entry("totalPayments", paymentService.countPaymentsByEmployee(email))
            
        );
    }

    @GetMapping("/claims/export")
    public ResponseEntity<byte[]> exportClaimsReport(@RequestParam String email) {
        // Fetch employee claims
        List<Claim> claims = claimService.getClaimsByEmployee(email);

        // Build CSV dynamically
        StringBuilder sb = new StringBuilder("ClaimId,Status,Amount\n");
        for (Claim claim : claims) {
            sb.append(claim.getClaimNumber())
              .append(",")
              .append(claim.getStatus())
              .append(",")
              .append(claim.getClaimAmount())
              .append("\n");
        }

        byte[] bytes = sb.toString().getBytes(StandardCharsets.UTF_8);

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=employee_claims.csv")
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .body(bytes);
    }

   

}