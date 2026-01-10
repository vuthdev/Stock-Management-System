package com.firestorm.stockmanagment.dto.request

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class UpdateProfileRequest(
    @field:NotBlank
    @field:Size(min = 3, max = 50, message = "Name must between 3 and 50 characters")
    var username: String,

    @field:Email
    var email: String,

    @field:NotBlank
    var gender: String,

    val profileImage: String? = null,
)