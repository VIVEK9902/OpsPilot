package com.opspilot.knowledge.application.service;

import org.springframework.stereotype.Component;

@Component
public class DocumentCleaner {
    
    public String clean(String rawContent) {
        if (rawContent == null) return "";
        
        // Normalize whitespace: replace multiple spaces with single space
        // Replace 3+ newlines with exactly 2 newlines (paragraph separator)
        String cleaned = rawContent
            .replaceAll("(?m)^[ \t]*\r?\n", "\n") // remove blank lines with just spaces
            .replaceAll("\n{3,}", "\n\n")         // max 2 newlines
            .replaceAll("[ \t]{2,}", " ")           // max 1 space
            .trim();
            
        return cleaned;
    }
}
