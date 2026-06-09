package com.codeforge.service;

import com.codeforge.dto.CompanyDto;
import com.codeforge.entity.*;
import com.codeforge.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final CompanyProblemRepository companyProblemRepository;
    private final SubmissionRepository submissionRepository;

    public List<CompanyDto.CompanyListItem> getAllCompanies() {
        return companyRepository.findAll().stream()
                .map(c -> CompanyDto.CompanyListItem.builder()
                        .id(c.getId())
                        .name(c.getName())
                        .logoUrl(c.getLogoUrl())
                        .totalQuestions(c.getTotalQuestions())
                        .hiringTrend(c.getHiringTrend())
                        .build())
                .sorted(Comparator.comparing(CompanyDto.CompanyListItem::getName))
                .collect(Collectors.toList());
    }

    public CompanyDto.CompanyDetailResponse getCompanyDetail(Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        List<CompanyProblem> cps = companyProblemRepository.findByCompanyId(companyId);

        // Difficulty distribution
        Map<String, Integer> diffDist = new HashMap<>();
        diffDist.put("EASY", 0);
        diffDist.put("MEDIUM", 0);
        diffDist.put("HARD", 0);
        for (CompanyProblem cp : cps) {
            String diff = cp.getProblem().getDifficulty().name();
            diffDist.merge(diff, 1, Integer::sum);
        }

        // Top topics
        Map<String, Integer> topicMap = new HashMap<>();
        for (CompanyProblem cp : cps) {
            for (Topic t : cp.getProblem().getTopics()) {
                topicMap.merge(t.getName(), 1, Integer::sum);
            }
        }
        List<CompanyDto.TopicCount> topTopics = topicMap.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(8)
                .map(e -> CompanyDto.TopicCount.builder().topic(e.getKey()).count(e.getValue()).build())
                .collect(Collectors.toList());

        return CompanyDto.CompanyDetailResponse.builder()
                .id(company.getId())
                .name(company.getName())
                .logoUrl(company.getLogoUrl())
                .totalQuestions(company.getTotalQuestions())
                .hiringTrend(company.getHiringTrend())
                .interviewFrequency(company.getInterviewFrequency())
                .difficultyDistribution(diffDist)
                .topTopics(topTopics)
                .build();
    }

    public List<CompanyDto.CompanyQuestionResponse> getCompanyQuestions(Long companyId, User user) {
        List<CompanyProblem> cps = companyProblemRepository.findByCompanyIdOrderByTimesAskedDesc(companyId);
        Set<Long> solvedIds = submissionRepository.findSolvedProblemIdsByUserId(user.getId())
                .stream().collect(Collectors.toSet());

        return cps.stream()
                .map(cp -> CompanyDto.CompanyQuestionResponse.builder()
                        .id(cp.getProblem().getId())
                        .title(cp.getProblem().getTitle())
                        .difficulty(cp.getProblem().getDifficulty().name())
                        .timesAsked(cp.getTimesAsked())
                        .frequency(cp.getFrequency().name())
                        .acceptanceRate(cp.getProblem().getAcceptanceRate())
                        .solved(solvedIds.contains(cp.getProblem().getId()))
                        .build())
                .collect(Collectors.toList());
    }
}
