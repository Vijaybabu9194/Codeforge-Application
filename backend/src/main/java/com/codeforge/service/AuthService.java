package com.codeforge.service;

import com.codeforge.dto.AuthDto;
import com.codeforge.entity.User;
import com.codeforge.repository.UserRepository;
import com.codeforge.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

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

    public AuthDto.UserInfo getCurrentUser(User user) {
        return mapToUserInfo(user);
    }

    private AuthDto.UserInfo mapToUserInfo(User user) {
        return AuthDto.UserInfo.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .problemsSolved(user.getProblemsSolved())
                .currentStreak(user.getCurrentStreak())
                .contestRating(user.getContestRating())
                .build();
    }
}
