package com.codeforge.service;

import com.codeforge.dto.SubmissionRequestDto.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class CodeExecutionService {

    @Value("${app.judge0.url:https://ce.judge0.com}")
    private String judge0Url;

    @Value("${app.judge0.token:}")
    private String judge0Token;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    public CodeRunResponse runCode(CodeRunRequest request) {
        log.info("Attempting to run code via Judge0: languageId={}", request.getLanguageId());
        try {
            Map<String, Object> bodyMap = new HashMap<>();
            bodyMap.put("source_code", request.getSourceCode());
            bodyMap.put("language_id", request.getLanguageId());
            bodyMap.put("stdin", request.getStdin());

            String jsonBody = objectMapper.writeValueAsString(bodyMap);

            HttpRequest.Builder reqBuilder = HttpRequest.newBuilder()
                    .uri(URI.create(judge0Url + "/submissions?base64_encoded=true&wait=true"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody));

            if (judge0Token != null && !judge0Token.isBlank()) {
                reqBuilder.header("X-Auth-Token", judge0Token);
            }

            HttpResponse<String> response = httpClient.send(reqBuilder.build(), HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200 || response.statusCode() == 201) {
                Map<String, Object> respMap = objectMapper.readValue(response.body(), new com.fasterxml.jackson.core.type.TypeReference<Map<String, Object>>() {});
                
                String stdout = (String) respMap.get("stdout");
                String stderr = (String) respMap.get("stderr");
                String compileOutput = (String) respMap.get("compile_output");
                Object timeObj = respMap.get("time");
                Double time = 0.0;
                if (timeObj instanceof Number) {
                    time = ((Number) timeObj).doubleValue();
                } else if (timeObj instanceof String) {
                    time = Double.parseDouble((String) timeObj);
                }
                
                Object memObj = respMap.get("memory");
                Integer memory = 0;
                if (memObj instanceof Number) {
                    memory = ((Number) memObj).intValue();
                }

                String message = (String) respMap.get("message");

                @SuppressWarnings("unchecked")
                Map<String, Object> statusMap = (Map<String, Object>) respMap.get("status");
                Integer statusId = 3;
                String statusDesc = "Accepted";
                if (statusMap != null) {
                    statusId = (Integer) statusMap.get("id");
                    statusDesc = (String) statusMap.get("description");
                }

                return CodeRunResponse.builder()
                        .stdout(stdout)
                        .stderr(stderr)
                        .compileOutput(compileOutput)
                        .time(time)
                        .memory(memory)
                        .message(message)
                        .status(RunStatus.builder().id(statusId).description(statusDesc).build())
                        .build();
            } else {
                log.warn("Judge0 returned error code: {}. Falling back to local execution.", response.statusCode());
                return runLocally(request);
            }
        } catch (Exception e) {
            log.error("Failed to execute code via Judge0. Falling back to local execution.", e);
            return runLocally(request);
        }
    }

    private CodeRunResponse runLocally(CodeRunRequest request) {
        log.info("Executing code locally: languageId={}", request.getLanguageId());
        try {
            String sourceCode = new String(Base64.getDecoder().decode(request.getSourceCode()), StandardCharsets.UTF_8);
            String stdin = request.getStdin() != null ? new String(Base64.getDecoder().decode(request.getStdin()), StandardCharsets.UTF_8) : "";

            String ext = "";
            String lang = "";
            if (request.getLanguageId() == 71 || request.getLanguageId() == 92) {
                ext = "py";
                lang = "python";
            } else if (request.getLanguageId() == 62 || request.getLanguageId() == 91) {
                ext = "java";
                lang = "java";
            } else if (request.getLanguageId() == 54 || request.getLanguageId() == 75) {
                ext = "cpp";
                lang = "cpp";
            } else {
                ext = "py";
                lang = "python";
            }

            Path tempDir = Files.createTempDirectory("codeforge-local-exec-");
            String fileName = "Main." + ext;

            Path codePath = tempDir.resolve(fileName);
            Files.writeString(codePath, sourceCode);

            String compileError = null;
            String stdout = "";
            String stderr = "";
            long startTime = System.currentTimeMillis();
            long endTime = startTime;

            if (lang.equals("java")) {
                ProcessBuilder compileBuilder = new ProcessBuilder("javac", "Main.java");
                compileBuilder.directory(tempDir.toFile());
                Process compileProcess = compileBuilder.start();
                
                String compileStderr = readStream(compileProcess.getErrorStream());
                boolean compileOk = compileProcess.waitFor(10, TimeUnit.SECONDS);
                
                if (!compileOk || compileProcess.exitValue() != 0) {
                    compileError = Base64.getEncoder().encodeToString(compileStderr.getBytes(StandardCharsets.UTF_8));
                    return CodeRunResponse.builder()
                            .compileOutput(compileError)
                            .status(RunStatus.builder().id(6).description("Compilation Error").build())
                            .build();
                }

                startTime = System.currentTimeMillis();
                ProcessBuilder runBuilder = new ProcessBuilder("java", "Main");
                runBuilder.directory(tempDir.toFile());
                Process runProcess = runBuilder.start();

                if (!stdin.isEmpty()) {
                    try (Writer w = new OutputStreamWriter(runProcess.getOutputStream())) {
                        w.write(stdin);
                        w.flush();
                    }
                }

                stdout = readStream(runProcess.getInputStream());
                stderr = readStream(runProcess.getErrorStream());
                runProcess.waitFor(5, TimeUnit.SECONDS);
                endTime = System.currentTimeMillis();

            } else if (lang.equals("cpp")) {
                ProcessBuilder compileBuilder = new ProcessBuilder("g++", "-O3", "Main.cpp", "-o", "Main.out");
                compileBuilder.directory(tempDir.toFile());
                Process compileProcess = compileBuilder.start();
                
                String compileStderr = readStream(compileProcess.getErrorStream());
                boolean compileOk = compileProcess.waitFor(15, TimeUnit.SECONDS);
                
                if (!compileOk || compileProcess.exitValue() != 0) {
                    compileError = Base64.getEncoder().encodeToString(compileStderr.getBytes(StandardCharsets.UTF_8));
                    return CodeRunResponse.builder()
                            .compileOutput(compileError)
                            .status(RunStatus.builder().id(6).description("Compilation Error").build())
                            .build();
                }

                startTime = System.currentTimeMillis();
                ProcessBuilder runBuilder = new ProcessBuilder("./Main.out");
                runBuilder.directory(tempDir.toFile());
                Process runProcess = runBuilder.start();

                if (!stdin.isEmpty()) {
                    try (Writer w = new OutputStreamWriter(runProcess.getOutputStream())) {
                        w.write(stdin);
                        w.flush();
                    }
                }

                stdout = readStream(runProcess.getInputStream());
                stderr = readStream(runProcess.getErrorStream());
                runProcess.waitFor(5, TimeUnit.SECONDS);
                endTime = System.currentTimeMillis();

            } else {
                startTime = System.currentTimeMillis();
                ProcessBuilder runBuilder = new ProcessBuilder("python3", "Main.py");
                runBuilder.directory(tempDir.toFile());
                Process runProcess = runBuilder.start();

                if (!stdin.isEmpty()) {
                    try (Writer w = new OutputStreamWriter(runProcess.getOutputStream())) {
                        w.write(stdin);
                        w.flush();
                    }
                }

                stdout = readStream(runProcess.getInputStream());
                stderr = readStream(runProcess.getErrorStream());
                runProcess.waitFor(5, TimeUnit.SECONDS);
                endTime = System.currentTimeMillis();
            }

            deleteDir(tempDir.toFile());

            double durationSeconds = (endTime - startTime) / 1000.0;
            String encodedStdout = Base64.getEncoder().encodeToString(stdout.getBytes(StandardCharsets.UTF_8));
            String encodedStderr = Base64.getEncoder().encodeToString(stderr.getBytes(StandardCharsets.UTF_8));

            RunStatus status = RunStatus.builder().id(3).description("Accepted").build();
            if (!stderr.isEmpty()) {
                status = RunStatus.builder().id(11).description("Runtime Error (NZEC)").build();
            }

            return CodeRunResponse.builder()
                    .stdout(encodedStdout)
                    .stderr(encodedStderr)
                    .time(durationSeconds)
                    .memory(1024)
                    .status(status)
                    .build();

        } catch (Exception e) {
            log.error("Local execution failed completely", e);
            String errBase64 = Base64.getEncoder().encodeToString(("Local execution error: " + e.getMessage()).getBytes(StandardCharsets.UTF_8));
            return CodeRunResponse.builder()
                    .stderr(errBase64)
                    .status(RunStatus.builder().id(12).description("Runtime Error (Other)").build())
                    .build();
        }
    }

    private String readStream(InputStream is) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line).append("\n");
            }
        }
        return sb.toString();
    }

    private void deleteDir(File file) {
        File[] contents = file.listFiles();
        if (contents != null) {
            for (File f : contents) {
                deleteDir(f);
            }
        }
        file.delete();
    }
}
