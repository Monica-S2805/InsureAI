package com.insureai.controller;

import com.insureai.model.User;
import com.insureai.repository.UserRepository;
import com.insureai.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ✅ Registration endpoint
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        // Encode password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Store role exactly as provided (EMPLOYEE, AGENT, ADMIN)
        user.setRole(user.getRole().toUpperCase());

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    // ✅ Login endpoint
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(email, password)
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtService.generateToken(userDetails);

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ Role is already stored as EMPLOYEE, AGENT, ADMIN
        String normalizedRole = user.getRole();

        Map<String, Object> response = new HashMap<>();
        response.put("token", "Bearer " + token);
        response.put("role", normalizedRole); // "EMPLOYEE", "AGENT", "ADMIN"
        response.put("username", user.getUsername() != null ? user.getUsername() : user.getEmail());
        response.put("email", user.getEmail());
        response.put("status", user.getStatus());

        return ResponseEntity.ok(response);
    }
}
