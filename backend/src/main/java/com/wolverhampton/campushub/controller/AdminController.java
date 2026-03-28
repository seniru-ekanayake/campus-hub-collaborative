package com.wolverhampton.campushub.controller;

import com.wolverhampton.campushub.dto.UserDTO;
import com.wolverhampton.campushub.repository.*;
import com.wolverhampton.campushub.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

// Admin-only endpoints — class-level @PreAuthorize covers everything here.
// Stats are used by the admin dashboard to show counts at a glance.
// User management is basic for now — list and delete, no role change or suspend.
//
// TODO: prevent admin from deleting their own account (discovered this late, ran out of time)
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired private UserRepository userRepository;
    @Autowired private ClubRepository clubRepository;
    @Autowired private EventRepository eventRepository;
    @Autowired private AnnouncementRepository announcementRepository;
    @Autowired private AuthService authService;

    // Quick counts for the admin dashboard header cards
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(Map.of(
            "totalStudents",      userRepository.count(),
            "totalClubs",         clubRepository.count(),
            "totalEvents",        eventRepository.count(),
            "totalAnnouncements", announcementRepository.count()
        ));
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll().stream()
                .map(authService::toDTO).collect(Collectors.toList()));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "User deleted"));
    }
}
