package com.firestorm.stockmanagment.dto.request

import com.firestorm.stockmanagment.model.Product
import jakarta.validation.constraints.NotBlank
import java.math.BigDecimal

data class ProductRequest(
    @field:NotBlank
    var name: String,
    var description: String? = null,

    @field:NotBlank
    var price: BigDecimal,

    @field:NotBlank
    var stock: Int,

    @field:NotBlank
    var categoryId: Long
)
