package com.codeforge.service;

import com.codeforge.dto.NotificationDto;
import com.codeforge.entity.Notification;
import com.codeforge.entity.User;
import com.codeforge.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional
    public List<NotificationDto.Response> getNotifications(User user) {
        List<Notification> list = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        
        // If user has zero notifications, seed a few welcome notifications
        if (list.isEmpty()) {
            Notification welcome = Notification.builder()
                    .user(user)
                    .title("Welcome to CodeForge!")
                    .message("Start tracking your DSA progress, mastering SDE sheet topics, and compiling code.")
                    .isRead(false)
                    .build();
            Notification feature = Notification.builder()
                    .user(user)
                    .title("Coding Platforms Connected")
                    .message("Go to the Profile tab to link your GeeksForGeeks, LeetCode, and Codeforces profiles.")
                    .isRead(false)
                    .build();
            notificationRepository.save(welcome);
            notificationRepository.save(feature);
            
            list = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        }

        return list.stream().map(n -> NotificationDto.Response.builder()
                .id(n.getId())
                .title(n.getTitle())
                .message(n.getMessage())
                .isRead(n.getIsRead())
                .createdAt(n.getCreatedAt())
                .build()).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public NotificationDto.UnreadCountResponse getUnreadCount(User user) {
        long count = notificationRepository.countByUserIdAndIsReadFalse(user.getId());
        return NotificationDto.UnreadCountResponse.builder()
                .count(count)
                .build();
    }

    @Transactional
    public void markAsRead(User user, Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        if (notification.getUser().getId().equals(user.getId())) {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        }
    }

    @Transactional
    public void markAllAsRead(User user) {
        List<Notification> unread = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .filter(n -> !n.getIsRead())
                .collect(Collectors.toList());
        for (Notification n : unread) {
            n.setIsRead(true);
        }
        notificationRepository.saveAll(unread);
    }

    @Transactional
    public void createNotification(User user, String title, String message) {
        Notification n = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .isRead(false)
                .build();
        notificationRepository.save(n);
    }
}
