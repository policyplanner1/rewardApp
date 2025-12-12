"use client";

import { useState } from "react";

// Types
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

// Dummy Data
const DUMMY_PRODUCTS: Product[] = [
  { id: 101, name: "Blue Widget", sku: "BW-455", vendorId: 1, vendorName: "Vendor A", category: "Widgets", price: 120 },
  { id: 102, name: "Red Gadget", sku: "RG-228", vendorId: 2, vendorName: "Vendor B", category: "Gadgets", price: 180 },
  { id: 103, name: "Green Component", sku: "GC-332", vendorId: 1, vendorName: "Vendor A", category: "Components", price: 95 },
];

// Example stock entry to view
const EXAMPLE_STOCK_ENTRY: StockEntry & { product: Product } = {
  productId: 101,
  product: DUMMY_PRODUCTS[0],
  totalQuantity: 50,
  passedQuantity: 45,
  failedQuantity: 5,
  stockInDate: "2025-12-10",
  location: "Rack-4",
  expiryDate: "2026-12-01",
};

export default function StockInViewPage() {
  const [stockEntry] = useState(EXAMPLE_STOCK_ENTRY);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">View Stock-In</h1>
      <p className="text-gray-600">Details of the stock-in entry received from vendor.</p>

      <div className="p-6 bg-white shadow rounded-xl space-y-4">
        <h2 className="text-xl font-semibold">Stock-In Details</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

          {/* Product Name */}
          <div>
            <label className="font-medium">Product</label>
            <input
              type="text"
              value={stockEntry.product.name}
              readOnly
              className="w-full p-3 border rounded-lg mt-1 bg-gray-100"
            />
          </div>

          {/* SKU */}
          <div>
            <label className="font-medium">SKU / Barcode</label>
            <input
              type="text"
              value={stockEntry.product.sku}
              readOnly
              className="w-full p-3 border rounded-lg mt-1 bg-gray-100"
            />
          </div>

          {/* Vendor */}
          <div>
            <label className="font-medium">Vendor</label>
            <input
              type="text"
              value={stockEntry.product.vendorName}
              readOnly
              className="w-full p-3 border rounded-lg mt-1 bg-gray-100"
            />
          </div>

          {/* Category */}
          <div>
            <label className="font-medium">Category</label>
            <input
              type="text"
              value={stockEntry.product.category}
              readOnly
              className="w-full p-3 border rounded-lg mt-1 bg-gray-100"
            />
          </div>

          {/* Total Quantity */}
          <div>
            <label className="font-medium">Total Quantity</label>
            <input
              type="number"
              value={stockEntry.totalQuantity}
              readOnly
              className="w-full p-3 border rounded-lg mt-1 bg-gray-100"
            />
          </div>

          {/* Passed Quantity */}
          <div>
            <label className="font-medium">Passed Quantity</label>
            <input
              type="number"
              value={stockEntry.passedQuantity}
              readOnly
              className="w-full p-3 border rounded-lg mt-1 bg-gray-100"
            />
          </div>

          {/* Failed Quantity */}
          <div>
            <label className="font-medium">Failed Quantity</label>
            <input
              type="number"
              value={stockEntry.failedQuantity}
              readOnly
              className="w-full p-3 border rounded-lg mt-1 bg-gray-100"
            />
          </div>

          {/* Stock-In Date */}
          <div>
            <label className="font-medium">Stock-In Date</label>
            <input
              type="date"
              value={stockEntry.stockInDate}
              readOnly
              className="w-full p-3 border rounded-lg mt-1 bg-gray-100"
            />
          </div>

          {/* Location */}
          <div>
            <label className="font-medium">Rack / Bin Location</label>
            <input
              type="text"
              value={stockEntry.location}
              readOnly
              className="w-full p-3 border rounded-lg mt-1 bg-gray-100"
            />
          </div>

          {/* Expiry Date */}
          <div>
            <label className="font-medium">Expiry Date</label>
            <input
              type="date"
              value={stockEntry.expiryDate || ""}
              readOnly
              className="w-full p-3 border rounded-lg mt-1 bg-gray-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
