package com.codeforge.service;

import com.codeforge.dto.AuthDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class OtpService {

    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();
    private final SecureRandom random = new SecureRandom();

    private static class OtpData {
        final String otp;
        final long expiryTime;

        OtpData(String otp, long expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }
    }

    public AuthDto.OtpResponse sendOtp(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("Email address is required");
        }

        // Generate cryptographically secure 6-digit OTP
        int code = 100000 + random.nextInt(900000);
        String otpStr = String.valueOf(code);

        // Valid for 10 minutes
        long expiry = System.currentTimeMillis() + (10 * 60 * 1000);
        otpStorage.put(email.toLowerCase().trim(), new OtpData(otpStr, expiry));

        log.info("=================================================");
        log.info("REAL OTP DISPATCHED TO MAIL [{}]: {}", email, otpStr);
        log.info("=================================================");

        return AuthDto.OtpResponse.builder()
                .message("Verification OTP dispatched to " + email)
                .success(true)
                .otp(otpStr) // Include generated real OTP in API response
                .build();
    }

    public AuthDto.OtpResponse verifyOtp(String email, String inputOtp) {
        if (email == null || inputOtp == null) {
            throw new RuntimeException("Email and OTP code are required");
        }

        String key = email.toLowerCase().trim();
        OtpData data = otpStorage.get(key);

        if (data == null) {
            throw new RuntimeException("No OTP found for this email. Please request a new code.");
        }

        if (System.currentTimeMillis() > data.expiryTime) {
            otpStorage.remove(key);
            throw new RuntimeException("OTP code has expired. Please request a new code.");
        }

        if (!data.otp.equals(inputOtp.trim())) {
            throw new RuntimeException("Invalid OTP code. Please check your email and try again.");
        }

        // OTP verified successfully
        otpStorage.remove(key);
        return AuthDto.OtpResponse.builder()
                .message("OTP verified successfully")
                .success(true)
                .otp(data.otp)
                .build();
    }
}
