package com.insureai.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VoiceRecognitionService {

    @Autowired private ClaimService claimService;
    @Autowired private AppointmentService appointmentService;
    @Autowired private PlanService planService; // 👈 using PlanService for both plans & policies

    public String processQuery(String role, String email, String query) {
        query = query.toLowerCase();

        // 🔹 Employee role queries
        if (role.equalsIgnoreCase("EMPLOYEE")) {
            if (query.contains("my claims")) {
                return "You have " + claimService.countClaimsByEmployee(email) + " claims.";
            }
            if (query.contains(" my appointments")) {
                return "You have " + appointmentService.countByEmployee(email) + " appointments.";
            }
            if (query.contains("policies") || query.contains(" my plans")) {
                return "You are enrolled in " + planService.countPlansByEmployee(email) + " plans.";
            }
        }

        // 🔹 Agent role queries
        if (role.equalsIgnoreCase("AGENT")) {
            if (query.contains("my availability")) {
                return "You have " + appointmentService.findAllOpenAvailability().size() + " open slots.";
            }
            if (query.contains("policies") || query.contains("plans")) {
                return "You are managing " + planService.countPlansByAgent(email) + " plans.";
            }
        }

        // 🔹 Admin role queries
        if (role.equalsIgnoreCase("ADMIN")) {
         
            if (query.contains("my policies") || query.contains("plans")) {
                return "There are " + planService.countAllPlans() + " plans in the system.";
            }
        }

        // Default fallback
        return "Sorry, I could not understand your query.";
    }
}
