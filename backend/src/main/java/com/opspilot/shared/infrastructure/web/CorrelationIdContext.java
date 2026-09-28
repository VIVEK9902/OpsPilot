package com.opspilot.shared.infrastructure.web;

public class CorrelationIdContext {
    private static final ThreadLocal<String> CORRELATION_ID = new ThreadLocal<>();

    public static void setCorrelationId(String id) {
        CORRELATION_ID.set(id);
    }

    public static String getCorrelationId() {
        return CORRELATION_ID.get();
    }

    public static void clear() {
        CORRELATION_ID.remove();
    }
}
