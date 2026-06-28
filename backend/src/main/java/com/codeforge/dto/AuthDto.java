package com.codeforge.dto;

import lombok.*;

public class AuthDto {

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class RegisterRequest {
        private String name;
        private String email;
        private String password;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class SendOtpRequest {
        private String email;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class VerifyOtpRequest {
        private String email;
        private String otp;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class OtpResponse {
        private String message;
        private boolean success;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class AuthResponse {
        private String token;
        private UserInfo user;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class UserInfo {
        private Long id;
        private String name;
        private String email;
        private String avatarUrl;
        private Integer problemsSolved;
        private Integer currentStreak;
        private Integer contestRating;
    }
}
