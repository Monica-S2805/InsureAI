package com.insureai.service;

import com.insureai.model.Notification;
import com.insureai.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    // 🔹 Get all notifications for a user by role
    public List<Notification> getNotifications(String email, String role) {
        return notificationRepository.findByUserEmailAndRole(email, role);
    }

    // 🔹 Get all unread notifications for a user
    public List<Notification> getUnreadNotifications(String email) {
        return notificationRepository.findByUserEmailAndStatus(email, "UNREAD");
    }

    // 🔹 Create a new notification
    public Notification createNotification(String email, String role, String message, String type) {
        Notification notification = new Notification();
        notification.setUserEmail(email);
        notification.setRole(role);
        notification.setMessage(message);
        notification.setType(type);
        notification.setStatus("UNREAD");
        notification.setTimestamp(LocalDateTime.now());
        return notificationRepository.save(notification);
    }

    // 🔹 Mark a notification as read
    public void markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setStatus("READ");
        notificationRepository.save(notification);
    }

    // 🔹 Delete a notification
    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }
}
