package com.codeforge.service;

import com.codeforge.dto.ProfileDto;
import com.codeforge.entity.PlatformProfile;
import com.codeforge.entity.User;
import com.codeforge.repository.PlatformProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final PlatformProfileRepository platformProfileRepository;

    public List<ProfileDto.PlatformListItem> getPlatforms(User user) {
        List<PlatformProfile> profiles = platformProfileRepository.findByUserId(user.getId());

        return List.of(
            PlatformProfile.Platform.LEETCODE,
            PlatformProfile.Platform.GEEKSFORGEEKS,
            PlatformProfile.Platform.CODECHEF,
            PlatformProfile.Platform.HACKERRANK,
            PlatformProfile.Platform.CODEFORCES
        ).stream().map(platform -> {
            var profile = profiles.stream()
                    .filter(p -> p.getPlatform() == platform)
                    .findFirst();
            return ProfileDto.PlatformListItem.builder()
                    .platform(platform.name())
                    .username(profile.map(PlatformProfile::getUsername).orElse(null))
                    .problemsSolved(profile.map(PlatformProfile::getProblemsSolved).orElse(0))
                    .contestRating(profile.map(PlatformProfile::getContestRating).orElse(0))
                    .connected(profile.isPresent())
                    .build();
        }).collect(Collectors.toList());
    }

    public ProfileDto.PlatformDashboardResponse getPlatformDashboard(User user, String platformName) {
        PlatformProfile.Platform platform = PlatformProfile.Platform.valueOf(platformName.toUpperCase());
        PlatformProfile profile = platformProfileRepository.findByUserIdAndPlatform(user.getId(), platform)
                .orElseThrow(() -> new RuntimeException("Platform profile not found"));

        return ProfileDto.PlatformDashboardResponse.builder()
                .platform(profile.getPlatform().name())
                .username(profile.getUsername())
                .globalRank(profile.getGlobalRank())
                .countryRank(profile.getCountryRank())
                .contestRating(profile.getContestRating())
                .problemsSolved(profile.getProblemsSolved())
                .easySolved(profile.getEasySolved())
                .mediumSolved(profile.getMediumSolved())
                .hardSolved(profile.getHardSolved())
                .badgesCount(profile.getBadgesCount())
                .contestHistory(profile.getContestHistory())
                .heatmapData(profile.getHeatmapData())
                .badges(profile.getBadges())
                .recentActivity(profile.getRecentActivity())
                .build();
    }
}
