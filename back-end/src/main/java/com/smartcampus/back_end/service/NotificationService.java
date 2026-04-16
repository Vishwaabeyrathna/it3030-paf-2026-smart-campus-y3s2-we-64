package com.smartcampus.back_end.service;

import com.smartcampus.back_end.dto.NotificationResponseDTO;
import com.smartcampus.back_end.model.IncidentTicket;
import com.smartcampus.back_end.model.Notification;
import com.smartcampus.back_end.model.Role;
import com.smartcampus.back_end.model.User;
import com.smartcampus.back_end.repository.NotificationRepository;
import com.smartcampus.back_end.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    // ── Notification triggers ─────────────────────────────────────────────────

    /** Notify all admins when a new ticket is submitted. */
    public void notifyAdminsNewTicket(IncidentTicket ticket) {
        String message = "New ticket submitted by " + ticket.getCreator().getName()
                + ": [" + ticket.getCategory() + "] at " + ticket.getResourceLocation();

        userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.ADMIN)
                .forEach(admin -> notificationRepository.save(
                        new Notification(admin, message, "TICKET_CREATED", ticket.getId())));
    }

    /** Notify the ticket creator when its status changes. */
    public void notifyCreatorStatusChanged(IncidentTicket ticket, String newStatus) {
        String message = "Your ticket [" + ticket.getCategory() + "] at "
                + ticket.getResourceLocation() + " status changed to: " + newStatus;
        notificationRepository.save(
                new Notification(ticket.getCreator(), message, "STATUS_UPDATED", ticket.getId()));
    }

    /** Notify the assigned technician that a ticket has been assigned to them. */
    public void notifyTechnicianAssigned(IncidentTicket ticket, User technician) {
        String message = "You have been assigned to ticket [" + ticket.getCategory() + "] at "
                + ticket.getResourceLocation() + " (submitted by " + ticket.getCreator().getName() + ")";
        notificationRepository.save(
                new Notification(technician, message, "ASSIGNED", ticket.getId()));
    }

    /**
     * Notify relevant parties when a comment is added.
     * - Ticket creator is notified (unless they wrote the comment).
     * - Assigned technician is notified (unless they wrote the comment).
     * - All admins are notified (unless the admin wrote the comment).
     */
    public void notifyCommentAdded(IncidentTicket ticket, User commentAuthor) {
        String message = commentAuthor.getName() + " commented on ticket ["
                + ticket.getCategory() + "] at " + ticket.getResourceLocation();

        // Collect unique recipients: creator + assigned technician + all admins
        List<User> recipients = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.ADMIN)
                .collect(Collectors.toList());

        // Add creator if not already in list
        User creator = ticket.getCreator();
        if (recipients.stream().noneMatch(u -> u.getId().equals(creator.getId()))) {
            recipients.add(creator);
        }

        // Add assigned technician if present and not already in list
        User technician = ticket.getAssignedTechnician();
        if (technician != null && recipients.stream().noneMatch(u -> u.getId().equals(technician.getId()))) {
            recipients.add(technician);
        }

        // Send to everyone except the comment author
        recipients.stream()
                .filter(u -> !u.getId().equals(commentAuthor.getId()))
                .forEach(u -> notificationRepository.save(
                        new Notification(u, message, "COMMENT_ADDED", ticket.getId())));
    }

    // ── Queries ───────────────────────────────────────────────────────────────

    public List<NotificationResponseDTO> getNotificationsForUser(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public long countUnread(User user) {
        return notificationRepository.countByUserAndIsRead(user, false);
    }

    // ── Mark read ─────────────────────────────────────────────────────────────

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

    // ── Delete ────────────────────────────────────────────────────────────────

    public void deleteNotification(Long notificationId, User user) {
        Notification n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found"));
        if (!n.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your notification");
        }
        notificationRepository.delete(n);
    }

    public void deleteAllForUser(User user) {
        List<Notification> all = notificationRepository.findByUserOrderByCreatedAtDesc(user);
        notificationRepository.deleteAll(all);
    }

    // ── Mapping ───────────────────────────────────────────────────────────────

    private NotificationResponseDTO mapToDTO(Notification n) {
        return NotificationResponseDTO.builder()
                .id(n.getId())
                .message(n.getMessage())
                .type(n.getType())
                .isRead(n.isRead())
                .createdAt(n.getCreatedAt())
                .ticketId(n.getTicketId())
                .build();
    }
}
