"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../(auth)/context/AuthContext";
import { useState } from "react";
import { FiTag } from "react-icons/fi";

/* ---------------- ICONS ---------------- */

const LayoutDashboard = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="9" />
    <rect x="14" y="3" width="7" height="5" />
    <rect x="14" y="12" width="7" height="9" />
    <rect x="3" y="16" width="7" height="5" />
  </svg>
);

const Package = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m7.5 4.27 9 5.15" />
    <path d="m21 8.24-9-5.15-9 5.15" />
    <path d="M3.27 12.44 12 17.59l8.73-5.15" />
    <path d="M2.57 17.59 12 22.74l9.43-5.15" />
    <line x1="12" x2="12" y1="2.76" y2="22.74" />
  </svg>
);

const PlusSquare = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const Building2 = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 22V7.5L12 2L6 7.5V22" />
    <path d="M4 22h16" />
  </svg>
);

const LogOut = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

/* ---------------- COMPONENT ---------------- */

export default function VendorNavbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const [openDropdown, setOpenDropdown] = useState<string | null>("Products");

  const navItems = [
    {
      href: "/src/vendor/dashboard",
      label: "Dashboard",
      Icon: LayoutDashboard,
    },
    {
      href: "/src/vendor/onboarding",
      label: "Onboarding Form",
      Icon: Building2,
    },
    {
      label: "Products",
      Icon: FiTag,
      isDropdown: true,
      children: [
        {
          href: "/src/vendor/products/add",
          label: "Add Product",
          Icon: PlusSquare,
        },
        {
          href: "/src/vendor/products/list",
          label: "Product List",
          Icon: Package,
        },
      ],
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="fixed top-0 left-0 h-full w-60 bg-white border-r border-gray-100 flex flex-col">
      {/* LOGO */}
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold">Rewards</h1>
        <p className="text-xs text-gray-400">Vendor Portal</p>
      </div>

      {/* MENU */}
      <div className="p-4 space-y-1 flex-1">
        {navItems.map((item) => {
          if (item.isDropdown) {
            const isOpen = openDropdown === item.label;

            return (
              <div key={item.label}>
                <button
                  onClick={() =>
                    setOpenDropdown(isOpen ? null : item.label)
                  }
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 font-semibold hover:bg-gray-50"
                >
                  <item.Icon />
                  <span>{item.label}</span>
                </button>

                {isOpen && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.children.map((child: any) => {
                      const active = isActive(child.href);
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block px-4 py-2 rounded-lg text-sm font-medium ${
                            active
                              ? "bg-purple-100 text-purple-700"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold ${
                active
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <item.Icon />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* USER / LOGOUT */}
      <div className="p-4 border-t">
        <p className="text-sm font-semibold truncate">{user?.email}</p>
        <button
          onClick={logout}
          className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border hover:bg-purple-600 hover:text-white"
        >
          <LogOut />
          Logout
        </button>
      </div>
    </nav>
  );
}
