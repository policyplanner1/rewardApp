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
  FaChartBar
} from "react-icons/fa";
import { FiPackage } from "react-icons/fi";

/* ================================
       INTERFACES
================================ */
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
  status: "pending" | "approved" | "rejected" | "resubmission" | "draft";
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  main_image: string | null;
  category_name: string;
  subcategory_name: string;
  sub_subcategory_name: string;
  sku: string;
  barcode: string;
  documents?: Array<{
    document_id: number;
    document_name: string;
    document_url: string;
    uploaded_at: string;
  }>;
}

interface ApiResponse {
  success: boolean;
  data: ProductItem[];
  total: number;
  page: number;
  totalPages: number;
  stats?: {
    pending: number;
    approved: number;
    rejected: number;
    resubmission: number;
    draft: number;
    total: number;
  };
}

interface ActionPayload {
  action: "approve" | "reject" | "request_resubmission";
  reason?: string;
  product_id: number;
}

/* ================================
       STATUS CHIP COMPONENT
================================ */
const StatusChip = ({ status }: { status: ProductItem["status"] }) => {
  const statusConfig = {
    approved: {
      color: "bg-green-100 text-green-800 border-green-200",
      icon: FaCheckCircle,
      text: "Approved"
    },
    rejected: {
      color: "bg-red-100 text-red-800 border-red-200",
      icon: FaTimesCircle,
      text: "Rejected"
    },
    resubmission: {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: FaRedo,
      text: "Resubmission"
    },
    pending: {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: FaClock,
      text: "Pending"
    },
    draft: {
      color: "bg-gray-100 text-gray-800 border-gray-200",
      icon: FaClock,
      text: "Draft"
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center px-3 py-1.5 rounded-full border text-xs font-medium ${config.color}`}>
      <Icon className="mr-1.5" size={12} />
      {config.text}
    </div>
  );
};

/* ================================
       ACTION MODAL COMPONENT
================================ */
interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (action: string, reason?: string) => Promise<void>;
  product: ProductItem | null;
  actionType: "approve" | "reject" | "request_resubmission";
}

const ActionModal = ({ isOpen, onClose, onSubmit, product, actionType }: ActionModalProps) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !product) return null;

  const modalConfig = {
    approve: {
      title: "Approve Product",
      description: `Approve "${product.product_name}"?`,
      buttonText: "Approve",
      buttonColor: "bg-green-600 hover:bg-green-700",
      icon: FaCheck,
      showReason: false
    },
    reject: {
      title: "Reject Product",
      description: `Reject "${product.product_name}"?`,
      buttonText: "Reject",
      buttonColor: "bg-red-600 hover:bg-red-700",
      icon: FaTimes,
      showReason: true,
      placeholder: "Provide rejection reason..."
    },
    request_resubmission: {
      title: "Request Resubmission",
      description: `Request changes for "${product.product_name}"?`,
      buttonText: "Request Changes",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      icon: FaRedo,
      showReason: true,
      placeholder: "Specify required changes..."
    }
  };

  const config = modalConfig[actionType];

  const handleSubmit = async () => {
    if (config.showReason && !reason.trim()) {
      alert("Please provide a reason");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(actionType, config.showReason ? reason : undefined);
      onClose();
      setReason("");
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <div className="flex items-center mb-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
            actionType === 'approve' ? 'bg-green-100' : 
            actionType === 'reject' ? 'bg-red-100' : 'bg-blue-100'
          }`}>
            <config.icon className={
              actionType === 'approve' ? 'text-green-600' : 
              actionType === 'reject' ? 'text-red-600' : 'text-blue-600'
            } />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{config.title}</h3>
            <p className="text-sm text-gray-600">{config.description}</p>
          </div>
        </div>

        {config.showReason && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason / Comments *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={config.placeholder}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#852BAF] focus:border-transparent"
              required
            />
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
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
                <FaSpinner className="animate-spin mr-2" />
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
    itemsPerPage: 10
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    resubmission: 0,
    draft: 0
  });

  // Modal state
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    product: ProductItem | null;
    actionType: "approve" | "reject" | "request_resubmission";
  }>({
    isOpen: false,
    product: null,
    actionType: "approve"
  });

  /* ================================
          FETCH PRODUCTS
  ================================= */
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: pagination.itemsPerPage.toString(),
        status: statusFilter !== "all" ? statusFilter : "",
        search: searchQuery,
        sortBy,
        sortOrder
      });

      const response = await fetch(`http://localhost:5000/api/manager/products?${params}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      if (data.success) {
        setProducts(data.data);
        setPagination(prev => ({
          ...prev,
          totalPages: data.totalPages || 1,
          totalItems: data.total || 0
        }));
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [pagination.currentPage, statusFilter, sortBy, sortOrder]);

  /* ================================
          HANDLE ACTIONS
  ================================= */
  const handleProductAction = async (action: string, productId: number, reason?: string) => {
    setActionLoading(productId);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/manager/products/${productId}/status`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          action,
          reason
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message || "Action completed successfully");
        fetchProducts(); // Refresh list
      } else {
        throw new Error(data.message || "Action failed");
      }
    } catch (error: any) {
      console.error("Error performing action:", error);
      alert(error.message || "Error performing action");
    } finally {
      setActionLoading(null);
    }
  };

  const openActionModal = (product: ProductItem, actionType: "approve" | "reject" | "request_resubmission") => {
    setModalState({
      isOpen: true,
      product,
      actionType
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      product: null,
      actionType: "approve"
    });
  };

  /* ================================
          HELPER FUNCTIONS
  ================================= */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR"
    }).format(price);
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) return <FaSort className="ml-1 opacity-30" />;
    return sortOrder === "asc" ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchProducts();
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: page }));
    }
  };

  const handleDownloadDocument = (documentUrl: string, documentName: string) => {
    const link = document.createElement('a');
    link.href = documentUrl;
    link.download = documentName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* ================================
          RENDER
  ================================= */
  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-[#852BAF]" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <ActionModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onSubmit={(action, reason) => 
          modalState.product ? 
          handleProductAction(action, modalState.product.product_id, reason) : 
          Promise.resolve()
        }
        product={modalState.product}
        actionType={modalState.actionType}
      />

      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-12 h-12 bg-gradient-to-r from-[#852BAF] to-[#FC3F78] rounded-full flex items-center justify-center mr-4">
              <FiPackage className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Product Management</h1>
              <p className="text-gray-600">Review and manage vendor-submitted products</p>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            <div className="font-semibold">Total: {stats.total} products</div>
            <div className="text-xs">Auto-refreshes every 30s</div>
          </div>
        </div>

        {/* STATISTICS */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
          <div className="bg-gray-50 p-3 rounded-lg border">
            <div className="text-xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
            <div className="text-xl font-bold text-yellow-700">{stats.pending}</div>
            <div className="text-xs text-yellow-600">Pending</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg border border-green-100">
            <div className="text-xl font-bold text-green-700">{stats.approved}</div>
            <div className="text-xs text-green-600">Approved</div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg border border-red-100">
            <div className="text-xl font-bold text-red-700">{stats.rejected}</div>
            <div className="text-xs text-red-600">Rejected</div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <div className="text-xl font-bold text-blue-700">{stats.resubmission}</div>
            <div className="text-xs text-blue-600">Resubmission</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="text-xl font-bold text-gray-700">{stats.draft}</div>
            <div className="text-xs text-gray-600">Draft</div>
          </div>
        </div>

        {/* FILTERS AND SEARCH */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1">
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
                  setPagination(prev => ({ ...prev, currentPage: 1 }));
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
                setPagination(prev => ({ ...prev, currentPage: 1 }));
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

        {/* PRODUCTS TABLE */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Product Details
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Vendor Info
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Category
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("created_at")}
                >
                  <div className="flex items-center">
                    Submitted
                    {getSortIcon("created_at")}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
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
                        <div className="flex-shrink-0 h-12 w-12 mr-3 bg-gray-100 rounded overflow-hidden">
                          <img
                            src={product.main_image}
                            alt={product.product_name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 h-12 w-12 mr-3 bg-gray-100 rounded flex items-center justify-center">
                          <FaBox className="text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{product.product_name}</div>
                        <div className="text-sm text-gray-600">{product.brand_name}</div>
                        <div className="text-xs text-gray-500 mt-1">
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
                      <FaUser className="text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.company_name}</div>
                        <div className="text-xs text-gray-600">{product.vendor_name}</div>
                        <div className="text-xs text-gray-500">ID: {product.vendor_id}</div>
                      </div>
                    </div>
                  </td>

                  {/* CATEGORY */}
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">
                      {product.category_name || "N/A"}
                    </div>
                    <div className="text-xs text-gray-600">
                      {product.subcategory_name} {product.sub_subcategory_name && `› ${product.sub_subcategory_name}`}
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
                      <div className="text-xs text-red-600 max-w-xs">
                        {product.rejection_reason}
                      </div>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-4 py-4">
                    <div className="flex flex-col space-y-2">
                      {/* View Button */}
                      <Link href={`/manager/products/${product.product_id}`}>
                        <button className="flex items-center justify-center w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
                          <FaEye className="mr-2" /> View
                        </button>
                      </Link>

                      {/* Document Download */}
                      {product.documents && product.documents.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {product.documents.slice(0, 2).map((doc, index) => (
                            <button
                              key={doc.document_id}
                              onClick={() => handleDownloadDocument(doc.document_url, doc.document_name)}
                              className="flex-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs hover:bg-blue-100 flex items-center justify-center"
                              title={`Download ${doc.document_name}`}
                            >
                              <FaDownload className="mr-1" /> {index + 1}
                            </button>
                          ))}
                          {product.documents.length > 2 && (
                            <span className="text-xs text-gray-500 px-2">
                              +{product.documents.length - 2} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="grid grid-cols-3 gap-1">
                        {/* Approve Button - shown for pending/resubmission/draft */}
                        {(product.status === "pending" || product.status === "resubmission" || product.status === "draft") && (
                          <button
                            onClick={() => openActionModal(product, "approve")}
                            disabled={actionLoading === product.product_id}
                            className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 disabled:opacity-50 flex items-center justify-center"
                            title="Approve Product"
                          >
                            {actionLoading === product.product_id ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              <FaCheck />
                            )}
                          </button>
                        )}

                        {/* Reject Button - shown for all except rejected */}
                        {product.status !== "rejected" && (
                          <button
                            onClick={() => openActionModal(product, "reject")}
                            disabled={actionLoading === product.product_id}
                            className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 disabled:opacity-50 flex items-center justify-center"
                            title="Reject Product"
                          >
                            {actionLoading === product.product_id ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              <FaTimes />
                            )}
                          </button>
                        )}

                        {/* Request Changes Button - shown for all except resubmission */}
                        {product.status !== "resubmission" && (
                          <button
                            onClick={() => openActionModal(product, "request_resubmission")}
                            disabled={actionLoading === product.product_id}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 disabled:opacity-50 flex items-center justify-center"
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

                      {/* Edit Link for Rejected Products */}
                      {product.status === "rejected" && (
                        <Link 
                          href={`/vendor/products/edit/${product.product_id}`} 
                          target="_blank"
                        >
                          <button className="w-full px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs hover:bg-purple-200">
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
              Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{" "}
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{" "}
              {pagination.totalItems} products
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.currentPage <= 3) {
                  pageNum = i + 1;
                } else if (pagination.currentPage >= pagination.totalPages - 2) {
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
              })}
              
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <FaFileAlt className="text-gray-400 text-4xl mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No Products Found</h3>
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