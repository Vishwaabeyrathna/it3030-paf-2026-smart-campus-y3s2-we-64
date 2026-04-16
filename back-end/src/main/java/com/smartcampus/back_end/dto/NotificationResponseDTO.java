package com.smartcampus.back_end.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter @Builder
public class NotificationResponseDTO {
    private Long id;
    private String message;
    private String type;
    private boolean isRead;
    private LocalDateTime createdAt;
}
