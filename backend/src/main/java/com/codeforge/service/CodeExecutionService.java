package com.codeforge.service;

import com.codeforge.dto.SubmissionRequestDto.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class CodeExecutionService {

    public CodeRunResponse runCode(CodeRunRequest request) {
        log.info("Executing code via local engine: languageId={}", request.getLanguageId());
        return runLocally(request);
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

            if (lang.equals("python")) {
                sourceCode = wrapPythonCode(sourceCode, stdin);
            } else if (lang.equals("java")) {
                sourceCode = wrapJavaCode(sourceCode, stdin);
            }

            Path codePath = tempDir.resolve(fileName);
            Files.writeString(codePath, sourceCode);

            String compileError = null;
            String stdout = "";
            String stderr = "";
            long startTime = System.currentTimeMillis();
            long endTime = startTime;

            int exitCode = 0;
            boolean timedOut = false;
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

                boolean finished = runProcess.waitFor(3, TimeUnit.SECONDS);
                if (!finished) {
                    runProcess.destroyForcibly();
                    timedOut = true;
                } else {
                    stdout = readStream(runProcess.getInputStream());
                    stderr = readStream(runProcess.getErrorStream());
                    exitCode = runProcess.exitValue();
                }
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

                boolean finished = runProcess.waitFor(3, TimeUnit.SECONDS);
                if (!finished) {
                    runProcess.destroyForcibly();
                    timedOut = true;
                } else {
                    stdout = readStream(runProcess.getInputStream());
                    stderr = readStream(runProcess.getErrorStream());
                    exitCode = runProcess.exitValue();
                }
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

                boolean finished = runProcess.waitFor(3, TimeUnit.SECONDS);
                if (!finished) {
                    runProcess.destroyForcibly();
                    timedOut = true;
                } else {
                    stdout = readStream(runProcess.getInputStream());
                    stderr = readStream(runProcess.getErrorStream());
                    exitCode = runProcess.exitValue();
                }
                endTime = System.currentTimeMillis();
            }

            deleteDir(tempDir.toFile());

            double durationSeconds = (endTime - startTime) / 1000.0;
            String encodedStdout = Base64.getEncoder().encodeToString(stdout.getBytes(StandardCharsets.UTF_8));
            String encodedStderr = Base64.getEncoder().encodeToString(stderr.getBytes(StandardCharsets.UTF_8));

            RunStatus status = RunStatus.builder().id(3).description("Accepted").build();
            if (timedOut) {
                status = RunStatus.builder().id(5).description("Time Limit Exceeded").build();
            } else if (exitCode != 0) {
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

    private String wrapPythonCode(String sourceCode, String stdin) {
        if (!sourceCode.contains("class Solution")) {
            return sourceCode;
        }
        StringBuilder sb = new StringBuilder();
        sb.append(sourceCode).append("\n\n");
        sb.append("import json, sys, inspect, re\n");
        sb.append("from typing import *\n\n");
        sb.append("def _run_sol():\n");
        String escapedStdin = stdin.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n");
        sb.append("    raw = \"").append(escapedStdin).append("\"\n");
        sb.append("    for line in raw.splitlines():\n");
        sb.append("        for part in re.split(r',\\s*(?=[a-zA-Z_][a-zA-Z0-9_]*\\s*=)', line.strip()):\n");
        sb.append("            if '=' in part:\n");
        sb.append("                try:\n");
        sb.append("                    exec(part.strip(), globals())\n");
        sb.append("                except:\n");
        sb.append("                    pass\n");
        sb.append("    sol = Solution()\n");
        sb.append("    methods = [m for m in dir(sol) if not m.startswith('_')]\n");
        sb.append("    if methods:\n");
        sb.append("        method = getattr(sol, methods[0])\n");
        sb.append("        sig = inspect.signature(method)\n");
        sb.append("        args = [globals()[p] for p in sig.parameters.keys() if p in globals()]\n");
        sb.append("        res = method(*args)\n");
        sb.append("        if res is None and sig.parameters:\n");
        sb.append("            res = globals()[list(sig.parameters.keys())[0]]\n");
        sb.append("        if isinstance(res, bool):\n");
        sb.append("            print('true' if res else 'false')\n");
        sb.append("        elif isinstance(res, (list, dict, int, str)):\n");
        sb.append("            print(json.dumps(res, separators=(',', ':')))\n");
        sb.append("        elif res is not None:\n");
        sb.append("            print(res)\n\n");
        sb.append("_run_sol()\n");
        return sb.toString();
    }

    private String wrapJavaCode(String sourceCode, String stdin) {
        if (sourceCode.contains("public class Main") || sourceCode.contains("class Main")) {
            return sourceCode;
        }
        StringBuilder sb = new StringBuilder();
        sb.append("import java.util.*;\n");
        sb.append("import java.lang.reflect.*;\n\n");
        sb.append(sourceCode).append("\n\n");
        sb.append("public class Main {\n");
        sb.append("    public static void main(String[] args) {\n");
        sb.append("        try {\n");
        String escapedStdin = stdin.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n");
        sb.append("            String stdinRaw = \"").append(escapedStdin).append("\";\n");
        sb.append("            Map<String, String> vars = new LinkedHashMap<>();\n");
        sb.append("            for (String line : stdinRaw.split(\"\\\\n\")) {\n");
        sb.append("                for (String part : line.split(\",\\\\s*(?=[a-zA-Z_][a-zA-Z0-9_]*\\\\s*=)\")) {\n");
        sb.append("                    if (part.contains(\"=\")) {\n");
        sb.append("                        String[] kv = part.split(\"=\", 2);\n");
        sb.append("                        vars.put(kv[0].trim(), kv[1].trim());\n");
        sb.append("                    }\n");
        sb.append("                }\n");
        sb.append("            }\n");
        sb.append("            Solution sol = new Solution();\n");
        sb.append("            Method targetMethod = null;\n");
        sb.append("            for (Method m : Solution.class.getDeclaredMethods()) {\n");
        sb.append("                if (Modifier.isPublic(m.getModifiers()) && !Modifier.isStatic(m.getModifiers())) {\n");
        sb.append("                    targetMethod = m;\n");
        sb.append("                    break;\n");
        sb.append("                }\n");
        sb.append("            }\n");
        sb.append("            if (targetMethod == null) return;\n");
        sb.append("            Class<?>[] paramTypes = targetMethod.getParameterTypes();\n");
        sb.append("            Object[] paramValues = new Object[paramTypes.length];\n");
        sb.append("            String[] valStrs = vars.values().toArray(new String[0]);\n");
        sb.append("            for (int i = 0; i < paramTypes.length; i++) {\n");
        sb.append("                String valStr = i < valStrs.length ? valStrs[i] : \"\";\n");
        sb.append("                paramValues[i] = parseVal(valStr, paramTypes[i]);\n");
        sb.append("            }\n");
        sb.append("            Object res = targetMethod.invoke(sol, paramValues);\n");
        sb.append("            if (res == null && paramValues.length > 0) {\n");
        sb.append("                res = paramValues[0];\n");
        sb.append("            }\n");
        sb.append("            printRes(res);\n");
        sb.append("        } catch (Exception e) {\n");
        sb.append("            e.printStackTrace();\n");
        sb.append("        }\n");
        sb.append("    }\n");
        sb.append("    private static Object parseVal(String s, Class<?> type) {\n");
        sb.append("        s = s.trim();\n");
        sb.append("        if (type == int.class || type == Integer.class) return Integer.parseInt(s);\n");
        sb.append("        if (type == long.class || type == Long.class) return Long.parseLong(s);\n");
        sb.append("        if (type == double.class || type == Double.class) return Double.parseDouble(s);\n");
        sb.append("        if (type == boolean.class || type == Boolean.class) return Boolean.parseBoolean(s);\n");
        sb.append("        if (type == String.class) return s.replace(String.valueOf('\"'), \"\");\n");
        sb.append("        if (type == int[].class) {\n");
        sb.append("            s = s.replace(\"[\", \"\").replace(\"]\", \"\").trim();\n");
        sb.append("            if (s.isEmpty()) return new int[0];\n");
        sb.append("            String[] parts = s.split(\",\");\n");
        sb.append("            int[] arr = new int[parts.length];\n");
        sb.append("            for(int i=0;i<parts.length;i++) arr[i] = Integer.parseInt(parts[i].trim());\n");
        sb.append("            return arr;\n");
        sb.append("        }\n");
        sb.append("        return s;\n");
        sb.append("    }\n");
        sb.append("    private static void printRes(Object res) {\n");
        sb.append("        if (res instanceof int[]) {\n");
        sb.append("            System.out.println(Arrays.toString((int[])res).replace(\" \", \"\"));\n");
        sb.append("        } else {\n");
        sb.append("            System.out.println(res);\n");
        sb.append("        }\n");
        sb.append("    }\n");
        sb.append("}\n");
        return sb.toString();
    }
}

