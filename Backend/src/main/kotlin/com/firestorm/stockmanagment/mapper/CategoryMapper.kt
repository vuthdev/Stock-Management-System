package com.firestorm.stockmanagment.mapper

import com.firestorm.stockmanagment.dto.request.CategoryRequest
import com.firestorm.stockmanagment.dto.response.CategoryResponse
import com.firestorm.stockmanagment.model.Category

fun CategoryRequest.toEntity(): Category =
    Category(
        name = name,
        description = description,
    )

fun Category.toResponse(): CategoryResponse =
    CategoryResponse(
        id = id,
        name = name,
        description = description,
    )