package com.codeforge.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "platform_profiles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PlatformProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Platform platform;

    private String username;

    @Builder.Default
    private Integer globalRank = 0;

    @Builder.Default
    private Integer countryRank = 0;

    @Builder.Default
    private Integer contestRating = 0;

    @Builder.Default
    private Integer problemsSolved = 0;

    @Builder.Default
    private Integer easySolved = 0;

    @Builder.Default
    private Integer mediumSolved = 0;

    @Builder.Default
    private Integer hardSolved = 0;

    @Builder.Default
    private Integer badgesCount = 0;

    @Column(columnDefinition = "TEXT")
    private String contestHistory; // JSON string

    @Column(columnDefinition = "TEXT")
    private String heatmapData; // JSON string

    @Column(columnDefinition = "TEXT")
    private String badges; // JSON string

    @Column(columnDefinition = "TEXT")
    private String recentActivity; // JSON string

    public enum Platform {
        LEETCODE, GEEKSFORGEEKS, CODECHEF, HACKERRANK, CODEFORCES, GITHUB
    }
}
