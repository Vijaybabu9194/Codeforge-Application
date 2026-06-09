package com.codeforge.repository;

import com.codeforge.entity.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    Optional<Bookmark> findByUserIdAndProblemId(Long userId, Long problemId);
    List<Bookmark> findByUserId(Long userId);
    void deleteByUserIdAndProblemId(Long userId, Long problemId);

    @Query("SELECT b.problem.id FROM Bookmark b WHERE b.user.id = :userId")
    List<Long> findBookmarkedProblemIdsByUserId(@Param("userId") Long userId);
}
