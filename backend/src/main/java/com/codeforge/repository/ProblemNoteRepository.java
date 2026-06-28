package com.codeforge.repository;

import com.codeforge.entity.Problem;
import com.codeforge.entity.ProblemNote;
import com.codeforge.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ProblemNoteRepository extends JpaRepository<ProblemNote, Long> {
    Optional<ProblemNote> findByUserAndProblem(User user, Problem problem);
}
