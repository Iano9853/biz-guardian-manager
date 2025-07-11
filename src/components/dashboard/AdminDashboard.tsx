import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StockManager } from '@/components/business/StockManager';
import { 
  Users, 
  Package, 
  TrendingUp, 
  Settings, 
  Download,
  Store,
  UserPlus,
  MessageSquare,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SHOP_NAMES } from '@/types/business';

export const AdminDashboard: React.FC = () => {
  const { user, users, assignEmployeeToShop, deleteUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  // Export functionality
  const exportToExcel = (data: any[], filename: string) => {
    if (data.length === 0) {
      toast({
        title: "No Data to Export",
        description: "There is no data available to export.",
        variant: "destructive",
      });
      return;
    }

    const csvContent = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: `${filename} has been downloaded.`,
    });
  };

  const employees = users.filter(u => u.role === 'employee');
  const unassignedEmployees = employees.filter(e => !e.assignedShop);
  const admins = users.filter(u => u.role === 'admin');

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-primary text-primary-foreground rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.fullName}!</h2>
        <p className="text-primary-foreground/80">
          Manage your business operations with full administrative control
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Employees</p>
                <p className="text-2xl font-bold">{employees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-accent/10 rounded-lg">
                <UserPlus className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unassigned</p>
                <p className="text-2xl font-bold">{unassignedEmployees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Store className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Shops</p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Settings className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold">{admins.length}/3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="employees" className="text-xs sm:text-sm">Employees</TabsTrigger>
          <TabsTrigger value="shops" className="text-xs sm:text-sm">Shops</TabsTrigger>
          <TabsTrigger value="reports" className="text-xs sm:text-sm">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserPlus className="h-5 w-5" />
                  <span>Employee Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Assign unassigned employees to shops
                </p>
                {unassignedEmployees.length > 0 ? (
                  <div className="space-y-2">
                    {unassignedEmployees.map(employee => (
                      <div key={employee.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{employee.fullName}</p>
                          <p className="text-sm text-muted-foreground">ID: {employee.nationalId}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => assignEmployeeToShop(employee.id, 'boutique')}
                            className="text-xs sm:text-sm"
                          >
                            → Boutique
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => assignEmployeeToShop(employee.id, 'house-decor')}
                            className="text-xs sm:text-sm"
                          >
                            → House Décor
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">All employees are assigned to shops</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="gradient" className="w-full justify-start">
                  <Package className="mr-2 h-4 w-4" />
                  Manage Stock
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Sales Reports
                </Button>
                <Button variant="accent" className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Messages
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employees.map(employee => (
                  <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium">{employee.fullName}</p>
                        <p className="text-sm text-muted-foreground">ID: {employee.nationalId}</p>
                      </div>
                      {employee.assignedShop ? (
                        <Badge variant="secondary">
                          {SHOP_NAMES[employee.assignedShop]}
                        </Badge>
                      ) : (
                        <Badge variant="outline">Unassigned</Badge>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {employee.assignedShop ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => assignEmployeeToShop(employee.id, 
                              employee.assignedShop === 'boutique' ? 'house-decor' : 'boutique'
                            )}
                          >
                            Switch Shop
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteUser(employee.id)}
                          >
                            Remove
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => assignEmployeeToShop(employee.id, 'boutique')}
                          >
                            → Boutique
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => assignEmployeeToShop(employee.id, 'house-decor')}
                          >
                            → House Décor
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                {employees.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No employees registered yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shops" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>👗</span>
                  <span>Boutique Stock</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Assigned Employees</span>
                    <Badge>
                      {employees.filter(e => e.assignedShop === 'boutique').length}
                    </Badge>
                  </div>
                  <StockManager shop="boutique" isAdmin={true} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🛋️</span>
                  <span>House Décor Stock</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Assigned Employees</span>
                    <Badge>
                      {employees.filter(e => e.assignedShop === 'house-decor').length}
                    </Badge>
                  </div>
                  <StockManager shop="house-decor" isAdmin={true} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Business Reports</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button 
                  variant="gradient" 
                  className="h-16 sm:h-20 flex-col text-xs sm:text-sm"
                  onClick={() => {
                    const boutiqueEmployees = employees.filter(e => e.assignedShop === 'boutique');
                    exportToExcel(boutiqueEmployees.map(e => ({
                      name: e.fullName,
                      nationalId: e.nationalId,
                      shop: 'Boutique',
                      assignedDate: new Date().toISOString().split('T')[0]
                    })), 'boutique-employees');
                  }}
                >
                  <Download className="h-6 w-6 mb-2" />
                  Export Boutique Data
                </Button>
                <Button 
                  variant="secondary" 
                  className="h-16 sm:h-20 flex-col text-xs sm:text-sm"
                  onClick={() => {
                    const houseDecorEmployees = employees.filter(e => e.assignedShop === 'house-decor');
                    exportToExcel(houseDecorEmployees.map(e => ({
                      name: e.fullName,
                      nationalId: e.nationalId,
                      shop: 'House Décor',
                      assignedDate: new Date().toISOString().split('T')[0]
                    })), 'house-decor-employees');
                  }}
                >
                  <Download className="h-6 w-6 mb-2" />
                  Export House Décor Data
                </Button>
                <Button 
                  variant="accent" 
                  className="h-16 sm:h-20 flex-col text-xs sm:text-sm"
                  onClick={() => {
                    exportToExcel(employees.map(e => ({
                      name: e.fullName,
                      nationalId: e.nationalId,
                      role: e.role,
                      assignedShop: e.assignedShop || 'Unassigned'
                    })), 'employees-summary');
                  }}
                >
                  <BarChart3 className="h-6 w-6 mb-2" />
                  Employee Summary
                </Button>
                <Button 
                  variant="outline" 
                  className="h-16 sm:h-20 flex-col text-xs sm:text-sm"
                  onClick={() => {
                    const allUsers = users.map(u => ({
                      name: u.fullName,
                      nationalId: u.nationalId,
                      role: u.role,
                      assignedShop: u.assignedShop || 'N/A'
                    }));
                    exportToExcel(allUsers, 'all-users-report');
                  }}
                >
                  <Package className="h-6 w-6 mb-2" />
                  Users Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};