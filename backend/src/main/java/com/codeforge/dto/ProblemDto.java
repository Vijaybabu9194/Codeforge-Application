package com.codeforge.dto;

import lombok.*;
import java.util.List;

public class ProblemDto {

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class CompanyInfo {
        private String name;
        private String logoUrl;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ProblemResponse {
        private Long id;
        private String title;
        private String slug;
        private String difficulty;
        private Double acceptanceRate;
        private List<String> topics;
        private List<String> companies;
        private List<CompanyInfo> companyInfo;
        private Boolean solved;
        private Boolean bookmarked;
        private String leetcodeUrl;
        private String gfgUrl;
        private String youtubeUrl;
        private String articleUrl;
        private Long subtopicId;
        private String subtopicName;
        // Rich problem content fields
        private String problemStatement;
        private String sampleTestCases;  // JSON string: [{input,output,explanation}]
        private String constraints;       // newline-separated
        private String hints;             // JSON string: ["hint1","hint2"]
        private String starterCode;       // JSON string: {python,java,cpp}
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ProblemListResponse {
        private List<ProblemResponse> problems;
        private Integer totalPages;
        private Long totalElements;
        private Integer currentPage;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class TopicResponse {
        private Long id;
        private String name;
        private String icon;
        private Integer problemCount;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class SubtopicResponse {
        private Long id;
        private String name;
        private String description;
        private List<ProblemResponse> problems;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class TopicDetailsResponse {
        private Long id;
        private String name;
        private String icon;
        private List<SubtopicResponse> subtopics;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ProblemSubmitRequest {
        private String sourceCode; // base64 encoded
        private Integer languageId;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class TestCaseResult {
        private String input;
        private String expectedOutput;
        private String actualOutput;
        private boolean passed;
        private String status;
        private Double time;
        private Integer memory;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class SubmitResult {
        private boolean allPassed;
        private int passedCount;
        private int totalCount;
        private List<TestCaseResult> results;
        private String overallStatus; // "Accepted", "Wrong Answer", "Runtime Error", etc.
        private String errorDetails;
    }
}
