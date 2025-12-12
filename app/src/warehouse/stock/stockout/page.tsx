'use client';

import { useState } from "react";

export default function StockOutTable() {

  // Static Dummy Data
  const STOCK_OUT_DATA = [
    {
      date: "2025-01-12",
      product: "Blue Widget",
      sku: "BW-455",
      quantity: 12,
      orderId: "ORD-10021",
      destination: "Mumbai, MH",
      status: "Dispatched"
    },
    {
      date: "2025-01-12",
      product: "Red Gadget",
      sku: "RG-228",
      quantity: 8,
      orderId: "ORD-10022",
      destination: "Pune, MH",
      status: "In Transit"
    },
    {
      date: "2025-01-11",
      product: "Green Component",
      sku: "GC-332",
      quantity: 25,
      orderId: "ORD-10018",
      destination: "Delhi, DL",
      status: "Delivered"
    },
    {
      date: "2025-01-10",
      product: "Blue Widget",
      sku: "BW-455",
      quantity: 5,
      orderId: "ORD-10016",
      destination: "Ahmedabad, GJ",
      status: "Pending Pickup"
    }
  ];

  // FILTER STATES
  const [productFilter, setProductFilter] = useState("");
  const [orderFilter, setOrderFilter] = useState("");

  // FILTER LOGIC
  const filteredData = STOCK_OUT_DATA.filter((row) => {
    const matchProduct =
      productFilter === "" ||
      row.product.toLowerCase().includes(productFilter.toLowerCase());

    const matchOrder =
      orderFilter === "" ||
      row.orderId.toLowerCase().includes(orderFilter.toLowerCase());

    return matchProduct && matchOrder;
  });

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-3xl font-bold">Warehouse Stock Out</h1>
      <p className="text-gray-600">Track all outbound shipments from the warehouse.</p>

      {/* FILTER SECTION */}
      <div className="flex flex-col gap-4 p-4 bg-white shadow rounded-xl md:flex-row">

        <input
          type="text"
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
          placeholder="Filter by Product Name"
          className="flex-1 p-3 border rounded-lg"
        />

        <input
          type="text"
          value={orderFilter}
          onChange={(e) => setOrderFilter(e.target.value)}
          placeholder="Filter by Order ID"
          className="flex-1 p-3 border rounded-lg"
        />

      </div>

      {/* TABLE SECTION */}
      <div className="p-6 bg-white shadow rounded-xl">

        <table className="w-full border-collapse">
          <thead>
            <tr className="text-sm font-semibold text-left bg-gray-100">
              <th className="p-3 border">Dispatch Date</th>
              <th className="p-3 border">Product</th>
              <th className="p-3 border">SKU</th>
              <th className="p-3 border">Quantity</th>
              <th className="p-3 border">Order ID</th>
              <th className="p-3 border">Destination</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No matching records found.
                </td>
              </tr>
            ) : (
              filteredData.map((row, index) => (
                <tr key={index} className="text-sm">
                  <td className="p-3 border">{row.date}</td>
                  <td className="p-3 border">{row.product}</td>
                  <td className="p-3 border">{row.sku}</td>
                  <td className="p-3 border">{row.quantity}</td>
                  <td className="p-3 border">{row.orderId}</td>
                  <td className="p-3 border">{row.destination}</td>
                  <td className="p-3 border">
                    <span
                      className={`
                        px-3 py-1 rounded-full text-white text-xs
                        ${
                          row.status === "Delivered"
                            ? "bg-green-600"
                            : row.status === "In Transit"
                            ? "bg-blue-600"
                            : row.status === "Pending Pickup"
                            ? "bg-orange-500"
                            : "bg-purple-600"
                        }
                      `}
                    >
                      {row.status}
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
