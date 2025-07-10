import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-muted/30 border-t border-border mt-12 py-6">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            © 2024 JosephineTechnologies - All Rights Reserved
          </p>
          <p className="text-xs text-muted-foreground">
            Built & Protected by JosephineTechnologies 2024
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <span>🔐 Enterprise-Grade Security</span>
            <span>•</span>
            <span>🤖 Powered by Josephine AI</span>
            <span>•</span>
            <span>📊 Advanced Analytics</span>
          </div>
        </div>
      </div>
    </footer>
  );
};