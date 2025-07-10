import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LogOut, User, MessageCircle } from 'lucide-react';
import { SHOP_NAMES } from '@/types/business';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <nav className="bg-background border-b border-border px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Biz Guardian Manager
          </h1>
          <Badge variant="secondary" className="hidden sm:inline-flex">
            Powered by Josephine AI
          </Badge>
        </div>

        <div className="flex items-center space-x-4">
          {/* User Info */}
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-medium">{user.fullName}</p>
              <div className="flex items-center space-x-2">
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                  {user.role === 'admin' ? '🧑‍💼 Admin' : '👷 Employee'}
                </Badge>
                {user.assignedShop && (
                  <Badge variant="outline">
                    {SHOP_NAMES[user.assignedShop]}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
};