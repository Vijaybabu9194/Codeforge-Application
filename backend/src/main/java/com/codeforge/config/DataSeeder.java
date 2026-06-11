package com.codeforge.config;

import com.codeforge.entity.*;
import com.codeforge.repository.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TopicRepository topicRepository;
    private final SubtopicRepository subtopicRepository;
    private final CompanyRepository companyRepository;
    private final ProblemRepository problemRepository;
    private final CompanyProblemRepository companyProblemRepository;
    private final SubmissionRepository submissionRepository;
    private final BookmarkRepository bookmarkRepository;
    private final PlatformProfileRepository platformProfileRepository;
    private final ActivityRepository activityRepository;
    private final DailyActivityRepository dailyActivityRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Database seeding is disabled.");
    }
}
