package com.firestorm.stockmanagment.service.impl

import com.firestorm.stockmanagment.mapper.toEntity
import com.firestorm.stockmanagment.mapper.toResponse
import com.firestorm.stockmanagment.dto.request.CategoryRequest
import com.firestorm.stockmanagment.dto.response.CategoryResponse
import com.firestorm.stockmanagment.repository.CategoryRepo
import com.firestorm.stockmanagment.service.CategoryService
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service

@Service
class CategoryServiceImpl(
    private val categoryRepo: CategoryRepo,
): CategoryService {
    override fun getAll(): List<CategoryResponse> = categoryRepo.findAll().map { it.toResponse() }

    override fun getById(id: Long): CategoryResponse =
        categoryRepo.findById(id).orElseThrow { RuntimeException("Category with id $id not found") }.toResponse()

    override fun save(category: CategoryRequest): CategoryResponse =
        categoryRepo.save(category.toEntity()).toResponse()

    @Transactional
    override fun update(request: CategoryRequest, id: Long): CategoryResponse {
        val category = categoryRepo.findById(id).orElseThrow { RuntimeException("Category with id ${id} not found") }

        category.name = request.name
        category.description = request.description

        return categoryRepo.save(category).toResponse()
    }

    @Transactional
    override fun delete(id: Long) =
        categoryRepo.deleteById(id)

}