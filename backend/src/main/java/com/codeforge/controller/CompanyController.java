package com.codeforge.controller;

import com.codeforge.dto.CompanyDto;
import com.codeforge.entity.User;
import com.codeforge.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    @GetMapping
    public ResponseEntity<List<CompanyDto.CompanyListItem>> getAllCompanies() {
        return ResponseEntity.ok(companyService.getAllCompanies());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompanyDto.CompanyDetailResponse> getCompanyDetail(@PathVariable Long id) {
        return ResponseEntity.ok(companyService.getCompanyDetail(id));
    }

    @GetMapping("/{id}/problems")
    public ResponseEntity<List<CompanyDto.CompanyQuestionResponse>> getCompanyQuestions(
            Authentication auth, @PathVariable Long id) {
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(companyService.getCompanyQuestions(id, user));
    }
}
