"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaExclamationTriangle,
  FaSpinner,
  FaEdit,
  FaTrash,
  FaFilter,
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown
} from "react-icons/fa";
import { FiPackage } from "react-icons/fi";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ProductData {
  product_id: number;
  vendor_id: number;
  product_name: string;
  brand_name: string;
  manufacturer: string;
  sale_price: string;
  vendor_price: string;
  stock: number;
  status: "pending" | "approved" | "rejected" | "draft";
  rejection_reason: string | null;
  created_at: string;
  category_name?: string;
  subcategory_name?: string;
  images?: string[];
  sku?: string;
  barcode?: string;
}

interface ApiResponse {
  success: boolean;
  data: ProductData[];
  total?: number;
  page?: number;
  totalPages?: number;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const LOW_STOCK_THRESHOLD = 10;

const StatusChip = ({ status, showIcon = true }: { status: string; showIcon?: boolean }) => {
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
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: FaClock,
          text: "Pending"
        };
      case "draft":
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: FaClock,
          text: "Draft"
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: FaClock,
          text: status
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center px-3 py-1.5 rounded-full border text-xs font-medium ${config.color}`}>
      {showIcon && <Icon className="mr-1.5" size={12} />}
      {config.text}
    </div>
  );
};

const StockIndicator = ({ stock }: { stock: number }) => {
  if (stock <= 0) {
    return (
      <div className="flex items-center">
        <span className="font-semibold text-red-600">Out of Stock</span>
        <FaExclamationTriangle className="ml-2 text-red-500" />
      </div>
    );
  }
  
  if (stock < LOW_STOCK_THRESHOLD) {
    return (
      <div className="flex items-center">
        <span className="font-semibold text-orange-600">{stock}</span>
        <FaExclamationTriangle className="ml-2 text-orange-500" />
        <span className="text-xs text-gray-500 ml-2">Low stock</span>
      </div>
    );
  }
  
  return <span className="font-semibold text-green-600">{stock}</span>;
};

export default function VendorProductList() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    draft: 0,
    lowStock: 0,
    outOfStock: 0
  });

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, sortBy, sortOrder, pagination.currentPage]);

  useEffect(() => {
    calculateStats();
  }, [products]);

  const calculateStats = () => {
    const total = products.length;
    const approved = products.filter(p => p.status === "approved").length;
    const pending = products.filter(p => p.status === "pending").length;
    const rejected = products.filter(p => p.status === "rejected").length;
    const draft = products.filter(p => p.status === "draft").length;
    const lowStock = products.filter(p => p.stock < LOW_STOCK_THRESHOLD && p.stock > 0).length;
    const outOfStock = products.filter(p => p.stock <= 0).length;

    setStats({ total, approved, pending, rejected, draft, lowStock, outOfStock });
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        return;
      }

      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: pagination.itemsPerPage.toString(),
        status: statusFilter !== "all" ? statusFilter : "",
        sortBy,
        sortOrder,
        search: searchQuery
      });

      const response = await fetch(`http://localhost:5000/api/vendor/products?${params}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
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
      } else {
        toast.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Error loading products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setDeletingId(productId);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Product deleted successfully");
        fetchProducts(); // Refresh the list
      } else {
        toast.error(data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error deleting product");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: page }));
    }
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) return <FaSort className="ml-1 opacity-30" />;
    return sortOrder === "asc" ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2
    }).format(parseFloat(price));
  };

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "approved", label: "Approved" },
    { value: "pending", label: "Pending" },
    { value: "rejected", label: "Rejected" },
    { value: "draft", label: "Draft" }
  ];

  if (loading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <FaSpinner className="animate-spin text-4xl text-[#852BAF] mb-4" />
        <p className="text-gray-600">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-12 h-12 bg-gradient-to-r from-[#852BAF] to-[#FC3F78] rounded-full flex items-center justify-center mr-4">
              <FiPackage className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Products</h1>
              <p className="text-gray-600">Manage and track your products</p>
            </div>
          </div>
          
          <Link href="/vendor/products/create">
            <button className="px-4 py-3 bg-gradient-to-r from-[#852BAF] to-[#FC3F78] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              + Add New Product
            </button>
          </Link>
        </div>

        {/* STATISTICS */}
        <div className="grid grid-cols-2 md:grid-cols-7 gap-3 mb-6">
          <div className="bg-gray-50 p-3 rounded-lg border">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-600">Total Products</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg border border-green-100">
            <div className="text-2xl font-bold text-green-700">{stats.approved}</div>
            <div className="text-xs text-green-600">Approved</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
            <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
            <div className="text-xs text-yellow-600">Pending</div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg border border-red-100">
            <div className="text-2xl font-bold text-red-700">{stats.rejected}</div>
            <div className="text-xs text-red-600">Rejected</div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <div className="text-2xl font-bold text-blue-700">{stats.draft}</div>
            <div className="text-xs text-blue-600">Draft</div>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
            <div className="text-2xl font-bold text-orange-700">{stats.lowStock}</div>
            <div className="text-xs text-orange-600">Low Stock</div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg border border-red-100">
            <div className="text-2xl font-bold text-red-700">{stats.outOfStock}</div>
            <div className="text-xs text-red-600">Out of Stock</div>
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
                placeholder="Search by product name, SKU, or barcode..."
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
                  setPagination(prev => ({ ...prev, currentPage: 1 }));
                }}
                className="appearance-none pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#852BAF] focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <FaFilter className="absolute left-3 top-3.5 text-gray-400" />
            </div>
            
            <select
              value={`${sortBy}:${sortOrder}`}
              onChange={(e) => {
                const [col, order] = e.target.value.split(":");
                setSortBy(col);
                setSortOrder(order as "asc" | "desc");
              }}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#852BAF] focus:border-transparent"
            >
              <option value="created_at:desc">Newest First</option>
              <option value="created_at:asc">Oldest First</option>
              <option value="product_name:asc">Name A-Z</option>
              <option value="product_name:desc">Name Z-A</option>
              <option value="sale_price:desc">Price: High to Low</option>
              <option value="sale_price:asc">Price: Low to High</option>
              <option value="stock:desc">Stock: High to Low</option>
              <option value="stock:asc">Stock: Low to High</option>
            </select>
          </div>
        </div>

        {/* PRODUCT LIST TABLE */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("product_name")}
                >
                  <div className="flex items-center">
                    Product
                    {getSortIcon("product_name")}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("sale_price")}
                >
                  <div className="flex items-center">
                    Price
                    {getSortIcon("sale_price")}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("stock")}
                >
                  <div className="flex items-center">
                    Stock
                    {getSortIcon("stock")}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    Status
                    {getSortIcon("status")}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.product_id} className="hover:bg-gray-50 transition-colors duration-150">
                  {/* PRODUCT COLUMN */}
                  <td className="px-4 py-4">
                    <div className="flex items-start">
                      {product.images && product.images.length > 0 ? (
                        <div className="flex-shrink-0 h-12 w-12 mr-3 bg-gray-100 rounded overflow-hidden">
                          <img
                            src={product.images[0]}
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
                        <div className="text-xs text-gray-500 mt-1">
                          SKU: {product.sku || "N/A"} | 
                          ID: {product.product_id} | 
                          Added: {formatDate(product.created_at)}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* PRICE COLUMN */}
                  <td className="px-4 py-4">
                    <div className="font-semibold text-gray-900">
                      {formatPrice(product.sale_price)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Cost: {formatPrice(product.vendor_price)}
                    </div>
                  </td>

                  {/* STOCK COLUMN */}
                  <td className="px-4 py-4">
                    <StockIndicator stock={product.stock} />
                  </td>

                  {/* STATUS COLUMN */}
                  <td className="px-4 py-4">
                    <StatusChip status={product.status} />
                    {product.status === "rejected" && product.rejection_reason && (
                      <div className="text-xs text-red-600 mt-1 max-w-xs">
                        <span className="font-medium">Reason:</span> {product.rejection_reason}
                      </div>
                    )}
                  </td>

                  {/* ACTIONS COLUMN */}
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <Link href={`/vendor/products/${product.product_id}`}>
                        <button className="p-2 text-gray-600 hover:text-[#852BAF] hover:bg-purple-50 rounded-lg transition-colors" title="View">
                          <FaEye size={16} />
                        </button>
                      </Link>
                      
                      {product.status === "draft" || product.status === "rejected" ? (
                        <Link href={`/vendor/products/edit/${product.product_id}`}>
                          <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                            <FaEdit size={16} />
                          </button>
                        </Link>
                      ) : null}
                      
                      <button
                        onClick={() => handleDelete(product.product_id)}
                        disabled={deletingId === product.product_id}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete"
                      >
                        {deletingId === product.product_id ? (
                          <FaSpinner className="animate-spin" size={16} />
                        ) : (
                          <FaTrash size={16} />
                        )}
                      </button>
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
              Showing <span className="font-semibold">{(pagination.currentPage - 1) * pagination.itemsPerPage + 1}</span> to{" "}
              <span className="font-semibold">
                {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
              </span> of{" "}
              <span className="font-semibold">{pagination.totalItems}</span> products
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

        {/* NO PRODUCTS MESSAGE */}
        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
            <p className="mt-2 text-sm text-gray-600">
              {searchQuery || statusFilter !== "all" 
                ? "Try adjusting your filters or search query"
                : "Get started by adding your first product"}
            </p>
            {!searchQuery && statusFilter === "all" && (
              <div className="mt-6">
                <Link href="/vendor/products/create">
                  <button className="px-4 py-2 bg-gradient-to-r from-[#852BAF] to-[#FC3F78] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                    + Add New Product
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}