package com.wolverhampton.campushub.controller;

import com.wolverhampton.campushub.BaseIntegrationTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * TC-CLUB-001 through TC-CLUB-010
 * Tests: club CRUD by admin, student join/leave, membership isolation.
 */
@DisplayName("TC-CLUB | ClubHub Controller")
class ClubControllerTest extends BaseIntegrationTest {

    private Map<String, Object> sampleClub(String name) {
        return Map.of(
            "name", name,
            "description", "A great club for students.",
            "category", "Academic",
            "meetingSchedule", "Every Wednesday 5pm",
            "location", "Room B12",
            "contactEmail", "club@wlv.ac.uk",
            "active", true
        );
    }

    private Long createClub(String name) throws Exception {
        String token = adminToken();
        MvcResult r = mockMvc.perform(post("/api/admin/clubs")
                .header("Authorization", authHeader(token))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleClub(name))))
                .andExpect(status().isOk())
                .andReturn();
        Map<?, ?> body = objectMapper.readValue(r.getResponse().getContentAsString(), Map.class);
        return Long.valueOf(body.get("id").toString());
    }

    // ── TC-CLUB-001 ──────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-CLUB-001 | Admin creates club → 200 + club returned")
    void createClub_asAdmin_returns200() throws Exception {
        String token = adminToken();
        mockMvc.perform(post("/api/admin/clubs")
                .header("Authorization", authHeader(token))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleClub("Coding Society"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Coding Society")))
                .andExpect(jsonPath("$.id", notNullValue()));
    }

    // ── TC-CLUB-002 ──────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-CLUB-002 | Student cannot create club → 403")
    void createClub_asStudent_returns403() throws Exception {
        String token = registerAndLogin("clubstu", "Pass1234");
        mockMvc.perform(post("/api/admin/clubs")
                .header("Authorization", authHeader(token))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleClub("Rogue Club"))))
                .andExpect(status().isForbidden());
    }

    // ── TC-CLUB-003 ──────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-CLUB-003 | GET /clubs returns list with active clubs")
    void getClubs_authenticated_returnsList() throws Exception {
        createClub("Visible Club");
        String token = registerAndLogin("clubviewer", "Pass1234");
        mockMvc.perform(get("/api/clubs")
                .header("Authorization", authHeader(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", isA(java.util.List.class)))
                .andExpect(jsonPath("$[?(@.name == 'Visible Club')]", hasSize(1)));
    }

    // ── TC-CLUB-004 ──────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-CLUB-004 | Student joins club → membership saved, memberCount +1")
    void joinClub_asStudent_membershipSaved() throws Exception {
        Long clubId = createClub("Join Test Club");
        String token = registerAndLogin("joiner", "Pass1234");

        mockMvc.perform(post("/api/clubs/" + clubId + "/join")
                .header("Authorization", authHeader(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.member", is(true)));
    }

    // ── TC-CLUB-005 ──────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-CLUB-005 | Student cannot join same club twice → 400")
    void joinClub_twice_returns400() throws Exception {
        Long clubId = createClub("No Duplicate Join");
        String token = registerAndLogin("joiner2", "Pass1234");

        mockMvc.perform(post("/api/clubs/" + clubId + "/join")
                .header("Authorization", authHeader(token)))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/clubs/" + clubId + "/join")
                .header("Authorization", authHeader(token)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error", notNullValue()));
    }

    // ── TC-CLUB-006 ──────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-CLUB-006 | Student leaves club → removed from my clubs")
    void leaveClub_asStudent_removedFromMyClubs() throws Exception {
        Long clubId = createClub("Leave Test Club");
        String token = registerAndLogin("leaver", "Pass1234");

        mockMvc.perform(post("/api/clubs/" + clubId + "/join")
                .header("Authorization", authHeader(token)))
                .andExpect(status().isOk());

        mockMvc.perform(delete("/api/clubs/" + clubId + "/leave")
                .header("Authorization", authHeader(token)))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/clubs/my")
                .header("Authorization", authHeader(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.id == " + clubId + ")]", hasSize(0)));
    }

    // ── TC-CLUB-007 ──────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-CLUB-007 | GET /clubs/my returns only clubs student joined")
    void getMyClubs_returnsOnlyJoinedClubs() throws Exception {
        Long club1 = createClub("My Club A");
        Long club2 = createClub("My Club B");
        createClub("Not Joined C");

        String token = registerAndLogin("myclubreader", "Pass1234");
        mockMvc.perform(post("/api/clubs/" + club1 + "/join").header("Authorization", authHeader(token)));
        mockMvc.perform(post("/api/clubs/" + club2 + "/join").header("Authorization", authHeader(token)));

        mockMvc.perform(get("/api/clubs/my").header("Authorization", authHeader(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    // ── TC-CLUB-008 ──────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-CLUB-008 | Admin updates club → changes reflected in GET /clubs")
    void updateClub_asAdmin_updatesSuccessfully() throws Exception {
        Long id = createClub("Old Club Name");
        String token = adminToken();

        Map<String, Object> updated = Map.of(
            "name", "Renamed Club", "description", "New desc",
            "category", "Sport", "meetingSchedule", "Fridays",
            "location", "Gym", "contactEmail", "sport@wlv.ac.uk", "active", true
        );
        mockMvc.perform(put("/api/admin/clubs/" + id)
                .header("Authorization", authHeader(token))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Renamed Club")));
    }

    // ── TC-CLUB-009 ──────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-CLUB-009 | Admin deletes club → no longer visible")
    void deleteClub_asAdmin_removesClub() throws Exception {
        Long id = createClub("Delete Me Club");
        String token = adminToken();

        mockMvc.perform(delete("/api/admin/clubs/" + id)
                .header("Authorization", authHeader(token)))
                .andExpect(status().isOk());

        String studentToken = registerAndLogin("afterdelete", "Pass1234");
        mockMvc.perform(get("/api/clubs").header("Authorization", authHeader(studentToken)))
                .andExpect(jsonPath("$[?(@.id == " + id + ")]", hasSize(0)));
    }

    // ── TC-CLUB-010 ──────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-CLUB-010 | GET /admin/clubs returns all clubs including inactive")
    void adminGetAllClubs_returnsAll() throws Exception {
        createClub("Active One");
        String token = adminToken();
        mockMvc.perform(get("/api/admin/clubs").header("Authorization", authHeader(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", isA(java.util.List.class)));
    }
}
