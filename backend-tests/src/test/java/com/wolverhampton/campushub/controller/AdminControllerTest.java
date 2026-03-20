package com.wolverhampton.campushub.controller;

import com.wolverhampton.campushub.BaseIntegrationTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * TC-ADMIN-001 through TC-ADMIN-007
 * Tests: dashboard stats, user list, user deletion, role enforcement.
 */
@DisplayName("TC-ADMIN | Admin Panel Controller")
class AdminControllerTest extends BaseIntegrationTest {

    // ── TC-ADMIN-001 ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-ADMIN-001 | GET /admin/stats returns totalStudents, totalClubs, totalEvents")
    void getStats_asAdmin_returnsAllFields() throws Exception {
        String token = adminToken();
        mockMvc.perform(get("/api/admin/stats")
                .header("Authorization", authHeader(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalStudents", notNullValue()))
                .andExpect(jsonPath("$.totalClubs", notNullValue()))
                .andExpect(jsonPath("$.totalEvents", notNullValue()));
    }

    // ── TC-ADMIN-002 ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-ADMIN-002 | Student cannot access /admin/stats → 403")
    void getStats_asStudent_returns403() throws Exception {
        String token = registerAndLogin("statstu", "Pass1234");
        mockMvc.perform(get("/api/admin/stats")
                .header("Authorization", authHeader(token)))
                .andExpect(status().isForbidden());
    }

    // ── TC-ADMIN-003 ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-ADMIN-003 | Unauthenticated cannot access /admin/stats → 401/403")
    void getStats_noToken_returns4xx() throws Exception {
        mockMvc.perform(get("/api/admin/stats"))
                .andExpect(status().is4xxClientError());
    }

    // ── TC-ADMIN-004 ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-ADMIN-004 | GET /admin/users returns list with at least admin user")
    void getUsers_asAdmin_returnsUserList() throws Exception {
        String token = adminToken();
        mockMvc.perform(get("/api/admin/users")
                .header("Authorization", authHeader(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", isA(java.util.List.class)))
                .andExpect(jsonPath("$[?(@.username == 'admin')]", hasSize(1)));
    }

    // ── TC-ADMIN-005 ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-ADMIN-005 | New registered student appears in /admin/users")
    void getUsers_newRegistration_appearsInList() throws Exception {
        registerAndLogin("newlistuser", "Pass1234");
        String token = adminToken();
        mockMvc.perform(get("/api/admin/users")
                .header("Authorization", authHeader(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.username == 'newlistuser')]", hasSize(1)));
    }

    // ── TC-ADMIN-006 ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-ADMIN-006 | Admin deletes a student user → user gone from list")
    void deleteUser_asAdmin_removesFromList() throws Exception {
        registerAndLogin("todelete", "Pass1234");
        String adminTok = adminToken();

        // Find the user ID
        MvcResult result = mockMvc.perform(get("/api/admin/users")
                .header("Authorization", authHeader(adminTok)))
                .andReturn();

        List<?> users = objectMapper.readValue(result.getResponse().getContentAsString(), List.class);
        Long userId = users.stream()
            .filter(u -> "todelete".equals(((Map<?,?>)u).get("username")))
            .map(u -> Long.valueOf(((Map<?,?>)u).get("id").toString()))
            .findFirst().orElseThrow();

        mockMvc.perform(delete("/api/admin/users/" + userId)
                .header("Authorization", authHeader(adminTok)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", notNullValue()));

        // Verify gone
        mockMvc.perform(get("/api/admin/users")
                .header("Authorization", authHeader(adminTok)))
                .andExpect(jsonPath("$[?(@.username == 'todelete')]", hasSize(0)));
    }

    // ── TC-ADMIN-007 ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-ADMIN-007 | totalStudents stat increases after new registration")
    void getStats_afterRegistration_countIncreases() throws Exception {
        String token = adminToken();

        MvcResult before = mockMvc.perform(get("/api/admin/stats")
                .header("Authorization", authHeader(token))).andReturn();
        int countBefore = (int) objectMapper.readValue(
            before.getResponse().getContentAsString(), Map.class).get("totalStudents");

        registerAndLogin("counttest", "Pass1234");

        MvcResult after = mockMvc.perform(get("/api/admin/stats")
                .header("Authorization", authHeader(token))).andReturn();
        int countAfter = (int) objectMapper.readValue(
            after.getResponse().getContentAsString(), Map.class).get("totalStudents");

        org.junit.jupiter.api.Assertions.assertTrue(countAfter > countBefore,
            "Student count should increase after registration");
    }
}
