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
  FaEdit,
  FaRedo,
  FaCheck,
  FaTimes,
  FaDownload,
  FaUser,
  FaBox,
} from "react-icons/fa";
import { FiPackage } from "react-icons/fi";

/* ================================
       TYPES
================================ */
type ProductStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "resubmission"
  | "draft";

interface ProductDocument {
  document_id: number;
  document_name: string;
  document_url: string;
  uploaded_at: string;
}

interface ProductItem {
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
  status: ProductStatus;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  main_image: string | null;
  category_name: string;
  subcategory_name: string;
  sub_subcategory_name: string | null;
  sku: string;
  barcode: string;
  documents?: ProductDocument[];
}

interface Stats {
  pending: number;
  approved: number;
  rejected: number;
  resubmission: number;
  draft: number;
  total: number;
}

interface ApiResponse {
  success: boolean;
  data: ProductItem[];
  total: number;
  page: number;
  totalPages: number;
  stats?: Stats;
}

type ActionType = "approve" | "reject" | "request_resubmission";

/* ================================
       STATUS CHIP
================================ */
const StatusChip = ({ status }: { status: ProductStatus }) => {
  const configMap: Record<
    ProductStatus,
    { color: string; icon: React.ComponentType<{ size?: number }>; text: string }
  > = {
    approved: {
      color: "bg-green-100 text-green-800 border-green-200",
      icon: FaCheckCircle,
      text: "Approved",
    },
    rejected: {
      color: "bg-red-100 text-red-800 border-red-200",
      icon: FaTimesCircle,
      text: "Rejected",
    },
    resubmission: {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: FaRedo,
      text: "Resubmission",
    },
    pending: {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: FaClock,
      text: "Pending",
    },
    draft: {
      color: "bg-gray-100 text-gray-800 border-gray-200",
      icon: FaClock,
      text: "Draft",
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
       ACTION MODAL
================================ */
interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (action: ActionType, reason?: string) => Promise<void>;
  product: ProductItem | null;
  actionType: ActionType;
}

const ActionModal = ({
  isOpen,
  onClose,
  onSubmit,
  product,
  actionType,
}: ActionModalProps) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) setReason("");
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const config = {
    approve: {
      title: "Approve Product",
      description: `Approve "${product.product_name}"?`,
      buttonText: "Approve",
      buttonColor: "bg-green-600 hover:bg-green-700",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      Icon: FaCheck,
      showReason: false,
      placeholder: "",
    },
    reject: {
      title: "Reject Product",
      description: `Reject "${product.product_name}"?`,
      buttonText: "Reject",
      buttonColor: "bg-red-600 hover:bg-red-700",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      Icon: FaTimes,
      showReason: true,
      placeholder: "Provide rejection reason...",
    },
    request_resubmission: {
      title: "Request Resubmission",
      description: `Request changes for "${product.product_name}"?`,
      buttonText: "Request Changes",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      Icon: FaRedo,
      showReason: true,
      placeholder: "Specify required changes...",
    },
  }[actionType];

  const handleSubmit = async () => {
    if (config.showReason && !reason.trim()) {
      alert("Please provide a reason.");
      return;
    }
    setLoading(true);
    try {
      await onSubmit(actionType, config.showReason ? reason : undefined);
      onClose();
    } catch (err) {
      console.error("Action failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white shadow-xl rounded-2xl">
        <div className="flex items-center mb-4">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${config.iconBg}`}
          >
            <config.Icon className={config.iconColor} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {config.title}
            </h3>
            <p className="text-sm text-gray-600">{config.description}</p>
          </div>
        </div>

        {config.showReason && (
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Reason / Comments *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={config.placeholder}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#852BAF] focus:border-transparent"
            />
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-4 py-2 text-white rounded-lg ${config.buttonColor} disabled:opacity-50 flex items-center`}
          >
            {loading ? (
              <>
                <FaSpinner className="mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              config.buttonText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ================================
       MAIN COMPONENT
================================ */
export default function ProductManagerList() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

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
    approved: 0,
    rejected: 0,
    resubmission: 0,
    draft: 0,
  });

  // Modal state
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    product: ProductItem | null;
    actionType: ActionType;
  }>({
    isOpen: false,
    product: null,
    actionType: "approve",
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

  const handleDownloadDocument = (documentUrl: string, documentName: string) => {
    const link = document.createElement("a");
    link.href = documentUrl;
    link.download = documentName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* ================================
       FETCH PRODUCTS
  ================================= */
  const fetchProducts = useCallback(async () => {
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
        `http://localhost:5000/api/manager/products?${params.toString()}`,
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
        setProducts(data.data);
        setPagination((prev) => ({
          ...prev,
          totalPages: data.totalPages || 1,
          totalItems: data.total || 0,
        }));
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error("Error loading products:", err);
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
    fetchProducts();
  }, [fetchProducts]);

  // Optional auto-refresh every 30s
  useEffect(() => {
    const id = setInterval(fetchProducts, 30000);
    return () => clearInterval(id);
  }, [fetchProducts]);

  /* ================================
       ACTION HANDLERS
  ================================= */
  const handleProductAction = async (
    action: ActionType,
    productId: number,
    reason?: string
  ) => {
    setActionLoading(productId);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");

      const response = await fetch(
        `http://localhost:5000/api/manager/products/${productId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action, reason }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Action failed");
      }

      alert(data.message || "Action completed successfully");
      fetchProducts();
    } catch (error: any) {
      console.error("Error performing action:", error);
      alert(error.message || "Error performing action");
    } finally {
      setActionLoading(null);
    }
  };

  const openActionModal = (product: ProductItem, actionType: ActionType) => {
    setModalState({ isOpen: true, product, actionType });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      product: null,
      actionType: "approve",
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchProducts();
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
  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-[#852BAF]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50">
      <ActionModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onSubmit={(action, reason) =>
          modalState.product
            ? handleProductAction(action, modalState.product.product_id, reason)
            : Promise.resolve()
        }
        product={modalState.product}
        actionType={modalState.actionType}
      />

      <div className="p-4 bg-white border border-gray-200 shadow-lg rounded-2xl md:p-6">
        {/* HEADER */}
        <div className="flex flex-col justify-between mb-6 md:flex-row md:items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-12 h-12 bg-gradient-to-r from-[#852BAF] to-[#FC3F78] rounded-full flex items-center justify-center mr-4">
              <FiPackage className="text-xl text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                Product Management
              </h1>
              <p className="text-gray-600">
                Review and manage vendor-submitted products
              </p>
            </div>
          </div>

          <div className="text-sm text-right text-gray-600">
            <div className="font-semibold">Total: {stats.total} products</div>
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
          <div className="p-3 border border-green-100 rounded-lg bg-green-50">
            <div className="text-xl font-bold text-green-700">
              {stats.approved}
            </div>
            <div className="text-xs text-green-600">Approved</div>
          </div>
          <div className="p-3 border border-red-100 rounded-lg bg-red-50">
            <div className="text-xl font-bold text-red-700">
              {stats.rejected}
            </div>
            <div className="text-xs text-red-600">Rejected</div>
          </div>
          <div className="p-3 border border-blue-100 rounded-lg bg-blue-50">
            <div className="text-xl font-bold text-blue-700">
              {stats.resubmission}
            </div>
            <div className="text-xs text-blue-600">Resubmission</div>
          </div>
          <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
            <div className="text-xl font-bold text-gray-700">
              {stats.draft}
            </div>
            <div className="text-xs text-gray-600">Draft</div>
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
                placeholder="Search by product name, vendor, SKU..."
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
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="resubmission">Resubmission</option>
                <option value="draft">Draft</option>
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
              <option value="product_name:asc">Product Name A-Z</option>
              <option value="product_name:desc">Product Name Z-A</option>
              <option value="sale_price:desc">Price: High to Low</option>
              <option value="sale_price:asc">Price: Low to High</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                  Product Details
                </th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                  Vendor Info
                </th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                  Category
                </th>
                <th
                  className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("created_at")}
                >
                  <div className="flex items-center">
                    Submitted
                    {getSortIcon("created_at")}
                  </div>
                </th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.product_id} className="hover:bg-gray-50">
                  {/* PRODUCT DETAILS */}
                  <td className="px-4 py-4">
                    <div className="flex items-start">
                      {product.main_image ? (
                        <div className="flex-shrink-0 w-12 h-12 mr-3 overflow-hidden bg-gray-100 rounded">
                          <img
                            src={product.main_image}
                            alt={product.product_name}
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
                          {product.product_name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {product.brand_name}
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          SKU: {product.sku} | Stock: {product.stock}
                        </div>
                        <div className="text-xs text-gray-500">
                          Price: {formatPrice(product.sale_price)}
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
                          {product.company_name}
                        </div>
                        <div className="text-xs text-gray-600">
                          {product.vendor_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {product.vendor_id}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* CATEGORY */}
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">
                      {product.category_name || "N/A"}
                    </div>
                    <div className="text-xs text-gray-600">
                      {product.subcategory_name}
                      {product.sub_subcategory_name &&
                        ` › ${product.sub_subcategory_name}`}
                    </div>
                  </td>

                  {/* DATE */}
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {formatDate(product.created_at)}
                  </td>

                  {/* STATUS */}
                  <td className="px-4 py-4">
                    <div className="mb-2">
                      <StatusChip status={product.status} />
                    </div>
                    {product.rejection_reason && (
                      <div className="flex items-start max-w-xs text-xs text-red-600">
                        <FaExclamationTriangle className="mr-1 mt-0.5" />
                        {product.rejection_reason}
                      </div>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-4 py-4">
                    <div className="flex flex-col space-y-2">
                      {/* View Button */}
                      <Link href={`/manager/products/${product.product_id}`}>
                        <button className="flex items-center justify-center w-full px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                          <FaEye className="mr-2" /> View
                        </button>
                      </Link>

                      {/* Documents */}
                      {product.documents && product.documents.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {product.documents.slice(0, 2).map((doc, index) => (
                            <button
                              key={doc.document_id}
                              onClick={() =>
                                handleDownloadDocument(
                                  doc.document_url,
                                  doc.document_name
                                )
                              }
                              className="flex items-center justify-center flex-1 px-2 py-1 text-xs text-blue-700 rounded bg-blue-50 hover:bg-blue-100"
                              title={`Download ${doc.document_name}`}
                            >
                              <FaDownload className="mr-1" /> {index + 1}
                            </button>
                          ))}
                          {product.documents.length > 2 && (
                            <span className="px-2 text-xs text-gray-500">
                              +{product.documents.length - 2} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="grid grid-cols-3 gap-1">
                        {/* Approve */}
                        {(product.status === "pending" ||
                          product.status === "resubmission" ||
                          product.status === "draft") && (
                          <button
                            onClick={() =>
                              openActionModal(product, "approve")
                            }
                            disabled={actionLoading === product.product_id}
                            className="flex items-center justify-center px-2 py-1 text-xs text-green-700 bg-green-100 rounded hover:bg-green-200 disabled:opacity-50"
                            title="Approve Product"
                          >
                            {actionLoading === product.product_id ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              <FaCheck />
                            )}
                          </button>
                        )}

                        {/* Reject */}
                        {product.status !== "rejected" && (
                          <button
                            onClick={() => openActionModal(product, "reject")}
                            disabled={actionLoading === product.product_id}
                            className="flex items-center justify-center px-2 py-1 text-xs text-red-700 bg-red-100 rounded hover:bg-red-200 disabled:opacity-50"
                            title="Reject Product"
                          >
                            {actionLoading === product.product_id ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              <FaTimes />
                            )}
                          </button>
                        )}

                        {/* Request Changes */}
                        {product.status !== "resubmission" && (
                          <button
                            onClick={() =>
                              openActionModal(
                                product,
                                "request_resubmission"
                              )
                            }
                            disabled={actionLoading === product.product_id}
                            className="flex items-center justify-center px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded hover:bg-blue-200 disabled:opacity-50"
                            title="Request Changes"
                          >
                            {actionLoading === product.product_id ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              <FaEdit />
                            )}
                          </button>
                        )}
                      </div>

                      {/* Edit Link for rejected */}
                      {product.status === "rejected" && (
                        <Link
                          href={`/vendor/products/edit/${product.product_id}`}
                          target="_blank"
                        >
                          <button className="w-full px-2 py-1 text-xs text-purple-700 bg-purple-100 rounded hover:bg-purple-200">
                            Edit Product
                          </button>
                        </Link>
                      )}
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
              of {pagination.totalItems} products
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() =>
                  handlePageChange(pagination.currentPage - 1)
                }
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
                onClick={() =>
                  handlePageChange(pagination.currentPage + 1)
                }
                disabled={
                  pagination.currentPage === pagination.totalPages
                }
                className="px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {products.length === 0 && !loading && (
          <div className="py-12 text-center">
            <FaFileAlt className="mx-auto mb-4 text-4xl text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">
              No Products Found
            </h3>
            <p className="text-gray-500">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your filters or search query"
                : "No products have been submitted yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
