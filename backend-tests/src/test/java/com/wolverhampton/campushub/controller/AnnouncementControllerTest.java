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
 * TC-ANN-001 through TC-ANN-008
 * Tests: announcement CRUD, category filtering, pinning, authorization.
 */
@DisplayName("TC-ANN | Announcement Controller")
class AnnouncementControllerTest extends BaseIntegrationTest {

    private Map<String, Object> announcement(String title, String category, boolean pinned) {
        return Map.of(
            "title", title,
            "content", "This is the body content of the announcement.",
            "category", category,
            "pinned", pinned
        );
    }

    private Long createAnnouncement(String title, String category) throws Exception {
        String token = adminToken();
        MvcResult r = mockMvc.perform(post("/api/admin/announcements")
                .header("Authorization", authHeader(token))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(announcement(title, category, false))))
                .andExpect(status().isOk())
                .andReturn();
        Map<?, ?> body = objectMapper.readValue(r.getResponse().getContentAsString(), Map.class);
        return Long.valueOf(body.get("id").toString());
    }

    // ── TC-ANN-001 ───────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-ANN-001 | Admin creates announcement → 200 + DTO returned")
    void createAnnouncement_asAdmin_returns200() throws Exception {
        String token = adminToken();
        mockMvc.perform(post("/api/admin/announcements")
                .header("Authorization", authHeader(token))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(announcement("Library Closure", "Academic", false))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Library Closure")))
                .andExpect(jsonPath("$.category", is("Academic")))
                .andExpect(jsonPath("$.id", notNullValue()));
    }

    // ── TC-ANN-002 ───────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-ANN-002 | Student cannot create announcement → 403")
    void createAnnouncement_asStudent_returns403() throws Exception {
        String token = registerAndLogin("annstu", "Pass1234");
        mockMvc.perform(post("/api/admin/announcements")
                .header("Authorization", authHeader(token))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(announcement("Fake News", "General", false))))
                .andExpect(status().isForbidden());
    }

    // ── TC-ANN-003 ───────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-ANN-003 | GET /announcements publicly accessible → returns list")
    void getAnnouncements_public_returns200() throws Exception {
        createAnnouncement("Public Post", "General");
        mockMvc.perform(get("/api/announcements"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", isA(java.util.List.class)))
                .andExpect(jsonPath("$[?(@.title == 'Public Post')]", hasSize(1)));
    }

    // ── TC-ANN-004 ───────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-ANN-004 | GET /announcements/category/{cat} filters correctly")
    void getByCategory_returnsCorrectSubset() throws Exception {
        createAnnouncement("Sports Day", "Sport");
        createAnnouncement("Exam Results", "Academic");
        createAnnouncement("Another Sport", "Sport");

        mockMvc.perform(get("/api/announcements/category/Sport"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].category", everyItem(is("Sport"))))
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(2))));
    }

    // ── TC-ANN-005 ───────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-ANN-005 | Admin updates announcement → new content persisted")
    void updateAnnouncement_asAdmin_returnsUpdated() throws Exception {
        Long id = createAnnouncement("Old Title", "General");
        String token = adminToken();

        Map<String, Object> updated = Map.of(
            "title", "New Title", "content", "Updated content here.",
            "category", "Academic", "pinned", true
        );
        mockMvc.perform(put("/api/admin/announcements/" + id)
                .header("Authorization", authHeader(token))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("New Title")))
                .andExpect(jsonPath("$.pinned", is(true)));
    }

    // ── TC-ANN-006 ───────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-ANN-006 | Admin deletes announcement → removed from list")
    void deleteAnnouncement_asAdmin_removedFromList() throws Exception {
        Long id = createAnnouncement("To Be Deleted", "General");
        String token = adminToken();

        mockMvc.perform(delete("/api/admin/announcements/" + id)
                .header("Authorization", authHeader(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", notNullValue()));

        mockMvc.perform(get("/api/announcements"))
                .andExpect(jsonPath("$[?(@.id == " + id + ")]", hasSize(0)));
    }

    // ── TC-ANN-007 ───────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-ANN-007 | Pinned announcement has pinned=true in response")
    void createPinnedAnnouncement_pinnedFlagIsTrue() throws Exception {
        String token = adminToken();
        mockMvc.perform(post("/api/admin/announcements")
                .header("Authorization", authHeader(token))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(announcement("Important Notice", "General", true))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.pinned", is(true)));
    }

    // ── TC-ANN-008 ───────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-ANN-008 | authorUsername is set to admin's username on creation")
    void createAnnouncement_authorUsernameSetToAdmin() throws Exception {
        String token = adminToken();
        mockMvc.perform(post("/api/admin/announcements")
                .header("Authorization", authHeader(token))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(announcement("Authored Post", "General", false))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.authorUsername", is("admin")));
    }
}
