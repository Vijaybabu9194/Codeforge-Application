package com.codeforge.controller;

import com.codeforge.dto.DashboardDto;
import com.codeforge.entity.User;
import com.codeforge.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardDto.StatsResponse> getStats(Authentication auth) {
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(dashboardService.getStats(user));
    }

    @GetMapping("/heatmap")
    public ResponseEntity<List<DashboardDto.HeatmapEntry>> getHeatmap(Authentication auth) {
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(dashboardService.getHeatmap(user));
    }

    @GetMapping("/progress")
    public ResponseEntity<DashboardDto.ProgressResponse> getProgress(Authentication auth) {
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(dashboardService.getProgress(user));
    }

    @GetMapping("/recent-activity")
    public ResponseEntity<List<DashboardDto.ActivityItem>> getRecentActivity(Authentication auth) {
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(dashboardService.getRecentActivity(user));
    }
}
