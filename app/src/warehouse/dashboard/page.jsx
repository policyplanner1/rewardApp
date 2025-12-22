'use client';

import { useState, useEffect } from "react";
import Link from "next/link";

// Icons
import { FaBoxes, FaTruckLoading, FaShippingFast, FaExclamationTriangle, FaUndo, FaClipboardCheck } from "react-icons/fa";
import { FiPackage, FiZap } from "react-icons/fi";
import { HiOutlineDocumentDownload } from "react-icons/hi"; 
import { GrStackOverflow } from "react-icons/gr";

// =======================
// STATIC DATA (NO TS INTERFACE)
// =======================
const STATIC_STATS = {
  totalSKUs: 1542,
  todayInbound: 15,
  todayOutbound: 235,
  lowStockAlerts: 42,
  pendingPicking: 88,
  pendingPacking: 55,
  pendingReturnsQC: 12,
};

const STATIC_NOTIFICATIONS = [
  { id: 1, message: "Vendor shipment #VSHIP-901 arriving in 2 hours.", type: "inbound", icon: <FaTruckLoading /> },
  { id: 2, message: "Courier pickup scheduled for 3:00 PM (235 orders).", type: "outbound", icon: <FaShippingFast /> },
  { id: 3, message: "Zero stock alert: SKU-455 (Blue Widgets) is out of stock.", type: "alert", icon: <FaExclamationTriangle /> },
  { id: 4, message: "12 returned items require Quality Control review.", type: "returns", icon: <FaUndo /> },
];

export default function WarehouseDashboard() {

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulate Loading
  useEffect(() => {
    setTimeout(() => {
      setStats(STATIC_STATS);
      setLoading(false);
    }, 1000);
  }, []);

  // LOADING Spinner
  if (loading || !stats)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-10 h-10 border-b-2 border-[#852BAF] rounded-full"></div>
      </div>
    );

  // KPI Card Component
  const KPICard = ({ title, value, icon, color }) => (
    <div className="p-6 transition bg-white border border-gray-100 shadow-lg rounded-2xl hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div className="p-3 rounded-full" style={{ backgroundColor: `${color}1A` }}>
          {icon}
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-extrabold" style={{ color }}>{value}</p>
        </div>
      </div>
    </div>
  );

  // Quick Action Component
  const QuickAction = ({ title, icon, href, color }) => (
    <Link href={href}>
      <div className="flex flex-col items-center justify-center p-6 transition bg-white border border-gray-100 shadow-md cursor-pointer rounded-2xl hover:shadow-lg">
        <div className="mb-3 text-4xl" style={{ color }}>{icon}</div>
        <p className="font-semibold text-center text-gray-700">{title}</p>
      </div>
    </Link>
  );

  // Notification Component
  const NotificationItem = ({ message, icon, color }) => (
    <div className="flex items-start p-3 space-x-3 transition hover:bg-gray-50 rounded-xl">
      <div className="pt-1 text-xl" style={{ color }}>{icon}</div>
      <p className="text-sm leading-snug text-gray-700">{message}</p>
    </div>
  );

  return (
    <div className="p-6 md:p-8 space-y-8 bg-[#F8F9FA] min-h-screen">

      {/* HEADER BANNER */}
      <div className="p-8 text-white shadow-2xl rounded-3xl"
        style={{ background: "linear-gradient(135deg, #852BAF, #D887FD)" }}>
        <h1 className="text-4xl font-extrabold">Warehouse Manager Dashboard</h1>
        <p className="mt-1 text-purple-100">Real-time operational overview for today</p>
      </div>

      {/* KPI SECTION */}
      <h2 className="flex items-center text-2xl font-bold text-gray-800">
        <FaClipboardCheck className="mr-2 text-[#FC3F78]" /> Operational Metrics
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

        <KPICard 
          title="Total SKUs" 
          value={stats.totalSKUs} 
          icon={<FaBoxes className="text-3xl" style={{ color: "#852BAF" }} />} 
          color="#852BAF" 
        />

        <KPICard 
          title="Inbound Today" 
          value={stats.todayInbound} 
          icon={<FaTruckLoading className="text-3xl" style={{ color: "#D887FD" }} />} 
          color="#D887FD" 
        />

        <KPICard 
          title="Outbound Today" 
          value={stats.todayOutbound} 
          icon={<FaShippingFast className="text-3xl" style={{ color: "#FC3F78" }} />} 
          color="#FC3F78" 
        />

        <KPICard 
          title="Low Stock Alerts" 
          value={stats.lowStockAlerts} 
          icon={<FaExclamationTriangle className="text-3xl" style={{ color: "#FF7CA3" }} />} 
          color="#FF7CA3" 
        />

        <KPICard 
          title="Pending Picking" 
          value={stats.pendingPicking} 
          icon={<FaClipboardCheck className="text-3xl text-yellow-600" />} 
          color="#C58600" 
        />

        <KPICard 
          title="Pending Packing" 
          value={stats.pendingPacking} 
          icon={<FiPackage className="text-3xl text-indigo-600" />} 
          color="#4F46E5" 
        />

        <KPICard 
          title="Returns QC Pending" 
          value={stats.pendingReturnsQC} 
          icon={<FaUndo className="text-3xl text-teal-600" />} 
          color="#0D9488" 
        />

        <div className="hidden lg:block"></div>
      </div>

      {/* QUICK ACTIONS */}
      <h2 className="flex items-center pt-4 text-2xl font-bold text-gray-800">
        <FiZap className="mr-2 text-[#852BAF]" /> Quick Actions
      </h2>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">

        <QuickAction 
          title="Receive Shipment" 
          icon={<HiOutlineDocumentDownload />} 
          href="/warehouse/inbound/receive" 
          color="#852BAF" 
        />

        <QuickAction 
          title="Pick Orders" 
          icon={<FaClipboardCheck />} 
          href="/warehouse/fulfilment/picking" 
          color="#FC3F78" 
        />

        <QuickAction 
          title="Pack Orders" 
          icon={<FiPackage />} 
          href="/warehouse/fulfilment/packing" 
          color="#D887FD" 
        />

        <QuickAction 
          title="Transfer Stock" 
          icon={<GrStackOverflow />} 
          href="/warehouse/transfer/bin" 
          color="#FF7CA3" 
        />

        <QuickAction 
          title="View Inventory" 
          icon={<FaBoxes />} 
          href="/warehouse/inventory/list" 
          color="#852BAF" 
        />
      </div>

      {/* NOTIFICATIONS + PLACEHOLDER CHART */}
      <div className="grid grid-cols-1 gap-6 pt-4 lg:grid-cols-3">

        <div className="p-6 bg-white border border-gray-100 shadow-lg rounded-2xl lg:col-span-1">
          <h3 className="text-xl font-bold mb-4 flex items-center text-[#FC3F78]">
            Live Alerts & Notifications
          </h3>

          <div className="space-y-3">
            {STATIC_NOTIFICATIONS.map((n) => (
              <NotificationItem
                key={n.id}
                message={n.message}
                icon={n.icon}
                color={
                  n.type === "alert" ? "#FC3F78" :
                  n.type === "inbound" ? "#852BAF" :
                  n.type === "outbound" ? "#D887FD" :
                  "#FF7CA3"
                }
              />
            ))}
          </div>
        </div>

        <div className="p-6 bg-white border border-gray-100 shadow-lg rounded-2xl lg:col-span-2">
          <h3 className="text-xl font-bold text-[#852BAF] mb-4">Performance Chart (Placeholder)</h3>

          <div className="flex items-center justify-center h-64 text-gray-400 border-2 border-dashed rounded-xl">
            Monthly Inbound/Outbound Chart Goes Here
          </div>
        </div>

      </div>

    </div>
  );
}
