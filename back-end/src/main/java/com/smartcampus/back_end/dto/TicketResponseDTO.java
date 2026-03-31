package com.smartcampus.back_end.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter @Builder
public class TicketResponseDTO {
    private Long id;
    private String resourceLocation;
    private String category;
    private String description;
    private String priority;
    private String preferredContactDetails;
    private List<String> images;
    private String creatorName;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
