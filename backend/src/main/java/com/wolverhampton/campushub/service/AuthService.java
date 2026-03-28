package com.wolverhampton.campushub.service;

import com.wolverhampton.campushub.dto.AuthDTO;
import com.wolverhampton.campushub.dto.UserDTO;
import com.wolverhampton.campushub.entity.Role;
import com.wolverhampton.campushub.entity.User;
import com.wolverhampton.campushub.repository.RoleRepository;
import com.wolverhampton.campushub.repository.UserRepository;
import com.wolverhampton.campushub.security.JwtUtils;
import com.wolverhampton.campushub.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class AuthService {

    @Autowired private UserRepository userRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private JwtUtils jwtUtils;

    public UserDTO register(AuthDTO.RegisterRequest request) {
        // Check both username and email uniqueness before doing anything
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setStudentId(request.getStudentId());
        user.setCourse(request.getCourse());

        // Everyone who registers gets STUDENT — only DataInitializer makes admins
        Role studentRole = roleRepository.findByName(Role.RoleName.ROLE_STUDENT)
                .orElseThrow(() -> new RuntimeException("Student role not found"));
        user.setRoles(Set.of(studentRole));

        User saved = userRepository.save(user);
        return toDTO(saved);
    }

    public AuthDTO.LoginResponse login(AuthDTO.LoginRequest request) {
        // Spring handles the actual credential check — throws if wrong
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        // Just grab the first role — users only have one in this version
        String role = userDetails.getAuthorities().stream()
                .findFirst().map(Object::toString).orElse("ROLE_STUDENT");

        // Need the full User object to get firstName/lastName for the response
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new AuthDTO.LoginResponse(token, user.getUsername(), user.getEmail(),
                role, user.getId(), user.getFirstName(), user.getLastName());
    }

    public UserDTO getProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return toDTO(user);
    }

    // Only allows updating name and course — username/email/password not changeable here
    // TODO: add a separate change-password endpoint if we revisit this
    public UserDTO updateProfile(String username, UserDTO dto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (dto.getFirstName() != null) user.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) user.setLastName(dto.getLastName());
        if (dto.getCourse() != null) user.setCourse(dto.getCourse());
        return toDTO(userRepository.save(user));
    }

    // Shared by AuthController and AdminController (admin user list reuses this)
    public UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setStudentId(user.getStudentId());
        dto.setCourse(user.getCourse());
        dto.setEngagementPoints(user.getEngagementPoints());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setRole(user.getRoles().stream()
                .findFirst().map(r -> r.getName().name()).orElse(""));
        return dto;
    }
}
