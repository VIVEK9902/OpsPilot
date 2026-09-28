package com.opspilot.shared.infrastructure.web;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CorrelationIdFilter implements Filter {

    private static final String CORRELATION_ID_HEADER_NAME = "X-Correlation-Id";
    private static final String CORRELATION_ID_LOG_VAR_NAME = "correlationId";

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String correlationId = httpRequest.getHeader(CORRELATION_ID_HEADER_NAME);

        if (correlationId == null || correlationId.trim().isEmpty()) {
            correlationId = UUID.randomUUID().toString();
        } else {
            // Basic sanitization
            correlationId = correlationId.replaceAll("[^a-zA-Z0-9-]", "");
            if (correlationId.length() > 50) {
                correlationId = correlationId.substring(0, 50);
            }
        }

        CorrelationIdContext.setCorrelationId(correlationId);
        MDC.put(CORRELATION_ID_LOG_VAR_NAME, correlationId);

        try {
            chain.doFilter(request, response);
        } finally {
            CorrelationIdContext.clear();
            MDC.remove(CORRELATION_ID_LOG_VAR_NAME);
        }
    }
}
