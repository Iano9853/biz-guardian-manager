import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Package, Edit, Trash2 } from 'lucide-react';
import { StockItem, Shop, SHOP_NAMES } from '@/types/business';
import { useToast } from '@/hooks/use-toast';

interface StockManagerProps {
  shop?: Shop;
  isAdmin?: boolean;
}

export const StockManager: React.FC<StockManagerProps> = ({ shop, isAdmin = false }) => {
  const { toast } = useToast();
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [formData, setFormData] = useState({
    itemName: '',
    brand: '',
    quantity: '',
    amount: '',
    shop: shop || ('boutique' as Shop)
  });

  const handleAddItem = () => {
    if (!formData.itemName || !formData.brand || !formData.quantity || !formData.amount) {
      toast({
        title: "Missing Information",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    const newItem: StockItem = {
      id: Date.now().toString(),
      itemName: formData.itemName,
      brand: formData.brand,
      quantity: parseInt(formData.quantity),
      amount: parseFloat(formData.amount),
      shop: formData.shop,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setStockItems(prev => [...prev, newItem]);
    setFormData({
      itemName: '',
      brand: '',
      quantity: '',
      amount: '',
      shop: shop || 'boutique'
    });
    setIsAddingItem(false);

    toast({
      title: "Stock Added",
      description: `${newItem.itemName} added to ${SHOP_NAMES[newItem.shop]}`,
    });
  };

  const handleDeleteItem = (itemId: string) => {
    setStockItems(prev => prev.filter(item => item.id !== itemId));
    toast({
      title: "Item Removed",
      description: "Stock item has been removed",
    });
  };

  const filteredItems = shop ? stockItems.filter(item => item.shop === shop) : stockItems;

  return (
    <div className="space-y-4">
      {/* Add Item Form */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Stock Management</span>
              </CardTitle>
              {!isAddingItem && (
                <Button onClick={() => setIsAddingItem(true)} variant="gradient">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              )}
            </div>
          </CardHeader>
          {isAddingItem && (
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="itemName">Item Name</Label>
                  <Input
                    id="itemName"
                    value={formData.itemName}
                    onChange={(e) => setFormData({...formData, itemName: e.target.value})}
                    placeholder="Enter item name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    placeholder="Enter brand"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    placeholder="Enter quantity"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="Enter price"
                  />
                </div>
              </div>
              {!shop && (
                <div className="space-y-2">
                  <Label htmlFor="shop">Shop</Label>
                  <Select
                    value={formData.shop}
                    onValueChange={(value: Shop) => setFormData({...formData, shop: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="boutique">{SHOP_NAMES.boutique}</SelectItem>
                      <SelectItem value="house-decor">{SHOP_NAMES['house-decor']}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex space-x-2">
                <Button onClick={handleAddItem} variant="gradient">
                  Add Item
                </Button>
                <Button onClick={() => setIsAddingItem(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Stock Items List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Current Stock {shop && `- ${SHOP_NAMES[shop]}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredItems.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Stock Items</h3>
              <p className="text-muted-foreground">
                {isAdmin ? 'Add your first stock item to get started.' : 'Stock items will appear here once added by administrators.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h4 className="font-medium">{item.itemName}</h4>
                        <p className="text-sm text-muted-foreground">{item.brand}</p>
                      </div>
                      <Badge variant={item.quantity < 10 ? 'destructive' : 'secondary'}>
                        Qty: {item.quantity}
                      </Badge>
                      <Badge variant="outline">
                        ${item.amount.toFixed(2)}
                      </Badge>
                      {!shop && (
                        <Badge variant="secondary">
                          {SHOP_NAMES[item.shop]}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};