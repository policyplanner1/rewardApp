'use client';

import { useAuth } from '../(auth)/context/AuthContext';
import WarehouseNavbar from '../components/navbar/WareHouseNavbar';

export default function WarehouseLayout({ children }) {
  const { user } = useAuth();

  // Restrict access to warehouse managers only
  if (!user || user.role !== 'warehouse_manager') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* Sidebar */}
      <WarehouseNavbar />

      {/* Main Content */}
      <main className="flex-1 p-6 ml-60">
        {children}
      </main>

    </div>
  );
}
