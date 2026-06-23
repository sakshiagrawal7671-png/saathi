package com.saathi.service;

import com.saathi.dto.request.LoginRequest;
import com.saathi.dto.request.RegisterRequest;
import com.saathi.dto.response.AuthResponse;
import com.saathi.dto.response.UserResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    UserResponse getProfile(String email);
    UserResponse updateProfile(String email, UserResponse updates);
}
