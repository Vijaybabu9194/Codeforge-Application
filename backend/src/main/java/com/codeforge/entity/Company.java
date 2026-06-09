package com.codeforge.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "companies")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    private String logoUrl;

    @Builder.Default
    private Integer totalQuestions = 0;

    private String hiringTrend; // "Growing", "Stable", "High"

    @Builder.Default
    private Integer interviewFrequency = 0; // 1-10 scale
}
