"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../(auth)/context/AuthContext";
import { useEffect, useState } from "react";
import { FiTag } from "react-icons/fi";
import {
  FiChevronDown,
  FiSettings,
  FiLogOut,
  FiUsers,
  FiPackage,
  FiBarChart2,
  FiCheckCircle,
  FiGrid,
} from "react-icons/fi";

import { HiOutlineUserCircle } from "react-icons/hi2";


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

/* ---------------- COMPONENT ---------------- */

export default function VendorNavbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const [openDropdown, setOpenDropdown] = useState<string | null>("Products");
  const [vendorStatus, setVendorStatus] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  /* ---------------- FETCH VENDOR STATUS ---------------- */

  useEffect(() => {
    const fetchVendorStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(
          "http://localhost:5000/api/vendor/my-details",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        if (data.success) {
          setVendorStatus(data.vendor.status);
        }
      } catch (err) {
        console.error("Failed to fetch vendor status", err);
      } finally {
        setLoadingStatus(false);
      }
    };

    fetchVendorStatus();
  }, []);

  /* Close profile dropdown on route change */
  useEffect(() => {
    setIsProfileOpen(false);
  }, [pathname]);

  const isApproved = vendorStatus === "approved";

  /* ---------------- NAV ITEMS ---------------- */

  const navItems = [
    {
      href: "/src/vendor/dashboard",
      label: "Dashboard",
      Icon: LayoutDashboard,
    },

    !isApproved && {
      href: "/src/vendor/onboarding",
      label: "Onboarding Form",
      Icon: Building2,
    },

    isApproved && {
      label: "Onboarding Completed",
      Icon: Building2,
      isDisabled: true,
    },

    isApproved && {
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
  ].filter(Boolean) as any[];

  const isActive = (href: string) => pathname === href;

  if (loadingStatus) return null;

  return (
    <nav className="fixed top-0 left-0 flex flex-col h-full bg-white border-r border-gray-100 w-60">
      {/* LOGO */}
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold">Rewards</h1>
        <p className="text-xs text-gray-400">Vendor Portal</p>
      </div>

      {/* MENU */}
      <div className="flex-1 p-4 space-y-1">
        {navItems.map((item: any) => {
          if (item.isDisabled) {
            return (
              <div
                key={item.label}
                className="flex items-center gap-3 px-4 py-3 font-semibold text-green-700 cursor-default rounded-xl bg-green-50"
              >
                <item.Icon />
                <span>{item.label}</span>
              </div>
            );
          }

          if (item.isDropdown) {
            const isOpen = openDropdown === item.label;

            return (
              <div key={item.label}>
                <button
                  onClick={() =>
                    setOpenDropdown(isOpen ? null : item.label)
                  }
                  className="flex items-center w-full gap-3 px-4 py-3 font-semibold text-gray-700 rounded-xl hover:bg-gray-50"
                >
                  <item.Icon />
                  <span>{item.label}</span>
                </button>

                {isOpen && (
                  <div className="mt-1 ml-6 space-y-1">
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

      {/* ---------------- PROFILE DROPDOWN ---------------- */}
      <div className="p-4 mt-auto border-t border-gray-100">
  <div className="relative">
    <button
      onClick={() => setIsProfileOpen(!isProfileOpen)}
      className="flex items-center w-full p-3 space-x-3 transition-colors duration-200 rounded-xl hover:bg-gray-100 group"
    >
      {/* Avatar */}
      <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
        <span className="text-sm font-bold text-purple-700">
          {user?.email?.charAt(0).toUpperCase() || "V"}
        </span>
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0 text-left">
        <p className="text-sm font-bold text-gray-800 truncate">
          {user?.email || "Vendor User"}
        </p>
        <p className="text-xs text-gray-500 capitalize">
          {user?.role?.replace("_", " ") || "Vendor"}
        </p>
      </div>

      {/* Chevron */}
      <FiChevronDown
        size={18}
        className={`text-gray-500 transition-transform duration-300 ${
          isProfileOpen ? "rotate-180" : ""
        }`}
      />
    </button>

    {/* DROPDOWN */}
    {isProfileOpen && (
      <div className="absolute left-0 right-0 z-20 py-2 mb-2 origin-bottom bg-white border border-gray-100 shadow-2xl bottom-full rounded-xl">
        <Link
          href="/src/vendor/profile"
          className="flex items-center px-4 py-2 space-x-3 text-sm text-gray-700 hover:bg-gray-50"
        >
          <HiOutlineUserCircle size={18} className="text-gray-500" />
          <span>Profile Settings</span>
        </Link>

        {/* <Link
          href="/src/vendor/settings"
          className="flex items-center px-4 py-2 space-x-3 text-sm text-gray-700 hover:bg-gray-50"
        >
          <FiSettings size={18} className="text-gray-500" />
          <span>Settings</span>
        </Link> */}

        <div className="my-1 border-t border-gray-100" />

        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-2 space-x-3 text-sm font-semibold text-red-600 hover:bg-red-50"
        >
          <FiLogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    )}
  </div>
</div>

    </nav>
  );
}
