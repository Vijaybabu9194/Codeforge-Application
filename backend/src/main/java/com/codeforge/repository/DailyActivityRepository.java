package com.codeforge.repository;

import com.codeforge.entity.DailyActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyActivityRepository extends JpaRepository<DailyActivity, Long> {
    @Query("SELECT da FROM DailyActivity da WHERE da.user.id = :userId AND da.activityDate BETWEEN :start AND :end ORDER BY da.activityDate")
    List<DailyActivity> findByUserIdAndDateRange(@Param("userId") Long userId, @Param("start") LocalDate start, @Param("end") LocalDate end);

    Optional<DailyActivity> findByUserIdAndActivityDate(Long userId, LocalDate date);
}
