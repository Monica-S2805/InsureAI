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

    // 🔹 CRUD
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

    public Plan updatePlan(Long id, Plan updatedPlan) {
        Plan existing = getPlanById(id);
        existing.setName(updatedPlan.getName());
        existing.setStatus(updatedPlan.getStatus());
        existing.setPremium(updatedPlan.getPremium());
        existing.setType(updatedPlan.getType());
        existing.setDescription(updatedPlan.getDescription());
        existing.setCoverage(updatedPlan.getCoverage());
        existing.setDuration(updatedPlan.getDuration());
        existing.setPolicyNumber(updatedPlan.getPolicyNumber());
        return planRepository.save(existing);
    }

    // 🔹 Reporting
    public long countPlansByAgent(String email) {
        return planRepository.countByAgentEmail(email);
    }

    public long countAllPlans() {
        return planRepository.count();
    }

    public long countByStatus(String status) {
        return planRepository.countByStatus(status);
    }

    public long countActivePlans() {
        return planRepository.countByStatus("Active");
    }

    public long countActiveByEmployee(String email) {
        return planRepository.countByUsers_EmailAndStatus(email, "Active");
    }

    public long countPlansByEmployee(String email) {
        return planRepository.countByUsers_Email(email);
    }

    public long countPlans() {
        return planRepository.count();
    }

    // 🔹 Find by policyNumber
    public Plan getPlanByPolicyNumber(String policyNumber) {
        return planRepository.findByPolicyNumber(policyNumber)
                .orElseThrow(() -> new RuntimeException("Plan not found: " + policyNumber));
    }

    // 🔹 Assign plan to user
    public void assignPlanToUser(String userEmail, String policyNumber) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));
        Plan plan = getPlanByPolicyNumber(policyNumber);

        user.getPlans().add(plan);
        userRepository.save(user);
    }

    // 🔹 Subscribe/unsubscribe by ID
    public void subscribeEmployeeToPolicy(String email, Long planId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Plan plan = getPlanById(planId);
        user.getPlans().add(plan);
        userRepository.save(user);
    }

    public void unsubscribePolicy(String email, Long planId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Plan plan = getPlanById(planId);
        user.getPlans().remove(plan);
        userRepository.save(user);
    }
}
