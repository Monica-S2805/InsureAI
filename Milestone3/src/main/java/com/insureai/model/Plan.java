package com.insureai.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
public class Plan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String policyNumber;
    private String name;
    private String type;
    private String premium;
    private String status;

    // 🔑 Inverse side of ManyToMany
    @ManyToMany(mappedBy = "plans")
    @JsonBackReference
    private List<User> users = new ArrayList<>();

    // --- Constructors ---
    public Plan() {}

    public Plan(String policyNumber, String name, String type, String premium, String status) {
        this.policyNumber = policyNumber;
        this.name = name;
        this.type = type;
        this.premium = premium;
        this.status = status;
    }

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPolicyNumber() { return policyNumber; }
    public void setPolicyNumber(String policyNumber) { this.policyNumber = policyNumber; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getPremium() { return premium; }
    public void setPremium(String premium) { this.premium = premium; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<User> getUsers() { return users; }
    public void setUsers(List<User> users) { this.users = users; }
}
