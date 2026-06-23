package com.codeforge;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.Instant;
import java.util.*;

public class TestDB {
    public static void main(String[] args) {
        String username = "vijaybabuarumilli99";
        try {
            System.out.println("Starting Codeforces stats test for " + username);
            HttpClient client = HttpClient.newBuilder()
                    .followRedirects(HttpClient.Redirect.NORMAL)
                    .connectTimeout(Duration.ofSeconds(10))
                    .build();

            // 1. Get rating and avatar
            HttpRequest infoReq = HttpRequest.newBuilder()
                    .uri(URI.create("https://codeforces.com/api/user.info?handles=" + username))
                    .header("User-Agent", "Mozilla/5.0")
                    .GET()
                    .build();

            HttpResponse<String> infoResponse = client.send(infoReq, HttpResponse.BodyHandlers.ofString());
            ObjectMapper mapper = new ObjectMapper();
            
            int contestRating = 0;
            String avatarUrl = "";
            if (infoResponse.statusCode() == 200) {
                JsonNode root = mapper.readTree(infoResponse.body());
                if ("OK".equalsIgnoreCase(root.path("status").asText())) {
                    JsonNode result = root.path("result").get(0);
                    if (result != null) {
                        contestRating = result.path("rating").asInt(0);
                        avatarUrl = result.path("avatar").asText("");
                        System.out.println("Rating: " + contestRating);
                        System.out.println("Avatar: " + avatarUrl);
                    }
                }
            } else {
                System.out.println("Failed info call: " + infoResponse.statusCode());
            }

            // 2. Query submissions
            HttpRequest statusReq = HttpRequest.newBuilder()
                    .uri(URI.create("https://codeforces.com/api/user.status?handle=" + username))
                    .header("User-Agent", "Mozilla/5.0")
                    .GET()
                    .build();

            HttpResponse<String> statusResponse = client.send(statusReq, HttpResponse.BodyHandlers.ofString());
            System.out.println("Status response code: " + statusResponse.statusCode());
            if (statusResponse.statusCode() == 200) {
                JsonNode statusRoot = mapper.readTree(statusResponse.body());
                if ("OK".equalsIgnoreCase(statusRoot.path("status").asText())) {
                    LocalDate today = LocalDate.now();
                    LocalDate oneYearAgo = today.minusDays(365);
                    
                    Map<String, Integer> dateCounts = new HashMap<>();
                    Set<String> solvedProblems = new HashSet<>();
                    
                    int easy = 0, medium = 0, hard = 0;
                    
                    JsonNode submissions = statusRoot.path("result");
                    System.out.println("Submissions count: " + (submissions.isArray() ? submissions.size() : "not array"));
                    if (submissions.isArray()) {
                        for (JsonNode sub : submissions) {
                            long creationSecs = sub.path("creationTimeSeconds").asLong();
                            LocalDate date = Instant.ofEpochSecond(creationSecs)
                                    .atZone(ZoneId.systemDefault()).toLocalDate();
                            
                            if (!date.isBefore(oneYearAgo) && !date.isAfter(today)) {
                                String dateStr = date.toString();
                                dateCounts.put(dateStr, dateCounts.getOrDefault(dateStr, 0) + 1);
                            }
                            
                            if ("OK".equalsIgnoreCase(sub.path("verdict").asText())) {
                                JsonNode prob = sub.path("problem");
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
                                        easy++;
                                    }
                                }
                            }
                        }
                    }
                    
                    System.out.println("Solved unique: " + solvedProblems.size());
                    System.out.println("Easy: " + easy);
                    System.out.println("Medium: " + medium);
                    System.out.println("Hard: " + hard);
                    
                    StringBuilder heatmapBuilder = new StringBuilder("[");
                    boolean first = true;
                    for (Map.Entry<String, Integer> entry : dateCounts.entrySet()) {
                        if (!first) heatmapBuilder.append(",");
                        heatmapBuilder.append(String.format("{\"date\":\"%s\",\"count\":%d}", entry.getKey(), entry.getValue()));
                        first = false;
                    }
                    heatmapBuilder.append("]");
                    System.out.println("Heatmap length: " + heatmapBuilder.length());
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
