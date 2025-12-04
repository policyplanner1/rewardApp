"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FaBox,
  FaDollarSign,
  FaImages,
  FaArrowLeft,
  FaSpinner,
  FaTimesCircle
} from "react-icons/fa";

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
  size: string;
  color: string;
  model: string;
  dimension: string;
  stock: number;
  vendor_price: string;
  sale_price: string;
  tax_code: string;
  expiry_date: string | null;
  status: "pending" | "approved" | "rejected";
  rejection_reason: string | null;
  created_at: string;
  company_name: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    product: ProductData;
    images: ProductImage[];
  };
}

const DetailItem = ({ label, value }: any) => (
  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
    <p className="text-xs font-medium text-gray-500 uppercase mb-1">{label}</p>
    <p className="text-sm font-semibold text-gray-800 break-words">
      {value || "N/A"}
    </p>
  </div>
);

const SectionHeader = ({ icon: Icon, title }: any) => (
  <div className="flex items-center space-x-3 mb-4 mt-8">
    <Icon className="text-xl text-[#852BAF]" />
    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
  </div>
);

export default function VendorProductView() {
  const params = useParams();
  const router = useRouter();
  const productId = params.productId as string;

  const [product, setProduct] = useState<ProductData | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch product from backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/products/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json"
            }
          }
        );

        if (!response.ok) throw new Error("Failed to fetch product");

        const data: ApiResponse = await response.json();

        if (data.success) {
          setProduct(data.data.product);
          setImages(data.data.images);
        } else {
          throw new Error("Product not found");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const statusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700 border-green-300";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
    }
  };

  const formatStatus = (status: string) =>
    status.charAt(0).toUpperCase() + status.slice(1);

  // Loading
  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 text-center">
          <FaSpinner className="animate-spin text-4xl text-[#852BAF] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">
            Loading Product...
          </h2>
        </div>
      </div>
    );
  }

  // Error
  if (error || !product) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 text-center">
          <FaTimesCircle className="text-4xl text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">
            Error Loading Product
          </h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-6 py-2 bg-[#852BAF] text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Vendor view
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
              <span>Back to List</span>
            </button>

            <div className="w-1 h-6 bg-gray-300" />

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Product Details
              </h1>
              <p className="text-gray-600">
                ID: {product.product_id} | Vendor: {product.company_name}
              </p>
            </div>
          </div>

          <span
            className={`px-4 py-2 text-sm font-semibold rounded-full border ${statusColor(
              product.status
            )}`}
          >
            {formatStatus(product.status)}
          </span>
        </div>

        {/* Product Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {product.product_name}
          </h2>
          <p className="text-gray-600 text-lg">{product.short_description}</p>

          {/* Core Details */}
          <SectionHeader icon={FaBox} title="Core Details" />

          <DetailItem label="Brand Name" value={product.brand_name} />
          <DetailItem label="Manufacturer" value={product.manufacturer} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <DetailItem label="Item Type" value={product.item_type} />
            <DetailItem label="Model" value={product.model} />
            <DetailItem label="Bar Code" value={product.barcode} />
            <DetailItem label="Color" value={product.color} />
            <DetailItem label="Size" value={product.size} />
            <DetailItem label="Dimension" value={product.dimension} />
            <DetailItem label="Stock" value={product.stock} />
          </div>

          {/* Pricing */}
          <SectionHeader icon={FaDollarSign} title="Pricing" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DetailItem
              label="Vendor Price"
              value={`₹${parseFloat(product.vendor_price).toFixed(2)}`}
            />
            <DetailItem
              label="Sales Price"
              value={`₹${parseFloat(product.sale_price).toFixed(2)}`}
            />
            <DetailItem label="Tax Code" value={product.tax_code} />
            <DetailItem
              label="Expiry Date"
              value={product.expiry_date || "N/A"}
            />
          </div>

          {/* Images */}
          <SectionHeader icon={FaImages} title="Product Images" />

          <div className="flex space-x-4 overflow-x-auto p-4 mb-8 border rounded-lg bg-gray-50">
            {images.length > 0 ? (
              images.map((img, index) => (
                <img
                  key={index}
                  className="w-48 h-48 object-cover rounded-lg border shadow"
                  src={`http://localhost:5000/${img.image_url.replace(
                    /\\/g,
                    "/"
                  )}`}
                  alt="Product"
                />
              ))
            ) : (
              <div>No images available</div>
            )}
          </div>

          {/* Status & Rejection Reason */}
          <div
            className={`p-6 mt-6 border rounded-lg ${statusColor(
              product.status
            )}`}
          >
            <p className="font-semibold text-lg">
              Product is {formatStatus(product.status)}
            </p>

            {product.status === "rejected" && product.rejection_reason && (
              <div className="mt-3 p-3 bg-red-50 rounded border border-red-200">
                <p className="font-medium text-red-800">Rejection Reason:</p>
                <p className="text-red-700 mt-1">{product.rejection_reason}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
