import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AdminDashboard } from './AdminDashboard';
import { EmployeeDashboard } from './EmployeeDashboard';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { JosephineChat } from '@/components/ai/JosephineChat';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        {user.role === 'admin' ? <AdminDashboard /> : <EmployeeDashboard />}
      </main>
      <Footer />
      <JosephineChat />
    </div>
  );
};