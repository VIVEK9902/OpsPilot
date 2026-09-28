package com.opspilot.payments.application.service;

import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
public class MockPaymentService implements PaymentService {

    @Override
    public PaymentDetails getPaymentDetails(Long orderId) {
        // Deterministic mock payment behavior based on orderId
        // In a real app, this would query a payment gateway API.
        
        String mockTransactionId = "txn_mock_" + orderId + "_" + UUID.nameUUIDFromBytes(String.valueOf(orderId).getBytes()).toString().substring(0, 8);
        String mockMethod = (orderId % 2 == 0) ? "CREDIT_CARD" : "PAYPAL";
        String mockStatus = (orderId % 5 == 0) ? "PENDING" : "COMPLETED";

        return PaymentDetails.builder()
                .orderId(orderId)
                .gatewayTransactionId(mockTransactionId)
                .paymentMethod(mockMethod)
                .status(mockStatus)
                .processedAt(OffsetDateTime.now().minusDays(1)) // Just a mock timestamp
                .build();
    }
}
