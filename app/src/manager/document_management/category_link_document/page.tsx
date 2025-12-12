"use client";

import React, { useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";

// ==========================
// STATIC CATEGORY → DOCUMENTS
// ==========================
const CATEGORY_DATA = {
  "Identity Proof": ["Aadhaar Card", "PAN Card", "Passport", "Driving License"],
  "Business Documents": ["Company Registration", "GST Certificate", "MSME Certificate"],
  "Financial Reports": ["Balance Sheet", "Profit & Loss Statement", "ITR Report"],
  "Vendor Agreements": ["Service Agreement", "Contract Document", "NDA Agreement"],
  "Tax Certificates": ["TDS Certificate", "Form 26AS", "GST Return"],
};

// Create type for dropdown keys
type CategoryType = keyof typeof CATEGORY_DATA;

interface Entry {
  id: number;
  category: string;
  documentName: string;
}

export default function DocumentManagement() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | "">("");
  const [selectedDocument, setSelectedDocument] = useState("");
  const [records, setRecords] = useState<Entry[]>([]);

  // Add to table
  const handleAdd = () => {
    if (!selectedCategory || !selectedDocument) {
      alert("Please select both category and document");
      return;
    }

    const newEntry: Entry = {
      id: records.length + 1,
      category: selectedCategory,
      documentName: selectedDocument,
    };

    setRecords([...records, newEntry]);
  };

  // Delete record
  const handleDelete = (id: number) => {
    setRecords(records.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="mb-6 text-3xl font-bold text-purple-700">Document Management</h1>

      {/* ------------------------- */}
      {/* FLEX ROW: CATEGORY + DOCUMENT + ADD */}
      {/* ------------------------- */}
      <div className="flex flex-col gap-4 p-6 bg-white shadow rounded-xl md:flex-row">

        {/* Category Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value as CategoryType);
            setSelectedDocument("");
          }}
          className="w-full p-3 border rounded-xl md:w-1/3"
        >
          <option value="">Select Category</option>
          {Object.keys(CATEGORY_DATA).map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Document Dropdown */}
        <select
          value={selectedDocument}
          onChange={(e) => setSelectedDocument(e.target.value)}
          className="w-full p-3 border rounded-xl md:w-1/3"
          disabled={!selectedCategory}
        >
          <option value="">Select Document</option>
          {selectedCategory &&
            CATEGORY_DATA[selectedCategory as CategoryType].map((doc, idx) => (
              <option key={idx} value={doc}>
                {doc}
              </option>
            ))}
        </select>

        {/* Add Button */}
        <button
          onClick={handleAdd}
          className="flex items-center justify-center w-full gap-2 px-6 py-3 text-white bg-purple-600 rounded-xl hover:bg-purple-700 md:w-auto"
        >
          <FiPlus /> Add Document
        </button>
      </div>

      {/* ------------------------- */}
      {/* TABLE SECTION */}
      {/* ------------------------- */}
      <div className="p-6 mt-6 bg-white shadow rounded-xl">
        <h2 className="mb-4 text-xl font-semibold">Document Records</h2>

        <table className="w-full border-collapse">
          <thead className="text-white bg-purple-600">
            <tr>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Document Name</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">
                  No documents added yet.
                </td>
              </tr>
            ) : (
              records.map((row) => (
                <tr key={row.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{row.category}</td>
                  <td className="p-3">{row.documentName}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 />
                    </button>
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
