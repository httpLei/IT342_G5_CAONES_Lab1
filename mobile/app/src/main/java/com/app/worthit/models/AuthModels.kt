package com.app.worthit.models

// This matches the JSON fields your Spring Boot Controller expects
data class LoginRequest(
    val username: String,
    val password: String
)

// This matches what your backend returns (usually includes a JWT token)
data class LoginResponse(
    val token: String,
    val type: String = "Bearer",
    val username: String
)

data class RegisterRequest(
    val username: String,
    val email: String,
    val password: String
)