'use client';

import { useState, useEffect } from "react";
import Link from "next/link";

import { FaUsers, FaClipboardList, FaMoneyBillWave, FaBuilding } from "react-icons/fa";
import { FiClock, FiPackage } from "react-icons/fi";
import DashboardCharts from "../../components/Charts/DashboardCharts";

interface ManagerStats {
  totalVendors: number;
  pendingApprovals: number;
  activeProducts: number;
  totalRevenue: number;
  monthlyLabels: string[];
  monthlyRevenue: number[];
  vendorCount: number[];
  productCount: number[];
}

export default function ManagerDashboard() {

  const [stats, setStats] = useState<ManagerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/manager/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (json.success) setStats(json.data);

    } catch (err) {
      console.error("Stats Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-b-2 border-[#852BAF] rounded-full"></div>
      </div>
    );

  return (
    <div className="p-6 space-y-6 bg-[#FFFAFB]">

      {/* Welcome */}
      <div className="p-6 rounded-2xl text-white"
        style={{ background: "linear-gradient(to right, #852BAF, #D887FD)" }}>
        <h1 className="text-3xl font-bold">Manager Dashboard</h1>
        <p className="text-pink-200">Overview & statistics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Total Vendors */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="flex items-center">
            <FaUsers className="text-[#852BAF] text-3xl" />
            <div className="ml-3">
              <p className="text-gray-500 text-sm">Total Vendors</p>
              <p className="text-2xl font-bold">{stats.totalVendors}</p>
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="flex items-center">
            <FiClock className="text-[#D887FD] text-3xl" />
            <div className="ml-3">
              <p className="text-gray-500 text-sm">Pending Approvals</p>
              <p className="text-2xl font-bold">{stats.pendingApprovals}</p>
            </div>
          </div>
        </div>

        {/* Active Products */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="flex items-center">
            <FiPackage className="text-green-600 text-3xl" />
            <div className="ml-3">
              <p className="text-gray-500 text-sm">Active Products</p>
              <p className="text-2xl font-bold">{stats.activeProducts}</p>
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="flex items-center">
            <FaMoneyBillWave className="text-[#FC3F78] text-3xl" />
            <div className="ml-3">
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold">₹{stats.totalRevenue}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Charts */}
      <DashboardCharts
        monthlyLabels={stats.monthlyLabels}
        monthlyRevenue={stats.monthlyRevenue}
        vendorCount={stats.vendorCount}
        productCount={stats.productCount}
      />

    </div>
  );
}
