"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../(auth)/context/AuthContext";

// --- Icon Placeholders (For a real app, install and import from a library like 'lucide-react')
const LayoutDashboard = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="9" />
    <rect x="14" y="3" width="7" height="5" />
    <rect x="14" y="12" width="7" height="9" />
    <rect x="3" y="16" width="7" height="5" />
  </svg>
);
const Package = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m7.5 4.27 9 5.15" />
    <path d="m21 8.24-9-5.15-9 5.15" />
    <path d="M3.27 12.44 12 17.59l8.73-5.15" />
    <path d="M2.57 17.59 12 22.74l9.43-5.15" />
    <line x1="12" x2="12" y1="2.76" y2="22.74" />
  </svg>
);
const PlusSquare = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const OrderTrackingV3 = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Package icon */}
    <rect x="6" y="6" width="12" height="12" rx="2" ry="2" />
    <path d="M6 6v12" />
    <path d="M18 6v12" />
    <path d="M6 12h12" />

    {/* Progress Path */}
    <path d="M4 16c4 2 8 2 12 0" />

    {/* Progress Marker (checkmark) */}
    <path d="M18 9l-2 2-4-4" />
  </svg>
);

const Building2 = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 22V7.5L12 2L6 7.5V22" />
    <path d="M4 22h16" />
    <path d="M8 15h2" />
    <path d="M8 11h2" />
    <path d="M14 15h2" />
    <path d="M14 11h2" />
  </svg>
);
const LogOut = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
);
// ---

export default function VendorNavbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Define utility classes based on the provided colors (using CSS variables)
  const brandPurple = "var(--brand-purple)";
  const brandPink = "var(--brand-pink)";
  const brandLightPurple = "var(--brand-light-purple)";

  const navItems = [
    {
      href: "/src/vendor/onboarding",
      label: "Business Profile",
      Icon: Building2,
    },
    {
      href: "/src/vendor/dashboard",
      label: "Dashboard",
      Icon: LayoutDashboard,
    },

    {
      href: "/src/vendor/products/add",
      label: "Add Product",
      Icon: PlusSquare,
    },

    { href: "/src/vendor/products/list", label: "Products", Icon: Package },

    {
      href: "/src/vendor/products/track-order",
      label: "Track Order",
      Icon: OrderTrackingV3,
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="fixed top-0 left-0 h-full w-60 bg-white shadow-xl/5 border-r border-gray-100 flex flex-col transition-all duration-300 z-10">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          {/* Gradient Logo with hover scale */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transform transition duration-300 hover:scale-[1.05]"
            style={{
              backgroundImage: `linear-gradient(45deg, ${brandPurple}, ${brandPink})`,
            }}
          >
            <span className="text-white font-extrabold text-lg tracking-widest">
              R
            </span>
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
              Rewards
            </h1>
            <p className="text-xs text-gray-400 font-medium">Vendor Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="p-4 space-y-1 flex-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const activeStyle = {
            backgroundColor: brandLightPurple, // Use lighter brand color for background
            color: brandPurple, // Use primary brand color for text
            boxShadow: `0 4px 6px -1px rgba(133, 43, 175, 0.1), 0 2px 4px -2px rgba(133, 43, 175, 0.1)`,
          };

          return (
            <Link
              key={item.href}
              href={item.href}
              // Base and Hover styles with smooth transitions and subtle translation
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold 
                transition-all duration-200 ease-in-out transform 
                ${
                  active
                    ? "bg-opacity-10 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50 hover:translate-x-1"
                }
              `}
              style={active ? activeStyle : undefined}
            >
              {/* Icon component with color change */}
              <item.Icon
                className={active ? "text-brand-purple" : "text-gray-400"}
                style={active ? { color: brandPurple } : undefined}
              />

              <span>{item.label}</span>

              {/* Active Indicator */}
              {active && (
                <span
                  className="w-1.5 h-1.5 ml-auto rounded-full transition-all duration-500"
                  style={{ backgroundColor: brandPink }} // Using pink for the indicator
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-100 mt-auto">
        {/* User Info Card */}
        <div className="flex items-center space-x-3 mb-4 p-2 rounded-xl transition-colors duration-300 hover:bg-gray-100 cursor-pointer">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-inner"
            style={{ background: brandLightPurple }}
          >
            <span className="text-white font-bold text-base">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-800 truncate">
              {user?.email || "Vendor User"}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.role || "vendor"}
            </p>
          </div>
        </div>

        {/* Logout Button with slide-in animation */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-semibold text-gray-700 rounded-xl transition-all duration-300 border border-gray-200
                     hover:text-white hover:shadow-md hover:shadow-brand-purple/20 group overflow-hidden relative"
          // Set up the background for the slide animation
          style={{
            background: `linear-gradient(to right, white 50%, ${brandPurple} 50%)`,
            backgroundSize: "200% 100%",
            backgroundPosition: "left center",
          }}
          // Add inline functions for the animation effect
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundPosition = "right center")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundPosition = "left center")
          }
        >
          <LogOut className="text-gray-500 group-hover:text-white transition-colors duration-300" />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}
