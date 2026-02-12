import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { transactionService } from '../services/transactionService';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('budget');
  
  // Budget Goal State
  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');
  
  // Expense Tracking State
  const [transactions, setTransactions] = useState([]);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    category: 'need',
    description: '',
  });
  
  // Logout Confirmation State
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // Delete Confirmation State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await authService.getCurrentUser();
        setUserData(data);
        
        // Load transactions from database
        const transactionsData = await transactionService.getCurrentMonthTransactions();
        setTransactions(transactionsData);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Calculate expense metrics
  const calculateExpenses = () => {
    const needs = transactions.filter(t => t.category === 'need').reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const wants = transactions.filter(t => t.category === 'want').reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const microWants = transactions.filter(t => t.category === 'want' && parseFloat(t.amount) < 200).reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const splurges = transactions.filter(t => t.category === 'want' && parseFloat(t.amount) >= 200).reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const totalSpent = needs + wants;
    
    return {
      needs,
      wants,
      microWants,
      splurges,
      totalSpent,
      needsPercentage: totalSpent > 0 ? (needs / totalSpent * 100).toFixed(1) : 0,
      wantsPercentage: totalSpent > 0 ? (wants / totalSpent * 100).toFixed(1) : 0,
    };
  };

  const expenses = calculateExpenses();

  const handleQuickAdd = async () => {
    if (!newTransaction.amount || parseFloat(newTransaction.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      const transactionData = {
        amount: parseFloat(newTransaction.amount),
        category: newTransaction.category,
        description: newTransaction.description,
      };

      const savedTransaction = await transactionService.createTransaction(transactionData);
      setTransactions([savedTransaction, ...transactions]);
      setNewTransaction({ amount: '', category: 'need', description: '' });
      setShowQuickAdd(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Failed to add transaction. Please try again.');
    }
  };

  const handleDeleteTransaction = (id) => {
    setTransactionToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await transactionService.deleteTransaction(transactionToDelete);
      setTransactions(transactions.filter(t => t.id !== transactionToDelete));
      setShowDeleteModal(false);
      setTransactionToDelete(null);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Failed to delete transaction. Please try again.');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTransactionToDelete(null);
  };

  const handleEditTransaction = (transaction) => {
    setEditingId(transaction.id);
    setNewTransaction({
      amount: transaction.amount.toString(),
      category: transaction.category,
      description: transaction.description,
    });
  };

  const handleUpdateTransaction = async () => {
    if (!newTransaction.amount || parseFloat(newTransaction.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      const transactionData = {
        amount: parseFloat(newTransaction.amount),
        category: newTransaction.category,
        description: newTransaction.description,
      };

      const updatedTransaction = await transactionService.updateTransaction(editingId, transactionData);
      setTransactions(transactions.map(t => 
        t.id === editingId ? updatedTransaction : t
      ));
      setEditingId(null);
      setNewTransaction({ amount: '', category: 'need', description: '' });
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert('Failed to update transaction. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewTransaction({ amount: '', category: 'need', description: '' });
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    navigate('/login');
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleSaveBudget = async () => {
    try {
      const budget = parseFloat(budgetInput);
      if (isNaN(budget) || budget < 0) {
        alert('Please enter a valid budget amount');
        return;
      }

      const updatedUser = await authService.updateMonthlyBudget(budget);
      setUserData(updatedUser);
      setEditingBudget(false);
    } catch (error) {
      console.error('Error updating budget:', error);
      alert('Failed to update budget. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  const displayUser = userData || user;

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="app-logo">WorthIt</h1>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'budget' ? 'active' : ''}`}
            onClick={() => setActiveTab('budget')}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Dashboard
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profile
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </button>
        </nav>

        <button className="logout-button" onClick={handleLogout}>
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {activeTab === 'budget' && (
          <div className="budget-layout">
            {/* Left Column - Budget Details */}
            <div className="budget-main">
              <div className="budget-header">
                <h2 className="budget-month">
                  {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Expenses
                </h2>
                <button className="quick-add-btn" onClick={() => setShowQuickAdd(!showQuickAdd)}>
                  <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Quick Add
                </button>
              </div>

              {/* Quick Add Transaction Form */}
              {showQuickAdd && (
                <div className="quick-add-form">
                  <h3 className="form-title">Add Transaction</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Amount</label>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={newTransaction.amount}
                        onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <select
                        value={newTransaction.category}
                        onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                      >
                        <option value="need">Need (Essential)</option>
                        <option value="want">Want (Extra)</option>
                      </select>
                    </div>
                    <div className="form-group full-width">
                      <label>Description (Optional)</label>
                      <input
                        type="text"
                        placeholder="What did you spend on?"
                        value={newTransaction.description}
                        onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button className="btn-cancel" onClick={() => setShowQuickAdd(false)}>Cancel</button>
                    <button className="btn-add" onClick={handleQuickAdd}>Add Transaction</button>
                  </div>
                </div>
              )}

              {/* Expense Categories */}
              <div className="budget-section">
                <h3 className="section-heading">EXPENSE CATEGORIES</h3>
                <div className="expense-cards">
                  <div className="expense-card needs-card">
                    <div className="expense-card-header">
                      <div className="row-icon needs">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <span className="expense-card-title">Needs (Essentials)</span>
                    </div>
                    <div className="expense-card-amount">₱{expenses.needs.toFixed(2)}</div>
                    <div className="expense-card-footer">
                      {expenses.totalSpent > 0 ? `${expenses.needsPercentage}% of total spending` : 'No spending yet'}
                    </div>
                  </div>

                  <div className="expense-card wants-card">
                    <div className="expense-card-header">
                      <div className="row-icon wants">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <span className="expense-card-title">Wants (Extras)</span>
                    </div>
                    <div className="expense-card-amount">₱{expenses.wants.toFixed(2)}</div>
                    <div className="expense-card-footer">
                      {expenses.totalSpent > 0 ? `${expenses.wantsPercentage}% of total spending` : 'No spending yet'}
                    </div>
                  </div>

                  {/* Wants Breakdown */}
                  {expenses.wants > 0 && (
                    <div className="expense-breakdown">
                      <h4 className="breakdown-title">Wants Breakdown</h4>
                      <div className="breakdown-items">
                        <div className="breakdown-item">
                          <span className="breakdown-label">• Micro-Treats (Under ₱200)</span>
                          <span className="breakdown-amount">₱{expenses.microWants.toFixed(2)}</span>
                        </div>
                        <div className="breakdown-item">
                          <span className="breakdown-label">• Splurges (₱200+)</span>
                          <span className="breakdown-amount">₱{expenses.splurges.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Transactions */}
              {transactions.length > 0 && (
                <div className="budget-section">
                  <h3 className="section-heading">RECENT TRANSACTIONS</h3>
                  <div className="transactions-list">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="transaction-item">
                        {editingId === transaction.id ? (
                          <div className="transaction-edit-form">
                            <div className="edit-form-grid">
                              <input
                                type="number"
                                placeholder="Amount"
                                value={newTransaction.amount}
                                onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                                className="edit-input"
                              />
                              <select
                                value={newTransaction.category}
                                onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                                className="edit-select"
                              >
                                <option value="need">Need</option>
                                <option value="want">Want</option>
                              </select>
                              <input
                                type="text"
                                placeholder="Description"
                                value={newTransaction.description}
                                onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                                className="edit-input full-width"
                              />
                            </div>
                            <div className="edit-actions">
                              <button className="btn-save" onClick={handleUpdateTransaction}>
                                <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Save
                              </button>
                              <button className="btn-cancel-edit" onClick={handleCancelEdit}>
                                <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="transaction-info">
                              <span className={`transaction-badge ${transaction.category}`}>
                                {transaction.category === 'need' ? 'Need' : 'Want'}
                              </span>
                              <span className="transaction-desc">
                                {transaction.description || 'No description'}
                              </span>
                            </div>
                            <div className="transaction-details">
                              <span className="transaction-amount">-₱{transaction.amount.toFixed(2)}</span>
                              <span className="transaction-date">
                                {new Date(transaction.transactionDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="transaction-actions">
                              <button 
                                className="action-btn edit-btn" 
                                onClick={() => handleEditTransaction(transaction)}
                                title="Edit transaction"
                              >
                                <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button 
                                className="action-btn delete-btn" 
                                onClick={() => handleDeleteTransaction(transaction.id)}
                                title="Delete transaction"
                              >
                                <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Summary */}
            <div className="budget-summary">
              {/* Monthly Budget Goal */}
              <div className="summary-card budget-goal-card">
                <div className="budget-goal-header">
                  <div className="budget-goal-title">
                    <svg className="stat-icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span>Monthly Budget Goal</span>
                  </div>
                  {!editingBudget && (
                    <button 
                      className="edit-budget-btn"
                      onClick={() => {
                        setBudgetInput(userData?.monthlyBudget?.toString() || '0');
                        setEditingBudget(true);
                      }}
                      title="Edit budget"
                    >
                      <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  )}
                </div>
                {editingBudget ? (
                  <div className="budget-goal-edit">
                    <input
                      type="number"
                      className="budget-input"
                      value={budgetInput}
                      onChange={(e) => setBudgetInput(e.target.value)}
                      placeholder="Enter your monthly budget"
                      min="0"
                      step="0.01"
                    />
                    <div className="budget-actions">
                      <button 
                        className="btn-save"
                        onClick={handleSaveBudget}
                      >
                        Save
                      </button>
                      <button 
                        className="btn-cancel"
                        onClick={() => setEditingBudget(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="budget-goal-display">
                    <div className="budget-amount">₱{(userData?.monthlyBudget || 0).toFixed(2)}</div>
                    {userData?.monthlyBudget > 0 && (
                      <div className="budget-progress">
                        <div className="budget-progress-bar">
                          <div 
                            className="budget-progress-fill"
                            style={{ 
                              width: `${Math.min((expenses.totalSpent / userData.monthlyBudget) * 100, 100)}%`,
                              backgroundColor: expenses.totalSpent > userData.monthlyBudget ? '#e74c3c' : '#4caf50'
                            }}
                          />
                        </div>
                        <div className="budget-status">
                          {expenses.totalSpent > userData.monthlyBudget ? (
                            <span className="budget-exceeded">
                              ₱{(expenses.totalSpent - userData.monthlyBudget).toFixed(2)} over budget
                            </span>
                          ) : (
                            <span className="budget-remaining">
                              ₱{(userData.monthlyBudget - expenses.totalSpent).toFixed(2)} remaining
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="summary-card">
                <div className="summary-circle">
                  <svg className="circle-chart" viewBox="0 0 36 36">
                    <path
                      className="circle-bg"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="circle-progress"
                      strokeDasharray={`${userData?.monthlyBudget > 0 ? Math.min((expenses.totalSpent / userData.monthlyBudget) * 100, 100) : 0}, 100`}
                      style={{
                        stroke: userData?.monthlyBudget > 0 && expenses.totalSpent > userData.monthlyBudget 
                          ? '#e74c3c' 
                          : 'var(--primary-purple)'
                      }}
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="circle-content">
                    <div className="circle-label">Total Spent</div>
                    <div className="circle-amount">₱{expenses.totalSpent.toFixed(2)}</div>
                    <div className="circle-total">this month</div>
                  </div>
                </div>
                <p className="summary-note">
                  {expenses.totalSpent > 0 
                    ? `You've tracked ${transactions.length} transaction${transactions.length !== 1 ? 's' : ''} this month`
                    : 'Start tracking your expenses!'}
                </p>
              </div>

              <div className="summary-stats">
                <div className="stat-item">
                  <svg className="stat-icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth={2} />
                  </svg>
                  <div className="stat-details">
                    <span className="stat-label-small">Total Expenses</span>
                    <span className="stat-value-small">₱{expenses.totalSpent.toFixed(2)}</span>
                  </div>
                </div>

                <div className="stat-item">
                  <svg className="stat-icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth={2} />
                  </svg>
                  <div className="stat-details">
                    <span className="stat-label-small">Needs</span>
                    <span className="stat-value-small">₱{expenses.needs.toFixed(2)}</span>
                  </div>
                </div>

                <div className="stat-item">
                  <svg className="stat-icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth={2} />
                  </svg>
                  <div className="stat-details">
                    <span className="stat-label-small">Wants</span>
                    <span className="stat-value-small">₱{expenses.wants.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Ratio Chart */}
              <div className="ratio-chart">
                <h4 className="chart-title">Spending Breakdown</h4>
                <div className="ratio-bars">
                  <div className="ratio-bar">
                    <div className="ratio-label">
                      <span>Needs</span>
                      <span className="ratio-percentage">{expenses.needsPercentage}%</span>
                    </div>
                    <div className="ratio-progress-bg">
                      <div 
                        className="ratio-progress needs-color" 
                        style={{width: `${expenses.needsPercentage}%`}}
                      ></div>
                    </div>
                    <span className="ratio-amount">₱{expenses.needs.toFixed(2)}</span>
                  </div>

                  <div className="ratio-bar">
                    <div className="ratio-label">
                      <span>Wants</span>
                      <span className="ratio-percentage">{expenses.wantsPercentage}%</span>
                    </div>
                    <div className="ratio-progress-bg">
                      <div 
                        className="ratio-progress wants-color" 
                        style={{width: `${expenses.wantsPercentage}%`}}
                      ></div>
                    </div>
                    <span className="ratio-amount">₱{expenses.wants.toFixed(2)}</span>
                  </div>

                  {expenses.wants > 0 && (
                    <>
                      <div className="ratio-bar subcategory">
                        <div className="ratio-label">
                          <span>• Micro-Treats (Under ₱200)</span>
                        </div>
                        <div className="ratio-progress-bg small">
                          <div 
                            className="ratio-progress micro-color" 
                            style={{width: `${expenses.wants > 0 ? (expenses.microWants / expenses.wants * 100) : 0}%`}}
                          ></div>
                        </div>
                        <span className="ratio-amount">₱{expenses.microWants.toFixed(2)}</span>
                      </div>

                      <div className="ratio-bar subcategory">
                        <div className="ratio-label">
                          <span>• Splurges (₱200+)</span>
                        </div>
                        <div className="ratio-progress-bg small">
                          <div 
                            className="ratio-progress splurge-color" 
                            style={{width: `${expenses.wants > 0 ? (expenses.splurges / expenses.wants * 100) : 0}%`}}
                          ></div>
                        </div>
                        <span className="ratio-amount">₱{expenses.splurges.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="tab-content">
            <div className="profile-header-card">
              <div className="profile-avatar-large">
                {displayUser?.displayName?.charAt(0) || displayUser?.username?.charAt(0) || 'U'}
              </div>
              <div className="profile-header-info">
                <h3 className="profile-name">{displayUser?.displayName || displayUser?.username}</h3>
                <p className="profile-email">{displayUser?.email}</p>
                <span className="profile-badge">{displayUser?.role || 'USER'}</span>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon-wrapper purple">
                  <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="stat-content">
                  <p className="stat-label">User ID</p>
                  <p className="stat-value">#{displayUser?.id}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-wrapper pink">
                  <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="stat-content">
                  <p className="stat-label">Username</p>
                  <p className="stat-value">{displayUser?.username}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-wrapper purple">
                  <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="stat-content">
                  <p className="stat-label">Member Since</p>
                  <p className="stat-value">
                    {userData?.createdAt 
                      ? new Date(userData.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="info-section">
              <h3 className="section-title">Profile Details</h3>
              <div className="info-cards-grid">
                <div className="info-card">
                  <span className="info-card-label">Display Name</span>
                  <span className="info-card-value">{displayUser?.displayName || 'Not provided'}</span>
                </div>
                <div className="info-card">
                  <span className="info-card-label">Email Address</span>
                  <span className="info-card-value">{displayUser?.email}</span>
                </div>
                <div className="info-card">
                  <span className="info-card-label">Account Type</span>
                  <span className="info-card-value">{displayUser?.role || 'USER'}</span>
                </div>
                <div className="info-card">
                  <span className="info-card-label">Status</span>
                  <span className="info-card-value status-active">Active</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="tab-content">
            <div className="settings-section">
              <h3 className="section-title">Account Settings</h3>
              <p className="section-description">Manage your account preferences and settings</p>
              <div className="settings-placeholder">
                <p>Settings functionality coming soon...</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay" onClick={cancelLogout}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <svg className="modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <h3 className="modal-title">Confirm Logout</h3>
            </div>
            <p className="modal-message">Are you sure you want to logout?</p>
            <div className="modal-actions">
              <button className="modal-btn modal-btn-cancel" onClick={cancelLogout}>
                Cancel
              </button>
              <button className="modal-btn modal-btn-confirm" onClick={confirmLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <svg className="modal-icon modal-icon-delete" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <h3 className="modal-title">Delete Transaction</h3>
            </div>
            <p className="modal-message">Are you sure you want to delete this transaction? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="modal-btn modal-btn-cancel" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="modal-btn modal-btn-delete" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
