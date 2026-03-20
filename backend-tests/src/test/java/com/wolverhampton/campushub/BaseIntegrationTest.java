package com.wolverhampton.campushub;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wolverhampton.campushub.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Base class shared by all integration tests.
 * Boots the full Spring context against an H2 in-memory database,
 * and provides helpers for registering / logging in test users.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public abstract class BaseIntegrationTest {

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected ObjectMapper objectMapper;

    // Repositories for test data teardown
    @Autowired private AnnouncementRepository announcementRepository;
    @Autowired private ClubMembershipRepository clubMembershipRepository;
    @Autowired private ClubRepository clubRepository;
    @Autowired private EventRepository eventRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private RoleRepository roleRepository;

    @BeforeEach
    void cleanDatabase() {
        announcementRepository.deleteAll();
        clubMembershipRepository.deleteAll();
        clubRepository.deleteAll();
        eventRepository.deleteAll();
        // Delete non-admin users to keep admin intact
        userRepository.findAll().stream()
            .filter(u -> u.getRoles().stream()
                .noneMatch(r -> r.getName().name().equals("ROLE_ADMIN")))
            .forEach(userRepository::delete);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    protected String registerAndLogin(String username, String password) throws Exception {
        // Register
        Map<String, String> reg = Map.of(
            "username", username,
            "email", username + "@test.ac.uk",
            "password", password,
            "firstName", "Test",
            "lastName", "User",
            "studentId", "S" + System.currentTimeMillis(),
            "course", "Computer Science"
        );
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reg)))
                .andExpect(status().isOk());

        // Login and extract token
        return login(username, password);
    }

    protected String login(String username, String password) throws Exception {
        Map<String, String> creds = Map.of("username", username, "password", password);
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(creds)))
                .andExpect(status().isOk())
                .andReturn();

        Map<?, ?> body = objectMapper.readValue(result.getResponse().getContentAsString(), Map.class);
        return (String) body.get("token");
    }

    protected String adminToken() throws Exception {
        return login("admin", "admin123");
    }

    protected String authHeader(String token) {
        return "Bearer " + token;
    }
}
