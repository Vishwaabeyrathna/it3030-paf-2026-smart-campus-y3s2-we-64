package com.smartcampus.back_end.service;

import com.smartcampus.back_end.dto.BookingAnalyticsDTO;
import com.smartcampus.back_end.dto.BookingRequestDTO;
import com.smartcampus.back_end.dto.BookingResponseDTO;
import com.smartcampus.back_end.dto.BookingStatusUpdateDTO;
import com.smartcampus.back_end.exception.BookingConflictException;
import com.smartcampus.back_end.exception.BookingNotFoundException;
import com.smartcampus.back_end.model.*;
import com.smartcampus.back_end.repository.BookingRepository;
import com.smartcampus.back_end.repository.ResourceRepository;
import com.smartcampus.back_end.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;
    private final NotificationService notificationService;

    public BookingService(BookingRepository bookingRepository,
                          UserRepository userRepository,
                          ResourceRepository resourceRepository,
                          NotificationService notificationService) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.resourceRepository = resourceRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO dto, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Resource resource = resourceRepository.findById(dto.getResourceId())
                .orElseThrow(() -> new IllegalArgumentException("Resource not found: " + dto.getResourceId()));

        validateTimes(dto.getDate(), dto.getStartTime(), dto.getEndTime());

        if (dto.getExpectedAttendees() != null && resource.getCapacity() != null
                && dto.getExpectedAttendees() > resource.getCapacity()) {
            throw new IllegalArgumentException("expectedAttendees cannot exceed resource capacity (" + resource.getCapacity() + ")");
        }

        List<Booking> overlaps = bookingRepository.findOverlappingBookings(
                resource.getId(), dto.getDate(), dto.getStartTime(), dto.getEndTime()
        );

        if (!overlaps.isEmpty()) {
            throw new BookingConflictException("Booking conflict: resource is already booked for the selected time window");
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setResource(resource);
        booking.setDate(dto.getDate());
        booking.setStartTime(dto.getStartTime());
        booking.setEndTime(dto.getEndTime());
        booking.setPurpose(dto.getPurpose().trim());
        booking.setExpectedAttendees(dto.getExpectedAttendees());
        booking.setStatus(BookingStatus.PENDING);
        booking.setAdminReason(null);

        Booking saved = bookingRepository.save(booking);
        notificationService.notifyAdminsNewBooking(saved);
        return toResponseDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getUserBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return bookingRepository.findByUserId(user.getId()).stream()
                .sorted(Comparator
                        .comparing(Booking::getDate).reversed()
                        .thenComparing(Booking::getStartTime).reversed()
                )
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getAllBookings(String status, LocalDate date, Long resourceId) {
        BookingStatus statusEnum = null;
        if (status != null && !status.isBlank()) {
            try {
                statusEnum = BookingStatus.valueOf(status.trim().toUpperCase());
            } catch (IllegalArgumentException ex) {
                throw new IllegalArgumentException("Invalid status. Valid values: PENDING, APPROVED, REJECTED, CANCELLED");
            }
        }

        return bookingRepository.findAllWithFilters(statusEnum, date, resourceId).stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public BookingAnalyticsDTO getBookingAnalytics() {
        long approvedBookings = bookingRepository.countByStatus(BookingStatus.APPROVED);
        long pendingBookings = bookingRepository.countByStatus(BookingStatus.PENDING);
        long uniqueResourcesBooked = bookingRepository.countDistinctResourceId();

        var topResources = bookingRepository.findResourceBookingCounts().stream()
                .limit(5)
                .map(entry -> {
                    BookingAnalyticsDTO.ResourceUsage item = new BookingAnalyticsDTO.ResourceUsage();
                    item.setResourceName(entry[0] != null ? entry[0].toString() : "Unknown");
                    item.setBookingCount(((Number) entry[1]).longValue());
                    return item;
                })
                .toList();

        var peakHours = bookingRepository.findBookingCountsByHour().stream()
                .limit(5)
                .map(entry -> {
                    BookingAnalyticsDTO.PeakHour item = new BookingAnalyticsDTO.PeakHour();
                    int hour = ((Number) entry[0]).intValue();
                    item.setHourLabel(String.format("%02d:00 - %02d:00", hour, (hour + 1) % 24));
                    item.setBookings(((Number) entry[1]).longValue());
                    return item;
                })
                .toList();

        BookingAnalyticsDTO analytics = new BookingAnalyticsDTO();
        analytics.setTotalBookings(approvedBookings);
        analytics.setApprovedBookings(approvedBookings);
        analytics.setPendingBookings(pendingBookings);
        analytics.setUniqueResourcesBooked(uniqueResourcesBooked);
        analytics.setTopResources(topResources);
        analytics.setPeakHours(peakHours);
        return analytics;
    }

    @Transactional(readOnly = true)
    public BookingResponseDTO getBookingById(Long id) {
        return toResponseDTO(getBookingEntityById(id));
    }

    @Transactional(readOnly = true)
    public Booking getBookingEntityById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException(id));
    }

    @Transactional
    public BookingResponseDTO updateBookingStatus(Long id, BookingStatusUpdateDTO dto, String userEmail) {
        Booking booking = getBookingEntityById(id);

        User actor = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (actor.getRole() == Role.ADMIN) {
            return adminUpdateStatus(booking, dto);
        }

        if (actor.getRole() == Role.USER) {
            return userCancelBooking(booking, dto, actor);
        }

        throw new AccessDeniedException("Only ADMIN or USER can update booking status");
    }

    @Transactional
    public void deleteBooking(Long id, String userEmail) {
        Booking booking = getBookingEntityById(id);

        User actor = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (actor.getRole() != Role.USER) {
            throw new AccessDeniedException("Only USER can delete bookings");
        }

        if (!booking.getUser().getId().equals(actor.getId())) {
            throw new AccessDeniedException("You can only delete your own bookings");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only PENDING bookings can be deleted");
        }

        bookingRepository.delete(booking);
    }

    private BookingResponseDTO adminUpdateStatus(Booking booking, BookingStatusUpdateDTO dto) {
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only PENDING bookings can be approved or rejected");
        }

        BookingStatus newStatus = dto.getStatus();
        if (newStatus != BookingStatus.APPROVED && newStatus != BookingStatus.REJECTED) {
            throw new IllegalArgumentException("ADMIN can only set status to APPROVED or REJECTED");
        }

        if (newStatus == BookingStatus.APPROVED) {
            // Re-check conflicts at approval time (handles race conditions)
            List<Booking> overlaps = bookingRepository.findOverlappingBookings(
                    booking.getResource().getId(), booking.getDate(), booking.getStartTime(), booking.getEndTime()
            );

            boolean hasOtherOverlap = overlaps.stream().anyMatch(b -> !b.getId().equals(booking.getId()));
            if (hasOtherOverlap) {
                throw new BookingConflictException("Cannot approve: booking overlaps an existing booking");
            }

            booking.setStatus(BookingStatus.APPROVED);
            booking.setAdminReason(null);
            Booking approvedBooking = bookingRepository.save(booking);
            notificationService.notifyUserBookingApproved(approvedBooking);
            return toResponseDTO(approvedBooking);
        } else {
            String reason = dto.getAdminReason();
            if (reason == null || reason.isBlank()) {
                throw new IllegalArgumentException("adminReason is required when rejecting a booking");
            }
            booking.setStatus(BookingStatus.REJECTED);
            booking.setAdminReason(reason.trim());
            Booking rejectedBooking = bookingRepository.save(booking);
            notificationService.notifyUserBookingRejected(rejectedBooking);
            return toResponseDTO(rejectedBooking);
        }
    }

    private BookingResponseDTO userCancelBooking(Booking booking, BookingStatusUpdateDTO dto, User actor) {
        if (!booking.getUser().getId().equals(actor.getId())) {
            throw new AccessDeniedException("You can only cancel your own bookings");
        }

        if (dto.getStatus() != BookingStatus.CANCELLED) {
            throw new IllegalArgumentException("USER can only set status to CANCELLED");
        }

        if (booking.getStatus() != BookingStatus.APPROVED && booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only PENDING or APPROVED bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        if (dto.getAdminReason() != null && !dto.getAdminReason().isBlank()) {
            booking.setAdminReason(dto.getAdminReason().trim());
        }

        Booking cancelledBooking = bookingRepository.save(booking);
        notificationService.notifyAdminsBookingCancelled(cancelledBooking);
        return toResponseDTO(cancelledBooking);
    }

    private void validateTimes(LocalDate date, LocalTime startTime, LocalTime endTime) {
        if (date == null) {
            throw new IllegalArgumentException("date is required");
        }
        if (date.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("date cannot be in the past");
        }
        if (startTime == null || endTime == null) {
            throw new IllegalArgumentException("startTime and endTime are required");
        }
        if (!startTime.isBefore(endTime)) {
            throw new IllegalArgumentException("startTime must be before endTime");
        }
    }

    private BookingResponseDTO toResponseDTO(Booking booking) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setId(booking.getId());

        dto.setUserId(booking.getUser().getId());
        dto.setUserName(booking.getUser().getName());

        dto.setResourceId(booking.getResource().getId());
        dto.setResourceName(booking.getResource().getName());

        dto.setDate(booking.getDate());
        dto.setStartTime(booking.getStartTime());
        dto.setEndTime(booking.getEndTime());

        dto.setPurpose(booking.getPurpose());
        dto.setExpectedAttendees(booking.getExpectedAttendees());

        dto.setStatus(booking.getStatus());
        dto.setAdminReason(booking.getAdminReason());

        dto.setCreatedAt(booking.getCreatedAt());
        dto.setUpdatedAt(booking.getUpdatedAt());
        return dto;
    }
}
