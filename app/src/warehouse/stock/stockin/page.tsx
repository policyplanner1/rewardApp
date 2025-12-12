"use client";

import { useState } from "react";

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

export default function StockInPage() {
  const [search, setSearch] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"Pending" | "Sent">("Pending");

  const [tableData, setTableData] = useState<StockEntry[]>([
    {
      grn: "GRN-2025-001",
      sku: "BW-455",
      vendorName: "Vendor A",
      productName: "Blue Widget",
      category: "Widgets",
      totalQuantity: 50,
      passedQuantity: 45,
      failedQuantity: 5,
      stockInDate: "10/12/2025",
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
      stockInDate: "11/12/2025",
      location: "Rack-2",
      expiryDate: "2026-11-15",
      status: "Sent",
    },
  ]);

  // Filter based on search and active tab
  const filteredData = tableData.filter(
    (row) =>
      row.status === activeTab &&
      (row.productName.toLowerCase().includes(search.toLowerCase()) ||
        row.vendorName.toLowerCase().includes(search.toLowerCase()) ||
        row.grn.toLowerCase().includes(search.toLowerCase()) ||
        row.sku.toLowerCase().includes(search.toLowerCase()))
  );

  const sendToInventory = (grn: string) => {
    setTableData((prev) =>
      prev.map((row) => (row.grn === grn ? { ...row, status: "Sent" } : row))
    );
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Warehouse Stock In</h1>
      <p className="text-gray-600">
        View all stock-in entries received into warehouse.
      </p>

      {/* Top Actions */}
      <div className="flex justify-between p-6 bg-white shadow rounded-xl">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by GRN, SKU, Product, Vendor..."
          className="w-1/2 p-3 border rounded-lg"
        />

        <button
          className="px-6 py-3 text-white bg-purple-600 rounded-lg"
          onClick={() => (window.location.href = "stockcreate")}
        >
          + New Stock In
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4">
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === "Pending"
              ? "bg-purple-600 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("Pending")}
        >
          Pending Inventory
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === "Sent" ? "bg-purple-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("Sent")}
        >
          Sent to Inventory
        </button>
      </div>

      {/* Table container */}
      <div className="bg-white shadow rounded-xl mt-4">
        <h2 className="p-6 text-xl font-semibold">
          {activeTab === "Pending" ? "Pending Inventory" : "Sent to Inventory"}{" "}
          Records
        </h2>

        {/* Scrollable table ONLY */}
        <div className="overflow-x-auto">
          <table className="min-w-max w-full border-collapse">
            <thead>
              <tr className="text-left bg-gray-100">
                <th className="p-3 border">SKU</th>
                <th className="p-3 border">GRN No</th>
                <th className="p-3 border">Vendor</th>
                <th className="p-3 border">Product</th>
                <th className="p-3 border">Category</th>
                <th className="p-3 border">Total Qty</th>
                <th className="p-3 border">Passed Qty</th>
                <th className="p-3 border">Failed Qty</th>
                <th className="p-3 border">Stock-In Date</th>
                <th className="p-3 border">Location</th>
                <th className="p-3 border">Expiry</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={13} className="p-4 text-center text-gray-500">
                    No records found.
                  </td>
                </tr>
              ) : (
                filteredData.map((row, i) => (
                  <tr key={i}>
                    <td className="p-3 border font-semibold">{row.sku}</td>
                    <td className="p-3 border font-semibold">{row.grn}</td>
                    <td className="p-3 border">{row.vendorName}</td>
                    <td className="p-3 border">{row.productName}</td>
                    <td className="p-3 border">{row.category}</td>
                    <td className="p-3 border">{row.totalQuantity}</td>
                    <td className="p-3 border">{row.passedQuantity}</td>
                    <td className="p-3 border">{row.failedQuantity}</td>
                    <td className="p-3 border">{row.stockInDate}</td>
                    <td className="p-3 border">{row.location}</td>
                    <td className="p-3 border">{row.expiryDate || "N/A"}</td>
                    <td className="p-3 border">{row.status}</td>
                    <td className="p-3 border whitespace-nowrap">
                      <button className="text-purple-600 mr-2">View</button>
                      <button className="text-green-600 mr-2">Edit</button>
                      {activeTab === "Pending" && (
                        <button
                          className="text-blue-600"
                          onClick={() => sendToInventory(row.grn)}
                        >
                          Send to Inventory
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
