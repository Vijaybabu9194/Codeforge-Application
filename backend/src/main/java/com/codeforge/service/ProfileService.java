package com.codeforge.service;

import com.codeforge.dto.ProfileDto;
import com.codeforge.entity.PlatformProfile;
import com.codeforge.entity.User;
import com.codeforge.repository.PlatformProfileRepository;
import com.codeforge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final PlatformProfileRepository platformProfileRepository;
    private final UserRepository userRepository;

    public List<ProfileDto.PlatformListItem> getPlatforms(User user) {
        List<PlatformProfile> profiles = platformProfileRepository.findByUserId(user.getId());

        return List.of(
            PlatformProfile.Platform.LEETCODE,
            PlatformProfile.Platform.GEEKSFORGEEKS,
            PlatformProfile.Platform.CODECHEF,
            PlatformProfile.Platform.HACKERRANK,
            PlatformProfile.Platform.CODEFORCES
        ).stream().map(platform -> {
            var profile = profiles.stream()
                    .filter(p -> p.getPlatform() == platform)
                    .findFirst();
            return ProfileDto.PlatformListItem.builder()
                    .platform(platform.name())
                    .username(profile.map(PlatformProfile::getUsername).orElse(null))
                    .problemsSolved(profile.map(PlatformProfile::getProblemsSolved).orElse(0))
                    .contestRating(profile.map(PlatformProfile::getContestRating).orElse(0))
                    .connected(profile.isPresent())
                    .build();
        }).collect(Collectors.toList());
    }

    public ProfileDto.PlatformDashboardResponse getPlatformDashboard(User user, String platformName) {
        PlatformProfile.Platform platform = PlatformProfile.Platform.valueOf(platformName.toUpperCase());
        PlatformProfile profile = platformProfileRepository.findByUserIdAndPlatform(user.getId(), platform)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Platform profile not found"));

        return ProfileDto.PlatformDashboardResponse.builder()
                .platform(profile.getPlatform().name())
                .username(profile.getUsername())
                .globalRank(profile.getGlobalRank())
                .countryRank(profile.getCountryRank())
                .contestRating(profile.getContestRating())
                .problemsSolved(profile.getProblemsSolved())
                .easySolved(profile.getEasySolved())
                .mediumSolved(profile.getMediumSolved())
                .hardSolved(profile.getHardSolved())
                .badgesCount(profile.getBadgesCount())
                .contestHistory(profile.getContestHistory())
                .heatmapData(profile.getHeatmapData())
                .badges(profile.getBadges())
                .recentActivity(profile.getRecentActivity())
                .build();
    }

    public ProfileDto.PlatformListItem linkPlatform(User user, ProfileDto.LinkPlatformRequest request) {
        PlatformProfile.Platform platform = PlatformProfile.Platform.valueOf(request.getPlatform().toUpperCase());
        
        PlatformProfile profile = platformProfileRepository.findByUserIdAndPlatform(user.getId(), platform)
                .orElse(PlatformProfile.builder()
                        .user(user)
                        .platform(platform)
                        .build());
        
        profile.setUsername(request.getUsername());
        
        Random random = new Random();
        int solved = 50 + random.nextInt(250);
        int easy = (int)(solved * 0.4);
        int medium = (int)(solved * 0.45);
        int hard = solved - easy - medium;
        int rating = 1400 + random.nextInt(500);
        
        profile.setProblemsSolved(solved);
        profile.setEasySolved(easy);
        profile.setMediumSolved(medium);
        profile.setHardSolved(hard);
        profile.setContestRating(rating);
        profile.setGlobalRank(1000 + random.nextInt(50000));
        profile.setCountryRank(100 + random.nextInt(10000));
        profile.setBadgesCount(2 + random.nextInt(4));
        
        // Fetch real stats dynamically
        if (platform == PlatformProfile.Platform.LEETCODE) {
            fetchLeetCodeStats(profile, request.getUsername());
        } else if (platform == PlatformProfile.Platform.CODEFORCES) {
            fetchCodeforcesStats(profile, request.getUsername());
        }
        
        profile.setContestHistory("[" +
                "{\"label\": \"Weekly Contest 350\", \"rating\": " + (profile.getContestRating() - 80) + "}," +
                "{\"label\": \"Weekly Contest 351\", \"rating\": " + (profile.getContestRating() - 40) + "}," +
                "{\"label\": \"Weekly Contest 352\", \"rating\": " + (profile.getContestRating() - 10) + "}," +
                "{\"label\": \"Weekly Contest 353\", \"rating\": " + (profile.getContestRating() + 20) + "}," +
                "{\"label\": \"Weekly Contest 354\", \"rating\": " + profile.getContestRating() + "}" +
                "]");
                 
        StringBuilder heatmap = new StringBuilder("[");
        java.time.LocalDate today = java.time.LocalDate.now();
        for (int i = 30; i >= 0; i--) {
            java.time.LocalDate date = today.minusDays(i);
            int count = random.nextDouble() > 0.4 ? random.nextInt(5) : 0;
            heatmap.append(String.format("{\"date\":\"%s\",\"count\":%d}", date.toString(), count));
            if (i > 0) heatmap.append(",");
        }
        heatmap.append("]");
        profile.setHeatmapData(heatmap.toString());
        
        profile.setBadges("[" +
                "{\"name\": \"Solved Challenge\", \"icon\": \"🏆\", \"description\": \"Successfully solved 50+ problems\"}," +
                "{\"name\": \"Contestant Badge\", \"icon\": \"🎖️\", \"description\": \"Participated in 5+ official contests\"}" +
                "]");
                 
        profile.setRecentActivity("[" +
                "{\"title\": \"Two Sum\", \"status\": \"Accepted\", \"time\": \"15 mins ago\", \"language\": \"Java\"}," +
                "{\"title\": \"3Sum\", \"status\": \"Accepted\", \"time\": \"2 hours ago\", \"language\": \"Java\"}," +
                "{\"title\": \"Move Zeroes\", \"status\": \"Accepted\", \"time\": \"1 day ago\", \"language\": \"C++\"}" +
                "]");
                 
        platformProfileRepository.save(profile);
        
        return ProfileDto.PlatformListItem.builder()
                .platform(profile.getPlatform().name())
                .username(profile.getUsername())
                .problemsSolved(profile.getProblemsSolved())
                .contestRating(profile.getContestRating())
                .connected(true)
                .build();
    }

    private void fetchLeetCodeStats(PlatformProfile profile, String username) {
        try {
            java.net.http.HttpClient client = java.net.http.HttpClient.newBuilder()
                    .followRedirects(java.net.http.HttpClient.Redirect.NORMAL)
                    .build();

            String query = "query userProblemsSolved($username: String!) { " +
                    "  matchedUser(username: $username) { " +
                    "    username " +
                    "    profile { " +
                    "      ranking " +
                    "      userAvatar " +
                    "      realName " +
                    "    } " +
                    "    submitStats { " +
                    "      acSubmissionNum { " +
                    "        difficulty " +
                    "        count " +
                    "      } " +
                    "    } " +
                    "  } " +
                    "}";

            String payload = "{\"query\":\"" + query.replace("\"", "\\\"").replace("\n", " ") + "\",\"variables\":{\"username\":\"" + username + "\"}}";

            java.net.http.HttpRequest httpRequest = java.net.http.HttpRequest.newBuilder()
                    .uri(java.net.URI.create("https://leetcode.com/graphql"))
                    .header("Content-Type", "application/json")
                    .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                    .POST(java.net.http.HttpRequest.BodyPublishers.ofString(payload))
                    .build();

            java.net.http.HttpResponse<String> response = client.send(httpRequest, java.net.http.HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                String body = response.body();
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                com.fasterxml.jackson.databind.JsonNode root = mapper.readTree(body);
                com.fasterxml.jackson.databind.JsonNode matchedUser = root.path("data").path("matchedUser");
                if (matchedUser.isMissingNode() || matchedUser.isNull()) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "LeetCode profile not found. Please check your username.");
                }
                
                int globalRank = matchedUser.path("profile").path("ranking").asInt();
                String avatarUrl = matchedUser.path("profile").path("userAvatar").asText();
                
                profile.setGlobalRank(globalRank);
                if (profile.getUser() != null && avatarUrl != null && !avatarUrl.isEmpty()) {
                    User userObj = profile.getUser();
                    userObj.setAvatarUrl(avatarUrl);
                    userRepository.save(userObj);
                }

                int total = 0;
                int easy = 0;
                int medium = 0;
                int hard = 0;

                com.fasterxml.jackson.databind.JsonNode acSubmissions = matchedUser.path("submitStats").path("acSubmissionNum");
                if (acSubmissions.isArray()) {
                    for (com.fasterxml.jackson.databind.JsonNode node : acSubmissions) {
                        String difficulty = node.path("difficulty").asText();
                        int count = node.path("count").asInt();
                        if ("All".equalsIgnoreCase(difficulty)) {
                            total = count;
                        } else if ("Easy".equalsIgnoreCase(difficulty)) {
                            easy = count;
                        } else if ("Medium".equalsIgnoreCase(difficulty)) {
                            medium = count;
                        } else if ("Hard".equalsIgnoreCase(difficulty)) {
                            hard = count;
                        }
                    }
                }

                profile.setProblemsSolved(total);
                profile.setEasySolved(easy);
                profile.setMediumSolved(medium);
                profile.setHardSolved(hard);
            } else {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to connect to LeetCode API");
            }
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error fetching LeetCode stats: " + e.getMessage());
        }
    }

    private void fetchCodeforcesStats(PlatformProfile profile, String username) {
        try {
            java.net.http.HttpClient client = java.net.http.HttpClient.newBuilder()
                    .followRedirects(java.net.http.HttpClient.Redirect.NORMAL)
                    .build();

            java.net.http.HttpRequest httpRequest = java.net.http.HttpRequest.newBuilder()
                    .uri(java.net.URI.create("https://codeforces.com/api/user.info?handles=" + username))
                    .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                    .GET()
                    .build();

            java.net.http.HttpResponse<String> response = client.send(httpRequest, java.net.http.HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                String body = response.body();
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                com.fasterxml.jackson.databind.JsonNode root = mapper.readTree(body);
                if (!"OK".equalsIgnoreCase(root.path("status").asText())) {
                    String comment = root.path("comment").asText();
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Codeforces handle error: " + comment);
                }

                com.fasterxml.jackson.databind.JsonNode result = root.path("result").get(0);
                if (result != null) {
                    int rating = result.path("rating").asInt();
                    String avatar = result.path("avatar").asText();
                    if (avatar != null && avatar.startsWith("//")) {
                        avatar = "https:" + avatar;
                    }
                    
                    profile.setContestRating(rating);
                    if (profile.getUser() != null && avatar != null && !avatar.isEmpty()) {
                        User userObj = profile.getUser();
                        userObj.setAvatarUrl(avatar);
                        userRepository.save(userObj);
                    }
                }
            } else {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Codeforces handle not found.");
            }
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error fetching Codeforces stats: " + e.getMessage());
        }
    }
}
