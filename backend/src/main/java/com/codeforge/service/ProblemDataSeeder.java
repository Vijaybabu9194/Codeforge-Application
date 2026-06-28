package com.codeforge.service;

import com.codeforge.entity.Problem;
import com.codeforge.repository.ProblemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Seeds rich problem content (statement, test cases, constraints, hints, starter code)
 * for problems that do not already have it. Runs once on startup.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class ProblemDataSeeder implements ApplicationRunner {

    private final ProblemRepository problemRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        List<Problem> problems = problemRepository.findAll();
        int updated = 0;
        for (Problem p : problems) {
            if (p.getProblemStatement() == null || p.getProblemStatement().isBlank()) {
                seedProblem(p);
                problemRepository.save(p);
                updated++;
            }
        }
        if (updated > 0) {
            log.info("ProblemDataSeeder: seeded rich content for {} problems", updated);
        }
    }

    private void seedProblem(Problem p) {
        String slug = p.getSlug() != null ? p.getSlug().toLowerCase() : "";
        String title = p.getTitle() != null ? p.getTitle() : "";
        String diff = p.getDifficulty() != null ? p.getDifficulty().name() : "EASY";

        if (contains(slug, "two-sum", "two_sum")) {
            setTwoSum(p);
        } else if (contains(slug, "reverse-string", "reverse_string")) {
            setReverseString(p);
        } else if (contains(slug, "palindrome")) {
            setPalindrome(p);
        } else if (contains(slug, "fibonacci", "-fib")) {
            setFibonacci(p);
        } else if (contains(slug, "binary-search", "binary_search")) {
            setBinarySearch(p);
        } else if (contains(slug, "valid-parentheses", "parentheses", "brackets")) {
            setValidParentheses(p);
        } else if (contains(slug, "maximum-subarray", "max-subarray", "kadane")) {
            setMaximumSubarray(p);
        } else if (contains(slug, "factorial")) {
            setFactorial(p);
        } else if (contains(slug, "merge-sort", "merge_sort")) {
            setMergeSort(p);
        } else if (contains(slug, "linked-list", "linkedlist")) {
            setLinkedListCycle(p);
        } else {
            setGeneric(p, title, diff);
        }
    }

    private boolean contains(String slug, String... keywords) {
        for (String kw : keywords) {
            if (slug.contains(kw)) return true;
        }
        return false;
    }

    // ─────────────────────────── TWO SUM ───────────────────────────────────────

    private void setTwoSum(Problem p) {
        p.setProblemStatement(
            "Given an array of integers `nums` and an integer `target`, return **indices** of " +
            "the two numbers such that they add up to `target`.\n\n" +
            "You may assume each input has exactly one solution, and you may not use the same element twice.\n\n" +
            "**Input format:**\nLine 1: n (array size)\nLine 2: n space-separated integers\nLine 3: target\n\n" +
            "**Output:** Two space-separated indices."
        );
        p.setSampleTestCases(
            "[" +
            "{\"input\":\"4\\n2 7 11 15\\n9\",\"output\":\"0 1\",\"explanation\":\"nums[0]+nums[1]=2+7=9\"}," +
            "{\"input\":\"3\\n3 2 4\\n6\",\"output\":\"1 2\",\"explanation\":\"nums[1]+nums[2]=2+4=6\"}," +
            "{\"input\":\"2\\n3 3\\n6\",\"output\":\"0 1\",\"explanation\":\"nums[0]+nums[1]=6\"}" +
            "]"
        );
        p.setHiddenTestCases(
            "[" +
            "{\"input\":\"5\\n1 2 3 4 5\\n9\",\"output\":\"3 4\"}," +
            "{\"input\":\"4\\n0 4 3 0\\n0\",\"output\":\"0 3\"}," +
            "{\"input\":\"3\\n-1 -2 -3\\n-5\",\"output\":\"1 2\"}," +
            "{\"input\":\"2\\n1000000 999999\\n1999999\",\"output\":\"0 1\"}" +
            "]"
        );
        p.setConstraints(
            "2 <= nums.length <= 10^4\n" +
            "-10^9 <= nums[i] <= 10^9\n" +
            "-10^9 <= target <= 10^9\n" +
            "Only one valid answer exists."
        );
        p.setHints(
            "[" +
            "\"Try using a hash map to store visited numbers and their indices.\"," +
            "\"For each number, check if (target - number) already exists in your hash map.\"," +
            "\"This gives you O(n) time complexity instead of O(n^2) brute force.\"" +
            "]"
        );
        p.setStarterCode(buildStarterCode(
            "n = int(input())\nnums = list(map(int, input().split()))\ntarget = int(input())\n" +
            "# Write your solution here\n# Print the two indices separated by space",
            "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n" +
            "        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n" +
            "        int[] nums = new int[n];\n        for (int i=0;i<n;i++) nums[i] = sc.nextInt();\n" +
            "        int target = sc.nextInt();\n        // Write your solution here\n    }\n}",
            "#include<bits/stdc++.h>\nusing namespace std;\nint main(){\n" +
            "    int n; cin>>n; vector<int> nums(n);\n" +
            "    for(auto& x:nums) cin>>x;\n    int target; cin>>target;\n" +
            "    // Write your solution here\n    return 0;\n}"
        ));
    }

    // ─────────────────────────── REVERSE STRING ────────────────────────────────

    private void setReverseString(Problem p) {
        p.setProblemStatement(
            "Write a function that reverses a string.\n\n" +
            "Read a single string from input and print the reversed string."
        );
        p.setSampleTestCases(
            "[" +
            "{\"input\":\"hello\",\"output\":\"olleh\",\"explanation\":\"Reverse each character\"}," +
            "{\"input\":\"Hannah\",\"output\":\"hannaH\",\"explanation\":\"Case is preserved\"}," +
            "{\"input\":\"abcde\",\"output\":\"edcba\",\"explanation\":\"5-char reversal\"}" +
            "]"
        );
        p.setHiddenTestCases(
            "[" +
            "{\"input\":\"racecar\",\"output\":\"racecar\"}," +
            "{\"input\":\"leetcode\",\"output\":\"edocteel\"}," +
            "{\"input\":\"a\",\"output\":\"a\"}," +
            "{\"input\":\"12345\",\"output\":\"54321\"}" +
            "]"
        );
        p.setConstraints("1 <= s.length <= 10^5\ns consists of printable ASCII characters.");
        p.setHints(
            "[" +
            "\"Use two pointers: one at start, one at end, swap until they meet.\"," +
            "\"In Python you can use slicing: s[::-1]\"," +
            "\"In Java, use StringBuilder.reverse()\"" +
            "]"
        );
        p.setStarterCode(buildStarterCode(
            "s = input()\n# Write your solution here",
            "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n" +
            "        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine();\n" +
            "        // Write your solution here\n    }\n}",
            "#include<bits/stdc++.h>\nusing namespace std;\nint main(){\n" +
            "    string s; getline(cin,s);\n    // Write your solution here\n    return 0;\n}"
        ));
    }

    // ─────────────────────────── PALINDROME ────────────────────────────────────

    private void setPalindrome(Problem p) {
        p.setProblemStatement(
            "Given a string `s`, return `true` if it is a palindrome, `false` otherwise.\n\n" +
            "Consider only alphanumeric characters and ignore case.\n\n" +
            "Print `true` or `false`."
        );
        p.setSampleTestCases(
            "[" +
            "{\"input\":\"A man a plan a canal Panama\",\"output\":\"true\"," +
            "\"explanation\":\"After filtering: amanaplanacanalpanama is a palindrome\"}," +
            "{\"input\":\"race a car\",\"output\":\"false\",\"explanation\":\"raceacar is not a palindrome\"}," +
            "{\"input\":\" \",\"output\":\"true\",\"explanation\":\"Empty string after filtering is palindrome\"}" +
            "]"
        );
        p.setHiddenTestCases(
            "[" +
            "{\"input\":\"Was it a car or a cat I saw\",\"output\":\"true\"}," +
            "{\"input\":\"hello\",\"output\":\"false\"}," +
            "{\"input\":\"12321\",\"output\":\"true\"}," +
            "{\"input\":\"12345\",\"output\":\"false\"}" +
            "]"
        );
        p.setConstraints("1 <= s.length <= 2 * 10^5\ns consists only of printable ASCII characters.");
        p.setHints(
            "[" +
            "\"Filter out non-alphanumeric characters and convert to lowercase first.\"," +
            "\"Use two pointers: compare s[left] and s[right] moving toward center.\"," +
            "\"Alternatively compare the cleaned string to its reverse.\"" +
            "]"
        );
        p.setStarterCode(buildStarterCode(
            "s = input()\n# Filter and check palindrome\n# Print true or false",
            "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n" +
            "        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine();\n" +
            "        // Filter alphanumeric, check palindrome\n    }\n}",
            "#include<bits/stdc++.h>\nusing namespace std;\nint main(){\n" +
            "    string s; getline(cin,s);\n    // Filter and check palindrome\n    return 0;\n}"
        ));
    }

    // ─────────────────────────── FIBONACCI ─────────────────────────────────────

    private void setFibonacci(Problem p) {
        p.setProblemStatement(
            "Given a number `n`, find the n-th Fibonacci number (0-indexed).\n\n" +
            "F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2) for n>1.\n\nPrint the result."
        );
        p.setSampleTestCases(
            "[" +
            "{\"input\":\"0\",\"output\":\"0\",\"explanation\":\"F(0)=0\"}," +
            "{\"input\":\"1\",\"output\":\"1\",\"explanation\":\"F(1)=1\"}," +
            "{\"input\":\"10\",\"output\":\"55\",\"explanation\":\"F(10)=55\"}" +
            "]"
        );
        p.setHiddenTestCases(
            "[" +
            "{\"input\":\"5\",\"output\":\"5\"}," +
            "{\"input\":\"15\",\"output\":\"610\"}," +
            "{\"input\":\"20\",\"output\":\"6765\"}," +
            "{\"input\":\"30\",\"output\":\"832040\"}" +
            "]"
        );
        p.setConstraints("0 <= n <= 30");
        p.setHints(
            "[" +
            "\"Use dynamic programming: maintain just the last two values.\"," +
            "\"Avoid pure recursion without memoization — it is O(2^n).\"," +
            "\"Iterative approach uses O(1) space and O(n) time.\"" +
            "]"
        );
        p.setStarterCode(buildStarterCode(
            "n = int(input())\n# Compute nth Fibonacci and print",
            "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n" +
            "        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n" +
            "        // Compute nth Fibonacci\n    }\n}",
            "#include<bits/stdc++.h>\nusing namespace std;\nint main(){\n" +
            "    int n; cin>>n;\n    // Compute nth Fibonacci\n    return 0;\n}"
        ));
    }

    // ─────────────────────────── BINARY SEARCH ─────────────────────────────────

    private void setBinarySearch(Problem p) {
        p.setProblemStatement(
            "Given a sorted array of `n` integers and a target, return its index using binary search.\n" +
            "If not found, return -1.\n\n" +
            "**Input:** Line 1: n, Line 2: sorted integers, Line 3: target"
        );
        p.setSampleTestCases(
            "[" +
            "{\"input\":\"6\\n-1 0 3 5 9 12\\n9\",\"output\":\"4\",\"explanation\":\"9 is at index 4\"}," +
            "{\"input\":\"6\\n-1 0 3 5 9 12\\n2\",\"output\":\"-1\",\"explanation\":\"2 not found\"}," +
            "{\"input\":\"1\\n5\\n5\",\"output\":\"0\",\"explanation\":\"Single element\"}" +
            "]"
        );
        p.setHiddenTestCases(
            "[" +
            "{\"input\":\"5\\n1 3 5 7 9\\n7\",\"output\":\"3\"}," +
            "{\"input\":\"5\\n1 3 5 7 9\\n6\",\"output\":\"-1\"}," +
            "{\"input\":\"3\\n1 2 3\\n3\",\"output\":\"2\"}," +
            "{\"input\":\"7\\n1 2 4 8 16 32 64\\n16\",\"output\":\"4\"}" +
            "]"
        );
        p.setConstraints(
            "1 <= n <= 10^4\n" +
            "-10^4 < nums[i], target < 10^4\n" +
            "All integers are unique.\n" +
            "Array is sorted ascending."
        );
        p.setHints(
            "[" +
            "\"Set lo=0, hi=n-1. While lo<=hi compute mid=(lo+hi)/2.\"," +
            "\"If nums[mid]==target return mid. If less, search right. If more, search left.\"," +
            "\"Time complexity: O(log n).\"" +
            "]"
        );
        p.setStarterCode(buildStarterCode(
            "n = int(input())\nnums = list(map(int, input().split()))\ntarget = int(input())\n# Binary search",
            "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n" +
            "        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n" +
            "        int[] nums = new int[n]; for(int i=0;i<n;i++) nums[i]=sc.nextInt();\n" +
            "        int target = sc.nextInt();\n        // Binary search\n    }\n}",
            "#include<bits/stdc++.h>\nusing namespace std;\nint main(){\n" +
            "    int n; cin>>n; vector<int>a(n); for(auto&x:a)cin>>x; int t; cin>>t;\n" +
            "    // Binary search\n    return 0;\n}"
        ));
    }

    // ─────────────────────────── VALID PARENTHESES ─────────────────────────────

    private void setValidParentheses(Problem p) {
        p.setProblemStatement(
            "Given a string containing `(`, `)`, `{`, `}`, `[`, `]`, determine if it is valid.\n\n" +
            "Valid means: open brackets are closed by the same type in the correct order.\n\n" +
            "Print `true` or `false`."
        );
        p.setSampleTestCases(
            "[" +
            "{\"input\":\"()\",\"output\":\"true\",\"explanation\":\"Simple match\"}," +
            "{\"input\":\"()[]{}\",\"output\":\"true\",\"explanation\":\"All match\"}," +
            "{\"input\":\"(]\",\"output\":\"false\",\"explanation\":\"Wrong bracket type\"}" +
            "]"
        );
        p.setHiddenTestCases(
            "[" +
            "{\"input\":\"([{}])\",\"output\":\"true\"}," +
            "{\"input\":\"((\",\"output\":\"false\"}," +
            "{\"input\":\"{[]}\",\"output\":\"true\"}," +
            "{\"input\":\"([)]\",\"output\":\"false\"}" +
            "]"
        );
        p.setConstraints("0 <= s.length <= 10^4\ns consists of parentheses only ()[]{}");
        p.setHints(
            "[" +
            "\"Use a stack. Push opening brackets, pop on closing.\"," +
            "\"When you see a closing bracket, check if it matches the top of the stack.\"," +
            "\"At the end, the stack should be empty for a valid string.\"" +
            "]"
        );
        p.setStarterCode(buildStarterCode(
            "s = input()\n# Use a stack to validate\n# Print true or false",
            "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n" +
            "        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine();\n" +
            "        // Use a stack to validate\n    }\n}",
            "#include<bits/stdc++.h>\nusing namespace std;\nint main(){\n" +
            "    string s; getline(cin,s);\n    // Use a stack to validate\n    return 0;\n}"
        ));
    }

    // ─────────────────────────── MAXIMUM SUBARRAY ──────────────────────────────

    private void setMaximumSubarray(Problem p) {
        p.setProblemStatement(
            "Given an integer array `nums`, find the subarray with the largest sum and return its sum.\n\n" +
            "**Input:** Line 1: n, Line 2: space-separated integers"
        );
        p.setSampleTestCases(
            "[" +
            "{\"input\":\"9\\n-2 1 -3 4 -1 2 1 -5 4\",\"output\":\"6\"," +
            "\"explanation\":\"Subarray [4,-1,2,1] has sum 6\"}," +
            "{\"input\":\"1\\n1\",\"output\":\"1\",\"explanation\":\"Single element\"}," +
            "{\"input\":\"5\\n5 4 -1 7 8\",\"output\":\"23\",\"explanation\":\"Entire array\"}" +
            "]"
        );
        p.setHiddenTestCases(
            "[" +
            "{\"input\":\"4\\n-3 -1 -2 -4\",\"output\":\"-1\"}," +
            "{\"input\":\"6\\n1 -1 1 -1 1 -1\",\"output\":\"1\"}," +
            "{\"input\":\"3\\n100 -200 100\",\"output\":\"100\"}," +
            "{\"input\":\"5\\n-2 -3 4 -1 2\",\"output\":\"5\"}" +
            "]"
        );
        p.setConstraints("1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4");
        p.setHints(
            "[" +
            "\"Use Kadane's Algorithm: maintain currentSum and maxSum.\"," +
            "\"currentSum = max(nums[i], currentSum + nums[i]) at each step.\"," +
            "\"maxSum = max(maxSum, currentSum). Time: O(n), Space: O(1).\"" +
            "]"
        );
        p.setStarterCode(buildStarterCode(
            "n = int(input())\nnums = list(map(int, input().split()))\n# Kadane's algorithm\n# Print max subarray sum",
            "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n" +
            "        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n" +
            "        int[] nums = new int[n]; for(int i=0;i<n;i++) nums[i]=sc.nextInt();\n" +
            "        // Kadane's algorithm\n    }\n}",
            "#include<bits/stdc++.h>\nusing namespace std;\nint main(){\n" +
            "    int n; cin>>n; vector<int>a(n); for(auto&x:a)cin>>x;\n" +
            "    // Kadane's algorithm\n    return 0;\n}"
        ));
    }

    // ─────────────────────────── FACTORIAL ─────────────────────────────────────

    private void setFactorial(Problem p) {
        p.setProblemStatement(
            "Given a non-negative integer `n`, compute its factorial.\n\n" +
            "n! = n x (n-1) x ... x 2 x 1, and 0! = 1.\n\nPrint the result."
        );
        p.setSampleTestCases(
            "[" +
            "{\"input\":\"0\",\"output\":\"1\",\"explanation\":\"0! = 1 by definition\"}," +
            "{\"input\":\"5\",\"output\":\"120\",\"explanation\":\"5! = 120\"}," +
            "{\"input\":\"10\",\"output\":\"3628800\",\"explanation\":\"10! = 3628800\"}" +
            "]"
        );
        p.setHiddenTestCases(
            "[" +
            "{\"input\":\"1\",\"output\":\"1\"}," +
            "{\"input\":\"7\",\"output\":\"5040\"}," +
            "{\"input\":\"12\",\"output\":\"479001600\"}," +
            "{\"input\":\"3\",\"output\":\"6\"}" +
            "]"
        );
        p.setConstraints("0 <= n <= 12");
        p.setHints(
            "[" +
            "\"Use a loop from 1 to n, multiplying a running product.\"," +
            "\"Base case: factorial(0) = 1.\"," +
            "\"Avoid recursion for large n to prevent stack overflow.\"" +
            "]"
        );
        p.setStarterCode(buildStarterCode(
            "n = int(input())\n# Compute factorial and print",
            "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n" +
            "        Scanner sc = new Scanner(System.in);\n        long n = sc.nextLong();\n" +
            "        // Compute factorial\n    }\n}",
            "#include<bits/stdc++.h>\nusing namespace std;\nint main(){\n" +
            "    long long n; cin>>n;\n    // Compute factorial\n    return 0;\n}"
        ));
    }

    // ─────────────────────────── MERGE SORT ────────────────────────────────────

    private void setMergeSort(Problem p) {
        p.setProblemStatement(
            "Sort an array using Merge Sort.\n\n" +
            "**Input:** Line 1: n (size), Line 2: space-separated integers\n\n" +
            "**Output:** Sorted array, space-separated."
        );
        p.setSampleTestCases(
            "[" +
            "{\"input\":\"5\\n38 27 43 3 9\",\"output\":\"3 9 27 38 43\"," +
            "\"explanation\":\"Sorted ascending\"}," +
            "{\"input\":\"4\\n5 1 4 2\",\"output\":\"1 2 4 5\",\"explanation\":\"Sorted\"}," +
            "{\"input\":\"1\\n42\",\"output\":\"42\",\"explanation\":\"Single element\"}" +
            "]"
        );
        p.setHiddenTestCases(
            "[" +
            "{\"input\":\"6\\n64 34 25 12 22 11\",\"output\":\"11 12 22 25 34 64\"}," +
            "{\"input\":\"3\\n3 1 2\",\"output\":\"1 2 3\"}," +
            "{\"input\":\"5\\n-5 0 -1 3 2\",\"output\":\"-5 -1 0 2 3\"}," +
            "{\"input\":\"4\\n9 9 9 1\",\"output\":\"1 9 9 9\"}" +
            "]"
        );
        p.setConstraints("1 <= n <= 10^5\n-10^9 <= nums[i] <= 10^9");
        p.setHints(
            "[" +
            "\"Divide the array in half, recursively sort each half, then merge.\"," +
            "\"Merge by comparing front elements of both sorted halves.\"," +
            "\"Time: O(n log n), Space: O(n) for the merge step.\"" +
            "]"
        );
        p.setStarterCode(buildStarterCode(
            "n = int(input())\nnums = list(map(int, input().split()))\n# Implement merge sort\n# Print sorted array",
            "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n" +
            "        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n" +
            "        int[] nums = new int[n]; for(int i=0;i<n;i++) nums[i]=sc.nextInt();\n" +
            "        // Implement merge sort\n    }\n}",
            "#include<bits/stdc++.h>\nusing namespace std;\nint main(){\n" +
            "    int n; cin>>n; vector<int>a(n); for(auto&x:a)cin>>x;\n" +
            "    // Implement merge sort\n    return 0;\n}"
        ));
    }

    // ─────────────────────────── LINKED LIST CYCLE ─────────────────────────────

    private void setLinkedListCycle(Problem p) {
        p.setProblemStatement(
            "Detect if a linked list has a cycle.\n\n" +
            "Given n node values and a pos value (0-indexed tail connection, or -1 for no cycle),\n" +
            "print `true` if there is a cycle, `false` otherwise.\n\n" +
            "**Input:** Line 1: n, Line 2: node values, Line 3: pos"
        );
        p.setSampleTestCases(
            "[" +
            "{\"input\":\"4\\n3 2 0 -4\\n1\",\"output\":\"true\"," +
            "\"explanation\":\"Tail connects to node at index 1\"}," +
            "{\"input\":\"2\\n1 2\\n0\",\"output\":\"true\"," +
            "\"explanation\":\"Tail connects to head\"}," +
            "{\"input\":\"1\\n1\\n-1\",\"output\":\"false\"," +
            "\"explanation\":\"No cycle, pos=-1\"}" +
            "]"
        );
        p.setHiddenTestCases(
            "[" +
            "{\"input\":\"5\\n1 2 3 4 5\\n2\",\"output\":\"true\"}," +
            "{\"input\":\"3\\n1 2 3\\n-1\",\"output\":\"false\"}," +
            "{\"input\":\"1\\n1\\n0\",\"output\":\"true\"}," +
            "{\"input\":\"6\\n1 2 3 4 5 6\\n-1\",\"output\":\"false\"}" +
            "]"
        );
        p.setConstraints("1 <= nodes <= 10^4\npos is -1 or a valid index in the list.");
        p.setHints(
            "[" +
            "\"Use Floyd's Cycle Detection (Tortoise and Hare).\"," +
            "\"Slow pointer moves 1 step, fast moves 2. If they meet, cycle exists.\"," +
            "\"Alternatively, use a hash set to track visited nodes.\"" +
            "]"
        );
        p.setStarterCode(buildStarterCode(
            "n = int(input())\nvals = list(map(int, input().split()))\npos = int(input())\n# Detect cycle",
            "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n" +
            "        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n" +
            "        for(int i=0;i<n;i++) sc.nextInt();\n        int pos = sc.nextInt();\n" +
            "        // Detect cycle\n    }\n}",
            "#include<bits/stdc++.h>\nusing namespace std;\nint main(){\n" +
            "    int n; cin>>n; for(int i=0;i<n;i++){int x;cin>>x;}\n    int pos; cin>>pos;\n" +
            "    // Detect cycle\n    return 0;\n}"
        ));
    }

    // ─────────────────────────── GENERIC ───────────────────────────────────────

    private void setGeneric(Problem p, String title, String difficulty) {
        p.setProblemStatement(
            "**" + title + "** (" + difficulty + ")\n\n" +
            "Read input from standard input and write your answer to standard output.\n\n" +
            "Analyze the problem carefully, identify the optimal algorithm, and implement an efficient solution."
        );
        p.setSampleTestCases(
            "[{\"input\":\"5\",\"output\":\"5\",\"explanation\":\"Sample test case\"}]"
        );
        p.setHiddenTestCases(
            "[{\"input\":\"10\",\"output\":\"10\"},{\"input\":\"1\",\"output\":\"1\"}]"
        );
        p.setConstraints("1 <= n <= 10^5\nTime limit: 2 seconds\nMemory limit: 256 MB");
        p.setHints(
            "[" +
            "\"Break down the problem into smaller subproblems.\"," +
            "\"Consider the time complexity — aim for O(n log n) or better.\"," +
            "\"Think about edge cases: empty input, single element, maximum values.\"" +
            "]"
        );
        p.setStarterCode(buildStarterCode(
            "# Read input and solve\nn = int(input())\nprint(n)",
            "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n" +
            "        Scanner sc = new Scanner(System.in);\n        // Read and solve\n    }\n}",
            "#include<bits/stdc++.h>\nusing namespace std;\nint main(){\n    // Read and solve\n    return 0;\n}"
        ));
    }

    // ─────────────────────────── HELPER ────────────────────────────────────────

    private String buildStarterCode(String python, String java, String cpp) {
        return "{\"python\":\"" + escapeJson(python) + "\"," +
               "\"java\":\"" + escapeJson(java) + "\"," +
               "\"cpp\":\"" + escapeJson(cpp) + "\"}";
    }

    private String escapeJson(String s) {
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}
