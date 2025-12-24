"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../../(auth)/context/AuthContext";

import {
  FaBox,
  FaCheckCircle,
  FaPlus,
  FaListAlt,
  FaBuilding,
  FaTimesCircle,
} from "react-icons/fa";

import { FiClock } from "react-icons/fi";

const API_BASE = "http://localhost:5000";

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

  const [vendorStatus, setVendorStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendorStats();
    fetchVendorStatus();
  }, []);

  const fetchVendorStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/api/vendor/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();

      if (json.success) {
        setStats(json.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchVendorStatus = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/api/vendor/my-details`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (json.success) {
        setVendorStatus(json.vendor.status);
      }
    } catch (error) {
      console.error("Error fetching vendor status:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="w-12 h-12 border-b-2 rounded-full animate-spin"
          style={{ borderColor: "#852BAF" }}
        />
      </div>
    );
  }

  const isApproved = vendorStatus === "approved";

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: "#FFFAFB" }}>
      {/* Welcome */}
      <div
        className="p-6 text-white rounded-2xl"
        style={{ background: "linear-gradient(to right, #852BAF, #FC3F78)" }}
      >
        <h1 className="mb-2 text-3xl font-bold">
          Welcome back, {user?.email}!
        </h1>
        <p style={{ color: "#D887FD" }}>
          {isApproved
            ? "Manage your products and track performance"
            : "Complete onboarding to start selling products"}
        </p>
      </div>

      {/* STATUS INFO */}
      {!isApproved && (
        <div className="p-4 text-yellow-800 bg-yellow-100 border border-yellow-300 rounded-xl">
          <p className="font-medium">
            Your vendor onboarding is not approved yet.
          </p>
          <p className="mt-1 text-sm">
            Please complete or wait for approval to access product features.
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Products */}
        <div className="p-6 bg-white shadow rounded-xl">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FaBox className="text-2xl text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="p-6 bg-white shadow rounded-xl">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-50">
              <FiClock className="text-2xl text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
          </div>
        </div>

        {/* Approved */}
        <div className="p-6 bg-white shadow rounded-xl">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <FaCheckCircle className="text-2xl text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold">{stats.approved}</p>
            </div>
          </div>
        </div>

        {/* Rejected */}
        <div className="p-6 bg-white shadow rounded-xl">
          <div className="flex items-center">
            <div className="p-3 bg-pink-100 rounded-lg">
              <FaTimesCircle className="text-2xl text-pink-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold">{stats.rejected}</p>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* APPROVED ONLY */}
        {isApproved && (
          <>
            <Link href="/src/vendor/products/add">
              <div className="p-6 bg-white border shadow cursor-pointer rounded-xl hover:shadow-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-purple-600 rounded-full">
                    <FaPlus className="text-white" />
                  </div>
                  <h3 className="font-semibold">Add New Product</h3>
                  <p className="text-sm text-gray-600">
                    Create new product listing
                  </p>
                </div>
              </div>
            </Link>

            <Link href="/src/vendor/products/list">
              <div className="p-6 bg-white border shadow cursor-pointer rounded-xl hover:shadow-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-pink-500 rounded-full">
                    <FaListAlt className="text-white" />
                  </div>
                  <h3 className="font-semibold">Manage Products</h3>
                  <p className="text-sm text-gray-600">
                    View and edit your products
                  </p>
                </div>
              </div>
            </Link>
          </>
        )}

        {/* NOT APPROVED */}
        {!isApproved && (
          <Link href="/src/vendor/onboarding">
            <div className="p-6 bg-white border shadow cursor-pointer rounded-xl hover:shadow-lg">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-purple-300 rounded-full">
                  <FaBuilding className="text-white" />
                </div>
                <h3 className="font-semibold">Business Profile</h3>
                <p className="text-sm text-gray-600">
                  Complete vendor onboarding
                </p>
              </div>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
