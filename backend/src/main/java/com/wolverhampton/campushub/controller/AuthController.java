package com.wolverhampton.campushub.controller;

import com.wolverhampton.campushub.dto.AuthDTO;
import com.wolverhampton.campushub.dto.UserDTO;
import com.wolverhampton.campushub.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

// Handles register, login, and profile — all under /api/auth
// Public endpoints (register + login) are whitelisted in SecurityConfig,
// profile endpoints require a valid JWT.
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody AuthDTO.RegisterRequest request) {
        try {
            UserDTO user = authService.register(request);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            // username taken, email taken, etc.
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthDTO.LoginRequest request) {
        try {
            AuthDTO.LoginResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Don't leak whether the username exists or just the password was wrong
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid credentials"));
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        UserDTO user = authService.getProfile(userDetails.getUsername());
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal UserDetails userDetails,
                                           @RequestBody UserDTO dto) {
        UserDTO updated = authService.updateProfile(userDetails.getUsername(), dto);
        return ResponseEntity.ok(updated);
    }
}
