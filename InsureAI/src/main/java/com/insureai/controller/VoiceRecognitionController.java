package com.insureai.controller;

import com.insureai.model.VoiceQuery;
import com.insureai.service.VoiceRecognitionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/voice")
public class VoiceRecognitionController {

    @Autowired private VoiceRecognitionService voiceService;

    @PostMapping("/query")
    public ResponseEntity<String> handleVoice(@RequestBody VoiceQuery voiceQuery, Authentication auth) {
        String response = voiceService.processQuery(
                voiceQuery.getRole(),
                auth.getName(),
                voiceQuery.getQuery()
        );
        return ResponseEntity.ok(response);
    }
}
