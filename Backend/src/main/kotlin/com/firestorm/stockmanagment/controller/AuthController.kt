package com.firestorm.stockmanagment.controller

import com.firestorm.stockmanagment.dto.request.LoginRequest
import com.firestorm.stockmanagment.dto.request.RegisterRequest
import com.firestorm.stockmanagment.dto.response.AuthResponse
import com.firestorm.stockmanagment.security.JwtTokenProvider
import com.firestorm.stockmanagment.service.UserService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@CrossOrigin
@RequestMapping("/api/v1/auth")
@RestController
class AuthController(
    private val authenticationManager: AuthenticationManager,
    private val userService: UserService,
    private val tokenProvider: JwtTokenProvider
) {
    /**
     * POST /api/auth/register
     * Register a new user
     */
    @PostMapping("/register")
    fun register(@Valid @RequestBody request: RegisterRequest): ResponseEntity<Any> {
        return try {
            val user = userService.registerUser(request)

            ResponseEntity.status(HttpStatus.CREATED).body(
                mapOf(
                    "message" to "User registered successfully!",
                    "username" to user.username
                )
            )
        } catch (ex: RuntimeException) {
            ResponseEntity.badRequest().body(
                mapOf("error" to ex.message)
            )
        }
    }

    /**
     * POST /api/auth/login
     * Authenticate user and return JWT token
     */
    @PostMapping("/login")
    fun login(@Valid @RequestBody request: LoginRequest): ResponseEntity<Any> {
        return try {
            // 1. Authenticate the user
            val authentication = authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken(
                    request.username,
                    request.password
                )
            )

            // 2. Set authentication in SecurityContext
            SecurityContextHolder.getContext().authentication = authentication

            // 3. Generate JWT token
            val jwt = tokenProvider.generateToken(authentication, request.rememberMe)

            // 4. Get user details
            val user = userService.findByUsername(request.username)
                ?: return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(mapOf("error" to "User not found"))

            // 5. Return token and user info
            val response = AuthResponse(
                token = jwt,
                username = user.username,
                email = user.email,
                roles = user.roles
            )

            ResponseEntity.ok(response)
        } catch (ex: Exception) {
            ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                mapOf("error" to "Invalid username or password")
            )
        }
    }

    /**
     * GET /api/auth/me
     * Get current authenticated user info
     * This endpoint requires authentication (JWT token)
     */
    @GetMapping("/me")
    fun getCurrentUser(): ResponseEntity<Any> {
        val authentication = SecurityContextHolder.getContext().authentication
        if (authentication == null || !authentication.isAuthenticated || authentication.name == "anonymousUser") {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(mapOf("error" to "Unauthorized"))
        }

        val user = userService.findByUsername(authentication.name)
            ?: return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(mapOf("error" to "User not found"))

        return ResponseEntity.ok(
            mapOf(
                "username" to user.username,
                "email" to user.email,
                "roles" to user.roles
            )
        )
    }
}