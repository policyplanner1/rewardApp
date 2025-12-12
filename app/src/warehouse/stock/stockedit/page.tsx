'use client';

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// Types
interface StockEntry {
  grn: string;
  sku: string;
  vendorName: string;
  productName: string;
  category: string;
  totalQuantity: number;
  passedQuantity: number;
  failedQuantity: number;
  stockInDate: string;
  location: string;
  expiryDate?: string;
  status: "Pending" | "Sent";
}

// Dummy data for demo
const DUMMY_DATA: StockEntry[] = [
  {
    grn: "GRN-2025-001",
    sku: "BW-455",
    vendorName: "Vendor A",
    productName: "Blue Widget",
    category: "Widgets",
    totalQuantity: 50,
    passedQuantity: 45,
    failedQuantity: 5,
    stockInDate: "2025-12-10",
    location: "Rack-4",
    expiryDate: "2026-12-01",
    status: "Pending",
  },
  {
    grn: "GRN-2025-002",
    sku: "RG-228",
    vendorName: "Vendor B",
    productName: "Red Gadget",
    category: "Gadgets",
    totalQuantity: 30,
    passedQuantity: 30,
    failedQuantity: 0,
    stockInDate: "2025-12-11",
    location: "Rack-2",
    expiryDate: "2026-11-15",
    status: "Sent",
  },
];

export default function StockInEditPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const grn = searchParams.get("grn") || "";

  const [stock, setStock] = useState<StockEntry | null>(null);

  // Editable fields
  const [totalQuantity, setTotalQuantity] = useState<number>(0);
  const [passedQuantity, setPassedQuantity] = useState<number>(0);
  const [failedQuantity, setFailedQuantity] = useState<number>(0);
  const [stockInDate, setStockInDate] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");

  // Load stock based on GRN
  useEffect(() => {
    const entry = DUMMY_DATA.find(item => item.grn === grn) || null;
    if (entry) {
      setStock(entry);
      setTotalQuantity(entry.totalQuantity);
      setPassedQuantity(entry.passedQuantity);
      setFailedQuantity(entry.failedQuantity);
      setStockInDate(entry.stockInDate);
      setLocation(entry.location);
      setExpiryDate(entry.expiryDate || "");
    }
  }, [grn]);

  const handleSubmit = () => {
    if (!stock) return;

    if (passedQuantity + failedQuantity !== totalQuantity) {
      alert("Total quantity must equal passed + failed quantity");
      return;
    }

    const updatedStock: StockEntry = {
      ...stock,
      totalQuantity,
      passedQuantity,
      failedQuantity,
      stockInDate,
      location,
      expiryDate: expiryDate || undefined,
    };

    console.log("Updated Stock-In:", updatedStock);
    alert("Stock-In updated successfully!");
    router.push("/stockin"); // go back to list
  };

  if (!stock) {
    return <p className="p-6 text-gray-600">Stock entry not found.</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Edit Stock-In</h1>
      <p className="text-gray-600">Modify stock details for GRN: {stock.grn}</p>

      <div className="p-6 bg-white shadow rounded-xl space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Read-only fields */}
          <div>
            <label className="font-medium">SKU</label>
            <input
              type="text"
              value={stock.sku}
              readOnly
              className="w-full p-3 border rounded-lg mt-1 bg-gray-100"
            />
          </div>

          <div>
            <label className="font-medium">GRN No</label>
            <input
              type="text"
              value={stock.grn}
              readOnly
              className="w-full p-3 border rounded-lg mt-1 bg-gray-100"
            />
          </div>

          <div>
            <label className="font-medium">Product</label>
            <input
              type="text"
              value={stock.productName}
              readOnly
              className="w-full p-3 border rounded-lg mt-1 bg-gray-100"
            />
          </div>

          <div>
            <label className="font-medium">Vendor</label>
            <input
              type="text"
              value={stock.vendorName}
              readOnly
              className="w-full p-3 border rounded-lg mt-1 bg-gray-100"
            />
          </div>

          <div>
            <label className="font-medium">Category</label>
            <input
              type="text"
              value={stock.category}
              readOnly
              className="w-full p-3 border rounded-lg mt-1 bg-gray-100"
            />
          </div>

          {/* Editable fields */}
          <div>
            <label className="font-medium">Total Quantity</label>
            <input
              type="number"
              value={totalQuantity}
              onChange={(e) => setTotalQuantity(parseInt(e.target.value))}
              className="w-full p-3 border rounded-lg mt-1"
            />
          </div>

          <div>
            <label className="font-medium">Passed Quantity</label>
            <input
              type="number"
              value={passedQuantity}
              onChange={(e) => setPassedQuantity(parseInt(e.target.value))}
              className="w-full p-3 border rounded-lg mt-1"
            />
          </div>

          <div>
            <label className="font-medium">Failed Quantity</label>
            <input
              type="number"
              value={failedQuantity}
              onChange={(e) => setFailedQuantity(parseInt(e.target.value))}
              className="w-full p-3 border rounded-lg mt-1"
            />
          </div>

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
              type="text"
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
          onClick={handleSubmit}
          className="px-6 py-3 mt-4 text-white bg-purple-600 rounded-lg"
        >
          Update Stock-In
        </button>
      </div>
    </div>
  );
}
