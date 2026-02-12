package com.worthit.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateBudgetRequest {
    
    @NotNull(message = "Monthly budget is required")
    @Min(value = 0, message = "Monthly budget must be 0 or greater")
    private Double monthlyBudget;
}
