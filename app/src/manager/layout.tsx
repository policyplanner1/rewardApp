'use client';

import { useAuth } from '../(auth)/context/AuthContext';
import ManagerNavbar from '../components/navbar/ManagerNavbar';

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  if (!user || user.role !== 'vendor_manager') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600">You dont have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ManagerNavbar />
      <main className="ml-64">
        {children}
      </main>
    </div>
  );
}