package com.firestorm.stockmanagment.service

import com.firestorm.stockmanagment.dto.request.OrderRequest
import com.firestorm.stockmanagment.dto.response.OrderResponse
import com.firestorm.stockmanagment.model.Order
import java.util.Optional

interface OrderService {
    fun findAll(): List<OrderResponse>
    fun findById(id: Long): OrderResponse
    fun createOrder(order: OrderRequest): OrderResponse
    fun addItem(productId: Long, orderId: Long, quantity: Int): OrderResponse
    fun removeItem(orderId: Long, itemId: Long): OrderResponse
}