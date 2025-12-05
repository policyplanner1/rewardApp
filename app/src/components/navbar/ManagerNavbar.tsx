'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../../(auth)/context/AuthContext';
import { FiTag, FiChevronsRight } from 'react-icons/fi'; // Import Category-related icons

// --- Icon Placeholders (Assume these are imported or defined)
// NOTE: I am redefining the imported components to use 'react-icons/fi' 
// or providing placeholders where necessary for a complete solution.
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

// Custom Tailwind utility classes for animation (Assuming you have access to tailwind.config.js)
// If you don't have access, you must ensure these animations are defined in your CSS/config:
/* 
@keyframes slide-down {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-down {
  animation: slide-down 0.3s ease-out forwards;
}
*/


// Component for the Submenu Dropdown Item
const SubMenuItem: React.FC<{ href: string; label: string; active: boolean; brandPurple: string }> = ({ href, label, active, brandPurple }) => {
    return (
        <Link
            href={href}
            className={`
                flex items-center space-x-2 pl-12 pr-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 
                ${active 
                    ? 'text-white font-bold bg-opacity-90' 
                    : 'text-gray-600 hover:bg-gray-100'
                }
            `}
            style={active ? { backgroundColor: brandPurple } : undefined}
        >
            <FiChevronsRight className="w-4 h-4" />
            <span>{label}</span>
        </Link>
    );
};

export default function ManagerNavbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  // New state for Category Management dropdown
  const [isCategoryManagementOpen, setIsCategoryManagementOpen] = useState(false);

  // Define utility styles based on the provided colors
  const brandPurple = '#852BAF'; // Default hex for brand-purple
  const brandPink = '#FC3F78'; // Default hex for brand-pink
  const brandLightPurple = '#F3E8FF'; // Default hex for brand-light-purple

  // Check if any of the category paths are currently active
  const isCategoryPathActive = pathname.startsWith('/src/manager/dashboard/category') || 
                             pathname.startsWith('/src/manager/dashboard/subcategory') ||
                             pathname.startsWith('/src/manager/dashboard/subsubcategory');

  // Sync dropdown state if a child route is active on load
  useState(() => {
    if (isCategoryPathActive) {
      setIsCategoryManagementOpen(true);
    }
  });


  const navItems = [
    { href: '/src/manager/dashboard', label: 'Dashboard', Icon: LayoutDashboard, isDropdown: false },
    { href: '/src/manager/dashboard/vendorlist', label: 'Vendors', Icon: Users, isDropdown: false },
    { href: '/src/manager/dashboard/product/productList', label: 'Products', Icon: Package, isDropdown: false },
    // --- New Category Management Dropdown Item ---
    { 
        label: 'Category Management', 
        Icon: FiTag, 
        isDropdown: true, 
        children: [
            { href: '/src/manager/category_management/categories', label: 'Categories' },
            { href: '/src/manager/category_management/subcategories', label: 'Subcategories' },
            { href: '/src/manager/category_management/subsubcategories', label: 'Type / Sub-type' },
        ],
        // Set the initial open state based on the current path
        initialOpen: isCategoryPathActive
    },
    // ---------------------------------------------
    { href: '/src/manager/approvals', label: 'Approvals', Icon: CheckCircle, badge: 5, isDropdown: false },
    { href: '/src/manager/analytics', label: 'Analytics', Icon: BarChart, isDropdown: false },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="fixed top-0 left-0 z-10 flex flex-col h-full transition-all duration-300 bg-white border-r border-gray-100 w-60 shadow-xl/5">

      {/* Logo Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transform transition duration-300 hover:scale-[1.05]"
            style={{ backgroundImage: `linear-gradient(45deg, ${brandPurple}, ${brandPink})` }}
          >
            <span className="text-lg font-extrabold tracking-widest text-white">R</span>
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-gray-900">Rewards</h1>
            <p className="text-xs font-medium text-gray-400">Manager Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item, index) => {
          
          if (item.isDropdown) {
            // --- Dropdown Menu Rendering (Category Management) ---
            const isOpen = isCategoryManagementOpen;
            const itemActive = isCategoryPathActive;

            return (
              <div key={index} className="space-y-1">
                <button
                  onClick={() => setIsCategoryManagementOpen(!isOpen)}
                  className={`
                    w-full flex items-center justify-between space-x-3 px-4 py-3 rounded-xl font-semibold 
                    transition-all duration-200 ease-in-out transform 
                    ${itemActive 
                        ? 'bg-opacity-10 shadow-md text-gray-900' 
                        : 'text-gray-600 hover:bg-gray-50 hover:translate-x-1'
                    }
                  `}
                  style={itemActive ? { backgroundColor: brandLightPurple, color: brandPurple } : undefined}
                >
                  <div className="flex items-center space-x-3">
                    <item.Icon className={itemActive ? 'text-brand-purple' : 'text-gray-400'} style={itemActive ? {color: brandPurple} : undefined} />
                    <span className="flex-1">{item.label}</span>
                  </div>
                  <ChevronDown 
                    className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                {/* Collapsible Submenu */}
                <div 
                    className={`
                        overflow-hidden transition-max-height duration-500 ease-in-out 
                        ${isOpen ? 'max-h-96' : 'max-h-0'} 
                    `}
                    style={{ maxHeight: isOpen ? '999px' : '0' }} // Use a large fixed value for better transition if max-h-96 is too restrictive
                >
                    <div className="pt-1 pb-2 pl-2 pr-2 space-y-1 animate-slide-down">
                        {item.children?.map((child) => (
                            <SubMenuItem 
                                key={child.href}
                                href={child.href} 
                                label={child.label} 
                                active={isActive(child.href)} 
                                brandPurple={brandPurple} 
                            />
                        ))}
                    </div>
                </div>
              </div>
            );
          } else {
            // --- Standard Menu Item Rendering ---
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
                            : 'text-gray-600 hover:bg-gray-50 hover:translate-x-1'
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
                                    ? 'text-white'
                                    : 'bg-brand-pink text-white'
                            }`}
                            style={active ? { backgroundColor: brandPink } : undefined}
                        >
                            {item.badge}
                        </span>
                    )}
                </Link>
            );
          }
        })}
      </div>

      {/* User Profile Section & Quick Stats */}
      <div className="p-4 mt-auto border-t border-gray-100">
        
        {/* Quick Stats (Kept for completeness) */}
        <div className="p-3 mb-4 border border-gray-100 rounded-lg bg-gray-50">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-gray-600">🚨 Approvals</span>
            <span className="font-bold" style={{ color: brandPink }}>{navItems.find(i => i.label === 'Approvals')?.badge || 0}</span>
          </div>
          <div className="flex items-center justify-between pt-1 mt-1 text-xs border-t border-gray-100">
            <span className="font-medium text-gray-600">👥 Active Vendors</span>
            <span className="font-bold text-green-600">42</span>
          </div>
        </div>

        {/* Profile Dropdown (Kept for completeness) */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center w-full p-3 space-x-3 transition-colors duration-200 rounded-xl hover:bg-gray-100 group"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full shadow-inner" style={{ background: brandLightPurple }}>
              <span className="text-sm font-bold text-white" style={{ color: brandPurple }}>
                {user?.email?.charAt(0).toUpperCase() || 'M'}
              </span>
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-bold text-gray-800 truncate">
                {user?.email || 'Manager User'}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ') || 'Manager'}</p>
            </div>
            <ChevronDown 
              className={`text-gray-500 transition-transform duration-300 group-hover:text-gray-800 ${isProfileOpen ? 'rotate-180' : ''}`} 
            />
          </button>

          {isProfileOpen && (
            <div className="absolute left-0 right-0 z-20 py-2 mb-2 origin-bottom bg-white border border-gray-100 shadow-2xl bottom-full rounded-xl">
              
              <Link
                href="/manager/profile"
                className="flex items-center px-4 py-2 space-x-3 text-sm text-gray-700 transition-colors hover:bg-gray-50"
              >
                <UserCircle className="text-gray-500"/>
                <span>Profile Settings</span>
              </Link>
              
              <Link
                href="/manager/settings"
                className="flex items-center px-4 py-2 space-x-3 text-sm text-gray-700 transition-colors hover:bg-gray-50"
              >
                <Settings className="text-gray-500"/>
                <span>Settings</span>
              </Link>
              
              <div className="my-1 border-t border-gray-100"></div>
              
              <button
                onClick={logout}
                className="flex items-center w-full px-4 py-2 space-x-3 text-sm text-red-600 transition-colors group hover:bg-red-50"
              >
                <LogOut className="text-red-600 group-hover:text-red-700"/>
                <span className="font-semibold text-red-600">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}