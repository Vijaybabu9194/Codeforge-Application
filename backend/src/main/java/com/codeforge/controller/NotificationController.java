package com.codeforge.controller;

import com.codeforge.dto.NotificationDto;
import com.codeforge.entity.User;
import com.codeforge.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationDto.Response>> getNotifications(Authentication auth) {
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(notificationService.getNotifications(user));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<NotificationDto.UnreadCountResponse> getUnreadCount(Authentication auth) {
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(notificationService.getUnreadCount(user));
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(Authentication auth, @PathVariable Long id) {
        User user = (User) auth.getPrincipal();
        notificationService.markAsRead(user, id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(Authentication auth) {
        User user = (User) auth.getPrincipal();
        notificationService.markAllAsRead(user);
        return ResponseEntity.ok().build();
    }
}
