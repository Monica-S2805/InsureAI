package com.insureai.repository;

import com.insureai.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // 🔹 Find all notifications for a specific user and role
    List<Notification> findByUserEmailAndRole(String userEmail, String role);

    // 🔹 Find all unread notifications for a user
    List<Notification> findByUserEmailAndStatus(String userEmail, String status);

    // 🔹 Optional: Find all notifications by role (e.g., ADMIN, AGENT, EMPLOYEE)
    List<Notification> findByRole(String role);
}
