package com.firestorm.stockmanagment.service

import com.firestorm.stockmanagment.dto.request.ProductRequest
import com.firestorm.stockmanagment.dto.response.ProductResponse

interface ProductService {
    fun findAll(): List<ProductResponse>
    fun findById(id: Long): ProductResponse
    fun save(product: ProductRequest): ProductResponse
    fun update(product: ProductRequest, id: Long): ProductResponse
    fun delete(id: Long)
}