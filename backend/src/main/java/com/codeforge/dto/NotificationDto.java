package com.codeforge.dto;

import lombok.*;
import java.time.LocalDateTime;

public class NotificationDto {

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Response {
        private Long id;
        private String title;
        private String message;
        private Boolean isRead;
        private LocalDateTime createdAt;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class UnreadCountResponse {
        private long count;
    }
}
