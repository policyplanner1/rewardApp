'use client';

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

export default function StockInCreatePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [totalQuantity, setTotalQuantity] = useState<number>(0);
  const [passedQuantity, setPassedQuantity] = useState<number>(0);
  const [failedQuantity, setFailedQuantity] = useState<number>(0);
  const [stockInDate, setStockInDate] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");

  // Submit stock-in (placeholder)
  const submitStockIn = () => {
    if (!selectedProduct || totalQuantity <= 0) {
      alert("Select product and enter total quantity");
      return;
    }

    if (passedQuantity + failedQuantity !== totalQuantity) {
      alert("Total quantity must equal passed + failed quantity");
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

    console.log("Submitting Stock-In:", stockEntry);
    alert("Stock-In submitted successfully!");

    // Reset form
    setSelectedProduct(null);
    setTotalQuantity(0);
    setPassedQuantity(0);
    setFailedQuantity(0);
    setStockInDate("");
    setLocation("");
    setExpiryDate("");
  };

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-3xl font-bold">Create New Stock In</h1>
      <p className="text-gray-600">Add products received from vendor before final stock-in.</p>

      {/* Product Selection */}
      <div className="p-6 bg-white shadow rounded-xl space-y-4">
        <h2 className="text-xl font-semibold">Stock-In Details</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

          {/* Product Dropdown */}
          <div>
            <label className="font-medium">Product</label>
            <select
              value={selectedProduct?.id || ""}
              onChange={(e) => {
                const product = DUMMY_PRODUCTS.find(p => p.id === parseInt(e.target.value));
                setSelectedProduct(product || null);
              }}
              className="w-full p-3 border rounded-lg mt-1"
            >
              <option value="">-- Select Product --</option>
              {DUMMY_PRODUCTS.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* SKU / Barcode */}
          <div>
            <label className="font-medium">SKU / Barcode</label>
            <input
              type="text"
              value={selectedProduct?.sku || ""}
              readOnly
              className="w-full p-3 border rounded-lg mt-1 bg-gray-100"
            />
          </div>

          {/* Vendor */}
          <div>
            <label className="font-medium">Vendor</label>
            <input
              type="text"
              value={selectedProduct?.vendorName || ""}
              readOnly
              className="w-full p-3 border rounded-lg mt-1 bg-gray-100"
            />
          </div>

          {/* Category */}
          <div>
            <label className="font-medium">Category</label>
            <input
              type="text"
              value={selectedProduct?.category || ""}
              readOnly
              className="w-full p-3 border rounded-lg mt-1 bg-gray-100"
            />
          </div>

          {/* Total Quantity */}
          <div>
            <label className="font-medium">Total Quantity</label>
            <input
              type="number"
              value={totalQuantity}
              onChange={(e) => setTotalQuantity(parseInt(e.target.value))}
              className="w-full p-3 border rounded-lg mt-1"
            />
          </div>

          {/* Passed Quantity */}
          <div>
            <label className="font-medium">Passed Quantity</label>
            <input
              type="number"
              value={passedQuantity}
              onChange={(e) => setPassedQuantity(parseInt(e.target.value))}
              className="w-full p-3 border rounded-lg mt-1"
            />
          </div>

          {/* Failed Quantity */}
          <div>
            <label className="font-medium">Failed Quantity</label>
            <input
              type="number"
              value={failedQuantity}
              onChange={(e) => setFailedQuantity(parseInt(e.target.value))}
              className="w-full p-3 border rounded-lg mt-1"
            />
          </div>

          {/* Stock-In Date */}
          <div>
            <label className="font-medium">Stock-In Date</label>
            <input
              type="date"
              value={stockInDate}
              onChange={(e) => setStockInDate(e.target.value)}
              className="w-full p-3 border rounded-lg mt-1"
            />
          </div>

          {/* Location */}
          <div>
            <label className="font-medium">Rack / Bin Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 border rounded-lg mt-1"
            />
          </div>

          {/* Expiry Date (Optional) */}
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
