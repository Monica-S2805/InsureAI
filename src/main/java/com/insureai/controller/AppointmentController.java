package com.insureai.controller;

import com.insureai.model.Appointment;
import com.insureai.service.AppointmentService;
import com.insureai.service.NotificationService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:5173")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final NotificationService notificationService;

    public AppointmentController(AppointmentService appointmentService, NotificationService notificationService) {
        this.appointmentService = appointmentService;
        this.notificationService = notificationService;
    }

    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @GetMapping("/{id}")
    public Appointment getAppointmentById(@PathVariable Long id) {
        return appointmentService.getAppointmentById(id);
    }

    @PostMapping
    public Appointment createAppointment(@RequestBody Appointment appointment, Authentication auth) {
        Appointment saved = appointmentService.saveAppointment(appointment);

        // 🔔 Notifications
        notificationService.createNotification(auth.getName(), "EMPLOYEE",
                "Appointment created with ID: " + saved.getId(), "SUCCESS");

        // Example: notify agent (replace with actual agent email lookup)
        notificationService.createNotification("agent@example.com", "AGENT",
                "New appointment request ID: " + saved.getId(), "INFO");

        return saved;
    }

    @PutMapping("/{id}/status")
    public Appointment updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body, Authentication auth) {
        Appointment updated = appointmentService.updateStatus(id, body.get("status"));

        // 🔔 Notification
        notificationService.createNotification(auth.getName(), "EMPLOYEE",
                "Appointment ID: " + id + " status updated to " + body.get("status"), "INFO");

        return updated;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAppointment(@PathVariable Long id, Authentication auth) {
        appointmentService.deleteAppointment(id);

        // 🔔 Notification
        notificationService.createNotification(auth.getName(), "EMPLOYEE",
                "Appointment ID: " + id + " deleted", "WARNING");

        return ResponseEntity.ok("Appointment " + id + " deleted successfully");
    }
}
