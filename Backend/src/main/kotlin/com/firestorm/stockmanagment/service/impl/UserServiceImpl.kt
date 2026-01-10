package com.firestorm.stockmanagment.service.impl

import com.firestorm.stockmanagment.dto.request.ChangePasswordRequest
import com.firestorm.stockmanagment.dto.request.RegisterRequest
import com.firestorm.stockmanagment.dto.request.UpdateProfileRequest
import com.firestorm.stockmanagment.dto.response.UserResponse
import com.firestorm.stockmanagment.mapper.toResponse
import com.firestorm.stockmanagment.model.User
import com.firestorm.stockmanagment.repository.UserRepo
import com.firestorm.stockmanagment.service.UserService
import jakarta.transaction.Transactional
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.io.FileSystemResource
import org.springframework.core.io.Resource
import org.springframework.http.MediaType
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.io.File
import java.nio.file.Files
import java.util.UUID

@Service
class UserServiceImpl(
    private val userRepo: UserRepo,
    private val passwordEncoder: PasswordEncoder
): UserService {
    @Value("\${file.upload-dir}")
    private lateinit var uploadFolder: String

    override fun findAll(): List<UserResponse> = userRepo.findAll().map { it.toResponse() }

    override fun findById(id: Long): UserResponse {
        val user = userRepo.findById(id).orElseThrow { RuntimeException("User with id $id not found") }
        return user.toResponse()
    }

    @Transactional
    override fun loadUserByUsername(username: String): UserDetails {
        return userRepo.findByUsername(username)
            ?: throw UsernameNotFoundException("User not found with username: $username")
    }

    override fun findByUsername(username: String?): User? {
        return if (username != null) {
            userRepo.findByUsername(username)
        } else {
            null
        }
    }

    @Transactional
    override fun registerUser(request: RegisterRequest): User {
        // Check if username already exists
        if (userRepo.existsByUsername(request.username)) {
            throw RuntimeException("Username is already taken!")
        }

        // Check if email already exists
        if (userRepo.existsByEmail(request.email)) {
            throw RuntimeException("Email is already in use!")
        }

        // Create new user with encoded password
        val user = User(
            username = request.username,
            email = request.email,
            password = passwordEncoder.encode(request.password), // Hash the password!
            gender = request.gender,
            roles = mutableSetOf("ROLE_USER")
        )

        return userRepo.save(user)
    }

    override fun updateProfile(
        request: UpdateProfileRequest,
        id: Long
    ): UserResponse {
        val user = userRepo.findById(id).orElseThrow { RuntimeException("User with id $id not found") }

        user.updateUsername(request.username)
        user.email = request.email
        user.gender = request.gender

        return userRepo.save(user).toResponse()
    }

    override fun changePassword(
        request: ChangePasswordRequest,
        id: Long
    ): UserResponse {
        val user = userRepo.findById(id).orElseThrow { RuntimeException("User with id $id not found") }

        if(!passwordEncoder.matches(request.currentPassword, user.password)) {
            throw RuntimeException("Password is incorrect!")
        }

        user.changePassword(passwordEncoder.encode(request.newPassword))

        return userRepo.save(user).toResponse()
    }

    override fun deleteById(id: Long) {
        return userRepo.deleteById(id)
    }

    override fun uploadProfileImage(
        id: Long,
        file: MultipartFile
    ): UserResponse {
        val user = userRepo.findById(id).orElseThrow { RuntimeException("User with id $id not found") }

        if (file.isEmpty) {
            throw RuntimeException("File is empty")
        }

        if(file.contentType?.startsWith("image/") != true) {
            throw RuntimeException("File must be a image!")
        }

        // if folder not exist create one
        val folder = File(uploadFolder)
        if(!folder.exists() && !folder.mkdirs()) {
            throw RuntimeException("Could not create upload directory")
        }

        // randomly uuid with name
        val originalName = file.originalFilename ?: "image"
        val uniqueFileName = "${UUID.randomUUID()}-$originalName"

        // transfer image file to folder
        val destinationFile = File(folder, uniqueFileName)
        println("Saving file to: ${File(uploadFolder).absolutePath}")
        file.transferTo(destinationFile)

        // set file name to entity
        user.profileImage = uniqueFileName
        return userRepo.save(user).toResponse()
    }

    override fun getProfileImage(id: Long): Pair<Resource, MediaType> {
        val user = userRepo.findById(id).orElseThrow { RuntimeException("User with id $id not found") }

        val fileName = user.profileImage ?: throw Exception("ProfileImage not found")
        val file = File(uploadFolder, fileName)
        if(!file.exists()) {
            throw RuntimeException("File does not exist")
        }

        val resource = FileSystemResource(file)
        val contentType = Files.probeContentType(file.toPath()) ?: "application/octet-stream"
        return resource to MediaType.parseMediaType(contentType)
    }
}