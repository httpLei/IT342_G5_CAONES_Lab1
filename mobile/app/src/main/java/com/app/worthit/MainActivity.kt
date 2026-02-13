package com.app.worthit

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Check if the user is logged in using SharedPreferences
        val sharedPref = getSharedPreferences("WorthItPrefs", MODE_PRIVATE)
        val isLoggedIn = sharedPref.getBoolean("isLoggedIn", false)

        if (!isLoggedIn) {
            // If not logged in, send them to the Login screen
            startActivity(Intent(this, LoginActivity::class.java))
            finish() // Prevent them from coming back to this screen
            return
        }

        val logoutBtn = findViewById<Button>(R.id.btnLogout)
        logoutBtn.setOnClickListener {
            val sharedPref = getSharedPreferences("WorthItPrefs", MODE_PRIVATE)
            with(sharedPref.edit()) {
                clear() // This removes the "isLoggedIn" status and any saved tokens
                apply()
            }

            Toast.makeText(this, "Logged out successfully", Toast.LENGTH_SHORT).show()

            // Redirect back to Login
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
        }

    }
}