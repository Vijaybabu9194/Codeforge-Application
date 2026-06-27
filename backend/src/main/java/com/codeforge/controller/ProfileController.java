package com.codeforge.controller;

import com.codeforge.dto.ProfileDto;
import com.codeforge.entity.User;
import com.codeforge.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/platforms")
    public ResponseEntity<List<ProfileDto.PlatformListItem>> getPlatforms(Authentication auth) {
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(profileService.getPlatforms(user));
    }

    @GetMapping("/{platform}")
    public ResponseEntity<ProfileDto.PlatformDashboardResponse> getPlatformDashboard(
            Authentication auth, @PathVariable String platform) {
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(profileService.getPlatformDashboard(user, platform));
    }

    @PostMapping("/platforms/link")
    public ResponseEntity<ProfileDto.PlatformListItem> linkPlatform(
            Authentication auth, @RequestBody ProfileDto.LinkPlatformRequest request) {
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(profileService.linkPlatform(user, request));
    }

    @PostMapping("/{platform}/refresh")
    public ResponseEntity<ProfileDto.PlatformDashboardResponse> refreshPlatform(
            Authentication auth, @PathVariable String platform) {
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(profileService.refreshPlatformStats(user, platform));
    }
}
