package com.opspilot.tickets.infrastructure.repository;

import com.opspilot.tickets.domain.model.TicketNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TicketNoteRepository extends JpaRepository<TicketNote, Long> {
    List<TicketNote> findByTicketIdOrderByCreatedAtAsc(Long ticketId);
}
