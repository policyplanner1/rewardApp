"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaExclamationTriangle,
  FaEye,
  FaFileAlt,
  FaSpinner,
  FaFilter,
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaDownload,
  FaUser,
  FaBox,
} from "react-icons/fa";
import { FiPackage } from "react-icons/fi";

/* ================================
       TYPES
================================ */
/* Allowed order statuses per your request */
type OrderStatus =
  | "pending"
  | "accepted"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

interface OrderItem {
  order_id: number;
  product_id: number;
  vendor_id: number;
  company_name: string;
  vendor_name: string;
  vendor_email: string;
  product_name: string;
  brand_name: string;
  sale_price: number;
  vendor_price: number;
  stock: number;
  status: OrderStatus;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  main_image: string | null;
  category_name: string;
  subcategory_name: string;
  sub_subcategory_name: string | null;
  sku: string;
  barcode: string;
}

interface Stats {
  pending: number;
  accepted: number;
  out_for_delivery: number;
  delivered: number;
  cancelled: number;
  total: number;
}

interface ApiResponse {
  success: boolean;
  data: OrderItem[];
  total: number;
  page: number;
  totalPages: number;
  stats?: Stats;
}

/* ================================
       STATUS CHIP
================================ */
const StatusChip = ({ status }: { status: OrderStatus }) => {
  const configMap: Record<
    OrderStatus,
    {
      color: string;
      icon: React.ComponentType<{ size?: number }>;
      text: string;
    }
  > = {
    pending: {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: FaClock,
      text: "Pending",
    },
    accepted: {
      color: "bg-blue-50 text-yellow-800 border-yellow-200",
      icon: FaCheckCircle,
      text: "Accepted",
    },
    out_for_delivery: {
      color: "bg-green-100 text-green-800 border-green-200",
      icon: FaCheckCircle,
      text: "Out for Delivery",
    },
    delivered: {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: FaCheckCircle,
      text: "Delivered",
    },
    cancelled: {
      color: "bg-red-100 text-red-800 border-red-200",
      icon: FaTimesCircle,
      text: "Cancelled",
    },
  };

  const cfg = configMap[status];
  const Icon = cfg.icon;

  return (
    <div
      className={`inline-flex items-center px-3 py-1.5 rounded-full border text-xs font-medium ${cfg.color}`}
    >
      <Icon className="mr-1.5" size={12} />
      {cfg.text}
    </div>
  );
};

/* ================================
       MAIN COMPONENT
================================ */
export default function OrderManagerList() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    accepted: 0,
    out_for_delivery: 0,
    delivered: 0,
    cancelled: 0,
  });

  /* ================================
       HELPERS
  ================================= */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(price);
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) return <FaSort className="ml-1 opacity-30" />;
    return sortOrder === "asc" ? (
      <FaSortUp className="ml-1" />
    ) : (
      <FaSortDown className="ml-1" />
    );
  };

  /* ================================
       FETCH ORDERS
  ================================= */
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        setLoading(false);
        return;
      }

      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: pagination.itemsPerPage.toString(),
        status: statusFilter !== "all" ? statusFilter : "",
        search: searchQuery,
        sortBy,
        sortOrder,
      });

      const response = await fetch(
        `http://localhost:5000/api/manager/orders?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      if (data.success) {
        setOrders(data.data);
        setPagination((prev) => ({
          ...prev,
          totalPages: data.totalPages || 1,
          totalItems: data.total || 0,
        }));
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  }, [
    pagination.currentPage,
    pagination.itemsPerPage,
    statusFilter,
    searchQuery,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Optional auto-refresh every 30s
  useEffect(() => {
    const id = setInterval(fetchOrders, 30000);
    return () => clearInterval(id);
  }, [fetchOrders]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchOrders();
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: page }));
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  /* ================================
       RENDER
  ================================= */
  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-[#852BAF]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50">
      <div className="p-4 bg-white border border-gray-200 shadow-lg rounded-2xl md:p-6">
        {/* HEADER */}
        <div className="flex flex-col justify-between mb-6 md:flex-row md:items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-12 h-12 bg-gradient-to-r from-[#852BAF] to-[#FC3F78] rounded-full flex items-center justify-center mr-4">
              <FiPackage className="text-xl text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                Order status and Tracking
              </h1>
              <p className="text-gray-600">Shipment Track</p>
            </div>
          </div>

          <div className="text-sm text-right text-gray-600">
            <div className="font-semibold">Total: {stats.total} orders</div>
            <div className="text-xs">Auto-refreshes every 30s</div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-3 mb-6 md:grid-cols-6">
          <div className="p-3 border rounded-lg bg-gray-50">
            <div className="text-xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
          <div className="p-3 border border-yellow-100 rounded-lg bg-yellow-50">
            <div className="text-xl font-bold text-yellow-700">
              {stats.pending}
            </div>
            <div className="text-xs text-yellow-600">Pending</div>
          </div>
          <div className="p-3 border border-blue-100 rounded-lg bg-blue-50">
            <div className="text-xl font-bold text-blue-700">
              {stats.accepted}
            </div>
            <div className="text-xs text-blue-600">Accepted</div>
          </div>
          <div className="p-3 border border-green-100 rounded-lg bg-green-50">
            <div className="text-xl font-bold text-green-700">
              {stats.out_for_delivery}
            </div>
            <div className="text-xs text-green-600">Out for Delivery</div>
          </div>
          <div className="p-3 border border-blue-100 rounded-lg bg-blue-50">
            <div className="text-xl font-bold text-blue-700">
              {stats.delivered}
            </div>
            <div className="text-xs text-blue-600">Delivered</div>
          </div>
          <div className="p-3 border border-red-100 rounded-lg bg-red-50">
            <div className="text-xl font-bold text-red-700">
              {stats.cancelled}
            </div>
            <div className="text-xs text-red-600">Cancelled</div>
          </div>
        </div>

        {/* FILTERS + SEARCH */}
        <div className="flex flex-col gap-4 mb-6 md:flex-row">
          <form onSubmit={handleSearchSubmit} className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by product name, orderID..."
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#852BAF] focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
              <button
                type="submit"
                className="absolute right-2 top-2 px-3 py-1.5 bg-[#852BAF] text-white rounded-md text-sm hover:bg-[#76209e]"
              >
                Search
              </button>
            </div>
          </form>

          <div className="flex gap-3">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPagination((prev) => ({ ...prev, currentPage: 1 }));
                }}
                className="appearance-none pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#852BAF] focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <FaFilter className="absolute left-3 top-3.5 text-gray-400" />
            </div>

            <select
              value={`${sortBy}:${sortOrder}`}
              onChange={(e) => {
                const [col, order] = e.target.value.split(":");
                setSortBy(col);
                setSortOrder(order as "asc" | "desc");
                setPagination((prev) => ({ ...prev, currentPage: 1 }));
              }}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#852BAF] focus:border-transparent"
            >
              <option value="created_at:desc">Newest First</option>
              <option value="created_at:asc">Oldest First</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                  Order ID
                </th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                  product ID
                </th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                  product
                </th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                  Customer
                </th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                  order Date
                </th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.order_id} className="hover:bg-gray-50">
                  {/* PRODUCT DETAILS */}
                  <td className="px-4 py-4">
                    <div className="flex items-start">
                      {order.main_image ? (
                        <div className="flex-shrink-0 w-12 h-12 mr-3 overflow-hidden bg-gray-100 rounded">
                          <img
                            src={order.main_image}
                            alt={order.product_name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mr-3 bg-gray-100 rounded">
                          <FaBox className="text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                          {order.product_name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {order.brand_name}
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          SKU: {order.sku} | Stock: {order.stock}
                        </div>
                        <div className="text-xs text-gray-500">
                          Price: {formatPrice(order.sale_price)}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* VENDOR INFO */}
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <FaUser className="mr-2 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.company_name}
                        </div>
                        <div className="text-xs text-gray-600">
                          {order.vendor_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {order.vendor_id}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* CATEGORY */}
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">
                      {order.category_name || "N/A"}
                    </div>
                    <div className="text-xs text-gray-600">
                      {order.subcategory_name}
                      {order.sub_subcategory_name &&
                        ` › ${order.sub_subcategory_name}`}
                    </div>
                  </td>

                  {/* DATE */}
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {formatDate(order.created_at)}
                  </td>

                  {/* STATUS */}
                  <td className="px-4 py-4">
                    <div className="mb-2">
                      <StatusChip status={order.status} />
                    </div>
                    {order.rejection_reason && (
                      <div className="flex items-start max-w-xs text-xs text-red-600">
                        <FaExclamationTriangle className="mr-1 mt-0.5" />
                        {order.rejection_reason}
                      </div>
                    )}
                  </td>

                  {/* ACTION */}
                  <td className="px-4 py-4">
                    <div className="flex flex-col space-y-2">
                      <Link href={`/manager/orders/${order.order_id}/track`}>
                        <button className="flex items-center justify-center w-full px-3 py-2 text-sm text-white bg-[#852BAF] rounded-lg hover:opacity-95">
                          Track
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Showing{" "}
              {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{" "}
              {Math.min(
                pagination.currentPage * pagination.itemsPerPage,
                pagination.totalItems
              )}{" "}
              of {pagination.totalItems} orders
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, i) => {
                  let pageNum: number;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (
                    pagination.currentPage >=
                    pagination.totalPages - 2
                  ) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 border text-sm font-medium rounded-md ${
                        pagination.currentPage === pageNum
                          ? "bg-[#852BAF] text-white border-[#852BAF]"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
              )}

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {orders.length === 0 && !loading && (
          <div className="py-12 text-center">
            <FaFileAlt className="mx-auto mb-4 text-4xl text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">
              No Orders Found
            </h3>
            <p className="text-gray-500">
              {searchQuery || statusFilter !== "all"
                ? "No results match your current filters or search."
                : "There are no orders yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
