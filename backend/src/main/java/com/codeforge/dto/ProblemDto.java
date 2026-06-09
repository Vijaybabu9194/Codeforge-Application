package com.codeforge.dto;

import lombok.*;
import java.util.List;

public class ProblemDto {

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ProblemResponse {
        private Long id;
        private String title;
        private String slug;
        private String difficulty;
        private Double acceptanceRate;
        private List<String> topics;
        private List<String> companies;
        private Boolean solved;
        private Boolean bookmarked;
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
}
