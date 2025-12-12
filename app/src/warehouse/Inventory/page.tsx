"use client";

import { useState } from "react";

// =======================
// Dummy Inventory Data
// =======================
const INVENTORY_DATA = [
  {
    id: 1,
    product: "Blue Widget",
    sku: "BW-455",
    vendor: "Vendor A",
    category: "Electronics",
    subcategory: "Components",
    stock: 12,
    location: "Aisle 3 - Shelf 2 - Bin 5",
    expiry: "2025-02-12",
    status: "Available",
  },
  {
    id: 2,
    product: "Red Gadget",
    sku: "RG-228",
    vendor: "Vendor B",
    category: "Hardware",
    subcategory: "Tools",
    stock: 5,
    location: "Aisle 1 - Shelf 1 - Bin 2",
    expiry: "2025-01-15",
    status: "Reserved",
  },
  {
    id: 3,
    product: "Green Component",
    sku: "GC-332",
    vendor: "Vendor A",
    category: "Electronics",
    subcategory: "Panels",
    stock: 50,
    location: "Aisle 2 - Shelf 4 - Bin 1",
    expiry: "2024-12-05",
    status: "Available",
  },
  {
    id: 4,
    product: "Orange Device",
    sku: "OD-982",
    vendor: "Vendor C",
    category: "Appliances",
    subcategory: "Kitchen",
    stock: 0,
    location: "Aisle 4 - Shelf 3 - Bin 6",
    expiry: "2024-11-10",
    status: "Damaged",
  },
];

export default function InventoryMasterPage() {
  // FILTER STATES
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [lowStockFilter, setLowStockFilter] = useState(false);
  const [expiryFilter, setExpiryFilter] = useState(false);

  const LOW_STOCK_LIMIT = 10;
  const EXPIRY_DAYS_LIMIT = 30;

  const daysToExpiry = (expiryDate) => {
    const exp = new Date(expiryDate);
    const today = new Date();
    return Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
  };

  // GET CATEGORY LIST
  const categories = ["All", ...new Set(INVENTORY_DATA.map((item) => item.category))];

  // APPLY FILTERS
  const filteredData = INVENTORY_DATA.filter((item) => {
    const matchSearch =
      item.product.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      item.vendor.toLowerCase().includes(search.toLowerCase());

    const matchCategory = categoryFilter === "All" || item.category === categoryFilter;

    const matchLowStock = !lowStockFilter || item.stock < LOW_STOCK_LIMIT;

    const matchExpiry =
      !expiryFilter || daysToExpiry(item.expiry) <= EXPIRY_DAYS_LIMIT;

    return matchSearch && matchCategory && matchLowStock && matchExpiry;
  });

  // ===============================
  // CSV EXPORT FUNCTION
  // ===============================
  const exportCSV = () => {
    const headers = [
      "Product",
      "SKU",
      "Vendor",
      "Category",
      "Subcategory",
      "Stock",
      "Location",
      "Expiry",
      "Status",
    ];

    const rows = filteredData.map((item) => [
      item.product,
      item.sku,
      item.vendor,
      item.category,
      item.subcategory,
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

        {/* Category Filter */}
        <select
          className="p-3 border rounded-lg"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          {categories.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>

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
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left bg-gray-100">
              <th className="p-3 border">Product</th>
              <th className="p-3 border">SKU</th>
              <th className="p-3 border">Vendor</th>
              <th className="p-3 border">Category</th>
              <th className="p-3 border">Subcategory</th>
              <th className="p-3 border">Stock</th>
              <th className="p-3 border">Location</th>
              <th className="p-3 border">Expiry</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="9" className="p-4 text-center text-gray-500">
                  No matching results
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-3 border">{item.product}</td>
                  <td className="p-3 border">{item.sku}</td>
                  <td className="p-3 border">{item.vendor}</td>
                  <td className="p-3 border">{item.category}</td>
                  <td className="p-3 border">{item.subcategory}</td>

                  <td className={`p-3 border ${item.stock < 10 ? "text-red-600 font-bold" : ""}`}>
                    {item.stock}
                  </td>

                  <td className="p-3 border">{item.location}</td>

                  <td className={`p-3 border ${
                    daysToExpiry(item.expiry) <= 30 ? "text-orange-600 font-semibold" : ""
                  }`}>
                    {item.expiry}
                  </td>

                  <td className="p-3 border">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      item.status === "Available"
                        ? "bg-green-100 text-green-700"
                        : item.status === "Reserved"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
