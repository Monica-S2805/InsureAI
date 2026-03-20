package com.insureai.controller;

import com.insureai.model.Notification;
import com.insureai.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/{role}/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    // 🔹 Get all notifications for a user by role
    @GetMapping
    public List<Notification> getNotifications(@PathVariable String role, Authentication auth) {
        return notificationService.getNotifications(auth.getName(), role.toUpperCase());
    }

    // 🔹 Get all unread notifications for a user
    @GetMapping("/unread")
    public List<Notification> getUnreadNotifications(Authentication auth) {
        return notificationService.getUnreadNotifications(auth.getName());
    }

    // 🔹 Get unread notification count for badge display
    @GetMapping("/count")
    public long getUnreadCount(Authentication auth) {
        return notificationService.getUnreadNotifications(auth.getName()).size();
    }

    // 🔹 Create a new notification
    @PostMapping
    public Notification createNotification(@PathVariable String role,
                                           @RequestParam String message,
                                           @RequestParam(defaultValue = "INFO") String type,
                                           Authentication auth) {
        return notificationService.createNotification(auth.getName(), role.toUpperCase(), message, type);
    }

    // 🔹 Mark a notification as read
    @PutMapping("/{id}/read")
    public ResponseEntity<String> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok("Notification marked as read");
    }

    // 🔹 Delete a notification
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok("Notification deleted successfully");
    }
}
