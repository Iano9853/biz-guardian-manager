import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  TrendingUp, 
  Store,
  MessageSquare,
  ShoppingCart,
  AlertCircle
} from 'lucide-react';
import { SHOP_NAMES } from '@/types/business';

export const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user?.assignedShop) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Account Pending Assignment</h3>
            <p className="text-muted-foreground">
              Your account is pending shop assignment by an administrator. 
              Please contact your manager to get access to the system.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-primary text-primary-foreground rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.fullName}!</h2>
        <p className="text-primary-foreground/80 mb-3">
          Managing {SHOP_NAMES[user.assignedShop]}
        </p>
        <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
          Employee Access
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Stock Items</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today's Sales</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-accent/10 rounded-lg">
                <MessageSquare className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Messages</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="stock" className="text-xs sm:text-sm">Stock</TabsTrigger>
          <TabsTrigger value="sales" className="text-xs sm:text-sm">Sales</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Store className="h-5 w-5" />
                  <span>Shop Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Assigned Shop</span>
                    <Badge variant="secondary">
                      {SHOP_NAMES[user.assignedShop]}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Your Role</span>
                    <Badge variant="outline">Employee</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Employee ID</span>
                    <span className="text-sm font-mono">{user.nationalId}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="gradient" className="w-full justify-start">
                  <Package className="mr-2 h-4 w-4" />
                  View Stock
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Record Sale
                </Button>
                <Button variant="accent" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message Admin
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stock" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Stock - {SHOP_NAMES[user.assignedShop]}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Stock Items</h3>
                <p className="text-muted-foreground mb-4">
                  Stock items will appear here once added by administrators.
                </p>
                <Button variant="outline">
                  Request Stock Update
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Record New Sale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Sales Tracking</h3>
                <p className="text-muted-foreground mb-4">
                  Record sales transactions to automatically update stock levels.
                </p>
                <Button variant="gradient">
                  Record Sale
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No sales recorded yet for {SHOP_NAMES[user.assignedShop]}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};