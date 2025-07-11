import { User as SupabaseUser, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  full_name: string;
  role: 'admin' | 'employee';
  assigned_shop?: 'boutique' | 'house-decor';
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: SupabaseUser | null;
  profile: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  users: UserProfile[];
}