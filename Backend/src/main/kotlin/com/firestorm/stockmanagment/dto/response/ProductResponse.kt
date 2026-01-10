package com.firestorm.stockmanagment.dto.response

import java.math.BigDecimal

data class ProductResponse(
    val id: Long? = null,
    var name: String?,
    var description: String?,
    var price: BigDecimal,
    var stock: Int,
    var categoryName: String?,
    var categoryId: Long?,
)
