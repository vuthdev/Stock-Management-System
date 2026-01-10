package com.firestorm.stockmanagment.dto.request

data class OrderRequest(
    var userId: Long,
    var items: List<OrderItemRequest>,
)
