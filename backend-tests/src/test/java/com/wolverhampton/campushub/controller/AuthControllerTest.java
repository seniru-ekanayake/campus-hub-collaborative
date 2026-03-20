package com.wolverhampton.campushub.controller;

import com.wolverhampton.campushub.BaseIntegrationTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * TC-AUTH-001 through TC-AUTH-010
 * Tests: registration, login, profile get/update, duplicate detection, auth guard.
 */
@DisplayName("TC-AUTH | Authentication & Account Controller")
class AuthControllerTest extends BaseIntegrationTest {

    // ── TC-AUTH-001 ──────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-AUTH-001 | Student registers with valid data → 200 + user DTO returned")
    void register_validData_returns200() throws Exception {
        Map<String, String> body = Map.of(
            "username", "jsmith",
            "email", "jsmith@wlv.ac.uk",
            "password", "SecurePass123",
            "firstName", "John",
            "lastName", "Smith",
            "studentId", "B123456",
            "course", "Software Engineering"
        );
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username", is("jsmith")))
                .andExpect(jsonPath("$.email", is("jsmith@wlv.ac.uk")))
                .andExpect(jsonPath("$.role", is("ROLE_STUDENT")))
                .andExpect(jsonPath("$.password").doesNotExist()); // password must NOT be exposed
    }

    // ── TC-AUTH-002 ──────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-AUTH-002 | Duplicate username → 400 with error message")
    void register_duplicateUsername_returns400() throws Exception {
        Map<String, String> body = Map.of(
            "username", "dupuser", "email", "first@wlv.ac.uk",
            "password", "Pass123", "firstName", "First", "lastName", "User",
            "studentId", "S001", "course", "IT"
        );
        // First registration succeeds
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk());

        // Second with same username fails
        Map<String, String> dup = Map.of(
            "username", "dupuser", "email", "second@wlv.ac.uk",
            "password", "Pass123", "firstName", "Second", "lastName", "User",
            "studentId", "S002", "course", "IT"
        );
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dup)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error", containsString("Username already taken")));
    }

    // ── TC-AUTH-003 ──────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-AUTH-003 | Duplicate email → 400 with error message")
    void register_duplicateEmail_returns400() throws Exception {
        Map<String, String> first = Map.of(
            "username", "user1email", "email", "shared@wlv.ac.uk",
            "password", "Pass123", "firstName", "A", "lastName", "B",
            "studentId", "S003", "course", "IT"
        );
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(first)))
                .andExpect(status().isOk());

        Map<String, String> second = Map.of(
            "username", "user2email", "email", "shared@wlv.ac.uk",
            "password", "Pass123", "firstName", "C", "lastName", "D",
            "studentId", "S004", "course", "IT"
        );
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(second)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error", containsString("Email already in use")));
    }

    // ── TC-AUTH-004 ──────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-AUTH-004 | Valid login → 200 + JWT token returned")
    void login_validCredentials_returnsToken() throws Exception {
        registerAndLogin("logintest", "MyPass99");
        // Token has already been obtained — verify the response fields exist
        Map<String, String> creds = Map.of("username", "logintest", "password", "MyPass99");
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(creds)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", not(emptyString())))
                .andExpect(jsonPath("$.username", is("logintest")))
                .andExpect(jsonPath("$.role", is("ROLE_STUDENT")));
    }

    // ── TC-AUTH-005 ──────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-AUTH-005 | Wrong password → 400 with error")
    void login_wrongPassword_returns400() throws Exception {
        registerAndLogin("badpassuser", "CorrectPass1");
        Map<String, String> creds = Map.of("username", "badpassuser", "password", "WrongPass99");
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(creds)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error", notNullValue()));
    }

    // ── TC-AUTH-006 ──────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-AUTH-006 | Non-existent user login → 400")
    void login_unknownUser_returns400() throws Exception {
        Map<String, String> creds = Map.of("username", "nobody", "password", "AnyPass1");
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(creds)))
                .andExpect(status().isBadRequest());
    }

    // ── TC-AUTH-007 ──────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-AUTH-007 | GET /profile authenticated → returns user profile")
    void getProfile_authenticated_returnsProfile() throws Exception {
        String token = registerAndLogin("profileuser", "Pass1234");
        mockMvc.perform(get("/api/auth/profile")
                .header("Authorization", authHeader(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username", is("profileuser")))
                .andExpect(jsonPath("$.email", is("profileuser@test.ac.uk")))
                .andExpect(jsonPath("$.role", notNullValue()));
    }

    // ── TC-AUTH-008 ──────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-AUTH-008 | GET /profile unauthenticated → 401")
    void getProfile_noToken_returns401() throws Exception {
        mockMvc.perform(get("/api/auth/profile"))
                .andExpect(status().isUnauthorized());
    }

    // ── TC-AUTH-009 ──────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-AUTH-009 | PUT /profile updates firstName, lastName, course")
    void updateProfile_validData_returnsUpdated() throws Exception {
        String token = registerAndLogin("updateme", "Pass1234");
        Map<String, String> update = Map.of(
            "firstName", "Updated",
            "lastName", "Name",
            "course", "Data Science"
        );
        mockMvc.perform(put("/api/auth/profile")
                .header("Authorization", authHeader(token))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(update)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName", is("Updated")))
                .andExpect(jsonPath("$.lastName", is("Name")))
                .andExpect(jsonPath("$.course", is("Data Science")));
    }

    // ── TC-AUTH-010 ──────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-AUTH-010 | Admin login returns ROLE_ADMIN in response")
    void adminLogin_returnsAdminRole() throws Exception {
        Map<String, String> creds = Map.of("username", "admin", "password", "admin123");
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(creds)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role", is("ROLE_ADMIN")))
                .andExpect(jsonPath("$.token", not(emptyString())));
    }
}
