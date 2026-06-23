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
        profile.setProblemsSolved(0);
        profile.setEasySolved(0);
        profile.setMediumSolved(0);
        profile.setHardSolved(0);
        profile.setContestRating(0);
        profile.setGlobalRank(0);
        profile.setCountryRank(0);
        profile.setBadgesCount(0);
        
        // Reset heatmap so platform fetchers can write fresh real data
        profile.setHeatmapData(null);

        // Fetch real stats dynamically
        if (platform == PlatformProfile.Platform.LEETCODE) {
            fetchLeetCodeStats(profile, request.getUsername());
        } else if (platform == PlatformProfile.Platform.CODEFORCES) {
            fetchCodeforcesStats(profile, request.getUsername());
        } else if (platform == PlatformProfile.Platform.GEEKSFORGEEKS) {
            fetchGFGStats(profile, request.getUsername());
        }
        
        profile.setContestHistory("[" +
                "{\"label\": \"Weekly Contest 350\", \"rating\": " + (profile.getContestRating() - 80) + "}," +
                "{\"label\": \"Weekly Contest 351\", \"rating\": " + (profile.getContestRating() - 40) + "}," +
                "{\"label\": \"Weekly Contest 352\", \"rating\": " + (profile.getContestRating() - 10) + "}," +
                "{\"label\": \"Weekly Contest 353\", \"rating\": " + (profile.getContestRating() + 20) + "}," +
                "{\"label\": \"Weekly Contest 354\", \"rating\": " + profile.getContestRating() + "}" +
                "]");
                 
        // Only generate random heatmap if the platform doesn't have real heatmap data set already
        if (profile.getHeatmapData() == null || profile.getHeatmapData().isEmpty()) {
            StringBuilder heatmap = new StringBuilder("[");
            java.time.LocalDate today = java.time.LocalDate.now();
            for (int i = 364; i >= 0; i--) {
                java.time.LocalDate date = today.minusDays(i);
                int count = random.nextDouble() > 0.55 ? random.nextInt(6) : 0;
                heatmap.append(String.format("{\"date\":\"%s\",\"count\":%d}", date.toString(), count));
                if (i > 0) heatmap.append(",");
            }
            heatmap.append("]");
            profile.setHeatmapData(heatmap.toString());
        }
        
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
                    .connectTimeout(java.time.Duration.ofSeconds(10))
                    .build();

            // Query 1: Solved stats + rank + avatar
            String statsQuery = "query userStats($username: String!) { " +
                    "  matchedUser(username: $username) { " +
                    "    username " +
                    "    profile { ranking userAvatar } " +
                    "    submitStats { acSubmissionNum { difficulty count } } " +
                    "  } " +
                    "}";
            String statsPayload = "{\"query\":\"" + statsQuery.replace("\"", "\\\"").replace("\n", " ") +
                    "\",\"variables\":{\"username\":\"" + username + "\"}}";

            java.net.http.HttpRequest statsReq = java.net.http.HttpRequest.newBuilder()
                    .uri(java.net.URI.create("https://leetcode.com/graphql"))
                    .header("Content-Type", "application/json")
                    .header("User-Agent", "Mozilla/5.0")
                    .header("Referer", "https://leetcode.com")
                    .POST(java.net.http.HttpRequest.BodyPublishers.ofString(statsPayload))
                    .build();

            java.net.http.HttpResponse<String> statsResponse = client.send(statsReq, java.net.http.HttpResponse.BodyHandlers.ofString());
            if (statsResponse.statusCode() != 200) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to connect to LeetCode API");
            }

            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            com.fasterxml.jackson.databind.JsonNode statsRoot = mapper.readTree(statsResponse.body());
            com.fasterxml.jackson.databind.JsonNode matchedUser = statsRoot.path("data").path("matchedUser");
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

            int total = 0, easy = 0, medium = 0, hard = 0;
            com.fasterxml.jackson.databind.JsonNode acSubs = matchedUser.path("submitStats").path("acSubmissionNum");
            if (acSubs.isArray()) {
                for (com.fasterxml.jackson.databind.JsonNode node : acSubs) {
                    String diff = node.path("difficulty").asText();
                    int cnt = node.path("count").asInt();
                    if ("All".equalsIgnoreCase(diff)) total = cnt;
                    else if ("Easy".equalsIgnoreCase(diff)) easy = cnt;
                    else if ("Medium".equalsIgnoreCase(diff)) medium = cnt;
                    else if ("Hard".equalsIgnoreCase(diff)) hard = cnt;
                }
            }
            profile.setProblemsSolved(total);
            profile.setEasySolved(easy);
            profile.setMediumSolved(medium);
            profile.setHardSolved(hard);

            // Query 2: Submission calendar (heatmap) + contest rating
            String calendarQuery = "query userCalendar($username: String!, $year: Int!, $prevYear: Int!) { " +
                    "  matchedUser(username: $username) { " +
                    "    currentCalendar: userCalendar(year: $year) { submissionCalendar } " +
                    "    prevCalendar: userCalendar(year: $prevYear) { submissionCalendar } " +
                    "    contestBadge { name } " +
                    "  } " +
                    "  userContestRanking(username: $username) { " +
                    "    rating " +
                    "    globalRanking " +
                    "    totalParticipants " +
                    "  } " +
                    "}";
            int currentYear = java.time.LocalDate.now().getYear();
            int prevYear = currentYear - 1;
            String calPayload = "{\"query\":\"" + calendarQuery.replace("\"", "\\\"").replace("\n", " ") +
                    "\",\"variables\":{\"username\":\"" + username + "\",\"year\":" + currentYear + ",\"prevYear\":" + prevYear + "}}";

            java.net.http.HttpRequest calReq = java.net.http.HttpRequest.newBuilder()
                    .uri(java.net.URI.create("https://leetcode.com/graphql"))
                    .header("Content-Type", "application/json")
                    .header("User-Agent", "Mozilla/5.0")
                    .header("Referer", "https://leetcode.com")
                    .POST(java.net.http.HttpRequest.BodyPublishers.ofString(calPayload))
                    .build();

            java.net.http.HttpResponse<String> calResponse = client.send(calReq, java.net.http.HttpResponse.BodyHandlers.ofString());
            if (calResponse.statusCode() == 200) {
                com.fasterxml.jackson.databind.JsonNode calRoot = mapper.readTree(calResponse.body());

                // Parse contest rating
                com.fasterxml.jackson.databind.JsonNode contestRankingNode = calRoot.path("data").path("userContestRanking");
                if (!contestRankingNode.isNull() && !contestRankingNode.isMissingNode()) {
                    double ratingDouble = contestRankingNode.path("rating").asDouble(0);
                    profile.setContestRating((int) Math.round(ratingDouble));
                    int contestGlobalRank = contestRankingNode.path("globalRanking").asInt(0);
                    if (contestGlobalRank > 0) {
                        profile.setGlobalRank(contestGlobalRank);
                    }
                } else {
                    profile.setContestRating(0);
                }

                // Parse submission calendar heatmap
                String currentCalStr = calRoot.path("data").path("matchedUser")
                        .path("currentCalendar").path("submissionCalendar").asText("");
                String prevCalStr = calRoot.path("data").path("matchedUser")
                        .path("prevCalendar").path("submissionCalendar").asText("");
                
                java.time.LocalDate today = java.time.LocalDate.now();
                java.time.LocalDate oneYearAgo = today.minusDays(365);
                java.util.Map<String, Integer> mergedCalendar = new java.util.HashMap<>();

                if (!currentCalStr.isEmpty()) {
                    com.fasterxml.jackson.databind.JsonNode calMap = mapper.readTree(currentCalStr);
                    java.util.Iterator<java.util.Map.Entry<String, com.fasterxml.jackson.databind.JsonNode>> fields = calMap.fields();
                    while (fields.hasNext()) {
                        java.util.Map.Entry<String, com.fasterxml.jackson.databind.JsonNode> entry = fields.next();
                        long epochSeconds = Long.parseLong(entry.getKey());
                        java.time.LocalDate date = java.time.Instant.ofEpochSecond(epochSeconds)
                                .atZone(java.time.ZoneId.of("UTC")).toLocalDate();
                        if (!date.isBefore(oneYearAgo) && !date.isAfter(today)) {
                            mergedCalendar.put(date.toString(), entry.getValue().asInt(0));
                        }
                    }
                }

                if (!prevCalStr.isEmpty()) {
                    com.fasterxml.jackson.databind.JsonNode calMap = mapper.readTree(prevCalStr);
                    java.util.Iterator<java.util.Map.Entry<String, com.fasterxml.jackson.databind.JsonNode>> fields = calMap.fields();
                    while (fields.hasNext()) {
                        java.util.Map.Entry<String, com.fasterxml.jackson.databind.JsonNode> entry = fields.next();
                        long epochSeconds = Long.parseLong(entry.getKey());
                        java.time.LocalDate date = java.time.Instant.ofEpochSecond(epochSeconds)
                                .atZone(java.time.ZoneId.of("UTC")).toLocalDate();
                        if (!date.isBefore(oneYearAgo) && !date.isAfter(today)) {
                            mergedCalendar.put(date.toString(), entry.getValue().asInt(0));
                        }
                    }
                }

                StringBuilder heatmapBuilder = new StringBuilder("[");
                boolean first = true;
                for (java.util.Map.Entry<String, Integer> entry : mergedCalendar.entrySet()) {
                    if (!first) heatmapBuilder.append(",");
                    heatmapBuilder.append(String.format("{\"date\":\"%s\",\"count\":%d}", entry.getKey(), entry.getValue()));
                    first = false;
                }
                heatmapBuilder.append("]");
                profile.setHeatmapData(heatmapBuilder.toString());
            }
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error fetching LeetCode stats: " + e.getMessage());
        }
    }

    private void fetchGFGStats(PlatformProfile profile, String username) {
        try {
            // Use community GFG stats API (unofficial)
            String apiUrl = "https://gfgstatscard.vercel.app/" + username + "?raw=true";
            java.net.http.HttpClient client = java.net.http.HttpClient.newBuilder()
                    .followRedirects(java.net.http.HttpClient.Redirect.NORMAL)
                    .connectTimeout(java.time.Duration.ofSeconds(15))
                    .build();

            java.net.http.HttpRequest httpRequest = java.net.http.HttpRequest.newBuilder()
                    .uri(java.net.URI.create(apiUrl))
                    .header("User-Agent", "Mozilla/5.0")
                    .GET()
                    .build();

            java.net.http.HttpResponse<String> response = client.send(httpRequest, java.net.http.HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                com.fasterxml.jackson.databind.JsonNode root = mapper.readTree(response.body());

                if (root.has("error")) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, root.path("error").asText());
                }

                int school = root.path("School").asInt(0);
                int basic = root.path("Basic").asInt(0);
                int easy = root.path("Easy").asInt(0);
                int medium = root.path("Medium").asInt(0);
                int hard = root.path("Hard").asInt(0);
                int totalSolved = root.path("total_problems_solved").asInt(0);

                int mappedEasy = school + basic + easy;
                int mappedMedium = medium;
                int mappedHard = hard;

                profile.setProblemsSolved(totalSolved);
                profile.setEasySolved(mappedEasy);
                profile.setMediumSolved(mappedMedium);
                profile.setHardSolved(mappedHard);

                int rank = root.path("rank").asInt(-1);
                if (rank != -1) {
                    profile.setCountryRank(rank);
                }

                // Generate deterministic pseudo-heatmap distributed over the last year matching their solved count
                int solvedCount = profile.getProblemsSolved();
                if (solvedCount > 0) {
                    StringBuilder heatmapBuilder = new StringBuilder("[");
                    java.time.LocalDate today = java.time.LocalDate.now();
                    java.util.Random r = new java.util.Random(username.hashCode());
                    int remaining = solvedCount;
                    boolean first = true;
                    for (int i = 364; i >= 0; i--) {
                        java.time.LocalDate date = today.minusDays(i);
                        int count = 0;
                        if (remaining > 0 && r.nextDouble() > 0.7) {
                            count = r.nextInt(Math.min(remaining, 3)) + 1;
                            remaining -= count;
                        }
                        if (count > 0 || r.nextDouble() > 0.95) {
                            if (!first) heatmapBuilder.append(",");
                            heatmapBuilder.append(String.format("{\"date\":\"%s\",\"count\":%d}", date.toString(), count));
                            first = false;
                        }
                    }
                    heatmapBuilder.append("]");
                    profile.setHeatmapData(heatmapBuilder.toString());
                }
            } else if (response.statusCode() == 400 || response.statusCode() == 404) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "GeeksforGeeks username not found or has no solved problems.");
            } else {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to connect to GeeksforGeeks API. Status: " + response.statusCode());
            }
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error fetching GeeksforGeeks stats: " + e.getMessage());
        }
    }

    private void fetchCodeforcesStats(PlatformProfile profile, String username) {
        try {
            java.net.http.HttpClient client = java.net.http.HttpClient.newBuilder()
                    .followRedirects(java.net.http.HttpClient.Redirect.NORMAL)
                    .connectTimeout(java.time.Duration.ofSeconds(10))
                    .build();

            // 1. Get rating and avatar
            java.net.http.HttpRequest infoReq = java.net.http.HttpRequest.newBuilder()
                    .uri(java.net.URI.create("https://codeforces.com/api/user.info?handles=" + username))
                    .header("User-Agent", "Mozilla/5.0")
                    .GET()
                    .build();

            java.net.http.HttpResponse<String> infoResponse = client.send(infoReq, java.net.http.HttpResponse.BodyHandlers.ofString());
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            
            if (infoResponse.statusCode() == 200) {
                com.fasterxml.jackson.databind.JsonNode root = mapper.readTree(infoResponse.body());
                if ("OK".equalsIgnoreCase(root.path("status").asText())) {
                    com.fasterxml.jackson.databind.JsonNode result = root.path("result").get(0);
                    if (result != null) {
                        int rating = result.path("rating").asInt(0);
                        String avatar = result.path("avatar").asText("");
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
                }
            } else if (infoResponse.statusCode() == 400) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Codeforces handle not found.");
            } else {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to fetch Codeforces profile. Status: " + infoResponse.statusCode());
            }

            // 2. Query Codeforces submissions to get actual problems solved count and heatmap
            java.net.http.HttpRequest statusReq = java.net.http.HttpRequest.newBuilder()
                    .uri(java.net.URI.create("https://codeforces.com/api/user.status?handle=" + username))
                    .header("User-Agent", "Mozilla/5.0")
                    .GET()
                    .build();

            java.net.http.HttpResponse<String> statusResponse = client.send(statusReq, java.net.http.HttpResponse.BodyHandlers.ofString());
            if (statusResponse.statusCode() == 200) {
                com.fasterxml.jackson.databind.JsonNode statusRoot = mapper.readTree(statusResponse.body());
                if ("OK".equalsIgnoreCase(statusRoot.path("status").asText())) {
                    java.time.LocalDate today = java.time.LocalDate.now();
                    java.time.LocalDate oneYearAgo = today.minusDays(365);
                    
                    java.util.Map<String, Integer> dateCounts = new java.util.HashMap<>();
                    java.util.Set<String> solvedProblems = new java.util.HashSet<>();
                    
                    int easy = 0, medium = 0, hard = 0;
                    
                    com.fasterxml.jackson.databind.JsonNode submissions = statusRoot.path("result");
                    if (submissions.isArray()) {
                        for (com.fasterxml.jackson.databind.JsonNode sub : submissions) {
                            long creationSecs = sub.path("creationTimeSeconds").asLong();
                            java.time.LocalDate date = java.time.Instant.ofEpochSecond(creationSecs)
                                    .atZone(java.time.ZoneId.systemDefault()).toLocalDate();
                            
                            // Heatmap date counting
                            if (!date.isBefore(oneYearAgo) && !date.isAfter(today)) {
                                String dateStr = date.toString();
                                dateCounts.put(dateStr, dateCounts.getOrDefault(dateStr, 0) + 1);
                            }
                            
                            // Check if solved
                            if ("OK".equalsIgnoreCase(sub.path("verdict").asText())) {
                                com.fasterxml.jackson.databind.JsonNode prob = sub.path("problem");
                                String contestId = prob.path("contestId").asText("");
                                String index = prob.path("index").asText("");
                                String name = prob.path("name").asText("");
                                String probKey = (!contestId.isEmpty() && !index.isEmpty()) ? (contestId + "_" + index) : name;
                                
                                if (!probKey.isEmpty() && solvedProblems.add(probKey)) {
                                    int probRating = prob.path("rating").asInt(0);
                                    if (probRating > 0) {
                                        if (probRating < 1200) easy++;
                                        else if (probRating < 1600) medium++;
                                        else hard++;
                                    } else {
                                        easy++; // fallback for unrated
                                    }
                                }
                            }
                        }
                    }
                    
                    profile.setProblemsSolved(solvedProblems.size());
                    profile.setEasySolved(easy);
                    profile.setMediumSolved(medium);
                    profile.setHardSolved(hard);
                    
                    // Generate heatmap JSON
                    StringBuilder heatmapBuilder = new StringBuilder("[");
                    boolean first = true;
                    for (java.util.Map.Entry<String, Integer> entry : dateCounts.entrySet()) {
                        if (!first) heatmapBuilder.append(",");
                        heatmapBuilder.append(String.format("{\"date\":\"%s\",\"count\":%d}", entry.getKey(), entry.getValue()));
                        first = false;
                    }
                    heatmapBuilder.append("]");
                    profile.setHeatmapData(heatmapBuilder.toString());
                }
            }
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error fetching Codeforces stats: " + e.getMessage());
        }
    }
}
