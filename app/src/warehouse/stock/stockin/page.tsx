"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEdit, FaPaperPlane } from "react-icons/fa";

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
  const router = useRouter();

  const [search, setSearch] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"Pending" | "Sent">("Pending");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5; // Adjust items per page

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
    // Add more dummy entries for testing pagination
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

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

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
      <div className="flex justify-left p-6 bg-white shadow rounded-xl">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // reset page on search
          }}
          placeholder="Search by GRN, SKU, Product, Vendor..."
          className="w-1/2 p-3 border rounded-lg"
        />

        <button
          className="px-6 py-3 ml-8 text-white bg-purple-600 rounded-lg"
          onClick={() => router.push("stockcreate")}
        >
          + New Stock In
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4">
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === "Pending" ? "bg-purple-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => {
            setActiveTab("Pending");
            setCurrentPage(1);
          }}
        >
          Pending Inventory
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === "Sent" ? "bg-purple-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => {
            setActiveTab("Sent");
            setCurrentPage(1);
          }}
        >
          Sent to Inventory
        </button>
      </div>

      {/* Table container */}
      <div className="bg-white shadow rounded-xl mt-4">
        <h2 className="p-6 text-xl font-semibold">
          {activeTab === "Pending" ? "Pending Inventory" : "Sent to Inventory"} Records
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
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={13} className="p-4 text-center text-gray-500">
                    No records found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, i) => (
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
                    <td className="p-3 border whitespace-nowrap flex space-x-2">
                      <button
                        className="text-purple-600 hover:text-purple-800"
                        onClick={() =>
                          router.push(`/src/warehouse/stock/stockview?grn=${row.grn}`)
                        }
                      >
                        <FaEye className="h-5 w-5" />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-800"
                        onClick={() =>
                          router.push(`/src/warehouse/stock/stockedit?grn=${row.grn}`)
                        }
                      >
                        <FaEdit className="h-5 w-5" />
                      </button>
                      {activeTab === "Pending" && (
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => sendToInventory(row.grn)}
                        >
                          <FaPaperPlane className="h-5 w-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-end items-center p-4 space-x-2">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                className={`px-3 py-1 border rounded ${
                  currentPage === idx + 1 ? "bg-purple-600 text-white" : ""
                }`}
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}

            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
