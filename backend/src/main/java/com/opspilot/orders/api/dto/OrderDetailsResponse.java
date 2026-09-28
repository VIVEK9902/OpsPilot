package com.opspilot.orders.api.dto;

import com.opspilot.orders.domain.model.OrderStatus;
import com.opspilot.orders.domain.model.PaymentStatus;
import com.opspilot.orders.domain.model.ShipmentStatus;
import com.opspilot.payments.application.service.PaymentDetails;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailsResponse {
    private Long id;
    private Long customerId;
    private String customerName;
    private OrderStatus status;
    private PaymentStatus paymentStatus;
    private ShipmentStatus shipmentStatus;
    private boolean cancellationEligible;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    
    // Abstracted mock payment details
    private PaymentDetails mockPaymentSummary;
}
