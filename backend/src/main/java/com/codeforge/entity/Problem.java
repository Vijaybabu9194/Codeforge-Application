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

    /** Rich problem statement (Markdown) */
    @Column(name = "problem_statement", columnDefinition = "TEXT")
    private String problemStatement;

    /** JSON array: [{input, output, explanation}] — sent to frontend */
    @Column(name = "sample_test_cases", columnDefinition = "TEXT")
    private String sampleTestCases;

    /** JSON array: [{input, output}] — NEVER sent to frontend */
    @Column(name = "hidden_test_cases", columnDefinition = "TEXT")
    private String hiddenTestCases;

    /** Newline-separated constraints */
    @Column(name = "constraints", columnDefinition = "TEXT")
    private String constraints;

    /** JSON array of hint strings */
    @Column(name = "hints", columnDefinition = "TEXT")
    private String hints;

    /** JSON map: {python, java, cpp} starter code templates */
    @Column(name = "starter_code", columnDefinition = "TEXT")
    private String starterCode;

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
