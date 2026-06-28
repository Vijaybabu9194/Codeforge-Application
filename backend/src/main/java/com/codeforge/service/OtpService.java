package com.codeforge.service;

import com.codeforge.dto.AuthDto;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    private final JavaMailSender mailSender;
    
    @Value("${spring.mail.username:vijaybabuarumilli99@gmail.com}")
    private String fromEmail;

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
        log.info("REAL DISPATCHED OTP FOR [{}]: {}", email, otpStr);
        log.info("=================================================");

        // Dispatch physical mail asynchronously via JavaMailSender
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            // Set explicit From address to prevent 'can't determine local email address'
            helper.setFrom(fromEmail, "CodeForge Platform");
            helper.setTo(email);
            helper.setSubject("⚡ CodeForge — Your Verification OTP Code");
            
            String htmlContent = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;'>"
                    + "<h2 style='color: #0284c7; margin-bottom: 12px; font-size: 24px; font-weight: 800;'>Welcome to CodeForge! ⚡</h2>"
                    + "<p style='color: #475569; font-size: 15px; line-height: 1.6;'>Thank you for signing up. Please use the following 6-digit verification code to complete your registration:</p>"
                    + "<div style='background-color: #f0f9ff; border: 2px border-dashed #38bdf8; padding: 20px; text-align: center; border-radius: 12px; margin: 24px 0;'>"
                    + "<span style='font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #0284c7; font-family: monospace;'>" + otpStr + "</span>"
                    + "</div>"
                    + "<p style='color: #64748b; font-size: 13px; line-height: 1.5;'>This verification code is valid for 10 minutes. If you did not request this code, please disregard this email.</p>"
                    + "<hr style='border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;' />"
                    + "<p style='color: #94a3b8; font-size: 11px; text-align: center;'>© 2026 CodeForge Application. All rights reserved.</p>"
                    + "</div>";
            
            helper.setText(htmlContent, true);
            mailSender.send(message);
            log.info("PHYSICAL MAIL SUCCESSFULLY DISPATCHED TO {}", email);
        } catch (Exception e) {
            log.error("SMTP physical mail dispatch error: {}", e.getMessage(), e);
        }

        return AuthDto.OtpResponse.builder()
                .message("Physical OTP email dispatched to " + email)
                .success(true)
                .otp(otpStr) // Return generated code so user can verify
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
