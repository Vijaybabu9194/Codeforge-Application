package com.codeforge.dto;

import lombok.*;
import java.util.List;
import java.util.Map;

public class ProfileDto {

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class PlatformListItem {
        private String platform;
        private String username;
        private Integer problemsSolved;
        private Integer contestRating;
        private Boolean connected;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class PlatformDashboardResponse {
        private String platform;
        private String username;
        private Integer globalRank;
        private Integer countryRank;
        private Integer contestRating;
        private Integer problemsSolved;
        private Integer easySolved;
        private Integer mediumSolved;
        private Integer hardSolved;
        private Integer badgesCount;
        private String contestHistory; // JSON
        private String heatmapData; // JSON
        private String badges; // JSON
        private String recentActivity; // JSON
    }
}
