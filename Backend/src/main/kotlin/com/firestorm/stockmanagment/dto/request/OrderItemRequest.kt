package com.firestorm.stockmanagment.dto.request

data class OrderItemRequest (
    val productId: Long,
    val quantity: Int,
)