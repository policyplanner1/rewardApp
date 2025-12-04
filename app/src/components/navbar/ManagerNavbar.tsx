'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../../(auth)/context/AuthContext';

// --- Icon Placeholders (Assume these are imported from an icon library like 'lucide-react')
const LayoutDashboard = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></svg>;
const Users = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const Package = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="m21 8.24-9-5.15-9 5.15"/><path d="M3.27 12.44 12 17.59l8.73-5.15"/><path d="M2.57 17.59 12 22.74l9.43-5.15"/><line x1="12" x2="12" y1="2.76" y2="22.74"/></svg>;
const CheckCircle = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const BarChart = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>;
const ChevronDown = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;
const Settings = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.22a2 2 0 0 1-1.4 1.4L4.9 7.1a2 2 0 0 0-1 3.4L5.6 12l-1.7 1.5a2 2 0 0 0 1 3.4l2.48 1.44a2 2 0 0 1 1.4 1.4v.22a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.22a2 2 0 0 1 1.4-1.4l2.48-1.44a2 2 0 0 0 1-3.4L18.4 12l1.7-1.5a2 2 0 0 0-1-3.4l-2.48-1.44a2 2 0 0 1-1.4-1.4V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;
const UserCircle = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const LogOut = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>;
// ---

export default function ManagerNavbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Define utility styles based on the provided colors
  const brandPurple = 'var(--brand-purple)';
  const brandPink = 'var(--brand-pink)';
  const brandLightPurple = 'var(--brand-light-purple)';

  const navItems = [
    { href: '/src/manager/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
    { href: '/src/manager/dashboard/vendorlist', label: 'Vendors', Icon: Users },
    { href: '/src/manager/dashboard/product/productList', label: 'Products', Icon: Package },
    { href: '/src/manager/approvals', label: 'Approvals', Icon: CheckCircle, badge: 5 },
    { href: '/src/manager/analytics', label: 'Analytics', Icon: BarChart },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    // Slightly reduced width for a modern look (w-60 instead of w-64)
    <nav className="fixed top-0 left-0 h-full w-60 bg-white shadow-xl/5 border-r border-gray-100 flex flex-col transition-all duration-300 z-10">

      {/* Logo Section - Enhanced Gradient/Styling */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transform transition duration-300 hover:scale-[1.05]"
            style={{ backgroundImage: `linear-gradient(45deg, ${brandPurple}, ${brandPink})` }}
          >
            <span className="text-white font-extrabold text-lg tracking-widest">R</span>
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Rewards</h1>
            <p className="text-xs text-gray-400 font-medium">Manager Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation Items - With Hover and Active Animations */}
      <div className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const activeStyle = {
            backgroundColor: brandLightPurple, // Softer active background
            color: brandPurple,
            boxShadow: `0 4px 6px -1px rgba(133, 43, 175, 0.1)`,
          };

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                relative flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold 
                transition-all duration-200 ease-in-out transform 
                ${active
                  ? 'bg-opacity-10 shadow-md'
                  : 'text-gray-600 hover:bg-gray-50 hover:translate-x-1' // Sliding hover effect
                }
              `}
              style={active ? activeStyle : undefined}
            >
              <item.Icon className={active ? 'text-brand-purple' : 'text-gray-400'} style={active ? {color: brandPurple} : undefined} />
              
              <span className="flex-1">{item.label}</span>
              
              {/* Badge for notifications */}
              {item.badge && (
                <span 
                  className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full transition-colors duration-200 ${
                    active 
                      ? 'text-white' // Text is white if active
                      : 'bg-brand-pink text-white' // Pink for inactive notifications
                  }`}
                  style={active ? { backgroundColor: brandPink } : undefined} // Ensure pink is used for badge when active
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* User Profile Section & Quick Stats */}
      <div className="p-4 border-t border-gray-100 mt-auto">
        
        {/* Quick Stats (Moved before profile for better flow) */}
        <div className="mb-4 p-3 rounded-lg border border-gray-100 bg-gray-50">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-600 font-medium">🚨 Approvals</span>
            <span className="font-bold" style={{ color: brandPink }}>{navItems.find(i => i.label === 'Approvals')?.badge || 0}</span>
          </div>
          <div className="flex justify-between items-center text-xs mt-1 pt-1 border-t border-gray-100">
            <span className="text-gray-600 font-medium">👥 Active Vendors</span>
            <span className="font-bold text-green-600">42</span>
          </div>
        </div>

        {/* Profile Button */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-full flex items-center space-x-3 p-3 rounded-xl transition-colors duration-200 hover:bg-gray-100 group"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-inner" style={{ background: brandLightPurple }}>
              <span className="text-white font-bold text-sm">
                {user?.email?.charAt(0).toUpperCase() || 'M'}
              </span>
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-bold text-gray-800 truncate">
                {user?.email || 'Manager User'}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ') || 'Manager'}</p>
            </div>
            <ChevronDown 
              className={`text-gray-500 transition-transform duration-300 group-hover:text-gray-800 ${isProfileOpen ? 'rotate-180' : ''}`} 
            />
          </button>

          {/* Profile Dropdown - Styled with Modern Look */}
          {isProfileOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-20 origin-bottom animate-slide-up">
              
              <Link
                href="/manager/profile"
                className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <UserCircle className="text-gray-500"/>
                <span>Profile Settings</span>
              </Link>
              
              <Link
                href="/manager/settings"
                className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Settings className="text-gray-500"/>
                <span>Settings</span>
              </Link>
              
              <div className="border-t border-gray-100 my-1"></div>
              
              <button
                onClick={logout}
                // Custom style for danger action with brand pink
                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 transition-colors group"
                style={{ backgroundColor: 'transparent', transition: 'background-color 0.3s' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--brand-light-pink)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <LogOut className="text-red-600 group-hover:text-red-700"/>
                <span className="text-red-600 font-semibold">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}