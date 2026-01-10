package com.firestorm.stockmanagment.mapper

import com.firestorm.stockmanagment.dto.request.ProductRequest
import com.firestorm.stockmanagment.dto.response.ProductResponse
import com.firestorm.stockmanagment.model.Category
import com.firestorm.stockmanagment.model.Product

fun ProductRequest.toEntity(category: Category): Product =
    Product(
        name = this.name,
        description = this.description,
        price = this.price,
        stock = this.stock,
        category = category
    )

fun Product.toResponse(): ProductResponse =
    ProductResponse(
        id = this.id,
        name = this.name,
        description = this.description,
        price = this.price,
        stock = this.stock,
        categoryName = this.category?.name,
        categoryId = this.category?.id
    )