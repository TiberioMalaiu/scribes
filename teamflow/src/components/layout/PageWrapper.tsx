import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
}

export default function PageWrapper({ children }: PageWrapperProps) {
  return (
    <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
      {children}
    </main>
  );
}
