package com.codeforge.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "company_problems")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CompanyProblem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    @Builder.Default
    private Integer timesAsked = 1;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Frequency frequency = Frequency.MEDIUM;

    public enum Frequency {
        VERY_HIGH, HIGH, MEDIUM, LOW
    }
}
