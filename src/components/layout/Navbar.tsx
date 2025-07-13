import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LogOut, User, MessageCircle } from 'lucide-react';
import { SHOP_NAMES } from '@/types/business';

export const Navbar: React.FC = () => {
  const { user, profile, logout } = useAuth();

  if (!user) return null;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <nav className="bg-background border-b border-border px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg sm:text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            <span className="hidden sm:inline">Biz Guardian Manager</span>
            <span className="sm:hidden">BizGuardian</span>
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
                {getInitials(profile?.full_name || 'User')}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-medium">{profile?.full_name}</p>
              <div className="flex items-center space-x-2">
                <Badge variant={profile?.role === 'admin' ? 'default' : 'secondary'}>
                  {profile?.role === 'admin' ? '🧑‍💼 Admin' : '👷 Employee'}
                </Badge>
                {profile?.assigned_shop && (
                  <Badge variant="outline">
                    {SHOP_NAMES[profile.assigned_shop]}
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