package com.insureai.repository;

import com.insureai.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // ✅ Fetch appointments for a specific employee
    List<Appointment> findByEmployeeEmail(String email);

    // ✅ Fetch appointments for a specific agent
    List<Appointment> findByAgentEmail(String email);

    // ✅ Count appointments by status (used in dashboards)
    long countByStatus(String status);

    // ✅ Optional: count appointments for employee by status
    long countByEmployeeEmailAndStatus(String email, String status);

    // ✅ Optional: count appointments for agent by status
    long countByAgentEmailAndStatus(String email, String status);
    
    
    long countByEmployeeEmail(String email);
}
