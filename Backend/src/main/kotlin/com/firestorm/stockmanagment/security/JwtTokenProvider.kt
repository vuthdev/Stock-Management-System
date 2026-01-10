package com.firestorm.stockmanagment.security

import io.jsonwebtoken.ExpiredJwtException
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.MalformedJwtException
import io.jsonwebtoken.UnsupportedJwtException
import io.jsonwebtoken.security.Keys
import io.jsonwebtoken.security.SignatureAlgorithm
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.authorization.AuthenticatedAuthorizationManager.rememberMe
import org.springframework.security.core.Authentication
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Component
import java.util.Date
import javax.crypto.SecretKey

/**
 * This class handles JWT token creation, validation, and parsing
 * Think of it as your "JWT factory"
 */
@Component
class JwtTokenProvider(
    @Value("\${jwt.secret}") private val jwtSecret: String,
    @Value("\${jwt.expiration}") private val jwtExpiration: Long,
    @Value("\${jwt.expiration-remember-me:604800000}") private val jwtExpirationRememberMe: Long
) {
    // Create a secure key from the secret string
    private val key: SecretKey = Keys.hmacShaKeyFor(jwtSecret.toByteArray())

    /**
     * Generate JWT token from authentication object
     * This happens after successful login
     */
    fun generateToken(authentication: Authentication, rememberMe: Boolean = false): String {
        val userPrincipal = authentication.principal as UserDetails
        val now = Date()

        val expiration = if (rememberMe)
            Date(now.time + jwtExpirationRememberMe)   // long-lived
        else
            Date(now.time + jwtExpiration)             // short-lived

        return Jwts.builder()
            .subject(userPrincipal.username)
            .issuedAt(now)
            .expiration(expiration)
            .signWith(key)
            .compact()
    }


    /**
     * Extract username from JWT token
     */
    fun getUsernameFromToken(token: String): String {
        val claims = Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token)
            .payload
        return claims.subject
    }

    /**
     * Validate the JWT token
     * Checks signature, expiration, and format
     */
    fun validateToken(token: String): Boolean {
        try {
            Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
            return true
        } catch (ex: SecurityException) {
            println("Invalid JWT signature")
        } catch (ex: MalformedJwtException) {
            println("Invalid JWT token")
        } catch (ex: ExpiredJwtException) {
            println("Expired JWT token")
        } catch (ex: UnsupportedJwtException) {
            println("Unsupported JWT token")
        } catch (ex: IllegalArgumentException) {
            println("JWT claims string is empty")
        }
        return false
    }
}