package com.firestorm.stockmanagment.mapper

import com.firestorm.stockmanagment.dto.response.UserResponse
import com.firestorm.stockmanagment.model.User

fun User.toResponse(): UserResponse =
    UserResponse(
        id = this.id,
        username = this.username,
        email = this.email,
        gender = this.gender,
        profileImage = this.profileImage,
    )