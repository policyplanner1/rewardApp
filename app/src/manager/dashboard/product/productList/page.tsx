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
  FaDownload
} from "react-icons/fa";
import { FiPackage, FiUser } from "react-icons/fi";
import axios from "axios";

/* ================================
       INTERFACES
================================ */
interface ProductItem {
  product_id: number;
  vendor_id: number;
  company_name: string;
  vendor_name?: string;
  product_name: string;
  brand_name: string;
  sale_price: string;
  vendor_price: string;
  stock: number;
  status: "pending" | "approved" | "rejected" | "resubmission";
  rejection_reason?: string | null;
  created_at: string;
  updated_at: string;
  mainImage?: string;
  category_name?: string;
  sku?: string;
  barcode?: string;
  documents?: string[];
}

interface ApiResponse {
  success: boolean;
  data: ProductItem[];
  total?: number;
  totalPages?: number;
}

interface ActionResponse {
  success: boolean;
  message: string;
}

/* ================================
       STATUS CHIP
================================ */
const StatusChip = ({ status }: { status: ProductItem["status"] }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "approved":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          icon: FaCheckCircle,
          text: "Approved"
        };
      case "rejected":
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          icon: FaTimesCircle,
          text: "Rejected"
        };
      case "resubmission":
        return {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: FaRedo,
          text: "Resubmission"
        };
      default: // pending
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: FaClock,
          text: "Pending Review"
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center px-3 py-1.5 rounded-full border text-xs font-medium ${config.color}`}>
      <Icon className="mr-1.5" size={12} />
      {config.text}
    </div>
  );
};

/* ================================
       ACTION MODAL
================================ */
interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason?: string) => void;
  type: 'approve' | 'reject' | 'request-resubmission';
  productName: string;
}

const ActionModal = ({ isOpen, onClose, onSubmit, type, productName }: ActionModalProps) => {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const getModalConfig = () => {
    switch (type) {
      case 'approve':
        return {
          title: 'Approve Product',
          description: `Are you sure you want to approve "${productName}"?`,
          buttonText: 'Approve',
          buttonColor: 'bg-green-600 hover:bg-green-700',
          icon: FaCheck,
          showReason: false
        };
      case 'reject':
        return {
          title: 'Reject Product',
          description: `Please provide a reason for rejecting "${productName}"`,
          buttonText: 'Reject',
          buttonColor: 'bg-red-600 hover:bg-red-700',
          icon: FaTimes,
          showReason: true,
          placeholder: 'Enter rejection reason...'
        };
      case 'request-resubmission':
        return {
          title: 'Request Resubmission',
          description: `Please specify what needs to be corrected for "${productName}"`,
          buttonText: 'Request Changes',
          buttonColor: 'bg-blue-600 hover:bg-blue-700',
          icon: FaRedo,
          showReason: true,
          placeholder: 'Enter required changes...'
        };
    }
  };

  const config = getModalConfig();

  const handleSubmit = async () => {
    if (config.showReason && !reason.trim()) {
      alert("Please provide a reason");
      return;
    }
    
    setSubmitting(true);
    await onSubmit(config.showReason ? reason : undefined);
    setSubmitting(false);
    setReason("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <div className="flex items-center mb-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${type === 'approve' ? 'bg-green-100' : type === 'reject' ? 'bg-red-100' : 'bg-blue-100'}`}>
            <config.icon className={type === 'approve' ? 'text-green-600' : type === 'reject' ? 'text-red-600' : 'text-blue-600'} />
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
            disabled={submitting}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`px-4 py-2 text-white rounded-lg ${config.buttonColor} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {submitting ? (
              <>
                <FaSpinner className="animate-spin inline mr-2" />
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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  // Action modal states
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'approve' | 'reject' | 'request-resubmission';
    productId: number | null;
    productName: string;
  }>({
    isOpen: false,
    type: 'approve',
    productId: null,
    productName: ''
  });

  const itemsPerPage = 10;
  const LOW_STOCK_THRESHOLD = 10;

  /* ================================
          FETCH PRODUCTS
  ================================= */
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        status: statusFilter !== "all" ? statusFilter : "",
        search: searchQuery,
        sortBy,
        sortOrder
      });

      const response = await fetch(`http://localhost:5000/api/manager/products?${params}`, {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const data: ApiResponse = await response.json();

      if (data.success) {
        setProducts(data.data);
        setTotalPages(data.totalPages || 1);
        setTotalItems(data.total || 0);
      }
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, statusFilter, sortBy, sortOrder]);

  /* ================================
          HANDLE ACTIONS
  ================================= */
  const handleProductAction = async (action: 'approve' | 'reject' | 'request-resubmission', productId: number, reason?: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/manager/products/${productId}/${action}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ reason })
      });

      const data: ActionResponse = await response.json();

      if (data.success) {
        alert(data.message);
        fetchProducts(); // Refresh the list
      } else {
        alert(data.message || "Action failed");
      }
    } catch (error) {
      console.error(`Error ${action} product:`, error);
      alert(`Error ${action} product`);
    }
  };

  const openActionModal = (type: 'approve' | 'reject' | 'request-resubmission', productId: number, productName: string) => {
    setModalState({
      isOpen: true,
      type,
      productId,
      productName
    });
  };

  const closeActionModal = () => {
    setModalState({
      isOpen: false,
      type: 'approve',
      productId: null,
      productName: ''
    });
  };

  const handleModalSubmit = (reason?: string) => {
    if (modalState.productId) {
      handleProductAction(modalState.type, modalState.productId, reason);
    }
    closeActionModal();
  };

  /* ================================
          STATISTICS
  ================================= */
  const getStatusCount = (status: string) => {
    return products.filter(p => p.status === status).length;
  };

  /* ================================
          HELPER FUNCTIONS
  ================================= */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatPrice = (price: string) => {
    return `₹${parseFloat(price).toFixed(2)}`;
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) return <FaSort className="ml-1 opacity-30" />;
    return sortOrder === "asc" ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
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
          RENDER UI
  ================================= */
  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-[#852BAF]" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ActionModal
        isOpen={modalState.isOpen}
        onClose={closeActionModal}
        onSubmit={handleModalSubmit}
        type={modalState.type}
        productName={modalState.productName}
      />

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-[#852BAF] to-[#FC3F78] rounded-full flex items-center justify-center mr-4">
              <FiPackage className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
              <p className="text-gray-600">Review and manage vendor-submitted products</p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Total Products: <span className="font-semibold">{totalItems}</span>
          </div>
        </div>

        {/* STATISTICS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="flex items-center">
              <FaClock className="text-yellow-600 mr-2" />
              <div>
                <div className="text-2xl font-bold">{getStatusCount("pending")}</div>
                <div className="text-sm text-gray-600">Pending Review</div>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <div className="flex items-center">
              <FaCheckCircle className="text-green-600 mr-2" />
              <div>
                <div className="text-2xl font-bold">{getStatusCount("approved")}</div>
                <div className="text-sm text-gray-600">Approved</div>
              </div>
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
            <div className="flex items-center">
              <FaTimesCircle className="text-red-600 mr-2" />
              <div>
                <div className="text-2xl font-bold">{getStatusCount("rejected")}</div>
                <div className="text-sm text-gray-600">Rejected</div>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-center">
              <FaRedo className="text-blue-600 mr-2" />
              <div>
                <div className="text-2xl font-bold">{getStatusCount("resubmission")}</div>
                <div className="text-sm text-gray-600">Resubmission</div>
              </div>
            </div>
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
                placeholder="Search products, vendors, SKU..."
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#852BAF] focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
              <button
                type="submit"
                className="absolute right-2 top-2 px-3 py-1.5 bg-[#852BAF] text-white rounded-md text-sm"
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
                  setCurrentPage(1);
                }}
                className="appearance-none pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#852BAF] focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="resubmission">Resubmission</option>
              </select>
              <FaFilter className="absolute left-3 top-3.5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* PRODUCT TABLE */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("product_name")}
                >
                  <div className="flex items-center">
                    Product
                    {getSortIcon("product_name")}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Vendor
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("created_at")}
                >
                  <div className="flex items-center">
                    Submitted
                    {getSortIcon("created_at")}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.product_id} className="hover:bg-gray-50">
                  {/* PRODUCT INFO */}
                  <td className="px-4 py-4">
                    <div className="flex items-start">
                      {product.mainImage ? (
                        <div className="flex-shrink-0 h-12 w-12 mr-3 bg-gray-100 rounded overflow-hidden">
                          <img
                            src={product.mainImage}
                            alt={product.product_name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 h-12 w-12 mr-3 bg-gray-100 rounded flex items-center justify-center">
                          <FiPackage className="text-gray-400" />
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-gray-900">{product.product_name}</div>
                        <div className="text-sm text-gray-600">{product.brand_name}</div>
                        <div className="text-xs text-gray-500">
                          ID: {product.product_id} | SKU: {product.sku || "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* VENDOR INFO */}
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <FiUser className="text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.company_name}</div>
                        <div className="text-xs text-gray-500">ID: {product.vendor_id}</div>
                      </div>
                    </div>
                  </td>

                  {/* DATE */}
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {formatDate(product.created_at)}
                  </td>

                  {/* PRICE */}
                  <td className="px-4 py-4">
                    <div className="font-semibold text-gray-900">
                      {formatPrice(product.sale_price)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Cost: {formatPrice(product.vendor_price)}
                    </div>
                  </td>

                  {/* STOCK */}
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <span className={`font-semibold ${
                        product.stock < LOW_STOCK_THRESHOLD ? "text-red-600" : "text-gray-900"
                      }`}>
                        {product.stock}
                      </span>
                      {product.stock < LOW_STOCK_THRESHOLD && (
                        <FaExclamationTriangle className="ml-2 text-red-500" />
                      )}
                    </div>
                    {product.stock < LOW_STOCK_THRESHOLD && (
                      <div className="text-xs text-red-600">Low Stock</div>
                    )}
                  </td>

                  {/* STATUS */}
                  <td className="px-4 py-4">
                    <StatusChip status={product.status} />
                    {product.rejection_reason && (
                      <div className="text-xs text-gray-600 mt-1 max-w-xs">
                        {product.rejection_reason}
                      </div>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-4 py-4">
                    <div className="flex flex-col space-y-2">
                      {/* View Button */}
                      <Link href={`/manager/products/${product.product_id}`}>
                        <button className="w-full flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
                          <FaEye className="mr-2" /> View Details
                        </button>
                      </Link>

                      {/* Document Download */}
                      {product.documents && product.documents.length > 0 && (
                        <div className="flex space-x-1">
                          {product.documents.map((doc, index) => (
                            <button
                              key={index}
                              onClick={() => handleDownloadDocument(doc, `document-${product.product_id}-${index}`)}
                              className="flex-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs hover:bg-blue-100"
                              title="Download Document"
                            >
                              <FaDownload />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="grid grid-cols-3 gap-1">
                        {product.status === "pending" || product.status === "resubmission" ? (
                          <>
                            <button
                              onClick={() => openActionModal('approve', product.product_id, product.product_name)}
                              className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200"
                              title="Approve"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => openActionModal('reject', product.product_id, product.product_name)}
                              className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
                              title="Reject"
                            >
                              <FaTimes />
                            </button>
                            <button
                              onClick={() => openActionModal('request-resubmission', product.product_id, product.product_name)}
                              className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                              title="Request Changes"
                            >
                              <FaEdit />
                            </button>
                          </>
                        ) : product.status === "rejected" ? (
                          <>
                            <button
                              onClick={() => openActionModal('approve', product.product_id, product.product_name)}
                              className="col-span-2 px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => window.open(`/vendor/products/edit/${product.product_id}`, '_blank')}
                              className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                              title="Edit Product"
                            >
                              <FaEdit />
                            </button>
                          </>
                        ) : product.status === "approved" ? (
                          <>
                            <button
                              onClick={() => openActionModal('reject', product.product_id, product.product_name)}
                              className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => openActionModal('request-resubmission', product.product_id, product.product_name)}
                              className="col-span-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                            >
                              Request Edit
                            </button>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} products
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-2 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
            <p className="text-gray-500">Nothing matches the current filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}