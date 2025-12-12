"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../(auth)/context/AuthContext";

// Icons
import {
  FiPackage,
  FiTruck,
  FiShoppingCart,
  FiRotateCcw,
  FiRepeat,
  FiChevronsRight,
} from "react-icons/fi";

// =======================
// SVG Icons (Same as Manager)
// =======================
const LayoutDashboard = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="9" y1="3" x2="9" y2="21" />
    <line x1="15" y1="3" x2="15" y2="21" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="3" y1="15" x2="21" y2="15" />
  </svg>
);

const BarChart = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
);

const ChevronDown = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const UserCircle = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const Settings = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const LogOut = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
);

// =======================
// Submenu Component
// =======================
const SubMenuItem = ({ href, label, active, brandPurple }: any) => (
  <Link
    href={href}
    className={`
      flex items-center space-x-2 pl-12 pr-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200
      ${active ? "text-white font-bold" : "text-gray-600 hover:bg-gray-100"}
    `}
    style={active ? { backgroundColor: brandPurple } : undefined}
  >
    <FiChevronsRight className="w-4 h-4" />
    <span>{label}</span>
  </Link>
);

// =======================
// MAIN COMPONENT
// =======================
export default function WarehouseNavbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const brandPurple = "#852BAF";
  const brandPink = "#FC3F78";
  const brandLightPurple = "#F3E8FF";

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Track dropdown states
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const isActive = (href: string) => pathname === href;

  // ===========================
  // WAREHOUSE MENU CONFIG
  // ===========================
  const navItems = [
    {
      href: "/src/warehouse/dashboard",
      label: "Dashboard",
      Icon: LayoutDashboard,
    },

    {
      label: "Inventory",
      Icon: FiTruck,
      isDropdown: true,
      children: [
                {
          href: "/src/warehouse/Inventory",
          label: "Stock Summary",
        },
        { href: "/src/warehouse/stock/stockin", label: "Stock In" },
        { href: "/src/warehouse/stock/stockout", label: "Stock Out" },
        {
          href: "/src/warehouse/stock/stockadjustment",
          label: "Stock Adjustment",
        },

      ],
    },
    // {
    //   href: "/src/warehouse/Inventory",
    //   label: "Stock Summary",
    //   Icon: BarChart,
    // },

    {
      label: "Order Status",
      Icon: FiShoppingCart,
      isDropdown: true,
      children: [
        { href: "/warehouse/fulfilment/picking", label: "Pending" },
        { href: "/warehouse/fulfilment/dispatch", label: "Dispatch" },
        { href: "/warehouse/fulfilment/awb", label: "Return" },
      ],
    },

    // {
    //   label: 'Stock Transfer',
    //   Icon: FiRepeat,
    //   isDropdown: true,
    //   children: [
    //     { href: '/warehouse/transfer/warehouse', label: 'Warehouse to Warehouse' },
    //     { href: '/warehouse/transfer/bin', label: 'Bin to Bin' },
    //   ]
    // },

    { href: "/warehouse/reports", label: "Reports", Icon: BarChart },
  ];

  return (
    <nav className="fixed top-0 left-0 z-10 flex flex-col h-full bg-white border-r border-gray-100 w-60 shadow-xl/5">
      {/* LOGO SECTION */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div
            className="flex items-center justify-center w-10 h-10 shadow-lg rounded-xl"
            style={{
              backgroundImage: `linear-gradient(45deg, ${brandPurple}, ${brandPink})`,
            }}
          >
            <span className="text-lg font-extrabold text-white">W</span>
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">Warehouse</h1>
            <p className="text-xs text-gray-400">Management Portal</p>
          </div>
        </div>
      </div>

      {/* MENU ITEMS */}
      <div className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item: any, index: number) => {
          // DROPDOWN ITEM
          if (item.isDropdown) {
            const isOpen = openDropdown === item.label;

            return (
              <div key={index} className="space-y-1">
                <button
                  onClick={() => toggleDropdown(item.label)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold
                    ${
                      isOpen
                        ? "bg-opacity-10 shadow-md text-gray-900"
                        : "text-gray-600 hover:bg-gray-50"
                    }
                  `}
                  style={
                    isOpen
                      ? {
                          backgroundColor: brandLightPurple,
                          color: brandPurple,
                        }
                      : undefined
                  }
                >
                  <div className="flex items-center space-x-3">
                    <item.Icon className="text-gray-400" />
                    <span>{item.label}</span>
                  </div>

                  <ChevronDown
                    className={`transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* SUBMENU */}
                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    isOpen ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="pt-1 pb-2 pl-2 space-y-1">
                    {item.children.map((child: any) => (
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
          }

          // STANDARD MENU ITEM
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold
                ${
                  active
                    ? "bg-opacity-10 shadow-md"
                    : "text-gray-600 hover:bg-gray-50"
                }
              `}
              style={
                active
                  ? { backgroundColor: brandLightPurple, color: brandPurple }
                  : undefined
              }
            >
              <item.Icon className="text-gray-400" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* PROFILE SECTION */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="flex items-center w-full p-3 space-x-3 rounded-xl hover:bg-gray-100"
        >
          <div
            className="flex items-center justify-center w-10 h-10 rounded-full"
            style={{ background: brandLightPurple }}
          >
            <span className="font-bold" style={{ color: brandPurple }}>
              {user?.email?.charAt(0).toUpperCase() || "W"}
            </span>
          </div>

          <div className="text-left">
            <p className="text-sm font-bold text-gray-800">
              {user?.email || "Warehouse User"}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.role || "warehouse_manager"}
            </p>
          </div>

          <ChevronDown
            className={`transition-transform ${
              isProfileOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isProfileOpen && (
          <div className="mt-2 bg-white border shadow-xl rounded-xl">
            <Link
              href="/warehouse/profile"
              className="flex items-center px-4 py-2 space-x-2 text-sm hover:bg-gray-50"
            >
              <UserCircle /> <span>Profile</span>
            </Link>

            <Link
              href="/warehouse/settings"
              className="flex items-center px-4 py-2 space-x-2 text-sm hover:bg-gray-50"
            >
              <Settings /> <span>Settings</span>
            </Link>

            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-2 space-x-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut /> <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
