package com.app.worthit.network

import com.app.worthit.models.LoginRequest
import com.app.worthit.models.LoginResponse
import com.app.worthit.models.RegisterRequest
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthService {

    @POST("api/auth/register")
    suspend fun register(@Body user: RegisterRequest): Response<Void>

    @POST("api/auth/login")
    suspend fun login(@Body credentials: LoginRequest): Response<LoginResponse>

    @POST("api/auth/logout")
    suspend fun logout(): Response<Void>
}