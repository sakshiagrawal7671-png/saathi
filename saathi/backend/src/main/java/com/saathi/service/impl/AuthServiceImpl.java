package com.saathi.service.impl;

import com.saathi.dto.request.LoginRequest;
import com.saathi.dto.request.RegisterRequest;
import com.saathi.dto.response.AuthResponse;
import com.saathi.dto.response.UserResponse;
import com.saathi.entity.User;
import com.saathi.exception.SaathiException;
import com.saathi.repository.UserRepository;
import com.saathi.security.JwtUtil;
import com.saathi.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail()))
            throw new SaathiException("Email already registered", HttpStatus.CONFLICT);
        if (userRepository.existsByUsername(request.getUsername()))
            throw new SaathiException("Username already taken", HttpStatus.CONFLICT);

        User user = User.builder()
                .fullName(request.getFullName())
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .user(UserResponse.from(user))
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .user(UserResponse.from(user))
                .build();
    }

    @Override
    public UserResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));
        return UserResponse.from(user);
    }

    @Override
    public UserResponse updateProfile(String email, UserResponse updates) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));

        if (updates.getFullName() != null) user.setFullName(updates.getFullName());
        if (updates.getBio() != null) user.setBio(updates.getBio());
        if (updates.getAvatarUrl() != null) user.setAvatarUrl(updates.getAvatarUrl());
        if (updates.getInterests() != null) user.setInterests(updates.getInterests());

        userRepository.save(user);
        return UserResponse.from(user);
    }
}
