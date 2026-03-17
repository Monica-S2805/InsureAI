package com.insureai.controller;

import com.insureai.model.Plan;
import com.insureai.service.PlanService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/policies")
@CrossOrigin(origins = "http://localhost:5173") // allow React dev server
public class PlanController {

    private final PlanService planService;

    public PlanController(PlanService planService) {
        this.planService = planService;
    }

    // ✅ Get all policies
    @GetMapping
    public List<Plan> getAllPlans() {
        return planService.getAllPlans();
    }

    // ✅ Get policy by ID
    @GetMapping("/{id}")
    public ResponseEntity<Plan> getPlanById(@PathVariable Long id) {
        Plan plan = planService.getPlanById(id);
        return ResponseEntity.ok(plan);
    }

    // ✅ Create new policy
    @PostMapping
    public ResponseEntity<Plan> createPlan(@RequestBody Plan plan) {
        Plan savedPlan = planService.savePlan(plan);
        return ResponseEntity.ok(savedPlan);
    }

    // ✅ Update existing policy
    @PutMapping("/{id}")
    public ResponseEntity<Plan> updatePlan(@PathVariable Long id, @RequestBody Plan plan) {
        Plan updatedPlan = planService.updatePlan(id, plan);
        return ResponseEntity.ok(updatedPlan);
    }

    // ✅ Delete policy
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePlan(@PathVariable Long id) {
        planService.deletePlan(id);
        return ResponseEntity.ok("Policy " + id + " deleted successfully");
    }
}
