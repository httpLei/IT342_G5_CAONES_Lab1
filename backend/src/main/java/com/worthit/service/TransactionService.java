package com.worthit.service;

import com.worthit.dto.TransactionRequest;
import com.worthit.dto.TransactionResponse;
import com.worthit.model.Transaction;
import com.worthit.model.User;
import com.worthit.repository.TransactionRepository;
import com.worthit.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {
    
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public TransactionResponse createTransaction(String username, TransactionRequest request) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Transaction transaction = new Transaction();
        transaction.setAmount(request.getAmount());
        transaction.setCategory(request.getCategory());
        transaction.setDescription(request.getDescription());
        transaction.setUser(user);
        
        Transaction saved = transactionRepository.save(transaction);
        return TransactionResponse.fromEntity(saved);
    }
    
    @Transactional(readOnly = true)
    public List<TransactionResponse> getAllUserTransactions(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return transactionRepository.findByUserIdOrderByTransactionDateDesc(user.getId())
            .stream()
            .map(TransactionResponse::fromEntity)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<TransactionResponse> getCurrentMonthTransactions(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        YearMonth currentMonth = YearMonth.now();
        LocalDateTime startDate = currentMonth.atDay(1).atStartOfDay();
        LocalDateTime endDate = currentMonth.atEndOfMonth().atTime(23, 59, 59);
        
        return transactionRepository.findByUserIdAndDateRange(user.getId(), startDate, endDate)
            .stream()
            .map(TransactionResponse::fromEntity)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public TransactionResponse updateTransaction(Long transactionId, String username, TransactionRequest request) {
        Transaction transaction = transactionRepository.findById(transactionId)
            .orElseThrow(() -> new RuntimeException("Transaction not found"));
        
        // Verify ownership
        if (!transaction.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized to update this transaction");
        }
        
        transaction.setAmount(request.getAmount());
        transaction.setCategory(request.getCategory());
        transaction.setDescription(request.getDescription());
        
        Transaction updated = transactionRepository.save(transaction);
        return TransactionResponse.fromEntity(updated);
    }
    
    @Transactional
    public void deleteTransaction(Long transactionId, String username) {
        Transaction transaction = transactionRepository.findById(transactionId)
            .orElseThrow(() -> new RuntimeException("Transaction not found"));
        
        // Verify ownership
        if (!transaction.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized to delete this transaction");
        }
        
        transactionRepository.delete(transaction);
    }
}
