package com.firestorm.stockmanagment.config

import com.firestorm.stockmanagment.security.JwtAuthenticationFilter
import com.firestorm.stockmanagment.service.UserService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.dao.DaoAuthenticationProvider
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
class SecurityConfig{

    /**
     * Configure HTTP security
     * This is the main security configuration
     */
    @Bean
    fun securityFilterChain(
        http: HttpSecurity,
        jwtAuthFilter: JwtAuthenticationFilter,
        authenticationProvider: DaoAuthenticationProvider
    ): SecurityFilterChain {
        http
            .csrf { it.disable() }
            .sessionManagement {
                it.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            }
//            .authorizeHttpRequests { auth ->
//                auth
//                    .requestMatchers("/api/auth/**", "/h2-console/**").permitAll()
//                    .anyRequest().authenticated()
//            }
            .authorizeHttpRequests { auth ->
                auth.anyRequest().permitAll()  // Allow everything temporarily
            }
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter::class.java)

        http.headers { it.frameOptions { frameOptions -> frameOptions.sameOrigin() } }

        return http.build()
    }

    /**
     * Password encoder - uses BCrypt hashing
     * Never store plain text passwords!
     */
    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()

    /**
     * Authentication provider - tells Spring how to authenticate users
     */
    @Bean
    fun authenticationProvider(
        passwordEncoder: PasswordEncoder,
        userService: UserService  // Inject here instead
    ): DaoAuthenticationProvider {
        val provider = DaoAuthenticationProvider(userService)
        provider.setPasswordEncoder(passwordEncoder)
        return provider
    }

    /**
     * Authentication manager - manages the authentication process
     */
    @Bean
    fun authenticationManager(config: AuthenticationConfiguration): AuthenticationManager {
        return config.authenticationManager
    }
}