package com.firestorm.stockmanagment.dto.response

data class AuthResponse(
    val token: String,
    val type: String = "Bearer",
    val username: String,
    val email: String,
    val roles: Set<String>,
)
