package com.opspilot.orders.application.service;

import com.opspilot.orders.api.dto.OrderDetailsResponse;
import com.opspilot.orders.domain.model.Order;
import com.opspilot.orders.domain.model.OrderStatus;
import com.opspilot.orders.infrastructure.repository.OrderRepository;
import com.opspilot.payments.application.service.PaymentDetails;
import com.opspilot.payments.application.service.PaymentService;
import com.opspilot.shared.exception.ResourceNotFoundException;
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

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final PaymentService paymentService;
    private final AuditService auditService;
    private final MeterRegistry meterRegistry;

    @Transactional(readOnly = true)
    public java.util.List<OrderDetailsResponse> getMyOrders(String currentUserEmail) {
        User user = getUserByEmail(currentUserEmail);
        java.util.List<Order> orders = (user.getRole() == Role.CUSTOMER) 
            ? orderRepository.findByCustomerId(user.getId()) 
            : orderRepository.findAll();
            
        return orders.stream()
                .map(order -> {
                    PaymentDetails paymentDetails = paymentService.getPaymentDetails(order.getId());
                    return toResponse(order, paymentDetails);
                })
                .collect(java.util.stream.Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderDetailsResponse getOrderDetails(String currentUserEmail, Long orderId) {
        User user = getUserByEmail(currentUserEmail);
        Order order = getOrderById(orderId);

        validateOrderAccess(user, order);

        // Fetch payment details through abstraction
        PaymentDetails paymentDetails = paymentService.getPaymentDetails(orderId);

        return toResponse(order, paymentDetails);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    }

    private void validateOrderAccess(User user, Order order) {
        if (user.getRole() == Role.CUSTOMER && !order.getCustomer().getId().equals(user.getId())) {
            throw new AccessDeniedException("Access denied to this order");
        }
    }

    private OrderDetailsResponse toResponse(Order order, PaymentDetails paymentDetails) {
        return OrderDetailsResponse.builder()
                .id(order.getId())
                .customerId(order.getCustomer().getId())
                .customerName(order.getCustomer().getName())
                .status(order.getStatus())
                .paymentStatus(order.getPaymentStatus())
                .shipmentStatus(order.getShipmentStatus())
                .cancellationEligible(order.isCancellationEligible())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .mockPaymentSummary(paymentDetails)
                .build();
    }

    @Transactional
    public void cancelOrder(String currentUserEmail, Long orderId) {
        User user = getUserByEmail(currentUserEmail);
        Order order = getOrderById(orderId);

        if (user.getRole() == Role.CUSTOMER && !order.getCustomer().getId().equals(user.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("You do not have permission to cancel this order.");
        }

        if (order.getStatus() == OrderStatus.CANCELLED) {
            return; // idempotent
        }

        if (!order.isCancellationEligible()) {
            meterRegistry.counter("order.cancellation.failure").increment();
            auditService.record(user.getId(), AuditAction.ORDER_CANCELLATION_REJECTED, ResourceType.ORDER, order.getId().toString(), AuditResult.REJECTED, "Order not eligible");
            throw new IllegalStateException("Order is not eligible for cancellation.");
        }

        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
        meterRegistry.counter("order.cancellation.success").increment();
        auditService.record(user.getId(), AuditAction.ORDER_CANCELLATION_EXECUTED, ResourceType.ORDER, order.getId().toString(), AuditResult.SUCCESS, "Order cancelled successfully");
    }
}
