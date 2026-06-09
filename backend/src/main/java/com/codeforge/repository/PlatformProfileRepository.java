package com.codeforge.repository;

import com.codeforge.entity.PlatformProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PlatformProfileRepository extends JpaRepository<PlatformProfile, Long> {
    List<PlatformProfile> findByUserId(Long userId);
    Optional<PlatformProfile> findByUserIdAndPlatform(Long userId, PlatformProfile.Platform platform);
}
