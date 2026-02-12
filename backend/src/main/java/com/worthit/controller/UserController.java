package com.worthit.controller;

import com.worthit.dto.UpdateBudgetRequest;
import com.worthit.dto.UserResponse;
import com.worthit.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {
    
    private final AuthService authService;
    
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        String username = authentication.getName();
        UserResponse user = authService.getCurrentUser(username);
        return ResponseEntity.ok(user);
    }
    
    @PutMapping("/budget")
    public ResponseEntity<UserResponse> updateMonthlyBudget(
            Authentication authentication,
            @Valid @RequestBody UpdateBudgetRequest request) {
        String username = authentication.getName();
        UserResponse updatedUser = authService.updateMonthlyBudget(username, request.getMonthlyBudget());
        return ResponseEntity.ok(updatedUser);
    }
}
