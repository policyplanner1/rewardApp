"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaExclamationTriangle,
  FaEye,
  FaFileAlt,
} from "react-icons/fa";
import { FiPackage } from "react-icons/fi";

/* ================================
       INTERFACES
================================ */
interface ProductItem {
  product_id: number;
  vendor_id: number;
  company_name: string;
  product_name: string;
  sale_price: string;
  stock: number;
  status: "pending" | "approved" | "rejected";
  rejection_reason?: string | null;
  created_at: string;
  mainImage?: string;
}

/* ================================
       STATUS CHIP
================================ */
const StatusChip = ({ status }: { status: ProductItem["status"] }) => {
  switch (status) {
    case "approved":
      return (
        <span className="inline-flex items-center text-green-700 bg-green-100 border border-green-300 px-3 py-1 text-xs rounded-full">
          <FaCheckCircle className="mr-1" /> Approved
        </span>
      );

    case "rejected":
      return (
        <span className="inline-flex items-center text-red-700 bg-red-100 border border-red-300 px-3 py-1 text-xs rounded-full">
          <FaTimesCircle className="mr-1" /> Rejected
        </span>
      );

    default:
      return (
        <span className="inline-flex items-center text-yellow-700 bg-yellow-100 border border-yellow-300 px-3 py-1 text-xs rounded-full">
          <FaClock className="mr-1" /> Pending
        </span>
      );
  }
};

const LOW_STOCK_THRESHOLD = 10;

/* ================================
       MAIN COMPONENT
================================ */
export default function ProductManagerList() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [filter, setFilter] = useState<
    "All" | "pending" | "approved" | "rejected"
  >("All");
  const [loading, setLoading] = useState(true);

  const filteredProducts =
    filter === "All" ? products : products.filter((p) => p.status === filter);

  /* ================================
          FETCH PRODUCTS
  ================================= */
  useEffect(() => {
    async function fetchProducts() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (data.success) {
          setProducts(data.data);
        }
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) return <p className="p-10 text-center">Loading products...</p>;

  /* ================================
          RENDER UI
  ================================= */
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        {/* HEADER */}
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-[#852BAF] to-[#FC3F78] rounded-full flex items-center justify-center mr-4">
            <FiPackage className="text-white text-xl" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Product Management
            </h1>
            <p className="text-gray-600">
              Review and approve vendor-submitted products
            </p>
          </div>
        </div>

        {/* FILTER TABS */}
        <div className="flex space-x-2 mb-6 p-1 bg-gray-100 rounded-lg w-fit">
          {["All", "pending", "approved", "rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab as any)}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                filter === tab
                  ? "bg-white text-[#852BAF] shadow"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.toString().toUpperCase()}
            </button>
          ))}
        </div>

        {/* PRODUCT TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Vendor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((p) => (
                <tr key={p.product_id} className="hover:bg-gray-50">
                  {/* PRODUCT INFO */}
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">
                      {p.product_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      ID: {p.product_id}
                    </div>
                    <div className="text-xs text-gray-500">{p.created_at}</div>
                  </td>

                  {/* VENDOR */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700">
                      {p.company_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      Vendor ID: {p.vendor_id}
                    </div>
                  </td>

                  {/* PRICE */}
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">
                      ₹{parseFloat(p.sale_price).toFixed(2)}
                    </span>
                  </td>

                  {/* STOCK */}
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span
                        className={`text-sm font-semibold ${
                          p.stock < LOW_STOCK_THRESHOLD
                            ? "text-red-600"
                            : "text-gray-900"
                        }`}
                      >
                        {p.stock}
                      </span>

                      {/* Low Stock Warning */}
                      {p.stock < LOW_STOCK_THRESHOLD &&
                        p.status === "approved" && (
                          <FaExclamationTriangle className="ml-2 text-red-500" />
                        )}
                    </div>

                    {p.stock < LOW_STOCK_THRESHOLD &&
                      p.status === "approved" && (
                        <p className="text-xs text-red-600">Low Stock</p>
                      )}
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4">
                    <StatusChip status={p.status} />

                    {/* Rejection Reason */}
                    {p.status === "rejected" && p.rejection_reason && (
                      <p className="mt-1 text-xs text-red-600">
                        {p.rejection_reason}
                      </p>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <Link
                      href={`/src/manager/dashboard/product/productId?product_id=${p.product_id}`}
                    >
                      <button className="flex items-center px-4 py-2 bg-[#852BAF] text-white rounded-lg hover:bg-[#73239c] transition text-sm">
                        <FaEye className="mr-2" /> Review
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* EMPTY */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <FaFileAlt className="text-gray-400 text-4xl mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No Products Found
            </h3>
            <p className="text-gray-500">Nothing matches the current filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
