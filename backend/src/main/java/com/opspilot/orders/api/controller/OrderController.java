package com.opspilot.orders.api.controller;

import com.opspilot.orders.api.dto.OrderDetailsResponse;
import com.opspilot.orders.application.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<java.util.List<OrderDetailsResponse>> getMyOrders(Authentication authentication) {
        return ResponseEntity.ok(orderService.getMyOrders(authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDetailsResponse> getOrder(
            Authentication authentication,
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(orderService.getOrderDetails(authentication.getName(), id));
    }
}
