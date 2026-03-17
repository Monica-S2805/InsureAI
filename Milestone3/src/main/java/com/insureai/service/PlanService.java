package com.insureai.service;

import com.insureai.model.User;
import com.insureai.model.Plan;
import com.insureai.repository.UserRepository;
import com.insureai.repository.PlanRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlanService {

    private final PlanRepository planRepository;
    private final UserRepository userRepository;

    public PlanService(PlanRepository planRepository, UserRepository userRepository) {
        this.planRepository = planRepository;
        this.userRepository = userRepository;
    }

    // ✅ CRUD for plans
    public List<Plan> getAllPlans() {
        return planRepository.findAll();
    }

    public Plan getPlanById(Long id) {
        return planRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan not found with id " + id));
    }

    public Plan savePlan(Plan plan) {
        return planRepository.save(plan);
    }

    public void deletePlan(Long id) {
        planRepository.deleteById(id);
    }

    // ✅ Update plan
    public Plan updatePlan(Long id, Plan updatedPlan) {
        Plan existing = getPlanById(id);

        // Update only the fields you want to allow changes for
        existing.setName(updatedPlan.getName());
        existing.setStatus(updatedPlan.getStatus());
        existing.setPremium(updatedPlan.getPremium());
      
        // add other fields as needed

        return planRepository.save(existing);
    }

    // ✅ Counts
    public long countPlans() {
        return planRepository.count();
    }

    public long countByStatus(String status) {
        return planRepository.countByStatus(status);
    }

    public long countActivePlans() {
        return planRepository.countByStatus("Active");
    }

    // ✅ Employee-specific plan logic
    public int countActiveByEmployee(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return (int) user.getPlans()
                .stream()
                .filter(plan -> "Active".equalsIgnoreCase(plan.getStatus()))
                .count();
    }

    public void subscribeEmployeeToPolicy(String email, Long planId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Plan plan = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        user.getPlans().add(plan);
        userRepository.save(user);
    }

    public void unsubscribePolicy(String email, Long planId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Plan plan = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        user.getPlans().remove(plan);
        userRepository.save(user);
    }
}
