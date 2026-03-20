package com.insureai.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String policyNumber;   // link to subscribed plan
    private Double amount;         // premium amount
    private String method;         // CARD, UPI, NETBANKING
    private String status;         // SUCCESS, FAILED, PENDING
    private LocalDateTime paidAt;  // timestamp of payment
    private String userEmail;      // employee who made payment

    // --- Constructors ---
    public Payment() {}

    public Payment(String policyNumber, Double amount, String method,
                   String status, LocalDateTime paidAt, String userEmail) {
        this.policyNumber = policyNumber;
        this.amount = amount;
        this.method = method;
        this.status = status;
        this.paidAt = paidAt;
        this.userEmail = userEmail;
    }

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPolicyNumber() { return policyNumber; }
    public void setPolicyNumber(String policyNumber) { this.policyNumber = policyNumber; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getMethod() { return method; }
    public void setMethod(String method) { this.method = method; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
}
