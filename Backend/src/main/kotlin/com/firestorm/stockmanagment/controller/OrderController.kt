package com.firestorm.stockmanagment.controller

import com.firestorm.stockmanagment.dto.request.OrderRequest
import com.firestorm.stockmanagment.dto.response.OrderResponse
import com.firestorm.stockmanagment.service.OrderService
import jakarta.validation.Valid
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@CrossOrigin
@RestController
@RequestMapping("/api/v1/orders")
class OrderController (
    private val orderService: OrderService
) {
    @GetMapping
    fun findAll(): List<OrderResponse> =
        orderService.findAll()

    @GetMapping("/{orderId}")
    fun findById(@PathVariable orderId: Long): OrderResponse =
        orderService.findById(orderId)

    @PostMapping
    fun createOrder(@Valid @RequestBody order: OrderRequest): ResponseEntity<OrderResponse> {
        return try {
            ResponseEntity.status(HttpStatus.CREATED).body(orderService.createOrder(order))
        } catch (e: Exception) {
            ResponseEntity.badRequest().body(null)
        }
    }

    @PostMapping("/{orderId}/items")
    fun addItem(@PathVariable orderId: Long, @RequestParam productId: Long, @RequestParam quantity: Int): ResponseEntity<OrderResponse> =
        ResponseEntity.ok(orderService.addItem(orderId, productId, quantity))

    @DeleteMapping("/{orderId}/items/{itemId}")
    fun deleteItem(@PathVariable orderId: Long, @PathVariable itemId: Long): OrderResponse =
        orderService.removeItem(orderId, itemId)
}