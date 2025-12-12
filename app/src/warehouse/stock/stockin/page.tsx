'use client';

import { useState } from "react";

// Types
interface Product {
  id: number;
  name: string;
  sku: string;
  vendorId: number;
  vendorName: string;
  price: number;
}

interface StockEntry {
  vendorName: string;
  productName: string;
  price: number;
  quantity: string;
  date: string;
  location: string;
  expiryDate: string;
}

// Dummy Product Data
const DUMMY_PRODUCTS: Product[] = [
  { id: 101, name: "Blue Widget", sku: "BW-455", vendorId: 1, vendorName: "Vendor A", price: 120 },
  { id: 102, name: "Red Gadget", sku: "RG-228", vendorId: 2, vendorName: "Vendor B", price: 180 },
  { id: 103, name: "Green Component", sku: "GC-332", vendorId: 1, vendorName: "Vendor A", price: 95 },
];

export default function StockInPage() {
  const [search, setSearch] = useState<string>("");
  const [filtered, setFiltered] = useState<Product[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [qty, setQty] = useState<string>("");
  const [expiry, setExpiry] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  const [tableData, setTableData] = useState<StockEntry[]>([]);

  // Search Handler
  const handleSearch = (value: string) => {
    setSearch(value);

    if (!value.trim()) return setFiltered([]);

    const result = DUMMY_PRODUCTS.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase()) ||
      item.sku.toLowerCase().includes(value.toLowerCase()) ||
      String(item.id).includes(value) ||
      item.vendorName.toLowerCase().includes(value.toLowerCase())
    );

    setFiltered(result);
  };

  // Add stock entry
  const addStockEntry = () => {
    if (!selectedProduct || !qty) {
      alert("Select product and enter quantity");
      return;
    }

    const newEntry: StockEntry = {
      vendorName: selectedProduct.vendorName,
      productName: selectedProduct.name,
      price: selectedProduct.price,
      quantity: qty,
      date: new Date().toLocaleDateString(),
      location,
      expiryDate: expiry || "N/A",
    };

    setTableData([...tableData, newEntry]);

    // Reset
    setSelectedProduct(null);
    setSearch("");
    setFiltered([]);
    setQty("");
    setExpiry("");
    setLocation("");
  };

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-3xl font-bold">Stock In (Receive Inventory)</h1>
      <p className="text-gray-600">Add new stock coming from vendors to warehouse.</p>

      {/* Search Section */}
      <div className="p-6 bg-white shadow rounded-xl">
        <h2 className="mb-4 text-xl font-semibold">Search Product</h2>

        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by Product ID, Name, SKU, Vendor"
          className="w-full p-3 border rounded-lg"
        />

        {/* Dropdown */}
        {filtered.length > 0 && (
          <div className="mt-2 overflow-y-auto bg-white border rounded-lg shadow max-h-48">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedProduct(item);
                  setFiltered([]);
                  setSearch(item.name);
                }}
                className="flex justify-between p-3 cursor-pointer hover:bg-gray-100"
              >
                <span>{item.name} ({item.sku})</span>
                <span className="text-gray-500">{item.vendorName}</span>
              </div>
            ))}
          </div>
        )}

        {/* Selected Product */}
        {selectedProduct && (
          <div className="p-4 mt-6 border bg-gray-50 rounded-xl">

            <h3 className="font-semibold">Selected Product</h3>
            <p><b>Product:</b> {selectedProduct.name}</p>
            <p><b>Vendor:</b> {selectedProduct.vendorName}</p>
            <p><b>Price:</b> ₹{selectedProduct.price}</p>

            <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-3">

              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                placeholder="Quantity"
                className="p-3 border rounded-lg"
              />

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Rack / Bin Location"
                className="p-3 border rounded-lg"
              />

              <input
                type="date"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="p-3 border rounded-lg"
              />
            </div>

            <button
              onClick={addStockEntry}
              className="px-6 py-3 mt-4 text-white bg-purple-600 rounded-lg"
            >
              Add Stock Entry
            </button>

          </div>
        )}
      </div>

      {/* Table */}
      <div className="p-6 bg-white shadow rounded-xl">
        <h2 className="mb-4 text-xl font-semibold">Stock In Records</h2>

        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left bg-gray-100">
              <th className="p-3 border">Vendor</th>
              <th className="p-3 border">Product</th>
              <th className="p-3 border">Price</th>
              <th className="p-3 border">Quantity</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Location</th>
              <th className="p-3 border">Expiry</th>
            </tr>
          </thead>
          <tbody>
            {tableData.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  No stock added yet.
                </td>
              </tr>
            ) : (
              tableData.map((row, i) => (
                <tr key={i}>
                  <td className="p-3 border">{row.vendorName}</td>
                  <td className="p-3 border">{row.productName}</td>
                  <td className="p-3 border">₹{row.price}</td>
                  <td className="p-3 border">{row.quantity}</td>
                  <td className="p-3 border">{row.date}</td>
                  <td className="p-3 border">{row.location}</td>
                  <td className="p-3 border">{row.expiryDate}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
