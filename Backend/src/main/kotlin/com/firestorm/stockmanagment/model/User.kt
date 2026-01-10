package com.firestorm.stockmanagment.model

import jakarta.persistence.CollectionTable
import jakarta.persistence.Column
import jakarta.persistence.ElementCollection
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.Table
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

@Table
@Entity(name = "users")
data class User (
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(unique = true, nullable = false)
    private var username: String,

    @Column(nullable = false)
    private var password: String?,

    @Column(nullable = false)
    var email: String,

    @Column(nullable = false)
    var gender: String,

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = [JoinColumn(name = "user_id")])
    @Column(name = "role")
    val roles: MutableSet<String> = mutableSetOf("ROLE_USER"),

    var profileImage: String? = null,
): UserDetails {
    override fun getAuthorities(): Collection<GrantedAuthority> =
        roles.map { role -> SimpleGrantedAuthority(role) }

    override fun getPassword(): String? = password

    fun changePassword(newPassword: String?) {
        this.password = newPassword
    }

    override fun getUsername(): String = username

    fun updateUsername(newUsername: String) {
        this.username = newUsername
    }

    override fun isAccountNonExpired(): Boolean = true

    override fun isAccountNonLocked(): Boolean = true

    override fun isCredentialsNonExpired(): Boolean = true

    override fun isEnabled(): Boolean = true
}