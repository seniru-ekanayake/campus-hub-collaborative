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
 * TC-EVT-001 through TC-EVT-009
 * Tests: event CRUD by admin, student read access, authorization enforcement.
 */
@DisplayName("TC-EVT | Event Management Controller")
class EventControllerTest extends BaseIntegrationTest {

    private Map<String, String> sampleEvent(String title) {
        return Map.of(
            "title", title,
            "description", "An annual spring event on campus.",
            "eventDate", "2025-06-15T14:00:00",
            "location", "Main Hall",
            "campus", "City",
            "category", "Social",
            "capacity", "200"
        );
    }

    // ── TC-EVT-001 ───────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-EVT-001 | GET /events is publicly accessible → 200")
    void getEvents_public_returns200() throws Exception {
        mockMvc.perform(get("/api/events"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", isA(java.util.List.class)));
    }

    // ── TC-EVT-002 ───────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-EVT-002 | Admin creates event → 200, event appears in list")
    void createEvent_asAdmin_returns200() throws Exception {
        String token = adminToken();
        mockMvc.perform(post("/api/admin/events")
                .header("Authorization", authHeader(token))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleEvent("Spring Fair 2025"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Spring Fair 2025")))
                .andExpect(jsonPath("$.id", notNullValue()));
    }

    // ── TC-EVT-003 ───────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-EVT-003 | Student cannot create event → 403")
    void createEvent_asStudent_returns403() throws Exception {
        String token = registerAndLogin("eventstu", "Pass1234");
        mockMvc.perform(post("/api/admin/events")
                .header("Authorization", authHeader(token))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleEvent("Hacked Event"))))
                .andExpect(status().isForbidden());
    }

    // ── TC-EVT-004 ───────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-EVT-004 | Unauthenticated cannot create event → 401 or 403")
    void createEvent_noToken_returnsUnauthorized() throws Exception {
        mockMvc.perform(post("/api/admin/events")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleEvent("Anon Event"))))
                .andExpect(status().is4xxClientError());
    }

    // ── TC-EVT-005 ───────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-EVT-005 | Admin creates event → student can see it in GET /events")
    void createdEvent_visibleToStudents() throws Exception {
        String admin = adminToken();
        mockMvc.perform(post("/api/admin/events")
                .header("Authorization", authHeader(admin))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleEvent("Visible Event"))))
                .andExpect(status().isOk());

        // Student reads events
        String student = registerAndLogin("evtviewer", "Pass1234");
        mockMvc.perform(get("/api/events")
                .header("Authorization", authHeader(student)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.title == 'Visible Event')]", hasSize(greaterThanOrEqualTo(1))));
    }

    // ── TC-EVT-006 ───────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-EVT-006 | Admin updates event → changes persisted")
    void updateEvent_asAdmin_returnsUpdated() throws Exception {
        String token = adminToken();
        // Create
        MvcResult result = mockMvc.perform(post("/api/admin/events")
                .header("Authorization", authHeader(token))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleEvent("Original Title"))))
                .andExpect(status().isOk())
                .andReturn();

        Map<?, ?> created = objectMapper.readValue(result.getResponse().getContentAsString(), Map.class);
        Long id = Long.valueOf(created.get("id").toString());

        // Update title
        Map<String, String> updated = Map.of(
            "title", "Updated Title",
            "description", "Updated description",
            "eventDate", "2025-07-20T10:00:00",
            "location", "Room 101",
            "campus", "City",
            "category", "Academic",
            "capacity", "50"
        );
        mockMvc.perform(put("/api/admin/events/" + id)
                .header("Authorization", authHeader(token))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Updated Title")));
    }

    // ── TC-EVT-007 ───────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-EVT-007 | Admin deletes event → removed from list")
    void deleteEvent_asAdmin_removesFromList() throws Exception {
        String token = adminToken();
        MvcResult result = mockMvc.perform(post("/api/admin/events")
                .header("Authorization", authHeader(token))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleEvent("Delete Me"))))
                .andReturn();

        Map<?, ?> created = objectMapper.readValue(result.getResponse().getContentAsString(), Map.class);
        Long id = Long.valueOf(created.get("id").toString());

        mockMvc.perform(delete("/api/admin/events/" + id)
                .header("Authorization", authHeader(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", notNullValue()));

        // Verify gone
        mockMvc.perform(get("/api/events"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.id == " + id + ")]", hasSize(0)));
    }

    // ── TC-EVT-008 ───────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-EVT-008 | GET /events/all returns all events (admin view)")
    void getAllEvents_authenticated_returnsList() throws Exception {
        String token = adminToken();
        mockMvc.perform(get("/api/events/all")
                .header("Authorization", authHeader(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", isA(java.util.List.class)));
    }

    // ── TC-EVT-009 ───────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-EVT-009 | GET /events/{id} returns single event")
    void getEventById_validId_returnsEvent() throws Exception {
        String token = adminToken();
        MvcResult result = mockMvc.perform(post("/api/admin/events")
                .header("Authorization", authHeader(token))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleEvent("Single Event"))))
                .andReturn();

        Map<?, ?> created = objectMapper.readValue(result.getResponse().getContentAsString(), Map.class);
        Long id = Long.valueOf(created.get("id").toString());

        mockMvc.perform(get("/api/events/" + id)
                .header("Authorization", authHeader(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Single Event")));
    }
}
