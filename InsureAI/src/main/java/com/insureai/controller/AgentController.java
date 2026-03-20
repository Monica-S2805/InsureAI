package com.insureai.controller;

import com.insureai.model.Appointment;
import com.insureai.model.Availability;
import com.insureai.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/agent")
@CrossOrigin(origins = "http://localhost:5173")
public class AgentController {

    private final AppointmentService appointmentService;

    public AgentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    // ✅ Fetch appointments assigned to the logged-in agent
    @GetMapping("/my-appointments")
    @PreAuthorize("hasRole('AGENT')")
    public List<Appointment> getMyAppointments(Authentication auth) {
        String email = auth.getName();
        return appointmentService.findAppointmentsByAgent(email);
    }

    // ✅ Fetch availability slots for the logged-in agent
    @GetMapping("/availability")
    @PreAuthorize("hasRole('AGENT')")
    public List<Availability> getAvailability(Authentication auth) {
        String email = auth.getName();
        return appointmentService.findAvailabilityByAgent(email);
    }

    // ✅ Publish new availability slot
    @PostMapping("/availability")
    @PreAuthorize("hasRole('AGENT')")
    public Availability publishAvailability(@RequestBody Map<String, String> body,
                                            Authentication auth) {
        String email = auth.getName();
        LocalDate date = LocalDate.parse(body.get("date"));
        LocalTime startTime = LocalTime.parse(body.get("startTime"));
        LocalTime endTime = LocalTime.parse(body.get("endTime"));

        return appointmentService.createAvailabilitySlot(email, date, startTime, endTime);
    }

    // ✅ Delete availability slot
    @DeleteMapping("/availability/{id}")
    @PreAuthorize("hasRole('AGENT')")
    public ResponseEntity<String> deleteAvailability(@PathVariable Long id, Authentication auth) {
        // Optional: check ownership before deletion
        appointmentService.deleteAvailabilitySlot(id);
        return ResponseEntity.ok("Availability slot " + id + " deleted successfully");
    }

    // ✅ Update appointment status (Completed, Rescheduled, Cancelled)
    @PutMapping("/appointments/{id}/status")
    @PreAuthorize("hasRole('AGENT')")
    public ResponseEntity<String> updateAppointmentStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        String status = body.get("status");
        appointmentService.updateStatus(id, status);
        return ResponseEntity.ok("Appointment " + id + " updated to " + status);
    }

 // ✅ Delete appointment assigned to the logged-in agent
    @DeleteMapping("/appointments/{id}")
    @PreAuthorize("hasRole('AGENT')")
    public ResponseEntity<String> deleteAppointment(@PathVariable Long id, Authentication auth) {
        String agentEmail = auth.getName();

        Appointment appointment = appointmentService.getAppointmentById(id);

        // Optional: check that this appointment belongs to the logged-in agent
        if (appointment == null || !appointment.getAgentEmail().equals(agentEmail)) {
            return ResponseEntity.status(403).body("You are not authorized to delete this appointment");
        }

        appointmentService.deleteAppointment(id);
        return ResponseEntity.ok("Appointment " + id + " deleted successfully");
    }

    // ✅ Dashboard metrics for agent
    @GetMapping("/metrics")
    @PreAuthorize("hasRole('AGENT')")
    public List<Map<String, String>> getMetrics(Authentication auth) {
        String email = auth.getName();

        long totalSlots = appointmentService.findAvailabilityByAgent(email).size();
        long openSlots = appointmentService.findAvailabilityByAgent(email)
                .stream().filter(a -> "OPEN".equals(a.getStatus())).count();
        long bookedSlots = appointmentService.findAvailabilityByAgent(email)
                .stream().filter(a -> "BOOKED".equals(a.getStatus())).count();
        long upcomingAppointments = appointmentService.findAppointmentsByAgent(email)
                .stream()
                .filter(a -> a.getDateTime().isAfter(java.time.LocalDateTime.now()))
                .count();

        return List.of(
                Map.of("label", "Total Slots", "value", String.valueOf(totalSlots)),
                Map.of("label", "Open Slots", "value", String.valueOf(openSlots)),
                Map.of("label", "Booked Slots", "value", String.valueOf(bookedSlots)),
                Map.of("label", "Upcoming Appointments", "value", String.valueOf(upcomingAppointments))
        );
    }
}
