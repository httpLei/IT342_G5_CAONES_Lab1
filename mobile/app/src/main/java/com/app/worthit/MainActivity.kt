package com.app.worthit

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import com.google.android.material.bottomnavigation.BottomNavigationView

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val navView: BottomNavigationView = findViewById(R.id.bottom_navigation)

        navView.setOnItemSelectedListener { item ->
            var selectedFragment: Fragment = DashboardFragment()
            when (item.itemId) {
                R.id.navigation_dashboard -> {
                    selectedFragment = DashboardFragment()
                }
                R.id.navigation_profile -> {
                    selectedFragment = ProfileFragment()
                }
                R.id.navigation_settings -> {
                    selectedFragment = SettingsFragment()
                }
            }
            supportFragmentManager.beginTransaction().replace(R.id.fragment_container, selectedFragment).commit()
            true
        }

        if (savedInstanceState == null) {
            supportFragmentManager.beginTransaction().replace(R.id.fragment_container, DashboardFragment()).commit()
        }
    }
}