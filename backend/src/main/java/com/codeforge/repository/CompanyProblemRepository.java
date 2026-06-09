package com.codeforge.repository;

import com.codeforge.entity.CompanyProblem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CompanyProblemRepository extends JpaRepository<CompanyProblem, Long> {
    List<CompanyProblem> findByCompanyId(Long companyId);

    @Query("SELECT cp FROM CompanyProblem cp WHERE cp.company.id = :companyId ORDER BY cp.timesAsked DESC")
    List<CompanyProblem> findByCompanyIdOrderByTimesAskedDesc(@Param("companyId") Long companyId);
}
