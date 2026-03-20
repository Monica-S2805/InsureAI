package com.insureai.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String role;        // ADMIN, AGENT, EMPLOYEE
    private String userEmail;
    private String message;
    private String type;        // INFO, WARNING, SUCCESS
    private String status;      // UNREAD, READ
    private LocalDateTime timestamp;

    // --- Constructors ---
    public Notification() {}

    public Notification(String role, String userEmail, String message, String type, String status, LocalDateTime timestamp) {
        this.role = role;
        this.userEmail = userEmail;
        this.message = message;
        this.type = type;
        this.status = status;
        this.timestamp = timestamp;
    }

    // --- Getters & Setters ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
