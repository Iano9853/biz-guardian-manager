import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot,
  Minimize2,
  Maximize2
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'josephine';
  timestamp: string;
}

export const JosephineChat: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hello ${user?.fullName}! I'm Josephine, your AI business assistant. How can I help you today?`,
      sender: 'josephine',
      timestamp: new Date().toISOString()
    }
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');

    // Simulate Josephine's response
    setTimeout(() => {
      const response = getJosephineResponse(message, user?.role);
      const josephineMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'josephine',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, josephineMessage]);
    }, 1000);
  };

  const getJosephineResponse = (userMessage: string, role?: 'admin' | 'employee'): string => {
    const msg = userMessage.toLowerCase();
    
    if (role === 'admin') {
      if (msg.includes('assign') || msg.includes('employee')) {
        return "I can help you assign employees to shops! Go to the Employees tab and use the assignment buttons, or tell me specifically which employee you'd like to assign to which shop.";
      }
      if (msg.includes('export') || msg.includes('data')) {
        return "You can export shop data from the Reports tab. Would you like me to guide you through exporting Boutique or House Décor data?";
      }
      if (msg.includes('sales') || msg.includes('report')) {
        return "I can help you view sales reports and summaries. Check the Reports tab for detailed analytics, or ask me for specific information about shop performance.";
      }
      if (msg.includes('stock') || msg.includes('inventory')) {
        return "You can manage stock for both shops from the Shops tab. Would you like help with adding new items or checking current inventory levels?";
      }
    } else {
      if (msg.includes('sale') || msg.includes('record')) {
        return "I can help you record a new sale! Make sure to include the item name, brand, quantity sold, and sale amount. This will automatically update the stock levels.";
      }
      if (msg.includes('stock') || msg.includes('inventory')) {
        return "You can view current stock levels in the Stock tab. If you notice any discrepancies, please inform your administrator.";
      }
      if (msg.includes('help') || msg.includes('how')) {
        return "I'm here to help! You can ask me about recording sales, checking stock, or any questions about your shop operations.";
      }
    }

    if (msg.includes('hello') || msg.includes('hi')) {
      return `Hello! I'm here to assist you with your ${role === 'admin' ? 'administrative' : 'shop'} tasks. What would you like to help with?`;
    }

    return "I'm here to help! You can ask me about managing stock, recording sales, employee assignments, generating reports, or any other business operations.";
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="gradient"
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-glow z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-6 right-6 z-50 shadow-glow transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-80 h-96'
    }`}>
      <CardHeader className="p-3 bg-gradient-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5" />
            <CardTitle className="text-sm">Josephine AI</CardTitle>
            <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground text-xs">
              Assistant
            </Badge>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-80">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-2 rounded-lg text-sm ${
                    msg.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t">
            <div className="flex space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask Josephine..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="text-sm"
              />
              <Button
                onClick={sendMessage}
                size="icon"
                variant="gradient"
                className="h-9 w-9"
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};