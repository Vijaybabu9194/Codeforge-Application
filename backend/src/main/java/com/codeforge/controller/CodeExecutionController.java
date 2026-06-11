package com.codeforge.controller;

import com.codeforge.dto.SubmissionRequestDto.*;
import com.codeforge.service.CodeExecutionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
public class CodeExecutionController {

    private final CodeExecutionService codeExecutionService;

    @PostMapping
    public ResponseEntity<CodeRunResponse> executeCode(@RequestBody CodeRunRequest request) {
        return ResponseEntity.ok(codeExecutionService.runCode(request));
    }
}
