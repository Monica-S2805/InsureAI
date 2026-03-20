package com.insureai.controller;

import com.insureai.model.Payment;
import com.insureai.service.PaymentService;
import com.insureai.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    private final PaymentService service;
    private final NotificationService notificationService;

    public PaymentController(PaymentService service, NotificationService notificationService) {
        this.service = service;
        this.notificationService = notificationService;
    }

    // ✅ Create new payment
    @PostMapping
    public ResponseEntity<Payment> process(@RequestBody Payment payment,
                                           Authentication auth) {

        // ✅ Set logged-in user email
        payment.setUserEmail(auth.getName());

        // ✅ Set timestamp
        payment.setPaidAt(LocalDateTime.now());

        // ✅ Default status if missing
        if (payment.getStatus() == null) {
            payment.setStatus("SUCCESS");
        }

        Payment saved = service.process(payment);

        // 🔔 Notifications
        notificationService.createNotification(auth.getName(), "EMPLOYEE",
                "Payment processed successfully. Payment ID: " + saved.getId(), "SUCCESS");

        notificationService.createNotification("admin@example.com", "ADMIN",
                "Payment logged for user: " + auth.getName() + ", Payment ID: " + saved.getId(), "INFO");

        return ResponseEntity.ok(saved);
    }

    // ✅ Get all payments
    @GetMapping
    public List<Payment> getAll() {
        return service.findAll();
    }

    // ✅ Get payments of logged-in user
    @GetMapping("/my")
    public List<Payment> getMyPayments(Authentication auth) {
        return service.findByUserEmail(auth.getName());
    }

    // ⚠️ Less secure: get payments by user email
    @GetMapping("/user/{email}")
    public List<Payment> getByUser(@PathVariable String email) {
        return service.findByUserEmail(email);
    }

    // ✅ Get payment by ID
    @GetMapping("/{id}")
    public ResponseEntity<Payment> getById(@PathVariable Long id) {
        Payment payment = service.findById(id);
        return ResponseEntity.ok(payment);
    }

    // ✅ Delete payment
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id, Authentication auth) {
        service.delete(id);

        // 🔔 Notification
        notificationService.createNotification(auth.getName(), "EMPLOYEE",
                "Payment ID: " + id + " deleted", "WARNING");

        return ResponseEntity.ok("Payment " + id + " deleted successfully");
    }
}
