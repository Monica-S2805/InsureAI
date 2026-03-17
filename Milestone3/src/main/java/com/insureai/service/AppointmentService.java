package com.insureai.service;

import com.insureai.model.Appointment;
import com.insureai.model.Availability;
import com.insureai.repository.AppointmentRepository;
import com.insureai.repository.AvailabilityRepository;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final AvailabilityRepository availabilityRepository;

    public AppointmentService(AppointmentRepository appointmentRepository,
                              AvailabilityRepository availabilityRepository) {
        this.appointmentRepository = appointmentRepository;
        this.availabilityRepository = availabilityRepository;
    }

    // ✅ Availability methods
    public List<Availability> findAvailabilityByAgent(String agentEmail) {
        return availabilityRepository.findByAgentEmail(agentEmail);
    }

    public List<Availability> findAllOpenAvailability() {
        LocalDate today = LocalDate.now();
        return availabilityRepository.findByStatus("OPEN")
                .stream()
                .filter(slot -> !slot.getDate().isBefore(today))
                .toList();
    }

    public Availability createAvailabilitySlot(String agentEmail, LocalDate date,
                                               LocalTime startTime, LocalTime endTime) {
        Availability slot = new Availability();
        slot.setAgentEmail(agentEmail);
        slot.setDate(date);
        slot.setStartTime(startTime);
        slot.setEndTime(endTime);
        slot.setStatus("OPEN");
        return availabilityRepository.save(slot);
    }

    public void deleteAvailabilitySlot(Long id) {
        availabilityRepository.deleteById(id);
    }

    // ✅ Appointment methods
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found: " + id));
    }

    public Appointment saveAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    public Appointment updateStatus(Long id, String status) {
        Appointment appointment = getAppointmentById(id);
        appointment.setStatus(status);
        return appointmentRepository.save(appointment);
    }

    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }

    public long countAppointments() {
        return appointmentRepository.count();
    }

    public long countByStatus(String status) {
        return appointmentRepository.countByStatus(status);
    }

    public List<Appointment> findAppointmentsByEmployee(String email) {
        return appointmentRepository.findByEmployeeEmail(email);
    }

    public List<Appointment> findAppointmentsByAgent(String email) {
        return appointmentRepository.findByAgentEmail(email);
    }

    public int countUpcomingByEmployee(String email) {
        LocalDateTime now = LocalDateTime.now();
        return (int) appointmentRepository.findByEmployeeEmail(email)
                .stream()
                .filter(a -> a.getDateTime().isAfter(now) && "REQUESTED".equalsIgnoreCase(a.getStatus()))
                .count();
    }

    // ✅ Booking workflow: employee books slot with customer details
    public Appointment bookSlot(Long slotId, Principal principal,
                                String customerName, String policyNumber) {
        Availability slot = availabilityRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        if (!"OPEN".equals(slot.getStatus())) {
            throw new RuntimeException("Slot is not available");
        }

        slot.setStatus("BOOKED");
        availabilityRepository.save(slot);

        LocalDateTime appointmentDateTime = slot.getDate().atTime(slot.getStartTime());

        Appointment appt = new Appointment();
        appt.setAgentEmail(slot.getAgentEmail());
        appt.setEmployeeEmail(principal.getName());
        appt.setCustomerName(customerName);
        appt.setPolicyNumber(policyNumber);
        appt.setDateTime(appointmentDateTime);
        appt.setStatus("REQUESTED");

        return appointmentRepository.save(appt);
    }
}
