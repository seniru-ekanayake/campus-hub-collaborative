package com.wolverhampton.campushub.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * TC-JWT-001 through TC-JWT-005
 * Unit tests for JwtUtils — verifies token generation, extraction, and validation.
 */
@DisplayName("TC-JWT | JwtUtils Unit Tests")
class JwtUtilsTest {

    private JwtUtils jwtUtils;

    private static final String SECRET =
        "wolverhampton_campus_hub_secret_key_2024_very_long_secure_string";

    @BeforeEach
    void setUp() {
        jwtUtils = new JwtUtils();
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", SECRET);
        ReflectionTestUtils.setField(jwtUtils, "jwtExpiration", 86400000L);
    }

    private Authentication mockAuth(String username) {
        UserDetailsImpl userDetails = new UserDetailsImpl(
            1L, username, username + "@wlv.ac.uk", "encoded",
            List.of(new SimpleGrantedAuthority("ROLE_STUDENT"))
        );
        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }

    // ── TC-JWT-001 ───────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-JWT-001 | generateJwtToken returns non-null, non-empty token")
    void generateToken_returnsValidString() {
        String token = jwtUtils.generateJwtToken(mockAuth("jsmith"));
        assertNotNull(token);
        assertFalse(token.isBlank());
        assertTrue(token.contains("."), "JWT should have 3 parts separated by dots");
    }

    // ── TC-JWT-002 ───────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-JWT-002 | getUsernameFromToken returns correct username")
    void extractUsername_matchesOriginal() {
        String token = jwtUtils.generateJwtToken(mockAuth("testuser"));
        assertEquals("testuser", jwtUtils.getUsernameFromToken(token));
    }

    // ── TC-JWT-003 ───────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-JWT-003 | validateJwtToken returns true for a valid token")
    void validateToken_validToken_returnsTrue() {
        String token = jwtUtils.generateJwtToken(mockAuth("validuser"));
        assertTrue(jwtUtils.validateJwtToken(token));
    }

    // ── TC-JWT-004 ───────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-JWT-004 | validateJwtToken returns false for tampered token")
    void validateToken_tamperedToken_returnsFalse() {
        String token = jwtUtils.generateJwtToken(mockAuth("user"));
        String tampered = token.substring(0, token.length() - 5) + "XXXXX";
        assertFalse(jwtUtils.validateJwtToken(tampered));
    }

    // ── TC-JWT-005 ───────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-JWT-005 | validateJwtToken returns false for an expired token")
    void validateToken_expiredToken_returnsFalse() {
        // Create a JwtUtils with 1ms expiry
        JwtUtils expiredUtils = new JwtUtils();
        ReflectionTestUtils.setField(expiredUtils, "jwtSecret", SECRET);
        ReflectionTestUtils.setField(expiredUtils, "jwtExpiration", 1L); // 1 ms

        String token = expiredUtils.generateJwtToken(mockAuth("expireduser"));

        // Sleep to let it expire
        try { Thread.sleep(50); } catch (InterruptedException ignored) {}

        assertFalse(expiredUtils.validateJwtToken(token));
    }
}
