package com.firestorm.stockmanagment.dto.response

import java.math.BigDecimal

data class OrderItemResponse (
    val productName: String?,
    val unitPrice: BigDecimal,
    val quantity: Int,
    val totalPrice: BigDecimal,
)