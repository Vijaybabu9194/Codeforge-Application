package com.codeforge.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.BatchSize;
import java.util.*;

@Entity
@Table(name = "problems")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Problem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(unique = true, nullable = false)
    private String slug;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Difficulty difficulty;

    @Builder.Default
    private Double acceptanceRate = 0.0;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Builder.Default
    private Integer timesAsked = 0;

    @Column(name = "leetcode_url")
    private String leetcodeUrl;

    @Column(name = "gfg_url")
    private String gfgUrl;

    @Column(name = "youtube_url")
    private String youtubeUrl;

    @Column(name = "article_url")
    private String articleUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subtopic_id")
    private Subtopic subtopic;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "problem_topics",
        joinColumns = @JoinColumn(name = "problem_id"),
        inverseJoinColumns = @JoinColumn(name = "topic_id")
    )
    @BatchSize(size = 100)
    @Builder.Default
    private Set<Topic> topics = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "problem_companies",
        joinColumns = @JoinColumn(name = "problem_id"),
        inverseJoinColumns = @JoinColumn(name = "company_id")
    )
    @BatchSize(size = 100)
    @Builder.Default
    private Set<Company> companies = new HashSet<>();

    public enum Difficulty {
        EASY, MEDIUM, HARD
    }
}
