package com.firestorm.stockmanagment.service.impl

import com.firestorm.stockmanagment.mapper.toEntity
import com.firestorm.stockmanagment.mapper.toResponse
import com.firestorm.stockmanagment.dto.request.ProductRequest
import com.firestorm.stockmanagment.dto.response.ProductResponse
import com.firestorm.stockmanagment.repository.CategoryRepo
import com.firestorm.stockmanagment.repository.ProductRepo
import com.firestorm.stockmanagment.service.ProductService
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service

@Service
class ProductServiceImpl(
    private val productRepo: ProductRepo,
    private val categoryRepo: CategoryRepo
): ProductService {
    override fun findAll(): List<ProductResponse> = productRepo.findAll().map { it.toResponse() }

    override fun findById(id: Long): ProductResponse {
        val product = productRepo.findById(id).orElseThrow { RuntimeException("Product with id $id not found") }.toResponse()
        return product
    }

    override fun save(product: ProductRequest): ProductResponse {
        val category = categoryRepo.findById(product.categoryId).orElseThrow { RuntimeException("Category with id ${product.categoryId} not found") }
        return productRepo.save(product.toEntity(category)).toResponse()
    }

    @Transactional
    override fun update(request: ProductRequest, id: Long): ProductResponse {
        val product = productRepo.findById(id).orElseThrow { RuntimeException("Product with id $id not found") }
        val category = categoryRepo.findById(request.categoryId).orElseThrow { RuntimeException("Category not found") }

        product.name = request.name
        product.description = request.description
        product.stock = request.stock
        product.price = request.price
        product.category = category

        return productRepo.save(product).toResponse()
    }

    @Transactional
    override fun delete(id: Long) {
        productRepo.deleteById(id)
    }
}