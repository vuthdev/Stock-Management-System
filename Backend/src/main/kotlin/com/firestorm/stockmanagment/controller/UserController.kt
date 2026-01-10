package com.firestorm.stockmanagment.controller

import com.firestorm.stockmanagment.dto.response.UserResponse
import com.firestorm.stockmanagment.service.UserService
import io.jsonwebtoken.io.IOException
import org.springframework.core.io.Resource
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile

@CrossOrigin
@RestController
@RequestMapping("/api/v1/users")
class UserController (
    private val userService: UserService
) {
    @GetMapping
    fun getAllUsers(): ResponseEntity<List<UserResponse>> {
        return ResponseEntity.ok(userService.findAll())
    }

    @GetMapping("/{id}")
    fun getUserById(@PathVariable("id") id: Long): UserResponse {
        val user = userService.findById(id)
        return user
    }

    @DeleteMapping("/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteUser(@PathVariable userId: Long) =
        userService.deleteById(userId)

    @PostMapping("/{userId}/profileImage")
    fun uploadUserImage(@PathVariable userId: Long, @RequestParam("file") file: MultipartFile): ResponseEntity<UserResponse> {
        return try {
            ResponseEntity.ok(userService.uploadProfileImage(userId, file))
        } catch (e: IOException) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading profile image: ${e.message}")
        } as ResponseEntity<UserResponse>
    }

    @GetMapping("/{userId}/profileImage")
    fun getUserImage(@PathVariable userId: Long): ResponseEntity<Resource> {
        val (resource, mediaType) = userService.getProfileImage(userId)
        return ResponseEntity.ok().contentType(mediaType).body(resource)
    }
}