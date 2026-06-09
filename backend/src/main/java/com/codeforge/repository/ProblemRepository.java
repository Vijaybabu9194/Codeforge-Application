package com.codeforge.repository;

import com.codeforge.entity.Problem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ProblemRepository extends JpaRepository<Problem, Long> {
    Optional<Problem> findBySlug(String slug);

    @Query("SELECT p FROM Problem p JOIN p.topics t WHERE t.id = :topicId")
    Page<Problem> findByTopicId(@Param("topicId") Long topicId, Pageable pageable);

    Page<Problem> findByDifficulty(Problem.Difficulty difficulty, Pageable pageable);

    @Query("SELECT p FROM Problem p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Problem> searchByTitle(@Param("search") String search, Pageable pageable);

    @Query("SELECT p FROM Problem p JOIN p.topics t WHERE t.id = :topicId AND p.difficulty = :difficulty")
    Page<Problem> findByTopicIdAndDifficulty(@Param("topicId") Long topicId, @Param("difficulty") Problem.Difficulty difficulty, Pageable pageable);

    @Query("SELECT p FROM Problem p JOIN p.companies c WHERE c.id = :companyId")
    Page<Problem> findByCompanyId(@Param("companyId") Long companyId, Pageable pageable);

    @Query("SELECT COUNT(p) FROM Problem p JOIN p.topics t WHERE t.id = :topicId")
    long countByTopicId(@Param("topicId") Long topicId);
}
