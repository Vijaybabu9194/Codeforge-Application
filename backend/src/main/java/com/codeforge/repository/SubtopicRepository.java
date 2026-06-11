package com.codeforge.repository;

import com.codeforge.entity.Subtopic;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface SubtopicRepository extends JpaRepository<Subtopic, Long> {
    Optional<Subtopic> findByNameAndTopicId(String name, Long topicId);
    List<Subtopic> findByTopicId(Long topicId);
}
