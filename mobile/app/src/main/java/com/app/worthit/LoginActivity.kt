package com.app.worthit


import android.content.Intent
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.app.worthit.models.LoginRequest
import com.app.worthit.network.RetrofitClient
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class LoginActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        val usernameField = findViewById<EditText>(R.id.etUsername)
        val passwordField = findViewById<EditText>(R.id.etPassword)
        val loginBtn = findViewById<Button>(R.id.btnLogin)

        loginBtn.setOnClickListener {
            val user = usernameField.text.toString()
            val pass = passwordField.text.toString()

            if (user.isNotEmpty() && pass.isNotEmpty()) {
                loginUser(LoginRequest(user, pass))
            } else {
                Toast.makeText(this, "Please fill all fields", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun loginUser(request: LoginRequest) {
        // Run network call in a background thread
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = RetrofitClient.instance.login(request)
                withContext(Dispatchers.Main) {
                    if (response.isSuccessful) {
                        Toast.makeText(this@LoginActivity, "Success!", Toast.LENGTH_SHORT).show()
                        // TODO: Save token to SharedPreferences here
                        startActivity(Intent(this@LoginActivity, MainActivity::class.java))
                        finish()
                    } else {
                        Toast.makeText(this@LoginActivity, "Login Failed", Toast.LENGTH_SHORT).show()
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@LoginActivity, "Error: ${e.message}", Toast.LENGTH_LONG).show()
                }
            }
        }

        // Inside your login success block:
        val sharedPref = getSharedPreferences("WorthItPrefs", MODE_PRIVATE)
        with(sharedPref.edit()) {
            putBoolean("isLoggedIn", true)
            apply()
        }
    }
}