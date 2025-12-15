"use client";

import { useState, useEffect } from "react";

const API_BASE = "http://localhost:5000/api";

export default function InventoryMasterPage() {
  // FILTER STATES
  const [search, setSearch] = useState("");
  const [lowStockFilter, setLowStockFilter] = useState(false);
  const [expiryFilter, setExpiryFilter] = useState(false);
  const [inventoryData, setInventoryData] = useState<any[]>([]); 
  const [loading, setLoading] = useState(false);

  const LOW_STOCK_LIMIT = 10;
  const EXPIRY_DAYS_LIMIT = 30;

  // Fetch the inventory data 
  useEffect(() => {
    const fetchInventoryData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_BASE}/inventory?search=${search}&lowStock=${lowStockFilter}&expiry=${expiryFilter}`
        );
        
        const data = await res.json();
        
        const inventoryArray = Array.isArray(data) ? data : data.data || [];
        
        setInventoryData(inventoryArray); 
      } catch (error) {
        console.error("Error fetching inventory data:", error);
        setInventoryData([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryData();
  }, [search, lowStockFilter, expiryFilter]);

  // Calculate days to expiry
  const daysToExpiry = (expiryDate: string) => {
    const exp = new Date(expiryDate);
    const today = new Date();
    return Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  // ===============================
  // CSV EXPORT FUNCTION
  // ===============================
  const exportCSV = () => {
    const headers = [
      "Product",
      "SKU",
      "Vendor",
      "Warehouse",  // Added the new column for warehouse
      "Stock",
      "Location",
      "Expiry",
      "Status",
    ];

    const rows = inventoryData.map((item) => [
      item.product,
      item.sku,
      item.vendor,
      item.warehouse,  // Added the new field for warehouse
      item.stock,
      item.location,
      item.expiry,
      item.status,
    ]);

    let csvContent = "data:text/csv;charset=utf-8,";

    csvContent += headers.join(",") + "\n";
    rows.forEach((row) => {
      csvContent += row.join(",") + "\n";
    });

    const encodedURI = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedURI;
    link.download = "inventory_export.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6">
      {/* TITLE */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Warehouse Stock Summary</h1>

        <button
          onClick={exportCSV}
          className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
        >
          Export CSV
        </button>
      </div>

      {/* SEARCH + FILTER BAR */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white shadow rounded-xl">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by product, vendor or SKU..."
          className="flex-1 p-3 border rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Low Stock */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={lowStockFilter}
            onChange={() => setLowStockFilter(!lowStockFilter)}
          />
          <span>Low Stock (&lt;10)</span>
        </label>

        {/* Expiry */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={expiryFilter}
            onChange={() => setExpiryFilter(!expiryFilter)}
          />
          <span>Near Expiry (30 days)</span>
        </label>
      </div>

      {/* TABLE */}
      <div className="p-6 bg-white shadow rounded-xl">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left bg-gray-100">
                <th className="p-3 border">Product</th>
                <th className="p-3 border">SKU</th>
                <th className="p-3 border">Vendor</th>
                <th className="p-3 border">Stock</th>
                <th className="p-3 border">Warehouse</th> {/* Added Warehouse column */}
                <th className="p-3 border">Location</th>
                <th className="p-3 border">Expiry</th>
                <th className="p-3 border">Status</th>
              </tr>
            </thead>

            <tbody>
              {inventoryData.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-4 text-center text-gray-500">
                    No matching results
                  </td>
                </tr>
              ) : (
                inventoryData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="p-3 border">{item.product}</td>
                    <td className="p-3 border">{item.sku}</td>
                    <td className="p-3 border">{item.vendor}</td>
                    <td className={`p-3 border ${item.stock < 10 ? "text-red-600 font-bold" : ""}`}>
                      {item.stock}
                    </td>
                    <td className="p-3 border">{item.warehouse}</td> 

                    <td className="p-3 border">{item.location}</td>

                    <td className={`p-3 border ${
                      daysToExpiry(item.expiry) <= 30 ? "text-orange-600 font-semibold" : ""
                    }`}>
                      {item.expiry}
                    </td>

                    <td className="p-3 border">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          item.status === "Available"
                            ? "bg-green-100 text-green-700"
                            : item.status === "Reserved"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
