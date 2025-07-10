export interface User {
  id: string;
  fullName: string;
  nationalId: string;
  role: 'admin' | 'employee';
  assignedShop?: 'boutique' | 'house-decor';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  users: User[];
}