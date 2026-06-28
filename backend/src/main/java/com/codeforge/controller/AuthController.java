package com.codeforge.controller;

import com.codeforge.dto.AuthDto;
import com.codeforge.entity.User;
import com.codeforge.service.AuthService;
import com.codeforge.service.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final OtpService otpService;

    @PostMapping("/send-otp")
    public ResponseEntity<AuthDto.OtpResponse> sendOtp(@RequestBody AuthDto.SendOtpRequest request) {
        return ResponseEntity.ok(otpService.sendOtp(request.getEmail()));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthDto.OtpResponse> verifyOtp(@RequestBody AuthDto.VerifyOtpRequest request) {
        return ResponseEntity.ok(otpService.verifyOtp(request.getEmail(), request.getOtp()));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthDto.AuthResponse> register(@RequestBody AuthDto.RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthDto.AuthResponse> login(@RequestBody AuthDto.LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PutMapping("/update-profile")
    public ResponseEntity<AuthDto.UserInfo> updateProfile(@RequestBody AuthDto.UpdateProfileRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(authService.updateProfile(user, request));
    }

    @PostMapping("/change-password")
    public ResponseEntity<AuthDto.OtpResponse> changePassword(@RequestBody AuthDto.ChangePasswordRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(authService.changePassword(user, request));
    }

    @DeleteMapping("/delete-account")
    public ResponseEntity<AuthDto.OtpResponse> deleteAccount(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        authService.deleteAccount(user);
        return ResponseEntity.ok(AuthDto.OtpResponse.builder().message("Account deleted successfully").success(true).build());
    }

    @GetMapping("/me")
    public ResponseEntity<AuthDto.UserInfo> getCurrentUser(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(authService.getCurrentUser(user));
    }
}
