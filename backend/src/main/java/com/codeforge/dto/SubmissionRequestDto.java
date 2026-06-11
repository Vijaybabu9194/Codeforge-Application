package com.codeforge.dto;

import lombok.*;

public class SubmissionRequestDto {

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class CodeRunRequest {
        private String sourceCode; // Base64 encoded or raw plain text (we will support base64)
        private Integer languageId; // Judge0 language ID
        private String stdin; // Base64 encoded or raw plain text input
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class CodeRunResponse {
        private String stdout; // Base64 encoded or plain text
        private String stderr; // Base64 encoded or plain text
        private String compileOutput; // Base64 encoded or plain text compilation error
        private Double time; // Execution time in seconds
        private Integer memory; // Memory usage in KB
        private String message; // Optional message from compiler/runner
        private RunStatus status;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class RunStatus {
        private Integer id; // Judge0 status ID (3 for Accepted, 6 for Compile Error, etc.)
        private String description; // Status message (e.g. "Accepted", "Wrong Answer")
    }
}
