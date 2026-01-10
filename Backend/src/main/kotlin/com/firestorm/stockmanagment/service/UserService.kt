package com.firestorm.stockmanagment.service

import com.firestorm.stockmanagment.dto.request.ChangePasswordRequest
import com.firestorm.stockmanagment.dto.request.RegisterRequest
import com.firestorm.stockmanagment.dto.request.UpdateProfileRequest
import com.firestorm.stockmanagment.dto.response.UserResponse
import com.firestorm.stockmanagment.model.User
import org.springframework.core.io.Resource
import org.springframework.http.MediaType
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.web.multipart.MultipartFile

interface UserService : UserDetailsService {
    fun findAll(): List<UserResponse>
    fun findById(id: Long): UserResponse
    fun findByUsername(username: String?): User?
    fun updateProfile(user: UpdateProfileRequest, id: Long): UserResponse
    fun changePassword(request: ChangePasswordRequest, id: Long): UserResponse
    fun deleteById(id: Long)
    fun uploadProfileImage(id: Long, file: MultipartFile): UserResponse
    fun getProfileImage(id: Long): Pair<Resource, MediaType>
    fun registerUser(userRequest: RegisterRequest): User
}
