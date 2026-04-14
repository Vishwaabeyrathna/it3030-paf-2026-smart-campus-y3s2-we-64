package com.smartcampus.back_end.service;

import com.smartcampus.back_end.dto.NotificationResponseDTO;
import com.smartcampus.back_end.model.IncidentTicket;
import com.smartcampus.back_end.model.Notification;
import com.smartcampus.back_end.model.Role;
import com.smartcampus.back_end.model.User;
import com.smartcampus.back_end.repository.NotificationRepository;
import com.smartcampus.back_end.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public void notifyAdminsNewTicket(IncidentTicket ticket) {
        List<User> admins = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.ADMIN)
                .collect(Collectors.toList());

        String message = "New ticket submitted by " + ticket.getCreator().getName()
                + ": [" + ticket.getCategory() + "] at " + ticket.getResourceLocation();

        for (User admin : admins) {
            notificationRepository.save(new Notification(admin, message, "TICKET_CREATED"));
        }
    }

    public void notifyCreatorStatusChanged(IncidentTicket ticket, String newStatus) {
        String message = "Your ticket [" + ticket.getCategory() + "] at "
                + ticket.getResourceLocation() + " has been updated to: " + newStatus;
        notificationRepository.save(new Notification(ticket.getCreator(), message, "STATUS_UPDATED"));
    }

    public List<NotificationResponseDTO> getNotificationsForUser(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public void markAsRead(Long notificationId, User user) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            if (n.getUser().getId().equals(user.getId())) {
                n.setRead(true);
                notificationRepository.save(n);
            }
        });
    }

    public void markAllAsRead(User user) {
        List<Notification> unread = notificationRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .filter(n -> !n.isRead())
                .collect(Collectors.toList());
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    public long countUnread(User user) {
        return notificationRepository.countByUserAndIsRead(user, false);
    }

    private NotificationResponseDTO mapToDTO(Notification n) {
        return NotificationResponseDTO.builder()
                .id(n.getId())
                .message(n.getMessage())
                .type(n.getType())
                .isRead(n.isRead())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
