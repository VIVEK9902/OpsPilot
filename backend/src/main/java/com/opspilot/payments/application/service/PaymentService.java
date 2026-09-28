package com.opspilot.payments.application.service;

public interface PaymentService {
    PaymentDetails getPaymentDetails(Long orderId);
}
