package com.wolverhampton.campushub.service;

import com.wolverhampton.campushub.dto.AuthDTO;
import com.wolverhampton.campushub.dto.UserDTO;
import com.wolverhampton.campushub.entity.Role;
import com.wolverhampton.campushub.entity.User;
import com.wolverhampton.campushub.repository.RoleRepository;
import com.wolverhampton.campushub.repository.UserRepository;
import com.wolverhampton.campushub.security.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * TC-SVC-001 through TC-SVC-008
 * Unit tests for AuthService — mocks all repository and security dependencies.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("TC-SVC | AuthService Unit Tests")
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private RoleRepository roleRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private JwtUtils jwtUtils;

    @InjectMocks
    private AuthService authService;

    private Role studentRole;
    private User testUser;

    @BeforeEach
    void setUp() {
        studentRole = new Role();
        studentRole.setName(Role.RoleName.ROLE_STUDENT);

        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("jsmith");
        testUser.setEmail("jsmith@wlv.ac.uk");
        testUser.setPassword("encoded_pass");
        testUser.setFirstName("John");
        testUser.setLastName("Smith");
        testUser.setCourse("Software Engineering");
        testUser.setRoles(Set.of(studentRole));
    }

    // ── TC-SVC-001 ───────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-SVC-001 | register with valid data → returns UserDTO with correct fields")
    void register_validData_returnsUserDTO() {
        AuthDTO.RegisterRequest req = new AuthDTO.RegisterRequest();
        req.setUsername("jsmith");
        req.setEmail("jsmith@wlv.ac.uk");
        req.setPassword("Pass1234");
        req.setFirstName("John");
        req.setLastName("Smith");
        req.setStudentId("B123456");
        req.setCourse("Software Engineering");

        when(userRepository.existsByUsername("jsmith")).thenReturn(false);
        when(userRepository.existsByEmail("jsmith@wlv.ac.uk")).thenReturn(false);
        when(roleRepository.findByName(Role.RoleName.ROLE_STUDENT)).thenReturn(Optional.of(studentRole));
        when(passwordEncoder.encode("Pass1234")).thenReturn("encoded_pass");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        UserDTO result = authService.register(req);

        assertNotNull(result);
        assertEquals("jsmith", result.getUsername());
        assertEquals("jsmith@wlv.ac.uk", result.getEmail());
        assertEquals("John", result.getFirstName());
        assertEquals("ROLE_STUDENT", result.getRole());
    }

    // ── TC-SVC-002 ───────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-SVC-002 | register with duplicate username → throws RuntimeException")
    void register_duplicateUsername_throwsException() {
        AuthDTO.RegisterRequest req = new AuthDTO.RegisterRequest();
        req.setUsername("existing");
        req.setEmail("new@wlv.ac.uk");
        req.setPassword("Pass1234");

        when(userRepository.existsByUsername("existing")).thenReturn(true);

        RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.register(req));
        assertEquals("Username already taken", ex.getMessage());
        verify(userRepository, never()).save(any());
    }

    // ── TC-SVC-003 ───────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-SVC-003 | register with duplicate email → throws RuntimeException")
    void register_duplicateEmail_throwsException() {
        AuthDTO.RegisterRequest req = new AuthDTO.RegisterRequest();
        req.setUsername("newuser");
        req.setEmail("taken@wlv.ac.uk");
        req.setPassword("Pass1234");

        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("taken@wlv.ac.uk")).thenReturn(true);

        RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.register(req));
        assertEquals("Email already in use", ex.getMessage());
        verify(userRepository, never()).save(any());
    }

    // ── TC-SVC-004 ───────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-SVC-004 | register → passwordEncoder.encode called with raw password")
    void register_passwordIsEncoded() {
        AuthDTO.RegisterRequest req = new AuthDTO.RegisterRequest();
        req.setUsername("enctest");
        req.setEmail("enc@wlv.ac.uk");
        req.setPassword("RawPassword99");
        req.setFirstName("Enc"); req.setLastName("Test");

        when(userRepository.existsByUsername(any())).thenReturn(false);
        when(userRepository.existsByEmail(any())).thenReturn(false);
        when(roleRepository.findByName(any())).thenReturn(Optional.of(studentRole));
        when(passwordEncoder.encode("RawPassword99")).thenReturn("$2a$hashed");
        when(userRepository.save(any())).thenReturn(testUser);

        authService.register(req);

        verify(passwordEncoder).encode("RawPassword99");
    }

    // ── TC-SVC-005 ───────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-SVC-005 | getProfile with valid username → returns correct DTO")
    void getProfile_validUsername_returnsDTO() {
        when(userRepository.findByUsername("jsmith")).thenReturn(Optional.of(testUser));

        UserDTO result = authService.getProfile("jsmith");

        assertEquals("jsmith", result.getUsername());
        assertEquals("John", result.getFirstName());
        assertEquals("Smith", result.getLastName());
    }

    // ── TC-SVC-006 ───────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-SVC-006 | getProfile with unknown username → throws RuntimeException")
    void getProfile_unknownUsername_throws() {
        when(userRepository.findByUsername("nobody")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> authService.getProfile("nobody"));
    }

    // ── TC-SVC-007 ───────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-SVC-007 | updateProfile updates firstName, lastName, course")
    void updateProfile_validData_updatesFields() {
        when(userRepository.findByUsername("jsmith")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        UserDTO dto = new UserDTO();
        dto.setFirstName("Jane");
        dto.setLastName("Doe");
        dto.setCourse("Data Science");

        authService.updateProfile("jsmith", dto);

        verify(userRepository).save(argThat(u ->
            "Jane".equals(u.getFirstName()) &&
            "Doe".equals(u.getLastName()) &&
            "Data Science".equals(u.getCourse())
        ));
    }

    // ── TC-SVC-008 ───────────────────────────────────────────────────────────
    @Test
    @DisplayName("TC-SVC-008 | toDTO does not expose password field")
    void toDTO_doesNotExposePassword() {
        UserDTO dto = authService.toDTO(testUser);
        // UserDTO has no getPassword() — confirms field is absent from DTO class
        assertDoesNotThrow(() -> dto.getClass().getMethod("getUsername"));
        assertThrows(NoSuchMethodException.class, () -> dto.getClass().getMethod("getPassword"));
    }
}
