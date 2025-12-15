"use client";

import { useEffect, useState } from "react";

// ============================
// Type Definitions
// ============================
interface Product {
  id: number;
  name: string;
  sku: string;
}

interface AdjustmentEntry {
  date: string;
  productId: number;
  product: string;
  sku: string;
  quantity: number;
  adjustmentType: "IN" | "OUT";
  reason: string;
}

// ============================

export default function StockAdjustmentPage() {
  // Form States
  const [date, setDate] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState("");
  const [adjustType, setAdjustType] = useState("");
  const [reason, setReason] = useState("");

  // Table
  const [tableData, setTableData] = useState<AdjustmentEntry[]>([]);

  // ============================
  // Fetch Products API
  // ============================
  const fetchProducts = async (search: string) => {
    if (!search.trim()) {
      setProducts([]);
      return;
    }

    const res = await fetch(`/api/products?search=${search}`);
    const data = await res.json();

    if (data.success) {
      setProducts(data.data);
    }
  };

  // ============================
  // Add Adjustment
  // ============================
  const addAdjustment = async () => {
    if (!date || !selectedProduct || !quantity || !adjustType || !reason) {
      alert("Please fill all fields");
      return;
    }

    const adjustmentTypeMap: Record<string, "IN" | "OUT"> = {
      Damage: "OUT",
      "Lost Item": "OUT",
      Return: "IN",
    };

    const payload = {
      date,
      product_id: selectedProduct.id,
      quantity: Number(quantity),
      adjustment_type: adjustmentTypeMap[adjustType],
      reason,
    };

    // Submit to backend
    const res = await fetch("/api/stock-adjustments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (!result.success) {
      alert(result.message);
      return;
    }

    // Update table UI
    setTableData((prev) => [
      ...prev,
      {
        date,
        productId: selectedProduct.id,
        product: selectedProduct.name,
        sku: selectedProduct.sku,
        quantity: Number(quantity),
        adjustmentType: adjustmentTypeMap[adjustType],
        reason,
      },
    ]);

    // Reset
    setDate("");
    setProductSearch("");
    setProducts([]);
    setSelectedProduct(null);
    setQuantity("");
    setAdjustType("");
    setReason("");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Warehouse Stock Adjustment</h1>

      {/* FORM */}
      <div className="p-6 space-y-4 bg-white shadow rounded-xl">
        {/* Product Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Product</label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg"
            placeholder="Search product"
            value={productSearch}
            onChange={(e) => {
              setProductSearch(e.target.value);
              fetchProducts(e.target.value);
            }}
          />

          {products.length > 0 && (
            <div className="mt-1 max-h-40 overflow-y-auto border rounded-lg">
              {products.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedProduct(p);
                    setProductSearch(p.name);
                    setProducts([]);
                  }}
                  className="p-3 cursor-pointer hover:bg-gray-100 flex justify-between"
                >
                  <span>{p.name}</span>
                  <span className="text-gray-500">{p.sku}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            className="w-full p-3 border rounded-lg"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        {/* Adjustment Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Adjustment Type</label>
          <select
            className="w-full p-3 border rounded-lg"
            value={adjustType}
            onChange={(e) => setAdjustType(e.target.value)}
          >
            <option value="">Select Type</option>
            <option value="Damage">Damage</option>
            <option value="Return">Return</option>
            <option value="Lost Item">Lost Item</option>
          </select>
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Reason</label>
          <textarea
            className="w-full p-3 border rounded-lg"
            placeholder="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            className="w-full p-3 border rounded-lg"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            onClick={addAdjustment}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg"
          >
            Add Adjustment
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="p-6 bg-white shadow rounded-xl">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Product</th>
              <th className="p-3 border">SKU</th>
              <th className="p-3 border">Qty</th>
              <th className="p-3 border">Type</th>
              <th className="p-3 border">Reason</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, i) => (
              <tr key={i}>
                <td className="p-3 border">{row.date}</td>
                <td className="p-3 border">{row.product}</td>
                <td className="p-3 border">{row.sku}</td>
                <td className="p-3 border">{row.quantity}</td>
                <td className="p-3 border">{row.adjustmentType}</td>
                <td className="p-3 border">{row.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
  