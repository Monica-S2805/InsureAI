package com.insureai.controller;

import com.insureai.service.PlanService;
import com.insureai.service.UserService;
import com.insureai.service.ClaimService;
import com.insureai.service.AppointmentService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:5173")
public class ReportsController {

    private final PlanService planService;
    private final UserService userService;
    private final ClaimService claimService;
    private final AppointmentService appointmentService;

    public ReportsController(PlanService planService,
                             UserService userService,
                             ClaimService claimService,
                             AppointmentService appointmentService) {
        this.planService = planService;
        this.userService = userService;
        this.claimService = claimService;
        this.appointmentService = appointmentService;
    }

    // ✅ Summary JSON for dashboard
    @GetMapping("/summary")
    public Map<String, Object> getSummaryReport() {
        return Map.ofEntries(
            Map.entry("totalAppointments", appointmentService.countAppointments()),
            Map.entry("completedAppointments", appointmentService.countByStatus("Completed")),
            Map.entry("cancelledAppointments", appointmentService.countByStatus("Cancelled")),
            Map.entry("totalPlans", planService.countPlans()),
            Map.entry("activePlans", planService.countByStatus("Active")),
            Map.entry("inactivePlans", planService.countByStatus("Inactive")),
            Map.entry("totalUsers", userService.countUsers()),
            Map.entry("totalClaims", claimService.countClaims()),
            Map.entry("approvedClaims", claimService.countByStatus("Approved")),
            Map.entry("pendingClaims", claimService.countByStatus("Pending")),
            Map.entry("rejectedClaims", claimService.countByStatus("Rejected"))
        );
    }

    // ✅ CSV export example
    @GetMapping("/claims/export")
    public ResponseEntity<byte[]> exportClaimsReport() {
        // Demo CSV content — replace with real query results
        String csv = "ClaimId,Status,Amount\nC001,Approved,5000\nC002,Pending,2000";
        byte[] bytes = csv.getBytes(StandardCharsets.UTF_8);

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=claims_report.csv")
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .body(bytes);
    }

    // ✅ PDF export example (stub)
    @GetMapping("/users/export")
    public ResponseEntity<byte[]> exportUsersReport() {
        // For PDF, generate with iText or PDFBox
        String pdfStub = "User Report PDF content here";
        byte[] bytes = pdfStub.getBytes(StandardCharsets.UTF_8);

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=users_report.pdf")
            .contentType(MediaType.APPLICATION_PDF)
            .body(bytes);
    }
}
