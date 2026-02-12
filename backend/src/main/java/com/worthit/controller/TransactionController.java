package com.worthit.controller;

import com.worthit.dto.TransactionRequest;
import com.worthit.dto.TransactionResponse;
import com.worthit.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class TransactionController {
    
    private final TransactionService transactionService;
    
    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(
            Authentication authentication,
            @Valid @RequestBody TransactionRequest request) {
        String username = authentication.getName();
        TransactionResponse response = transactionService.createTransaction(username, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getAllTransactions(Authentication authentication) {
        String username = authentication.getName();
        List<TransactionResponse> transactions = transactionService.getAllUserTransactions(username);
        return ResponseEntity.ok(transactions);
    }
    
    @GetMapping("/current-month")
    public ResponseEntity<List<TransactionResponse>> getCurrentMonthTransactions(Authentication authentication) {
        String username = authentication.getName();
        List<TransactionResponse> transactions = transactionService.getCurrentMonthTransactions(username);
        return ResponseEntity.ok(transactions);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponse> updateTransaction(
            @PathVariable Long id,
            Authentication authentication,
            @Valid @RequestBody TransactionRequest request) {
        String username = authentication.getName();
        TransactionResponse response = transactionService.updateTransaction(id, username, request);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(
            @PathVariable Long id,
            Authentication authentication) {
        String username = authentication.getName();
        transactionService.deleteTransaction(id, username);
        return ResponseEntity.noContent().build();
    }
}
