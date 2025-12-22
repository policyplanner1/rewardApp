"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../../(auth)/context/AuthContext";

import {
  FaBox,
  FaCheckCircle,
  FaMoneyBillWave,
  FaPlus,
  FaListAlt,
  FaBuilding,
  FaTimesCircle,
} from "react-icons/fa";

import { FiClock } from "react-icons/fi";

interface VendorStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
}

export default function VendorDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState<VendorStats>({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendorStats();
  }, []);

  const fetchVendorStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/vendor/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();

      if (json.success) {
        setStats(json.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: "#FFFAFB" }}
      >
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2"
          style={{ borderColor: "#852BAF" }}
        ></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: "#FFFAFB" }}>
      {/* Welcome */}
      <div
        className="rounded-2xl p-6 text-white"
        style={{ background: "linear-gradient(to right, #852BAF, #FC3F78)" }}
      >
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.email}!
        </h1>
        <p style={{ color: "#D887FD" }}>
          Manage your products and track performance
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Products */}
        <div className="bg-white rounded-xl p-6 shadow-xl hover:shadow-2xl transition">
          <div className="flex items-center">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: "rgba(133, 43, 175, 0.15)" }}
            >
              <FaBox className="text-2xl" style={{ color: "#852BAF" }} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-xl p-6 shadow-xl hover:shadow-2xl transition">
          <div className="flex items-center">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: "rgba(216, 135, 253, 0.3)" }}
            >
              <FiClock className="text-2xl" style={{ color: "#D887FD" }} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.pending}
              </p>
            </div>
          </div>
        </div>

        {/* Approved */}
        <div className="bg-white rounded-xl p-6 shadow-xl hover:shadow-2xl transition">
          <div className="flex items-center">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: "rgba(16, 185, 129, 0.15)" }}
            >
              <FaCheckCircle className="text-2xl text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.approved}
              </p>
            </div>
          </div>
        </div>

        {/* Rejected */}
        <div className="bg-white rounded-xl p-6 shadow-xl hover:shadow-2xl transition">
          <div className="flex items-center">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: "rgba(252, 63, 120, 0.15)" }}
            >
              <FaTimesCircle
                className="text-2xl"
                style={{ color: "#FC3F78" }}
              />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.rejected}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/src/vendor/products/add" className="block">
          <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-lg cursor-pointer">
            <div className="text-center">
              <div
                className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3"
                style={{ backgroundColor: "#852BAF" }}
              >
                <FaPlus className="text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">Add New Product</h3>
              <p className="text-sm text-gray-600">
                Create new product listing
              </p>
            </div>
          </div>
        </Link>

        <Link href="/src/vendor/products/list" className="block">
          <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-lg cursor-pointer">
            <div className="text-center">
              <div
                className="mx-auto w-12 h-12 rounded-full mb-3"
                style={{ backgroundColor: "#FC3F78" }}
              >
                <FaListAlt className="text-white text-xl" />
              </div>
              <h3 className="font-semibold text-gray-900">Manage Products</h3>
              <p className="text-sm text-gray-600">
                View and edit your products
              </p>
            </div>
          </div>
        </Link>

        <Link href="/src/vendor/onboarding" className="block">
          <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-lg cursor-pointer">
            <div className="text-center">
              <div
                className="mx-auto w-12 h-12 rounded-full mb-3"
                style={{ backgroundColor: "#D887FD" }}
              >
                <FaBuilding className="text-white text-xl" />
              </div>
              <h3 className="font-semibold text-gray-900">Business Profile</h3>
              <p className="text-sm text-gray-600">
                Update company information
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
