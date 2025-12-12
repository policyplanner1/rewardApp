// 'use client';

// import { useState, useEffect } from "react";
// import Link from "next/link";

// import { FaUsers, FaClipboardList, FaMoneyBillWave, FaBuilding } from "react-icons/fa";
// import { FiClock, FiPackage } from "react-icons/fi";
// import DashboardCharts from "../../components/Charts/DashboardCharts";

// interface ManagerStats {
//   totalVendors: number;
//   pendingApprovals: number;
//   activeProducts: number;
//   totalRevenue: number;
//   monthlyLabels: string[];
//   monthlyRevenue: number[];
//   vendorCount: number[];
//   productCount: number[];
// }

// export default function ManagerDashboard() {

//   const [stats, setStats] = useState<ManagerStats | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => { loadStats(); }, []);

//   const loadStats = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const res = await fetch("http://localhost:5000/api/manager/stats", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const json = await res.json();
//       console.log("Manager Stats:", json);
//       if (json.success) setStats(json.data);

//     } catch (err) {
//       console.error("Stats Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading || !stats)
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin w-10 h-10 border-b-2 border-[#852BAF] rounded-full"></div>
//       </div>
//     );

//   return (
//     <div className="p-6 space-y-6 bg-[#FFFAFB]">

//       {/* Welcome */}
//       <div className="p-6 text-white rounded-2xl"
//         style={{ background: "linear-gradient(to right, #852BAF, #D887FD)" }}>
//         <h1 className="text-3xl font-bold">Manager Dashboard</h1>
//         <p className="text-pink-200">Overview & statistics</p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">

//         {/* Total Vendors */}
//         <div className="p-6 bg-white border shadow rounded-xl">
//           <div className="flex items-center">
//             <FaUsers className="text-[#852BAF] text-3xl" />
//             <div className="ml-3">
//               <p className="text-sm text-gray-500">Total Vendors</p>
//               <p className="text-2xl font-bold">{stats.totalVendors}</p>
//             </div>
//           </div>
//         </div>

//         {/* Pending */}
//         <div className="p-6 bg-white border shadow rounded-xl">
//           <div className="flex items-center">
//             <FiClock className="text-[#D887FD] text-3xl" />
//             <div className="ml-3">
//               <p className="text-sm text-gray-500">Pending Approvals</p>
//               <p className="text-2xl font-bold">{stats.pendingApprovals}</p>
//             </div>
//           </div>
//         </div>

//         {/* Active Products */}
//         <div className="p-6 bg-white border shadow rounded-xl">
//           <div className="flex items-center">
//             <FiPackage className="text-3xl text-green-600" />
//             <div className="ml-3">
//               <p className="text-sm text-gray-500">Active Products</p>
//               <p className="text-2xl font-bold">{stats.activeProducts}</p>
//             </div>
//           </div>
//         </div>

//         {/* Revenue */}
//         <div className="p-6 bg-white border shadow rounded-xl">
//           <div className="flex items-center">
//             <FaMoneyBillWave className="text-[#FC3F78] text-3xl" />
//             <div className="ml-3">
//               <p className="text-sm text-gray-500">Total Revenue</p>
//               <p className="text-2xl font-bold">₹{stats.totalRevenue}</p>
//             </div>
//           </div>
//         </div>

//       </div>

//       {/* Charts */}
//       <DashboardCharts
//         monthlyLabels={stats.monthlyLabels}
//         monthlyRevenue={stats.monthlyRevenue}
//         vendorCount={stats.vendorCount}
//         productCount={stats.productCount}
//       />

//     </div>
//   );
// }



"use client";

import { useState, useEffect } from "react";
import DashboardCharts from "../../components/Charts/DashboardCharts";
import { FaUsers, FaMoneyBillWave } from "react-icons/fa";
import { FiClock, FiPackage } from "react-icons/fi";

interface ManagerStats {
  totalVendors: number;
  pendingApprovals: number;
  activeProducts: number;
  totalRevenue: number;

  // Charts data
  monthlyLabels?: string[];
  monthlyRevenue?: number[];
  vendorCount?: number[];
  productCount?: number[];
}

export default function ManagerDashboard() {
  const [stats, setStats] = useState<ManagerStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Fallback static chart data
  const STATIC_CHARTS = {
    monthlyLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    monthlyRevenue: [50000, 60000, 45000, 80000, 75000, 90000],
    vendorCount: [5, 10, 12, 15, 20, 22],
    productCount: [20, 25, 28, 35, 40, 48],
  };

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/manager/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      console.log("Manager Stats:", json);

      if (json.success) {
        const apiData = json.data;

        // Auto apply fallback values if BE didn't send them
        const mergedStats = {
          ...apiData,
          monthlyLabels: apiData.monthlyLabels || STATIC_CHARTS.monthlyLabels,
          monthlyRevenue: apiData.monthlyRevenue || STATIC_CHARTS.monthlyRevenue,
          vendorCount: apiData.vendorCount || STATIC_CHARTS.vendorCount,
          productCount: apiData.productCount || STATIC_CHARTS.productCount,
        };

        setStats(mergedStats);
      } else {
        throw new Error("API Returned Error");
      }

    } catch (err) {
      console.error("Stats Error:", err);

      // Use static fallback if backend fails
      setStats({
        totalVendors: 0,
        pendingApprovals: 0,
        activeProducts: 0,
        totalRevenue: 0,
        ...STATIC_CHARTS,
      });

    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-10 h-10 border-b-2 border-[#852BAF] rounded-full"></div>
      </div>
    );

  return (
    <div className="p-6 space-y-6 bg-[#FFFAFB]">

      {/* Banner */}
      <div
        className="p-6 text-white rounded-2xl"
        style={{ background: "linear-gradient(to right, #852BAF, #D887FD)" }}
      >
        <h1 className="text-3xl font-bold">Manager Dashboard</h1>
        <p className="text-pink-200">Overview & Statistics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">

        {/* Vendors */}
        <div className="p-6 transition bg-white border hover:shadow-xl rounded-xl">
          <div className="flex items-center">
            <FaUsers className="text-[#852BAF] text-3xl" />
            <div className="ml-3">
              <p className="text-sm text-gray-500">Total Vendors</p>
              <p className="text-2xl font-bold">{stats.totalVendors}</p>
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="p-6 transition bg-white border hover:shadow-xl rounded-xl">
          <div className="flex items-center">
            <FiClock className="text-[#D887FD] text-3xl" />
            <div className="ml-3">
              <p className="text-sm text-gray-500">Pending Approvals</p>
              <p className="text-2xl font-bold">{stats.pendingApprovals}</p>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="p-6 transition bg-white border hover:shadow-xl rounded-xl">
          <div className="flex items-center">
            <FiPackage className="text-3xl text-green-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-500">Active Products</p>
              <p className="text-2xl font-bold">{stats.activeProducts}</p>
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="p-6 transition bg-white border hover:shadow-xl rounded-xl">
          <div className="flex items-center">
            <FaMoneyBillWave className="text-[#FC3F78] text-3xl" />
            <div className="ml-3">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold">₹{stats.totalRevenue}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Charts */}
      <DashboardCharts
        monthlyLabels={stats.monthlyLabels!}
        monthlyRevenue={stats.monthlyRevenue!}
        vendorCount={stats.vendorCount!}
        productCount={stats.productCount!}
      />

    </div>
  );
}

