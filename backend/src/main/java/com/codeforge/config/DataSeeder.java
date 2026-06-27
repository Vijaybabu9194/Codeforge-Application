package com.codeforge.config;

import com.codeforge.entity.*;
import com.codeforge.repository.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.Setter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final TopicRepository topicRepository;
    private final SubtopicRepository subtopicRepository;
    private final CompanyRepository companyRepository;
    private final ProblemRepository problemRepository;

    @Getter @Setter
    public static class SeedCompany {
        private String id;
        private String name;
        private String slug;
        private String logo;
    }

    @Getter @Setter
    public static class SeedProblem {
        private String id;
        private String title;
        private String difficulty;
        private String leetcodeUrl;
        private String articleUrl;
        private String youtubeUrl;
        private String practiceUrl;
        private List<SeedCompany> companies;
    }

    @Getter @Setter
    public static class SeedSubtopic {
        private String id;
        private String title;
        private String description;
        private List<SeedProblem> problems;
    }

    @Getter @Setter
    public static class SeedTopic {
        private String id;
        private String title;
        private String description;
        private List<SeedSubtopic> subtopics;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (problemRepository.count() > 0) {
            log.info("Database already seeded with problems. Skipping seeder.");
            return;
        }

        log.info("Seeding database from scraped_topics.json...");
        try {
            ObjectMapper mapper = new ObjectMapper();
            InputStream is = getClass().getResourceAsStream("/scraped_topics.json");
            if (is == null) {
                log.error("Could not find scraped_topics.json in resources!");
                return;
            }

            List<SeedTopic> seedTopics = mapper.readValue(is, new TypeReference<List<SeedTopic>>() {});
            Map<String, Company> companyCache = new HashMap<>();

            for (SeedTopic sTopic : seedTopics) {
                Topic topic = topicRepository.findByName(sTopic.getTitle())
                        .orElseGet(() -> {
                            Topic t = Topic.builder()
                                    .name(sTopic.getTitle())
                                    .icon(getIconForTopic(sTopic.getTitle()))
                                    .problemCount(0)
                                    .build();
                            return topicRepository.save(t);
                        });

                int topicProblemCount = 0;

                for (SeedSubtopic sSubtopic : sTopic.getSubtopics()) {
                    Subtopic subtopic = subtopicRepository.findByNameAndTopicId(sSubtopic.getTitle(), topic.getId())
                            .orElseGet(() -> {
                                Subtopic s = Subtopic.builder()
                                        .name(sSubtopic.getTitle())
                                        .description(sSubtopic.getDescription())
                                        .topic(topic)
                                        .build();
                                return subtopicRepository.save(s);
                            });

                    for (SeedProblem sProblem : sSubtopic.getProblems()) {
                        String slug = sProblem.getTitle().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
                        
                        final String finalSlug = slug;
                        if (problemRepository.findBySlug(finalSlug).isPresent()) {
                            slug = slug + "-" + sProblem.getId().substring(sProblem.getId().length() - 4);
                        }

                        Problem.Difficulty diff = Problem.Difficulty.EASY;
                        try {
                            diff = Problem.Difficulty.valueOf(sProblem.getDifficulty().toUpperCase());
                        } catch (Exception e) {}

                        Set<Company> problemCompanies = new HashSet<>();
                        if (sProblem.getCompanies() != null) {
                            for (SeedCompany sComp : sProblem.getCompanies()) {
                                Company comp = companyCache.computeIfAbsent(sComp.getName(), name -> {
                                    return companyRepository.findByName(name)
                                            .orElseGet(() -> {
                                                Company c = Company.builder()
                                                        .name(name)
                                                        .logoUrl(sComp.getLogo())
                                                        .totalQuestions(0)
                                                        .hiringTrend("Stable")
                                                        .interviewFrequency(5)
                                                        .build();
                                                return companyRepository.save(c);
                                            });
                                });
                                comp.setTotalQuestions(comp.getTotalQuestions() + 1);
                                companyRepository.save(comp);
                                problemCompanies.add(comp);
                            }
                        }

                        Problem problem = Problem.builder()
                                .title(sProblem.getTitle())
                                .slug(slug)
                                .difficulty(diff)
                                .acceptanceRate(45.0 + Math.random() * 40.0)
                                .leetcodeUrl(sProblem.getLeetcodeUrl())
                                .gfgUrl(sProblem.getPracticeUrl())
                                .youtubeUrl(sProblem.getYoutubeUrl())
                                .articleUrl(sProblem.getArticleUrl())
                                .subtopic(subtopic)
                                .companies(problemCompanies)
                                .topics(new HashSet<>(Collections.singletonList(topic)))
                                .build();

                        problemRepository.save(problem);
                        topicProblemCount++;
                    }
                }

                topic.setProblemCount(topicProblemCount);
                topicRepository.save(topic);
            }
            log.info("Database seeding completed successfully!");
        } catch (Exception e) {
            log.error("Failed to seed database", e);
        }
    }

    private String getIconForTopic(String title) {
        if (title.contains("Array")) return "📁";
        if (title.contains("String")) return "🔤";
        if (title.contains("Search")) return "🔍";
        if (title.contains("LinkedList")) return "🔗";
        if (title.contains("Stack") || title.contains("Queue")) return "🥞";
        if (title.contains("Tree")) return "🌳";
        if (title.contains("Graph")) return "🕸️";
        if (title.contains("Recursion")) return "🔄";
        if (title.contains("Dynamic")) return "⚡";
        return "💻";
    }
}
