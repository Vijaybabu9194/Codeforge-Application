package com.codeforge.config;

import com.codeforge.entity.*;
import com.codeforge.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TopicRepository topicRepository;
    private final CompanyRepository companyRepository;
    private final ProblemRepository problemRepository;
    private final CompanyProblemRepository companyProblemRepository;
    private final SubmissionRepository submissionRepository;
    private final BookmarkRepository bookmarkRepository;
    private final PlatformProfileRepository platformProfileRepository;
    private final ActivityRepository activityRepository;
    private final DailyActivityRepository dailyActivityRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded, skipping...");
            return;
        }
        log.info("Seeding database with initial data...");

        // Create topics
        Map<String, Topic> topics = createTopics();

        // Create companies
        Map<String, Company> companies = createCompanies();

        // Create problems
        List<Problem> problems = createProblems(topics, companies);

        // Create demo user
        User user = createDemoUser();

        // Create company-problem relationships
        createCompanyProblems(problems, companies);

        // Create submissions & bookmarks
        createUserData(user, problems);

        // Create platform profiles
        createPlatformProfiles(user);

        // Create activities
        createActivities(user);

        // Create daily activities for heatmap
        createDailyActivities(user);

        log.info("Database seeding completed!");
    }

    private Map<String, Topic> createTopics() {
        String[][] topicData = {
            {"Arrays", "📊"}, {"Strings", "🔤"}, {"Linked List", "🔗"}, {"Stack", "📚"},
            {"Queue", "📋"}, {"Trees", "🌳"}, {"BST", "🌲"}, {"Heap", "⛰️"},
            {"Graph", "🕸️"}, {"Dynamic Programming", "💡"}, {"Greedy", "🎯"},
            {"Backtracking", "↩️"}, {"Bit Manipulation", "⚡"}, {"Math", "🔢"},
            {"Sorting", "📈"}, {"Searching", "🔍"}
        };

        Map<String, Topic> map = new HashMap<>();
        for (String[] td : topicData) {
            Topic t = topicRepository.save(Topic.builder().name(td[0]).icon(td[1]).problemCount(0).build());
            map.put(td[0], t);
        }
        return map;
    }

    private Map<String, Company> createCompanies() {
        Object[][] companyData = {
            {"Amazon", "Growing", 9}, {"Google", "Growing", 10}, {"Microsoft", "Stable", 8},
            {"Adobe", "Growing", 7}, {"Uber", "Stable", 7}, {"Netflix", "Stable", 6},
            {"Oracle", "Stable", 6}, {"Atlassian", "Growing", 7}, {"Flipkart", "Growing", 8},
            {"Goldman Sachs", "High", 8}, {"Walmart", "Stable", 6}, {"PayPal", "Stable", 5},
            {"Salesforce", "Growing", 6}
        };

        Map<String, Company> map = new HashMap<>();
        for (Object[] cd : companyData) {
            Company c = companyRepository.save(Company.builder()
                    .name((String) cd[0]).hiringTrend((String) cd[1])
                    .interviewFrequency((Integer) cd[2]).totalQuestions(0).build());
            map.put((String) cd[0], c);
        }
        return map;
    }

    private List<Problem> createProblems(Map<String, Topic> topics, Map<String, Company> companies) {
        List<Problem> allProblems = new ArrayList<>();

        Object[][] problemData = {
            {"Two Sum", "two-sum", "EASY", 52.3, new String[]{"Arrays"}, new String[]{"Amazon", "Google", "Microsoft", "Adobe"}},
            {"Add Two Numbers", "add-two-numbers", "MEDIUM", 41.2, new String[]{"Linked List", "Math"}, new String[]{"Amazon", "Microsoft"}},
            {"Longest Substring Without Repeating Characters", "longest-substring-without-repeating", "MEDIUM", 34.5, new String[]{"Strings", "Sliding Window"}, new String[]{"Amazon", "Google", "Adobe"}},
            {"Median of Two Sorted Arrays", "median-of-two-sorted-arrays", "HARD", 38.1, new String[]{"Arrays", "Searching"}, new String[]{"Google", "Goldman Sachs"}},
            {"Longest Palindromic Substring", "longest-palindromic-substring", "MEDIUM", 33.4, new String[]{"Strings", "Dynamic Programming"}, new String[]{"Amazon", "Microsoft"}},
            {"Reverse Integer", "reverse-integer", "MEDIUM", 28.3, new String[]{"Math"}, new String[]{"Adobe", "Oracle"}},
            {"String to Integer (atoi)", "string-to-integer", "MEDIUM", 17.2, new String[]{"Strings"}, new String[]{"Microsoft", "Amazon"}},
            {"Container With Most Water", "container-with-most-water", "MEDIUM", 55.1, new String[]{"Arrays", "Greedy"}, new String[]{"Amazon", "Google", "Goldman Sachs"}},
            {"3Sum", "3sum", "MEDIUM", 33.6, new String[]{"Arrays", "Sorting"}, new String[]{"Amazon", "Google", "Microsoft", "Uber"}},
            {"Valid Parentheses", "valid-parentheses", "EASY", 41.5, new String[]{"Stack", "Strings"}, new String[]{"Amazon", "Google", "Microsoft", "Uber", "Oracle"}},
            {"Merge Two Sorted Lists", "merge-two-sorted-lists", "EASY", 63.5, new String[]{"Linked List"}, new String[]{"Amazon", "Microsoft", "Adobe"}},
            {"Generate Parentheses", "generate-parentheses", "MEDIUM", 73.8, new String[]{"Backtracking", "Strings"}, new String[]{"Google", "Amazon"}},
            {"Merge k Sorted Lists", "merge-k-sorted-lists", "HARD", 51.2, new String[]{"Linked List", "Heap"}, new String[]{"Amazon", "Google", "Microsoft"}},
            {"Remove Duplicates from Sorted Array", "remove-duplicates-sorted-array", "EASY", 53.5, new String[]{"Arrays"}, new String[]{"Microsoft", "Adobe"}},
            {"Next Permutation", "next-permutation", "MEDIUM", 39.2, new String[]{"Arrays", "Math"}, new String[]{"Google", "Uber"}},
            {"Search in Rotated Sorted Array", "search-rotated-sorted-array", "MEDIUM", 40.1, new String[]{"Arrays", "Searching"}, new String[]{"Amazon", "Google", "Microsoft", "Uber"}},
            {"Combination Sum", "combination-sum", "MEDIUM", 69.7, new String[]{"Arrays", "Backtracking"}, new String[]{"Amazon", "Flipkart"}},
            {"Trapping Rain Water", "trapping-rain-water", "HARD", 60.4, new String[]{"Arrays", "Stack", "Dynamic Programming"}, new String[]{"Amazon", "Google", "Goldman Sachs"}},
            {"Jump Game", "jump-game", "MEDIUM", 38.9, new String[]{"Arrays", "Greedy", "Dynamic Programming"}, new String[]{"Amazon", "Microsoft"}},
            {"Merge Intervals", "merge-intervals", "MEDIUM", 47.1, new String[]{"Arrays", "Sorting"}, new String[]{"Amazon", "Google", "Microsoft", "Uber", "Flipkart"}},
            {"Climbing Stairs", "climbing-stairs", "EASY", 52.2, new String[]{"Dynamic Programming", "Math"}, new String[]{"Amazon", "Adobe"}},
            {"Maximum Subarray", "maximum-subarray", "MEDIUM", 50.6, new String[]{"Arrays", "Dynamic Programming"}, new String[]{"Amazon", "Microsoft", "Adobe"}},
            {"Spiral Matrix", "spiral-matrix", "MEDIUM", 47.4, new String[]{"Arrays", "Math"}, new String[]{"Amazon", "Microsoft", "Adobe"}},
            {"Unique Paths", "unique-paths", "MEDIUM", 63.9, new String[]{"Dynamic Programming", "Math"}, new String[]{"Google", "Amazon"}},
            {"Minimum Path Sum", "minimum-path-sum", "MEDIUM", 63.3, new String[]{"Dynamic Programming", "Arrays"}, new String[]{"Amazon", "Goldman Sachs"}},
            {"Edit Distance", "edit-distance", "MEDIUM", 54.7, new String[]{"Dynamic Programming", "Strings"}, new String[]{"Google", "Amazon"}},
            {"Sort Colors", "sort-colors", "MEDIUM", 60.2, new String[]{"Arrays", "Sorting"}, new String[]{"Microsoft", "Amazon", "Adobe"}},
            {"Subsets", "subsets", "MEDIUM", 76.2, new String[]{"Arrays", "Backtracking", "Bit Manipulation"}, new String[]{"Amazon", "Uber"}},
            {"Word Search", "word-search", "MEDIUM", 42.3, new String[]{"Backtracking", "Arrays"}, new String[]{"Amazon", "Microsoft"}},
            {"Largest Rectangle in Histogram", "largest-rectangle-histogram", "HARD", 43.8, new String[]{"Stack", "Arrays"}, new String[]{"Google", "Amazon"}},
            {"Binary Tree Inorder Traversal", "binary-tree-inorder-traversal", "EASY", 74.2, new String[]{"Trees"}, new String[]{"Microsoft", "Adobe"}},
            {"Validate Binary Search Tree", "validate-binary-search-tree", "MEDIUM", 32.4, new String[]{"Trees", "BST"}, new String[]{"Amazon", "Microsoft"}},
            {"Binary Tree Level Order Traversal", "binary-tree-level-order-traversal", "MEDIUM", 65.1, new String[]{"Trees", "Queue"}, new String[]{"Amazon", "Microsoft", "Flipkart"}},
            {"Binary Tree Zigzag Level Order Traversal", "binary-tree-zigzag", "MEDIUM", 56.7, new String[]{"Trees", "Queue"}, new String[]{"Amazon", "Microsoft"}},
            {"Maximum Depth of Binary Tree", "maximum-depth-binary-tree", "EASY", 74.3, new String[]{"Trees"}, new String[]{"Amazon", "Adobe"}},
            {"Construct Binary Tree from Preorder and Inorder", "construct-binary-tree-preorder-inorder", "MEDIUM", 62.8, new String[]{"Trees", "Arrays"}, new String[]{"Google", "Microsoft"}},
            {"Best Time to Buy and Sell Stock", "best-time-buy-sell-stock", "EASY", 54.1, new String[]{"Arrays", "Dynamic Programming"}, new String[]{"Amazon", "Google", "Goldman Sachs"}},
            {"Word Ladder", "word-ladder", "HARD", 37.6, new String[]{"Graph", "Strings"}, new String[]{"Amazon", "Google"}},
            {"LRU Cache", "lru-cache", "MEDIUM", 41.6, new String[]{"Linked List"}, new String[]{"Amazon", "Google", "Microsoft", "Uber"}},
            {"Number of Islands", "number-of-islands", "MEDIUM", 58.1, new String[]{"Graph", "Arrays"}, new String[]{"Amazon", "Google", "Microsoft"}},
            {"Course Schedule", "course-schedule", "MEDIUM", 46.2, new String[]{"Graph"}, new String[]{"Amazon", "Google", "Uber"}},
            {"Implement Trie", "implement-trie", "MEDIUM", 63.1, new String[]{"Trees", "Strings"}, new String[]{"Google", "Amazon"}},
            {"Kth Largest Element in an Array", "kth-largest-element", "MEDIUM", 66.5, new String[]{"Heap", "Sorting"}, new String[]{"Amazon", "Google", "Microsoft", "Flipkart"}},
            {"Maximal Square", "maximal-square", "MEDIUM", 45.7, new String[]{"Dynamic Programming", "Arrays"}, new String[]{"Google", "Goldman Sachs"}},
            {"Product of Array Except Self", "product-of-array-except-self", "MEDIUM", 65.8, new String[]{"Arrays"}, new String[]{"Amazon", "Microsoft", "Uber"}},
            {"Serialize and Deserialize Binary Tree", "serialize-deserialize-binary-tree", "HARD", 56.2, new String[]{"Trees"}, new String[]{"Amazon", "Google", "Microsoft"}},
            {"Top K Frequent Elements", "top-k-frequent-elements", "MEDIUM", 64.2, new String[]{"Heap", "Sorting", "Arrays"}, new String[]{"Amazon", "Google"}},
            {"Decode Ways", "decode-ways", "MEDIUM", 34.2, new String[]{"Dynamic Programming", "Strings"}, new String[]{"Amazon", "Google", "Uber"}},
            {"Coin Change", "coin-change", "MEDIUM", 43.9, new String[]{"Dynamic Programming"}, new String[]{"Amazon", "Google", "Microsoft"}},
            {"House Robber", "house-robber", "MEDIUM", 50.2, new String[]{"Dynamic Programming", "Arrays"}, new String[]{"Amazon", "Adobe"}},
            {"Rotate Image", "rotate-image", "MEDIUM", 72.1, new String[]{"Arrays", "Math"}, new String[]{"Amazon", "Microsoft", "Adobe"}},
            {"Group Anagrams", "group-anagrams", "MEDIUM", 67.3, new String[]{"Strings", "Sorting"}, new String[]{"Amazon", "Google"}},
            {"Pow(x, n)", "powx-n", "MEDIUM", 34.5, new String[]{"Math"}, new String[]{"Google", "Amazon"}},
            {"Set Matrix Zeroes", "set-matrix-zeroes", "MEDIUM", 53.2, new String[]{"Arrays"}, new String[]{"Amazon", "Microsoft"}},
            {"Longest Consecutive Sequence", "longest-consecutive-sequence", "MEDIUM", 49.2, new String[]{"Arrays"}, new String[]{"Google", "Amazon"}},
        };

        for (Object[] pd : problemData) {
            Set<Topic> problemTopics = new HashSet<>();
            for (String tn : (String[]) pd[4]) {
                Topic t = topics.get(tn);
                if (t != null) problemTopics.add(t);
            }

            Set<Company> problemCompanies = new HashSet<>();
            for (String cn : (String[]) pd[5]) {
                Company c = companies.get(cn);
                if (c != null) problemCompanies.add(c);
            }

            Problem p = Problem.builder()
                    .title((String) pd[0])
                    .slug((String) pd[1])
                    .difficulty(Problem.Difficulty.valueOf((String) pd[2]))
                    .acceptanceRate((Double) pd[3])
                    .topics(problemTopics)
                    .companies(problemCompanies)
                    .timesAsked(new Random().nextInt(30) + 5)
                    .build();
            allProblems.add(problemRepository.save(p));
        }

        // Update topic problem counts
        for (Topic t : topics.values()) {
            long count = problemRepository.countByTopicId(t.getId());
            t.setProblemCount((int) count);
            topicRepository.save(t);
        }

        // Update company total questions
        for (Company c : companies.values()) {
            long count = allProblems.stream().filter(p -> p.getCompanies().contains(c)).count();
            c.setTotalQuestions((int) count);
            companyRepository.save(c);
        }

        return allProblems;
    }

    private User createDemoUser() {
        return userRepository.save(User.builder()
                .name("Vijay")
                .email("vijay@codeforge.dev")
                .password(passwordEncoder.encode("password123"))
                .avatarUrl("https://api.dicebear.com/7.x/initials/svg?seed=Vijay")
                .problemsSolved(247)
                .currentStreak(23)
                .maxStreak(45)
                .studyHours(186.5)
                .contestRating(1847)
                .companiesCovered(8)
                .bookmarksCount(12)
                .build());
    }

    private void createCompanyProblems(List<Problem> problems, Map<String, Company> companies) {
        Random rand = new Random(42);
        for (Problem p : problems) {
            for (Company c : p.getCompanies()) {
                int timesAsked = rand.nextInt(25) + 3;
                CompanyProblem.Frequency freq;
                if (timesAsked > 20) freq = CompanyProblem.Frequency.VERY_HIGH;
                else if (timesAsked > 14) freq = CompanyProblem.Frequency.HIGH;
                else if (timesAsked > 7) freq = CompanyProblem.Frequency.MEDIUM;
                else freq = CompanyProblem.Frequency.LOW;

                companyProblemRepository.save(CompanyProblem.builder()
                        .company(c).problem(p).timesAsked(timesAsked).frequency(freq).build());
            }
        }
    }

    private void createUserData(User user, List<Problem> problems) {
        Random rand = new Random(42);
        List<Problem> shuffled = new ArrayList<>(problems);
        Collections.shuffle(shuffled, rand);

        // Mark some as solved
        for (int i = 0; i < Math.min(32, shuffled.size()); i++) {
            submissionRepository.save(Submission.builder()
                    .user(user).problem(shuffled.get(i)).solved(true)
                    .submittedAt(LocalDateTime.now().minusDays(rand.nextInt(90)))
                    .build());
        }

        // Bookmark some
        for (int i = 0; i < Math.min(12, shuffled.size()); i++) {
            bookmarkRepository.save(Bookmark.builder()
                    .user(user).problem(shuffled.get(i + 5)).build());
        }
    }

    private void createPlatformProfiles(User user) {
        // LeetCode
        platformProfileRepository.save(PlatformProfile.builder()
                .user(user).platform(PlatformProfile.Platform.LEETCODE)
                .username("vijay_codes").globalRank(45832).countryRank(12847)
                .contestRating(1847).problemsSolved(247)
                .easySolved(89).mediumSolved(128).hardSolved(30).badgesCount(8)
                .contestHistory("[{\"name\":\"Weekly Contest 380\",\"rank\":2341,\"rating\":1862,\"date\":\"2024-12-15\"},{\"name\":\"Weekly Contest 379\",\"rank\":1987,\"rating\":1847,\"date\":\"2024-12-08\"},{\"name\":\"Biweekly Contest 120\",\"rank\":3102,\"rating\":1823,\"date\":\"2024-12-01\"},{\"name\":\"Weekly Contest 378\",\"rank\":2654,\"rating\":1801,\"date\":\"2024-11-24\"},{\"name\":\"Weekly Contest 377\",\"rank\":1876,\"rating\":1789,\"date\":\"2024-11-17\"},{\"name\":\"Biweekly Contest 119\",\"rank\":2231,\"rating\":1765,\"date\":\"2024-11-10\"},{\"name\":\"Weekly Contest 376\",\"rank\":3456,\"rating\":1742,\"date\":\"2024-11-03\"},{\"name\":\"Weekly Contest 375\",\"rank\":2890,\"rating\":1728,\"date\":\"2024-10-27\"},{\"name\":\"Weekly Contest 374\",\"rank\":1654,\"rating\":1710,\"date\":\"2024-10-20\"},{\"name\":\"Biweekly Contest 118\",\"rank\":2102,\"rating\":1695,\"date\":\"2024-10-13\"}]")
                .badges("[{\"name\":\"50 Day Streak\",\"icon\":\"🔥\",\"date\":\"2024-10-15\"},{\"name\":\"100 Problems\",\"icon\":\"💯\",\"date\":\"2024-09-20\"},{\"name\":\"Knight Badge\",\"icon\":\"⚔️\",\"date\":\"2024-11-01\"},{\"name\":\"Contest Winner\",\"icon\":\"🏆\",\"date\":\"2024-12-08\"},{\"name\":\"Top 10%\",\"icon\":\"🌟\",\"date\":\"2024-12-15\"},{\"name\":\"200 Problems\",\"icon\":\"🎯\",\"date\":\"2024-11-28\"},{\"name\":\"Binary Search Master\",\"icon\":\"🔍\",\"date\":\"2024-10-05\"},{\"name\":\"DP Enthusiast\",\"icon\":\"💡\",\"date\":\"2024-11-15\"}]")
                .recentActivity("[{\"type\":\"contest\",\"description\":\"Participated in Weekly Contest 380\",\"detail\":\"Rank: 2341\",\"date\":\"2024-12-15\"},{\"type\":\"solved\",\"description\":\"Solved Trapping Rain Water\",\"detail\":\"Hard\",\"date\":\"2024-12-14\"},{\"type\":\"solved\",\"description\":\"Solved Course Schedule\",\"detail\":\"Medium\",\"date\":\"2024-12-13\"},{\"type\":\"achievement\",\"description\":\"Earned Top 10% Badge\",\"detail\":\"\",\"date\":\"2024-12-15\"},{\"type\":\"solved\",\"description\":\"Solved LRU Cache\",\"detail\":\"Medium\",\"date\":\"2024-12-12\"}]")
                .build());

        // GeeksForGeeks
        platformProfileRepository.save(PlatformProfile.builder()
                .user(user).platform(PlatformProfile.Platform.GEEKSFORGEEKS)
                .username("vijay_gfg").globalRank(8234).countryRank(3421)
                .contestRating(1654).problemsSolved(312)
                .easySolved(145).mediumSolved(132).hardSolved(35).badgesCount(5)
                .contestHistory("[{\"name\":\"GFG Weekly 180\",\"rank\":456,\"rating\":1654,\"date\":\"2024-12-14\"},{\"name\":\"GFG Weekly 179\",\"rank\":523,\"rating\":1638,\"date\":\"2024-12-07\"}]")
                .badges("[{\"name\":\"Problem Solver\",\"icon\":\"⭐\",\"date\":\"2024-11-01\"},{\"name\":\"Consistent Coder\",\"icon\":\"📅\",\"date\":\"2024-10-15\"},{\"name\":\"GFG Expert\",\"icon\":\"🏅\",\"date\":\"2024-12-01\"}]")
                .recentActivity("[]")
                .build());

        // CodeChef
        platformProfileRepository.save(PlatformProfile.builder()
                .user(user).platform(PlatformProfile.Platform.CODECHEF)
                .username("vijay_chef").globalRank(15234).countryRank(5432)
                .contestRating(1723).problemsSolved(156)
                .easySolved(78).mediumSolved(62).hardSolved(16).badgesCount(3)
                .contestHistory("[{\"name\":\"Starters 165\",\"rank\":1234,\"rating\":1723,\"date\":\"2024-12-11\"},{\"name\":\"Starters 164\",\"rank\":1567,\"rating\":1708,\"date\":\"2024-12-04\"}]")
                .badges("[{\"name\":\"4 Star\",\"icon\":\"⭐\",\"date\":\"2024-11-20\"},{\"name\":\"100 Problems\",\"icon\":\"💯\",\"date\":\"2024-10-01\"}]")
                .recentActivity("[]")
                .build());

        // HackerRank
        platformProfileRepository.save(PlatformProfile.builder()
                .user(user).platform(PlatformProfile.Platform.HACKERRANK)
                .username("vijay_hr").globalRank(23456).countryRank(8765)
                .contestRating(1534).problemsSolved(89)
                .easySolved(45).mediumSolved(34).hardSolved(10).badgesCount(6)
                .contestHistory("[]")
                .badges("[{\"name\":\"Gold Badge - Problem Solving\",\"icon\":\"🥇\",\"date\":\"2024-09-15\"},{\"name\":\"Silver Badge - Java\",\"icon\":\"🥈\",\"date\":\"2024-08-20\"}]")
                .recentActivity("[]")
                .build());

        // Codeforces
        platformProfileRepository.save(PlatformProfile.builder()
                .user(user).platform(PlatformProfile.Platform.CODEFORCES)
                .username("vijay_cf").globalRank(34567).countryRank(12345)
                .contestRating(1456).problemsSolved(134)
                .easySolved(67).mediumSolved(52).hardSolved(15).badgesCount(2)
                .contestHistory("[{\"name\":\"Round 912\",\"rank\":3456,\"rating\":1456,\"date\":\"2024-12-13\"},{\"name\":\"Round 911\",\"rank\":2876,\"rating\":1443,\"date\":\"2024-12-06\"}]")
                .badges("[{\"name\":\"Specialist\",\"icon\":\"🔵\",\"date\":\"2024-11-01\"},{\"name\":\"50 Contests\",\"icon\":\"🎪\",\"date\":\"2024-10-20\"}]")
                .recentActivity("[]")
                .build());
    }

    private void createActivities(User user) {
        Object[][] acts = {
            {"SOLVED", "Solved Two Sum", "Easy", "EASY"},
            {"SOLVED", "Solved Binary Tree Zigzag Level Order Traversal", "Medium", "MEDIUM"},
            {"PARTICIPATED", "Participated in Weekly Contest 380", "Rank: 2341", null},
            {"SOLVED", "Solved Word Ladder", "Hard", "HARD"},
            {"ACHIEVED", "Earned Top 10% Badge", "Weekly Contest", null},
            {"SOLVED", "Solved Trapping Rain Water", "Hard", "HARD"},
            {"COMPLETED", "Completed Binary Tree Topic", "12/12 problems solved", null},
            {"SOLVED", "Solved LRU Cache", "Medium", "MEDIUM"},
            {"BOOKMARKED", "Bookmarked Median of Two Sorted Arrays", "Hard", "HARD"},
            {"SOLVED", "Solved Number of Islands", "Medium", "MEDIUM"},
            {"PARTICIPATED", "Participated in Biweekly Contest 120", "Rank: 3102", null},
            {"SOLVED", "Solved Course Schedule", "Medium", "MEDIUM"},
            {"SOLVED", "Solved Coin Change", "Medium", "MEDIUM"},
            {"ACHIEVED", "Reached 200 Problems Milestone", "🎯", null},
            {"SOLVED", "Solved Container With Most Water", "Medium", "MEDIUM"},
        };

        for (int i = 0; i < acts.length; i++) {
            activityRepository.save(Activity.builder()
                    .user(user)
                    .type(Activity.ActivityType.valueOf((String) acts[i][0]))
                    .description((String) acts[i][1])
                    .detail((String) acts[i][2])
                    .difficulty((String) acts[i][3])
                    .createdAt(LocalDateTime.now().minusHours(i * 4 + 1))
                    .build());
        }
    }

    private void createDailyActivities(User user) {
        Random rand = new Random(42);
        LocalDate today = LocalDate.now();

        for (int i = 0; i < 365; i++) {
            LocalDate date = today.minusDays(i);
            int count;
            double r = rand.nextDouble();
            if (r < 0.15) count = 0;
            else if (r < 0.35) count = rand.nextInt(2) + 1;
            else if (r < 0.65) count = rand.nextInt(3) + 2;
            else if (r < 0.85) count = rand.nextInt(4) + 4;
            else count = rand.nextInt(5) + 7;

            if (count > 0) {
                dailyActivityRepository.save(DailyActivity.builder()
                        .user(user).activityDate(date).count(count).build());
            }
        }
    }
}
