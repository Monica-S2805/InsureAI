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
    private String description;
    private String type;
    private String coverage;
    private String premium;
    private String duration;
    private String status;
    private String agentEmail;

    // 🔑 Inverse side of ManyToMany
    @ManyToMany(mappedBy = "plans")
    @JsonBackReference
    private List<User> users = new ArrayList<>();

    public Plan() {}

    public Plan(String policyNumber, String name, String description, String type,
                String coverage, String premium, String duration, String status, String agentEmail) {
        this.policyNumber = policyNumber;
        this.name = name;
        this.description = description;
        this.type = type;
        this.coverage = coverage;
        this.premium = premium;
        this.duration = duration;
        this.status = status;
        this.agentEmail = agentEmail;
    }

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPolicyNumber() { return policyNumber; }
    public void setPolicyNumber(String policyNumber) { this.policyNumber = policyNumber; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getCoverage() { return coverage; }
    public void setCoverage(String coverage) { this.coverage = coverage; }

    public String getPremium() { return premium; }
    public void setPremium(String premium) { this.premium = premium; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<User> getUsers() { return users; }
    public void setUsers(List<User> users) { this.users = users; }

    public String getAgentEmail() { return agentEmail; }
    public void setAgentEmail(String agentEmail) { this.agentEmail = agentEmail; }
}
