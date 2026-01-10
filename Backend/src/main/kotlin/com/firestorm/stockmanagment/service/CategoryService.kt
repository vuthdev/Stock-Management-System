package com.firestorm.stockmanagment.service

import com.firestorm.stockmanagment.dto.request.CategoryRequest
import com.firestorm.stockmanagment.dto.response.CategoryResponse
import com.firestorm.stockmanagment.model.Category

interface CategoryService {
    fun getAll(): List<CategoryResponse>
    fun getById(id: Long): CategoryResponse
    fun save(category: CategoryRequest): CategoryResponse
    fun update(category: CategoryRequest, id: Long): CategoryResponse
    fun delete(id: Long)
}