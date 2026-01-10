package com.firestorm.stockmanagment.dto.request

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class ChangePasswordRequest(
    @field:NotBlank
    var currentPassword: String,

    @field:NotBlank
    @field:Size(min = 6)
    var newPassword: String
)
