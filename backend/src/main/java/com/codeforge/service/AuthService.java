package com.codeforge.service;

import com.codeforge.dto.AuthDto;
import com.codeforge.entity.User;
import com.codeforge.repository.SubmissionRepository;
import com.codeforge.repository.UserRepository;
import com.codeforge.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final OtpService otpService;

    public AuthDto.AuthResponse register(AuthDto.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .avatarUrl("https://api.dicebear.com/7.x/initials/svg?seed=" + request.getName())
                .build();

        user = userRepository.save(user);
        String token = jwtUtil.generateToken(user.getEmail());

        return AuthDto.AuthResponse.builder()
                .token(token)
                .user(mapToUserInfo(user))
                .build();
    }

    public AuthDto.AuthResponse login(AuthDto.LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return AuthDto.AuthResponse.builder()
                .token(token)
                .user(mapToUserInfo(user))
                .build();
    }

    public AuthDto.UserInfo updateProfile(User user, AuthDto.UpdateProfileRequest request) {
        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            user.setName(request.getName().trim());
        }
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty() && !request.getEmail().equalsIgnoreCase(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail().trim())) {
                throw new RuntimeException("Email address already in use");
            }
            user.setEmail(request.getEmail().trim());
        }
        user = userRepository.save(user);
        return mapToUserInfo(user);
    }

    public AuthDto.OtpResponse changePassword(User user, AuthDto.ChangePasswordRequest request) {
        // Verify OTP code first
        otpService.verifyOtp(user.getEmail(), request.getOtp());

        if (request.getNewPassword() == null || request.getNewPassword().trim().length() < 6) {
            throw new RuntimeException("New password must be at least 6 characters long");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword().trim()));
        userRepository.save(user);

        return AuthDto.OtpResponse.builder()
                .message("Password updated successfully")
                .success(true)
                .build();
    }

    @Transactional
    public void deleteAccount(User user) {
        userRepository.delete(user);
    }

    public AuthDto.UserInfo getCurrentUser(User user) {
        int solvedCount = (int) submissionRepository.countSolvedByUserId(user.getId());
        return mapToUserInfo(user, solvedCount);
    }

    private AuthDto.UserInfo mapToUserInfo(User user) {
        return mapToUserInfo(user, user.getProblemsSolved());
    }

    private AuthDto.UserInfo mapToUserInfo(User user, int problemsSolved) {
        return AuthDto.UserInfo.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .problemsSolved(problemsSolved)
                .currentStreak(user.getCurrentStreak())
                .contestRating(user.getContestRating())
                .build();
    }
}
