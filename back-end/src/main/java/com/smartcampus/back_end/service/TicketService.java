<<<<<<< HEAD
package com.smartcampus.back_end.service;

import com.smartcampus.back_end.dto.CreateTicketDTO;
import com.smartcampus.back_end.dto.TicketResponseDTO;
import com.smartcampus.back_end.model.IncidentTicket;
import com.smartcampus.back_end.model.User;
import com.smartcampus.back_end.repository.IncidentTicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final IncidentTicketRepository ticketRepository;

    public TicketResponseDTO createTicket(CreateTicketDTO dto, User user) throws IOException {
        IncidentTicket ticket = new IncidentTicket();
        ticket.setResourceLocation(dto.getResourceLocation());
        ticket.setCategory(dto.getCategory());
        ticket.setDescription(dto.getDescription());
        ticket.setPriority(dto.getPriority());
        ticket.setPreferredContactDetails(dto.getPreferredContactDetails());
        ticket.setCreator(user);

        if (dto.getImages() != null && !dto.getImages().isEmpty()) {
            List<String> base64Images = new ArrayList<>();
            // Only process up to 3 images as per requirements
            int limit = Math.min(dto.getImages().size(), 3);
            for (int i = 0; i < limit; i++) {
                MultipartFile image = dto.getImages().get(i);
                if (image != null && !image.isEmpty()) {
                    String base64Image = convertToBase64(image);
                    base64Images.add("data:" + image.getContentType() + ";base64," + base64Image);
                }
            }
            ticket.setImages(base64Images);
        }

        IncidentTicket savedTicket = ticketRepository.save(ticket);
        return mapToDTO(savedTicket);
    }

    public List<TicketResponseDTO> getAllTickets() {
        return ticketRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<TicketResponseDTO> getMyTickets(User user) {
        return ticketRepository.findByCreator(user).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private String convertToBase64(MultipartFile file) throws IOException {
        byte[] bytes = file.getBytes();
        return Base64.getEncoder().encodeToString(bytes);
    }

    private TicketResponseDTO mapToDTO(IncidentTicket ticket) {
        return TicketResponseDTO.builder()
                .id(ticket.getId())
                .resourceLocation(ticket.getResourceLocation())
                .category(ticket.getCategory())
                .description(ticket.getDescription())
                .priority(ticket.getPriority())
                .preferredContactDetails(ticket.getPreferredContactDetails())
                .images(ticket.getImages())
                .creatorName(ticket.getCreator().getName())
                .status(ticket.getStatus())
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .build();
    }

    public TicketResponseDTO updateTicketStatus(Long id, String status) {
        IncidentTicket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found with id: " + id));
        ticket.setStatus(status);
        IncidentTicket updatedTicket = ticketRepository.save(ticket);
        return mapToDTO(updatedTicket);
    }
}
=======
package com.smartcampus.back_end.service;

import com.smartcampus.back_end.dto.CreateTicketDTO;
import com.smartcampus.back_end.dto.TicketResponseDTO;
import com.smartcampus.back_end.model.IncidentTicket;
import com.smartcampus.back_end.model.User;
import com.smartcampus.back_end.repository.IncidentTicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final IncidentTicketRepository ticketRepository;

    public TicketResponseDTO createTicket(CreateTicketDTO dto, User user) throws IOException {
        IncidentTicket ticket = new IncidentTicket();
        ticket.setResourceLocation(dto.getResourceLocation());
        ticket.setCategory(dto.getCategory());
        ticket.setDescription(dto.getDescription());
        ticket.setPriority(dto.getPriority());
        ticket.setPreferredContactDetails(dto.getPreferredContactDetails());
        ticket.setCreator(user);

        if (dto.getImages() != null && !dto.getImages().isEmpty()) {
            List<String> base64Images = new ArrayList<>();
            // Only process up to 3 images as per requirements
            int limit = Math.min(dto.getImages().size(), 3);
            for (int i = 0; i < limit; i++) {
                MultipartFile image = dto.getImages().get(i);
                if (image != null && !image.isEmpty()) {
                    String base64Image = convertToBase64(image);
                    base64Images.add("data:" + image.getContentType() + ";base64," + base64Image);
                }
            }
            ticket.setImages(base64Images);
        }

        IncidentTicket savedTicket = ticketRepository.save(ticket);
        return mapToDTO(savedTicket);
    }

    public List<TicketResponseDTO> getAllTickets() {
        return ticketRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<TicketResponseDTO> getMyTickets(User user) {
        return ticketRepository.findByCreator(user).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private String convertToBase64(MultipartFile file) throws IOException {
        byte[] bytes = file.getBytes();
        return Base64.getEncoder().encodeToString(bytes);
    }

    private TicketResponseDTO mapToDTO(IncidentTicket ticket) {
        return TicketResponseDTO.builder()
                .id(ticket.getId())
                .resourceLocation(ticket.getResourceLocation())
                .category(ticket.getCategory())
                .description(ticket.getDescription())
                .priority(ticket.getPriority())
                .preferredContactDetails(ticket.getPreferredContactDetails())
                .images(ticket.getImages())
                .creatorName(ticket.getCreator().getName())
                .status(ticket.getStatus())
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .build();
    }

    public TicketResponseDTO updateTicketStatus(Long id, String status) {
        IncidentTicket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found with id: " + id));
        ticket.setStatus(status);
        IncidentTicket updatedTicket = ticketRepository.save(ticket);
        return mapToDTO(updatedTicket);
    }
}
>>>>>>> e924cb6fbde3f185ba9ea58ceca60b7f1fae6f4e
