package com.firestorm.stockmanagment.service.impl

import com.firestorm.stockmanagment.mapper.toResponse
import com.firestorm.stockmanagment.dto.request.OrderRequest
import com.firestorm.stockmanagment.dto.response.OrderResponse
import com.firestorm.stockmanagment.model.Order
import com.firestorm.stockmanagment.model.OrderItem
import com.firestorm.stockmanagment.repository.OrderRepo
import com.firestorm.stockmanagment.repository.ProductRepo
import com.firestorm.stockmanagment.repository.UserRepo
import com.firestorm.stockmanagment.service.OrderService
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class OrderServiceImpl(
    private val orderRepo: OrderRepo,
    private val productRepo: ProductRepo,
    private val userRepo: UserRepo,
): OrderService {
    override fun findAll(): List<OrderResponse> = orderRepo.findAll().map { it.toResponse() }

    override fun findById(id: Long): OrderResponse {
        val order = orderRepo.findById(id).orElseThrow { IllegalArgumentException("Order not found with id $id") }
        return order.toResponse()
    }

    @Transactional
    override fun createOrder(orderRequest: OrderRequest): OrderResponse {
        val user = userRepo.findById(orderRequest.userId).orElseThrow { IllegalArgumentException("User not found") }
        val order = Order(
            user = user,
            orderDate = LocalDateTime.now(),
        )

        orderRequest.items.forEach { item ->
            val productId = requireNotNull(item.productId) { "Product not found with id ${item.productId}" }
            val product = productRepo.findById(productId).orElseThrow { IllegalArgumentException("Product not found") }

            val orderItem = OrderItem(
                product = product,
                unitPrice = product.price,
                quantity = item.quantity,
            )

            orderItem.order = order
            order.items.add(orderItem)
        }

        order.totalPrice = order.items.sumOf { it.unitPrice * it.quantity.toBigDecimal() }

        return orderRepo.save(order).toResponse()
    }

    @Transactional
    override fun addItem(productId: Long, orderId: Long, quantity: Int): OrderResponse {
        val order = orderRepo.findById(orderId).orElseThrow { IllegalArgumentException("Order not found") }

        val product = productRepo.findById(productId).orElseThrow { IllegalArgumentException("Product not found") }

        val item = OrderItem(
            product = product,
            quantity = quantity,
            unitPrice = product.price,
        )

        item.order = order
        order.items.add(item)

        return order.toResponse()
    }

    @Transactional
    override fun removeItem(orderId: Long, itemId: Long): OrderResponse {
        val order = orderRepo.findById(orderId).orElseThrow { IllegalArgumentException("Order not found") }

        order.items.removeIf { it.id == itemId }
        return order.toResponse()
    }
}