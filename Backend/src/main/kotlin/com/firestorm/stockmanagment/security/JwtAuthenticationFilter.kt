package com.firestorm.stockmanagment.security

import com.firestorm.stockmanagment.service.UserService
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.context.annotation.Lazy

/**
 * This filter runs on EVERY request
 * It checks for JWT in the Authorization header and validates it
 *
 * Think of it as a bouncer at a club checking IDs
 */
@Component
class JwtAuthenticationFilter(
    private val tokenProvider: JwtTokenProvider,
    @Lazy private val userService: UserService
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        try {
            // 1. Extract JWT from request header
            val jwt = getJwtFromRequest(request)

            // 2. If token exists and is valid
            if (jwt != null && tokenProvider.validateToken(jwt)) {
                // 3. Get username from token
                val username = tokenProvider.getUsernameFromToken(jwt)

                // 4. Load user details from database
                val userDetails = userService.loadUserByUsername(username)

                // 5. Create authentication object
                val authentication = UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.authorities
                )
                authentication.details = WebAuthenticationDetailsSource().buildDetails(request)

                // 6. Set authentication in SecurityContext
                // This tells Spring Security "this user is authenticated"
                SecurityContextHolder.getContext().authentication = authentication
            }
        } catch (ex: Exception) {
            logger.error("Could not set user authentication in security context", ex)
        }

        // 7. Continue the filter chain (pass to next filter)
        filterChain.doFilter(request, response)
    }

    /**
     * Extract JWT token from Authorization header
     * Expected format: "Bearer <token>"
     */
    private fun getJwtFromRequest(request: HttpServletRequest): String? {
        val bearerToken = request.getHeader("Authorization")

        return if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            bearerToken.substring(7) // Remove "Bearer " prefix
        } else {
            null
        }
    }
}