package com.firestorm.stockmanagment.dto.response

import java.math.BigDecimal
import java.time.LocalDateTime

data class OrderResponse(
    val id: Long?,
    val userName: String,
    val items: List<OrderItemResponse>,
    val totalAmount: BigDecimal,
    val orderDate: String,
)
