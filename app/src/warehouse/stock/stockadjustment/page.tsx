"use client";

import { useState } from "react";

// ============================
// Type Definitions (TSX Safe)
// ============================
interface Product {
  id: number;
  name: string;
  sku: string;
  vendorId: number;
  vendorName: string;
  price: number;
}

interface AdjustmentEntry {
  date: string;
  product: string;
  sku: string;
  quantity: number;
  type: string;
  reason: string;
}

// ============================
// Dummy Data
// ============================
const DUMMY_PRODUCTS: Product[] = [
  { id: 101, name: "Blue Widget", sku: "BW-455", vendorId: 1, vendorName: "Vendor A", price: 120 },
  { id: 102, name: "Red Gadget", sku: "RG-228", vendorId: 2, vendorName: "Vendor B", price: 180 },
  { id: 103, name: "Green Component", sku: "GC-332", vendorId: 1, vendorName: "Vendor A", price: 95 },
];

export default function StockAdjustmentPage() {
  // Form States
  const [date, setDate] = useState<string>("");
  const [productSearch, setProductSearch] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<string>("");
  const [adjustType, setAdjustType] = useState<string>("");
  const [reason, setReason] = useState<string>("");

  // Table Data
  const [tableData, setTableData] = useState<AdjustmentEntry[]>([]);

  // ============================
  // Search Handler (TS strict)
  // ============================
  const handleSearch = (value: string) => {
    setProductSearch(value);

    if (!value.trim()) {
      setFilteredProducts([]);
      return;
    }

    const results = DUMMY_PRODUCTS.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredProducts(results);
  };

  // ============================
  // Add Adjustment Row
  // ============================
  const addAdjustment = () => {
    if (!date || !selectedProduct || !quantity || !adjustType || !reason) {
      alert("Please fill all fields!");
      return;
    }

    const newEntry: AdjustmentEntry = {
      date,
      product: selectedProduct.name,
      sku: selectedProduct.sku,
      quantity: Number(quantity),
      type: adjustType,
      reason,
    };

    setTableData((prev) => [...prev, newEntry]);

    // Reset form
    setDate("");
    setProductSearch("");
    setSelectedProduct(null);
    setFilteredProducts([]);
    setQuantity("");
    setAdjustType("");
    setReason("");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Stock Adjustment</h1>
      <p className="text-gray-600">Record stock changes due to damage, returns, or lost items.</p>

      {/* ============================ */}
      {/*  ADJUSTMENT FORM SECTION    */}
      {/* ============================ */}
      <div className="p-6 space-y-4 bg-white shadow rounded-xl">

        {/* Date */}
        <div>
          <label className="font-medium">Adjustment Date</label>
          <input
            type="date"
            className="w-full p-3 mt-1 border rounded-lg"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Product Search */}
        <div>
          <label className="font-medium">Product</label>
          <input
            type="text"
            className="w-full p-3 mt-1 border rounded-lg"
            placeholder="Search Product Name"
            value={productSearch}
            onChange={(e) => handleSearch(e.target.value)}
          />

          {/* Dropdown */}
          {filteredProducts.length > 0 && (
            <div className="mt-1 overflow-y-auto bg-white border rounded-lg shadow max-h-40">
              {filteredProducts.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedProduct(item);
                    setProductSearch(item.name);
                    setFilteredProducts([]);
                  }}
                  className="flex justify-between p-3 cursor-pointer hover:bg-gray-100"
                >
                  <span>{item.name}</span>
                  <span className="text-gray-500">{item.sku}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        {selectedProduct && (
          <div className="p-3 border rounded-lg bg-gray-50">
            <p><b>Product:</b> {selectedProduct.name}</p>
            <p><b>SKU:</b> {selectedProduct.sku}</p>
          </div>
        )}

        {/* Quantity */}
        <div>
          <label className="font-medium">Quantity</label>
          <input
            type="number"
            className="w-full p-3 mt-1 border rounded-lg"
            value={quantity}
            placeholder="Enter quantity"
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        {/* Adjustment Type */}
        <div>
          <label className="font-medium">Adjustment Type</label>
          <select
            className="w-full p-3 mt-1 border rounded-lg"
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
          <label className="font-medium">Reason</label>
          <textarea
            className="w-full p-3 mt-1 border rounded-lg"
            placeholder="Enter reason for adjustment"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        {/* Submit */}
        <button
          onClick={addAdjustment}
          className="px-6 py-3 text-white bg-purple-600 rounded-lg hover:bg-purple-700"
        >
          Add Stock Adjustment
        </button>
      </div>

      {/* ============================ */}
      {/*   TABLE SECTION             */}
      {/* ============================ */}
      <div className="p-6 bg-white shadow rounded-xl">
        <h2 className="mb-4 text-xl font-semibold">Adjustment Records</h2>

        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left bg-gray-100">
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Product</th>
              <th className="p-3 border">SKU</th>
              <th className="p-3 border">Quantity</th>
              <th className="p-3 border">Type</th>
              <th className="p-3 border">Reason</th>
            </tr>
          </thead>

          <tbody>
            {tableData.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No adjustments recorded.
                </td>
              </tr>
            ) : (
              tableData.map((entry, index) => (
                <tr key={index}>
                  <td className="p-3 border">{entry.date}</td>
                  <td className="p-3 border">{entry.product}</td>
                  <td className="p-3 border">{entry.sku}</td>
                  <td className="p-3 border">{entry.quantity}</td>
                  <td className="p-3 border">{entry.type}</td>
                  <td className="p-3 border">{entry.reason}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
