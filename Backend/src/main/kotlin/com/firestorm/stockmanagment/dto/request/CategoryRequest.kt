package com.firestorm.stockmanagment.dto.request

import jakarta.validation.constraints.NotBlank

data class CategoryRequest(
    @field:NotBlank
    var name: String,
    var description: String,
)
