package com.saathi.security;

import com.saathi.entity.User;
import com.saathi.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy; // Added Lazy import
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    @Value("${saathi.frontend.url}")
    private String frontendUrl;

    // Lombok constructor hata kar manual constructor banaya taaki @Lazy dependencies pass ho sakein
    public OAuth2LoginSuccessHandler(UserRepository userRepository,
                                     @Lazy JwtUtil jwtUtil,
                                     @Lazy PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        String email = oauthUser.getAttribute("email");
        String name  = oauthUser.getAttribute("name");
        String googleId = oauthUser.getAttribute("sub");
        String picture = oauthUser.getAttribute("picture");

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = User.builder()
                    .email(email)
                    .fullName(name)
                    .username(generateUsername(email))
                    .password(passwordEncoder.encode(UUID.randomUUID().toString())) // random, unused
                    .avatarUrl(picture)
                    .googleId(googleId)
                    .authProvider(User.AuthProvider.GOOGLE)
                    .emailVerified(true)
                    .build();
            return userRepository.save(newUser);
        });

        // Link Google account if previously local
        if (user.getGoogleId() == null) {
            user.setGoogleId(googleId);
            if (user.getAvatarUrl() == null) user.setAvatarUrl(picture);
            userRepository.save(user);
        }

        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                user.getEmail(), user.getPassword(), true, true, true, true,
                java.util.List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                        "ROLE_" + user.getRole().name())));

        String token = jwtUtil.generateToken(userDetails);

        // Redirect to frontend with token
        response.sendRedirect(frontendUrl + "/oauth-callback?token=" + token);
    }

    private String generateUsername(String email) {
        String base = email.split("@")[0].replaceAll("[^a-zA-Z0-9]", "");
        String candidate = base;
        int suffix = 1;
        while (userRepository.existsByUsername(candidate)) {
            candidate = base + suffix++;
        }
        return candidate;
    }
}