package com.app.worthit.network

import com.app.worthit.models.AuthResponse
import com.app.worthit.models.LoginRequest
import com.app.worthit.models.RegisterRequest
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthService {
    @POST("api/auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<Void>

    @POST("api/auth/login")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>
}