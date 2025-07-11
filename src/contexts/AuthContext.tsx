import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthState, UserProfile } from '@/types/auth';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: {
    fullName: string;
    email: string;
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
    profile: null,
    session: null,
    isAuthenticated: false,
    users: []
  });

  // Load users for admin dashboard
  const loadUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
    
    if (!error && data) {
      setAuthState(prev => ({ ...prev, users: data as UserProfile[] }));
    }
  };

  // Set up auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setAuthState(prev => ({ ...prev, session }));
        
        if (session?.user) {
          // Fetch user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          setAuthState(prev => ({
            ...prev,
            user: session.user,
            profile: profile as UserProfile,
            isAuthenticated: true
          }));
          
          // Load all users for admin functionality
          await loadUsers();
        } else {
          setAuthState(prev => ({
            ...prev,
            user: null,
            profile: null,
            isAuthenticated: false
          }));
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setAuthState(prev => ({ ...prev, session }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) return false;

      // Check if employee is assigned to a shop
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profile?.role === 'employee' && !profile.assigned_shop) {
          await supabase.auth.signOut();
          return false; // Employee not assigned to shop
        }
      }

      return true;
    } catch (error) {
      return false;
    }
  };

  const register = async (userData: {
    fullName: string;
    email: string;
    role: 'admin' | 'employee';
    password: string;
  }): Promise<boolean> => {
    try {
      // Check admin limit
      if (userData.role === 'admin') {
        const { data: adminProfiles } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'admin');
        
        if (adminProfiles && adminProfiles.length >= 3) {
          return false;
        }
      }

      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: userData.fullName,
            role: userData.role
          }
        }
      });

      if (error) return false;
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const assignEmployeeToShop = async (employeeId: string, shop: 'boutique' | 'house-decor') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ assigned_shop: shop })
        .eq('id', employeeId);

      if (!error) {
        // Reload users to reflect changes
        await loadUsers();
        
        // Update current profile if it's the assigned employee
        if (authState.user?.id === employeeId) {
          const { data: updatedProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', employeeId)
            .single();
          
          if (updatedProfile) {
            setAuthState(prev => ({ ...prev, profile: updatedProfile as UserProfile }));
          }
        }
      }
    } catch (error) {
      console.error('Error assigning employee to shop:', error);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // Note: In production, you'd want to handle this through a secure admin function
      // For now, we'll just remove from profiles table
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (!error) {
        await loadUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
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