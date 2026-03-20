package com.insureai.controller;

import com.insureai.model.Plan;
import com.insureai.model.Payment;
import com.insureai.service.PlanService;
import com.insureai.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/policies")
@CrossOrigin(origins = "http://localhost:5173")
public class PlanController {

    private final PlanService planService;
    private final PaymentService paymentService;

    public PlanController(PlanService planService, PaymentService paymentService) {
        this.planService = planService;
        this.paymentService = paymentService;
    }

    // ✅ Dashboard metrics endpoint
    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getMetrics(@RequestParam String email) {
        Map<String, Object> metrics = Map.ofEntries(
            Map.entry("totalPlans", planService.countPlans()),
            Map.entry("activePlans", planService.countActivePlans()),
            Map.entry("paymentsMade", paymentService.countPaymentsByEmployee(email))
        );
        return ResponseEntity.ok(metrics);
    }

    @GetMapping
    public List<Plan> getAllPlans() { return planService.getAllPlans(); }

    @GetMapping("/{id}")
    public ResponseEntity<Plan> getPlanById(@PathVariable Long id) {
        return ResponseEntity.ok(planService.getPlanById(id));
    }

    @PostMapping
    public ResponseEntity<Plan> createPlan(@RequestBody Plan plan) {
        return ResponseEntity.ok(planService.savePlan(plan));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Plan> updatePlan(@PathVariable Long id, @RequestBody Plan plan) {
        return ResponseEntity.ok(planService.updatePlan(id, plan));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePlan(@PathVariable Long id) {
        planService.deletePlan(id);
        return ResponseEntity.ok("Policy " + id + " deleted successfully");
    }

    // ✅ Subscribe by policyNumber
    @PostMapping("/subscribe/{policyNumber}")
    public ResponseEntity<String> subscribeToPlan(@PathVariable String policyNumber,
                                                  @RequestParam String userEmail) {
        Plan plan = planService.getPlanByPolicyNumber(policyNumber);
        planService.assignPlanToUser(userEmail, policyNumber);

        Payment payment = new Payment();
        payment.setPolicyNumber(plan.getPolicyNumber());
        payment.setAmount(Double.valueOf(plan.getPremium()));
        payment.setMethod("CARD");
        payment.setStatus("PENDING");
        payment.setPaidAt(LocalDateTime.now());
        payment.setUserEmail(userEmail);

        paymentService.process(payment);

        return ResponseEntity.ok("Subscribed to plan and payment record created");
    }
}
