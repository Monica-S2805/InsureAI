package com.insureai.controller;

import com.insureai.model.Availability;
import com.insureai.model.Appointment;
import com.insureai.repository.AvailabilityRepository;
import com.insureai.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/availability")
@CrossOrigin(origins = "http://localhost:5173")
public class AvailabilityController {

    @Autowired
    private AvailabilityRepository repo;

    @Autowired
    private AppointmentRepository appointmentRepo;

    // ✅ Agent publishes a slot
    @PostMapping("/publish")
    public Availability publish(@RequestBody Availability slot, Principal principal) {
        slot.setAgentEmail(principal.getName());
        slot.setStatus("OPEN");
        return repo.save(slot);
    }

    // ✅ Agent views their own slots
    @GetMapping("/agent/me")
    public List<Availability> mySlots(Principal principal) {
        LocalDate today = LocalDate.now();
        List<Availability> slots = repo.findByAgentEmail(principal.getName());

        slots.forEach(slot -> {
            if (slot.getStatus().equals("OPEN") && slot.getDate().isBefore(today)) {
                slot.setStatus("EXPIRED");
                repo.save(slot);
            }
        });

        return slots;
    }

    // ✅ Employees see valid OPEN slots (today or future)
    @GetMapping("/open")
    public List<Availability> openSlots() {
        LocalDate today = LocalDate.now();
        return repo.findByStatus("OPEN")
                   .stream()
                   .filter(slot -> !slot.getDate().isBefore(today))
                   .collect(Collectors.toList());
    }

    // ✅ Employee books a slot with customer details
    @PutMapping("/book/{id}")
    public ResponseEntity<?> book(@PathVariable Long id,
                                  @RequestBody Map<String, String> body,
                                  Principal principal) {
        Availability slot = repo.findById(id).orElseThrow();

        if (!slot.getStatus().equals("OPEN")) {
            return ResponseEntity.badRequest().body("Slot is not available");
        }

        slot.setStatus("BOOKED");
        repo.save(slot);

        LocalDateTime appointmentDateTime = slot.getDate().atTime(slot.getStartTime());

        Appointment appt = new Appointment();
        appt.setAgentEmail(slot.getAgentEmail());
        appt.setEmployeeEmail(principal.getName());
        appt.setCustomerName(body.get("customerName"));   // ✅ capture customerName
        appt.setPolicyNumber(body.get("policyNumber"));   // ✅ capture policyNumber
        appt.setDateTime(appointmentDateTime);
        appt.setStatus("REQUESTED");

        appointmentRepo.save(appt);

        return ResponseEntity.ok(appt);
    }

    // ✅ Agent deletes their own slot
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSlot(@PathVariable Long id, Principal principal) {
        return repo.findById(id)
            .map(slot -> {
                if (!slot.getAgentEmail().equals(principal.getName())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("You can only delete your own slots");
                }
                repo.delete(slot);
                return ResponseEntity.ok("Slot deleted successfully");
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
