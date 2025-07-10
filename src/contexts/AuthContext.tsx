import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (nationalId: string, password: string) => Promise<boolean>;
  register: (userData: {
    fullName: string;
    nationalId: string;
    role: 'admin' | 'employee';
    password: string;
  }) => Promise<boolean>;
  logout: () => void;
  assignEmployeeToShop: (employeeId: string, shop: 'boutique' | 'house-decor') => void;
  deleteUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    users: []
  });

  // Load data from localStorage
  useEffect(() => {
    const storedUsers = localStorage.getItem('bizapp_users');
    const storedCurrentUser = localStorage.getItem('bizapp_current_user');
    
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      setAuthState(prev => ({ ...prev, users }));
    }
    
    if (storedCurrentUser) {
      const user = JSON.parse(storedCurrentUser);
      setAuthState(prev => ({ ...prev, user, isAuthenticated: true }));
    }
  }, []);

  // Save users to localStorage
  const saveUsers = (users: User[]) => {
    localStorage.setItem('bizapp_users', JSON.stringify(users));
  };

  const login = async (nationalId: string, password: string): Promise<boolean> => {
    const storedPasswordsJson = localStorage.getItem('bizapp_passwords');
    const storedPasswords = storedPasswordsJson ? JSON.parse(storedPasswordsJson) : {};
    
    if (!storedPasswords[nationalId]) {
      return false;
    }

    // Simple password check (in production, use proper hashing)
    if (storedPasswords[nationalId] !== password) {
      return false;
    }

    const user = authState.users.find(u => u.nationalId === nationalId);
    if (!user) {
      return false;
    }

    // Check if employee is assigned to a shop
    if (user.role === 'employee' && !user.assignedShop) {
      return false; // Employee not assigned to shop
    }

    localStorage.setItem('bizapp_current_user', JSON.stringify(user));
    setAuthState(prev => ({ ...prev, user, isAuthenticated: true }));
    return true;
  };

  const register = async (userData: {
    fullName: string;
    nationalId: string;
    role: 'admin' | 'employee';
    password: string;
  }): Promise<boolean> => {
    // Check if user already exists
    if (authState.users.find(u => u.nationalId === userData.nationalId)) {
      return false;
    }

    // Check admin limit
    if (userData.role === 'admin') {
      const adminCount = authState.users.filter(u => u.role === 'admin').length;
      if (adminCount >= 3) {
        return false;
      }
    }

    const newUser: User = {
      id: Date.now().toString(),
      fullName: userData.fullName,
      nationalId: userData.nationalId,
      role: userData.role,
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [...authState.users, newUser];
    
    // Store password separately (in production, hash it properly)
    const storedPasswordsJson = localStorage.getItem('bizapp_passwords');
    const storedPasswords = storedPasswordsJson ? JSON.parse(storedPasswordsJson) : {};
    storedPasswords[userData.nationalId] = userData.password;
    localStorage.setItem('bizapp_passwords', JSON.stringify(storedPasswords));
    
    saveUsers(updatedUsers);
    setAuthState(prev => ({ ...prev, users: updatedUsers }));
    
    return true;
  };

  const logout = () => {
    localStorage.removeItem('bizapp_current_user');
    setAuthState(prev => ({ ...prev, user: null, isAuthenticated: false }));
  };

  const assignEmployeeToShop = (employeeId: string, shop: 'boutique' | 'house-decor') => {
    const updatedUsers = authState.users.map(user =>
      user.id === employeeId ? { ...user, assignedShop: shop } : user
    );
    
    saveUsers(updatedUsers);
    setAuthState(prev => ({ ...prev, users: updatedUsers }));
    
    // Update current user if it's the assigned employee
    if (authState.user?.id === employeeId) {
      const updatedUser = { ...authState.user, assignedShop: shop };
      localStorage.setItem('bizapp_current_user', JSON.stringify(updatedUser));
      setAuthState(prev => ({ ...prev, user: updatedUser }));
    }
  };

  const deleteUser = (userId: string) => {
    const updatedUsers = authState.users.filter(user => user.id !== userId);
    saveUsers(updatedUsers);
    setAuthState(prev => ({ ...prev, users: updatedUsers }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        assignEmployeeToShop,
        deleteUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};