package com.opspilot.tickets.application.service;

import com.opspilot.shared.exception.ResourceNotFoundException;
import com.opspilot.tickets.api.dto.*;
import com.opspilot.tickets.domain.model.*;
import com.opspilot.tickets.domain.rules.TicketLifecycleManager;
import com.opspilot.tickets.infrastructure.repository.TicketNoteRepository;
import com.opspilot.tickets.infrastructure.repository.TicketRepository;
import com.opspilot.users.domain.model.Role;
import com.opspilot.users.domain.model.User;
import com.opspilot.users.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import io.micrometer.core.instrument.MeterRegistry;
import com.opspilot.audit.application.AuditService;
import com.opspilot.audit.domain.model.AuditAction;
import com.opspilot.audit.domain.model.AuditResult;
import com.opspilot.audit.domain.model.ResourceType;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final TicketNoteRepository ticketNoteRepository;
    private final UserRepository userRepository;
    private final TicketLifecycleManager lifecycleManager;
    private final AuditService auditService;
    private final MeterRegistry meterRegistry;

    @Transactional
    public TicketResponse createTicket(String currentUserEmail, TicketCreateRequest request) {
        User customer = getUserByEmail(currentUserEmail);

        Ticket ticket = Ticket.builder()
                .customer(customer)
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority())
                .category(request.getCategory())
                .status(TicketStatus.OPEN)
                .build();

        ticket = ticketRepository.save(ticket);
        if (meterRegistry != null) meterRegistry.counter("ticket.created").increment();
        return toResponse(ticket);
    }

    @Transactional(readOnly = true)
    public List<TicketResponse> getTickets(String currentUserEmail) {
        User user = getUserByEmail(currentUserEmail);
        List<Ticket> tickets;

        if (user.getRole() == Role.CUSTOMER) {
            tickets = ticketRepository.findByCustomerId(user.getId());
        } else {
            // Admin and Support Agent can see all for now (Phase 2 requirement)
            tickets = ticketRepository.findAll();
        }

        return tickets.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TicketResponse getTicket(String currentUserEmail, Long ticketId) {
        User user = getUserByEmail(currentUserEmail);
        Ticket ticket = getTicketById(ticketId);

        validateTicketAccess(user, ticket);

        return toResponse(ticket);
    }

    @Transactional
    public TicketResponse updateTicket(String currentUserEmail, Long ticketId, TicketUpdateRequest request) {
        User currentUser = getUserByEmail(currentUserEmail);
        Ticket ticket = getTicketById(ticketId);

        // Only Support/Admin can assign or update tickets dynamically.
        if (currentUser.getRole() == Role.CUSTOMER) {
            throw new AccessDeniedException("Customers cannot update ticket attributes directly");
        }

        if (request.getStatus() != null) {
            lifecycleManager.validateTransition(ticket.getStatus(), request.getStatus());
            ticket.setStatus(request.getStatus());
        }

        if (request.getPriority() != null) {
            ticket.setPriority(request.getPriority());
        }

        if (request.getCategory() != null) {
            ticket.setCategory(request.getCategory());
        }

        if (request.getAssignedAgentId() != null) {
            User assignedAgent = userRepository.findById(request.getAssignedAgentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Agent not found"));
            
            if (assignedAgent.getRole() == Role.CUSTOMER) {
                throw new IllegalArgumentException("Cannot assign ticket to a customer");
            }
            ticket.setAssignedAgent(assignedAgent);
        }

        ticket = ticketRepository.save(ticket);
        if (meterRegistry != null) meterRegistry.counter("ticket.updated").increment();
        return toResponse(ticket);
    }

    @Transactional
    public TicketNoteResponse addNote(String currentUserEmail, Long ticketId, TicketNoteRequest request) {
        User author = getUserByEmail(currentUserEmail);
        Ticket ticket = getTicketById(ticketId);

        if (author.getRole() == Role.CUSTOMER) {
            throw new AccessDeniedException("Customers cannot add internal notes");
        }

        TicketNote note = TicketNote.builder()
                .ticket(ticket)
                .author(author)
                .note(request.getNote())
                .build();

        note = ticketNoteRepository.save(note);
        return toNoteResponse(note);
    }

    @Transactional(readOnly = true)
    public List<TicketNoteResponse> getNotes(String currentUserEmail, Long ticketId) {
        User user = getUserByEmail(currentUserEmail);
        Ticket ticket = getTicketById(ticketId);
        
        validateTicketAccess(user, ticket);
        
        List<TicketNote> notes = ticketNoteRepository.findByTicketIdOrderByCreatedAtAsc(ticketId);
        return notes.stream().map(this::toNoteResponse).collect(Collectors.toList());
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Ticket getTicketById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
    }

    private void validateTicketAccess(User user, Ticket ticket) {
        if (user.getRole() == Role.CUSTOMER && !ticket.getCustomer().getId().equals(user.getId())) {
            throw new AccessDeniedException("Access denied to this ticket");
        }
    }

    private TicketResponse toResponse(Ticket ticket) {
        return TicketResponse.builder()
                .id(ticket.getId())
                .customerId(ticket.getCustomer().getId())
                .customerName(ticket.getCustomer().getName())
                .assignedAgentId(ticket.getAssignedAgent() != null ? ticket.getAssignedAgent().getId() : null)
                .assignedAgentName(ticket.getAssignedAgent() != null ? ticket.getAssignedAgent().getName() : null)
                .title(ticket.getTitle())
                .description(ticket.getDescription())
                .priority(ticket.getPriority())
                .status(ticket.getStatus())
                .category(ticket.getCategory())
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .build();
    }

    private TicketNoteResponse toNoteResponse(TicketNote note) {
        return TicketNoteResponse.builder()
                .id(note.getId())
                .ticketId(note.getTicket().getId())
                .authorId(note.getAuthor().getId())
                .authorName(note.getAuthor().getName())
                .note(note.getNote())
                .createdAt(note.getCreatedAt())
                .build();
    }
}
