package com.codeforge.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Entity
@Table(name = "subtopics")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Subtopic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;

    @OneToMany(mappedBy = "subtopic", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Problem> problems = new ArrayList<>();
}
