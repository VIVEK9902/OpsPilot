package com.opspilot.payments.application.service;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDetails {
    private Long orderId;
    private String gatewayTransactionId;
    private String paymentMethod;
    private String status;
    private OffsetDateTime processedAt;
}
