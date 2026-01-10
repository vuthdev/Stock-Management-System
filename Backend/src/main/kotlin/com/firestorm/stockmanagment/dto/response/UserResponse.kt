package com.firestorm.stockmanagment.dto.response

data class UserResponse(
    val id: Long,
    var username: String?,
    var email: String,
    var gender: String,
    var profileImage: String?,
)