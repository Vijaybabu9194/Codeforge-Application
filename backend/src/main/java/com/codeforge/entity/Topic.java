package com.codeforge.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Entity
@Table(name = "topics")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Topic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    private String icon;

    @Builder.Default
    private Integer problemCount = 0;

    @OneToMany(mappedBy = "topic", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Subtopic> subtopics = new ArrayList<>();
}
