package com.insureai.model;

public class VoiceQuery {
    private String query;   // e.g. "show my claims"
    private String role;    // ADMIN, AGENT, EMPLOYEE

    public VoiceQuery() {}

    public VoiceQuery(String query, String role) {
        this.query = query;
        this.role = role;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
