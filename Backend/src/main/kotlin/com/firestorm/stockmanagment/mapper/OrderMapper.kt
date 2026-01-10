package com.firestorm.stockmanagment.mapper

import com.firestorm.stockmanagment.dto.response.OrderItemResponse
import com.firestorm.stockmanagment.dto.response.OrderResponse
import com.firestorm.stockmanagment.model.Order
import com.firestorm.stockmanagment.model.OrderItem
import java.time.format.DateTimeFormatter

private val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")

fun OrderItem.toResponse(): OrderItemResponse {
    val product = requireNotNull(this.product) {
        "Product is null."
    }

    return OrderItemResponse(
        productName = product.name,
        quantity = this.quantity,
        unitPrice = this.unitPrice,
        totalPrice = this.unitPrice * this.quantity.toBigDecimal()
    )
}

fun Order.toResponse(): OrderResponse {
    val user = requireNotNull(this.user) {
        "User is null."
    }

    return OrderResponse(
        id = this.id!!,
        userName = user.username,
        items = this.items.map { it.toResponse() }.toList(),
        totalAmount = this.items.sumOf { it.totalPrice },
        orderDate = this.orderDate.format(formatter) ?: "N/A",
    )
}
