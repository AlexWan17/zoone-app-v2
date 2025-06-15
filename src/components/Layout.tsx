
import React from 'react';
import AmazonStyleHeader from './AmazonStyleHeader';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AmazonStyleHeader />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;
