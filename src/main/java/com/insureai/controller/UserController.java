package com.insureai.controller;

import com.insureai.model.User;
import com.insureai.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    // Constructor injection
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Get all users
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Update user status (Active/Inactive)
    @PutMapping("/{id}/status")
    public User updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return userService.updateStatus(id, body.get("status"));
    }

    // Update user role (Admin, Agent, Employee)
    @PutMapping("/{id}/role")
    public User updateRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return userService.updateRole(id, body.get("role"));
    }

    // Delete user
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}
