package com.opspilot.tickets.api.controller;

import com.opspilot.tickets.api.dto.*;
import com.opspilot.tickets.application.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @PostMapping
    public ResponseEntity<TicketResponse> createTicket(
            Authentication authentication,
            @Valid @RequestBody TicketCreateRequest request
    ) {
        TicketResponse response = ticketService.createTicket(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<TicketResponse>> getTickets(Authentication authentication) {
        return ResponseEntity.ok(ticketService.getTickets(authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketResponse> getTicket(
            Authentication authentication,
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(ticketService.getTicket(authentication.getName(), id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<TicketResponse> updateTicket(
            Authentication authentication,
            @PathVariable Long id,
            @RequestBody TicketUpdateRequest request
    ) {
        return ResponseEntity.ok(ticketService.updateTicket(authentication.getName(), id, request));
    }

    @PostMapping("/{id}/notes")
    public ResponseEntity<TicketNoteResponse> addNote(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody TicketNoteRequest request
    ) {
        TicketNoteResponse response = ticketService.addNote(authentication.getName(), id, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}/notes")
    public ResponseEntity<List<TicketNoteResponse>> getNotes(
            Authentication authentication,
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(ticketService.getNotes(authentication.getName(), id));
    }
}
