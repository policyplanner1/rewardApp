"use client";

import { useEffect, useState } from "react";
const API_BASE = "http://localhost:5000";

/* ================= TYPES ================= */

interface Product {
  id: number;
  name: string;
  sku: string;
  vendorId: number;
  vendorName: string;
  category: string;
  price: number;
}

interface StockEntry {
  productId: number;
  totalQuantity: number;
  passedQuantity: number;
  failedQuantity: number;
  stockInDate: string;
  location: string;
  expiryDate?: string;
}

/* ================= COMPONENT ================= */

export default function StockInCreatePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [totalQuantity, setTotalQuantity] = useState(0);
  const [passedQuantity, setPassedQuantity] = useState(0);
  const [failedQuantity, setFailedQuantity] = useState(0);

  const [stockInDate, setStockInDate] = useState("");
  const [location, setLocation] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  /* ================= FETCH APPROVED PRODUCTS ================= */

  useEffect(() => {
    fetchApprovedProducts();
  }, []);

  const fetchApprovedProducts = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No auth token found");
        return;
      }

      const res = await fetch(`${API_BASE}/api/product/approved-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();

      setProducts(
        data.products.map((p: any) => ({
          id: p.product_id,
          name: p.product_name,
          sku: p.sku,
          vendorId: p.vendor_id,
          vendorName: p.vendor_name,
          category: p.category_name,
          price: p.price,
        }))
      );
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH PRODUCT DETAILS ON SELECT ================= */

  const handleProductSelect = async (productId: number) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_BASE}/api/product/approved-products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      const p = data.products[0];

      setSelectedProduct({
        id: p.product_id,
        name: p.product_name,
        sku: p.sku,
        vendorId: p.vendor_id,
        vendorName: p.vendor_name,
        category: p.category_name,
        price: p.price,
      });
    } catch (err) {
      console.error("Failed to fetch product details", err);
    }
  };

  /* ================= AUTO CALCULATE FAILED QTY ================= */

  useEffect(() => {
    if (totalQuantity >= passedQuantity) {
      setFailedQuantity(totalQuantity - passedQuantity);
    }
  }, [totalQuantity, passedQuantity]);

  /* ================= SUBMIT STOCK IN ================= */

  const submitStockIn = async () => {
    if (!selectedProduct || totalQuantity <= 0) {
      alert("Select product and enter valid quantity");
      return;
    }

    const stockEntry: StockEntry = {
      productId: selectedProduct.id,
      totalQuantity,
      passedQuantity,
      failedQuantity,
      stockInDate: stockInDate || new Date().toISOString().split("T")[0],
      location,
      expiryDate: expiryDate || undefined,
    };

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE}/api/warehouse/stock-in`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stockEntry),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        /* Reset */
        setSelectedProduct(null);
        setTotalQuantity(0);
        setPassedQuantity(0);
        setFailedQuantity(0);
        setStockInDate("");
        setLocation("");
        setExpiryDate("");

        alert("Entry created");
      }
    } catch (err) {
      console.error("Failed to submit stock-in", err);
      alert("Failed to submit stock-in");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Create New Stock In</h1>
      <p className="text-gray-600">
        Add products received from vendor before final inventory entry.
      </p>

      <div className="p-6 bg-white shadow rounded-xl space-y-4">
        <h2 className="text-xl font-semibold">Stock-In Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product */}
          <div>
            <label className="font-medium">Product</label>
            <select
              value={selectedProduct?.id || ""}
              onChange={(e) => handleProductSelect(Number(e.target.value))}
              className="w-full p-3 border rounded-lg mt-1"
            >
              <option value="">-- Select Product --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* SKU */}
          <div>
            <label className="font-medium">SKU / Barcode</label>
            <input
              value={selectedProduct?.sku || ""}
              readOnly
              className="w-full p-3 border rounded-lg mt-1 bg-gray-100"
            />
          </div>

          {/* Vendor */}
          <div>
            <label className="font-medium">Vendor</label>
            <input
              value={selectedProduct?.vendorName || ""}
              readOnly
              className="w-full p-3 border rounded-lg mt-1 bg-gray-100"
            />
          </div>

          {/* Category */}
          <div>
            <label className="font-medium">Category</label>
            <input
              value={selectedProduct?.category || ""}
              readOnly
              className="w-full p-3 border rounded-lg mt-1 bg-gray-100"
            />
          </div>

          {/* Quantities */}
          <div>
            <label className="font-medium">Total Quantity</label>
            <input
              type="number"
              value={totalQuantity}
              onChange={(e) => setTotalQuantity(+e.target.value)}
              className="w-full p-3 border rounded-lg mt-1"
            />
          </div>

          <div>
            <label className="font-medium">Passed Quantity</label>
            <input
              type="number"
              value={passedQuantity}
              onChange={(e) => setPassedQuantity(+e.target.value)}
              className="w-full p-3 border rounded-lg mt-1"
            />
          </div>

          <div>
            <label className="font-medium">Failed Quantity</label>
            <input
              type="number"
              value={failedQuantity}
              readOnly
              className="w-full p-3 border rounded-lg mt-1 bg-gray-100"
            />
          </div>

          {/* Dates & Location */}
          <div>
            <label className="font-medium">Stock-In Date</label>
            <input
              type="date"
              value={stockInDate}
              onChange={(e) => setStockInDate(e.target.value)}
              className="w-full p-3 border rounded-lg mt-1"
            />
          </div>

          <div>
            <label className="font-medium">Rack / Bin Location</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 border rounded-lg mt-1"
            />
          </div>

          <div>
            <label className="font-medium">Expiry Date (Optional)</label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full p-3 border rounded-lg mt-1"
            />
          </div>
        </div>

        <button
          onClick={submitStockIn}
          className="px-6 py-3 mt-4 text-white bg-purple-600 rounded-lg"
        >
          Submit Stock-In
        </button>
      </div>
    </div>
  );
}
