package com.codeforge.repository;

import com.codeforge.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByUserIdAndSolvedTrue(Long userId);

    Optional<Submission> findByUserIdAndProblemId(Long userId, Long problemId);

    @Query("SELECT COUNT(s) FROM Submission s WHERE s.user.id = :userId AND s.solved = true")
    long countSolvedByUserId(@Param("userId") Long userId);

    @Query("SELECT s.problem.id FROM Submission s WHERE s.user.id = :userId AND s.solved = true")
    List<Long> findSolvedProblemIdsByUserId(@Param("userId") Long userId);

    @Query("SELECT t.id, COUNT(DISTINCT s.problem.id) FROM Submission s JOIN s.problem p JOIN p.topics t WHERE s.user.id = :userId AND s.solved = true GROUP BY t.id")
    List<Object[]> countSolvedProblemsPerTopic(@Param("userId") Long userId);

    long countByUserId(Long userId);
}
