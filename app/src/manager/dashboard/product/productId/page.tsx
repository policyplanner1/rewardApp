"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";  // ✅ FIXED
import {
  FaBox,
  FaDollarSign,
  FaImages,
  FaArrowLeft,
  FaSpinner,
  FaTimesCircle,
  FaCheckCircle,
  FaCommentAlt,
} from "react-icons/fa";

/* ---------------------------
   Types
----------------------------*/
interface ProductImage {
  image_id: number;
  product_id: number;
  image_url: string;
  color: string | null;
  size: string | null;
}

interface ProductData {
  product_id: number;
  vendor_id: number;
  brand_name: string;
  manufacturer: string;
  item_type: string;
  barcode: string;
  product_name: string;
  description: string;
  short_description: string;
  size: string | null;
  color: string | null;
  model: string | null;
  dimension: string | null;
  stock: number;
  vendor_price: string;
  sale_price: string;
  tax_code: string | null;
  expiry_date: string | null;
  status: "pending" | "approved" | "rejected";
  rejection_reason: string | null;
  created_at: string;
  company_name?: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    product: ProductData;
    images: ProductImage[];
  };
}

/* ---------------------------
   Reusable UI Components
----------------------------*/
const DetailItem = ({ label, value }: { label: string; value?: string | number | null }) => (
  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
    <p className="text-xs font-medium text-gray-500 uppercase mb-1">{label}</p>
    <p className="text-sm text-gray-800 font-semibold break-words">{value ?? "N/A"}</p>
  </div>
);

const SectionHeader = ({ icon: Icon, title }: { icon: any; title: string }) => (
  <div className="flex items-center space-x-3 mb-4 mt-8">
    <Icon className="text-xl text-[#852BAF]" />
    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
  </div>
);

const statusColorClass = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-700 border-green-300";
    case "rejected":
      return "bg-red-100 text-red-700 border-red-300";
    default:
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
  }
};

const formatStatus = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/* ---------------------------
   Main Component
----------------------------*/
export default function ProductReviewPage() {
  const searchParams = useSearchParams();    // ✅ FIXED
  const router = useRouter();

  const productId = searchParams.get("product_id"); // ✅ FIXED

  const [product, setProduct] = useState<ProductData | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [decisionReason, setDecisionReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE = "http://localhost:5000/api/products";

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      if (!productId) {
        setError("Product ID missing from URL.");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Auth token missing. Please login.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const json = await res.json().catch(() => null);
          throw new Error(json?.message || `Failed to fetch product`);
        }

        const json: ApiResponse = await res.json();
        setProduct(json.data.product);
        setImages(json.data.images || []);
      } catch (err: any) {
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleDecision = async (status: "approved" | "rejected") => {
    if (status === "rejected" && decisionReason.trim().length < 10) {
      alert("Please provide a rejection reason (at least 10 characters).");
      return;
    }

    if (!product) return;

    const token = localStorage.getItem("token");
    if (!token) return alert("You must login again.");

    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/status/${product.product_id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          rejectionReason: status === "rejected" ? decisionReason : null,
        }),
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.message);

      setProduct((p) =>
        p ? { ...p, status, rejection_reason: status === "rejected" ? decisionReason : null } : p
      );

      alert(`Product ${status} successfully.`);
      router.push("/manager/products/list");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resolveImageUrl = (raw: string) => {
    if (!raw) return "";
    const cleaned = raw.replace(/\\/g, "/").replace(/^\/+/, "");
    return `http://localhost:5000/${cleaned}`;
  };

  /* ---------------------------
     Loading / Error UI
  ----------------------------*/
  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 text-center">
          <FaSpinner className="animate-spin text-4xl text-[#852BAF] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Loading Product...</h2>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 text-center">
          <FaTimesCircle className="text-4xl text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Product</h2>
          <p className="text-gray-600 mb-4">{error || "Product not found"}</p>
          <button onClick={() => router.back()} className="px-6 py-2 bg-[#852BAF] text-white rounded-lg">
            Go back
          </button>
        </div>
      </div>
    );
  }

  /* ---------------------------
     MAIN PAGE UI (unchanged)
  ----------------------------*/
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <FaArrowLeft />
              <span>Back to list</span>
            </button>

            <div className="w-1 h-6 bg-gray-300" />

            <div>
              <h1 className="text-2xl font-bold text-gray-900">Product Review</h1>
              <p className="text-gray-600">
                ID: {product.product_id} | Vendor: {product.company_name}
              </p>
            </div>
          </div>

          <span className={`px-4 py-2 text-sm font-semibold rounded-full border ${statusColorClass(product.status)}`}>
            {formatStatus(product.status)}
          </span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">

          {/* Title */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{product.product_name}</h2>
            <p className="text-gray-600 text-lg">{product.short_description}</p>
          </div>

          {/* Core Details */}
          <SectionHeader icon={FaBox} title="Core Details" />
          <div className="space-y-4 mb-8">
            <DetailItem label="Product Name" value={product.product_name} />
            <DetailItem label="Short Description" value={product.short_description} />

            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Detailed Description</p>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">{product.description || "N/A"}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <DetailItem label="Brand" value={product.brand_name} />
              <DetailItem label="Manufacturer" value={product.manufacturer} />
              <DetailItem label="Model/SKU" value={product.model} />
              <DetailItem label="Item Type" value={product.item_type} />
              <DetailItem label="Bar Code" value={product.barcode} />
              <DetailItem label="Size" value={product.size} />
              <DetailItem label="Color" value={product.color} />
              <DetailItem label="Dimension" value={product.dimension} />
              <DetailItem label="Stock" value={product.stock} />
            </div>
          </div>

          {/* Pricing */}
          <SectionHeader icon={FaDollarSign} title="Pricing & Compliance" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <DetailItem label="Vendor Price" value={`₹${parseFloat(product.vendor_price).toFixed(2)}`} />
            <DetailItem label="Sales Price" value={`₹${parseFloat(product.sale_price).toFixed(2)}`} />
            <DetailItem label="Tax Code" value={product.tax_code} />
            <DetailItem label="Expiry Date" value={product.expiry_date} />
          </div>

          {/* Images */}
          <SectionHeader icon={FaImages} title="Product Images" />
          <div className="flex space-x-4 overflow-x-auto p-4 mb-8 border rounded-lg bg-gray-50">
            {images.length > 0 ? (
              images.map((img) => (
                <div
                  key={img.image_id}
                  className="flex-shrink-0 w-48 h-48 rounded-lg overflow-hidden border shadow-sm bg-white"
                >
                  <img
                    src={resolveImageUrl(img.image_url)}
                    alt="product image"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center w-full text-gray-500">
                No images available
              </div>
            )}
          </div>

          {/* Status Panel */}
          <div className={`p-6 mt-6 border rounded-lg ${statusColorClass(product.status)}`}>
            <p className="font-semibold text-lg">Current status: {formatStatus(product.status)}</p>

            {product.status === "rejected" && product.rejection_reason && (
              <div className="mt-3 p-3 bg-red-50 rounded border border-red-200">
                <p className="font-medium text-red-800">Rejection Reason:</p>
                <p className="text-red-700 mt-1">{product.rejection_reason}</p>
              </div>
            )}

            {/* Manager Decision */}
            <div className="mt-6">
              <p className="text-sm font-bold text-gray-700 flex items-center mb-3">
                <FaCommentAlt className="mr-2 text-[#852BAF]" /> Manager decision notes
              </p>

              <textarea
                rows={3}
                value={decisionReason}
                onChange={(e) => {
                  setDecisionReason(e.target.value);
                  if (e.target.value.trim()) setIsRejecting(true);
                }}
                placeholder={
                  isRejecting
                    ? "Enter detailed rejection reason (required for rejecting)"
                    : "Optional notes for approval or comments..."
                }
                className={`w-full p-3 text-sm border rounded-lg transition ${
                  isRejecting ? "border-red-400 bg-red-50" : "border-gray-300"
                }`}
              />

              <div className="mt-4 flex flex-col md:flex-row justify-end gap-3">
                <button
                  onClick={() => handleDecision("rejected")}
                  disabled={isSubmitting}
                  className="px-6 py-3 text-lg font-semibold rounded-full border border-red-500 text-red-600 bg-white hover:bg-red-50"
                >
                  <FaTimesCircle className="inline mr-2" />
                  {isSubmitting ? "Rejecting..." : "Reject"}
                </button>

                <button
                  onClick={() => handleDecision("approved")}
                  disabled={isSubmitting}
                  className="px-6 py-3 text-lg font-semibold text-white rounded-full"
                  style={{ background: "linear-gradient(to right, #2ECC71, #27AE60)" }}
                >
                  <FaCheckCircle className="inline mr-2" />
                  {isSubmitting ? "Approving..." : "Approve"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
