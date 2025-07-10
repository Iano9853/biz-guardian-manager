import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* App Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-foreground mb-2">
            Biz Guardian Manager
          </h1>
          <p className="text-primary-foreground/80 text-lg">
            Professional Business Management
          </p>
          <div className="mt-4 text-xs text-primary-foreground/60">
            © JosephineTechnologies 2024
          </div>
        </div>

        {/* Auth Form */}
        {isLogin ? (
          <LoginForm onToggleMode={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onToggleMode={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};