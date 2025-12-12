"use client";

import React, { useState } from "react";
import { 
  FiEdit, FiTrash2, FiEye, FiPlus, FiCalendar, FiTag, FiX, FiSave
} from "react-icons/fi";

interface DocumentItem {
  id: number;
  category: string;
  documentName: string;
  created_at: string;
}

export default function DocumentManagement() {

  // Static Categories
  const categoryList = [
    "Business Documents",
    "Identity Proof",
    "Financial Reports",
    "Vendor Agreements",
    "Tax Certificates",
  ];

  // Static Table Data
  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: 1,
      category: "Business Documents",
      documentName: "Company Registration Certificate",
      created_at: "2024-10-01",
    },
    {
      id: 2,
      category: "Identity Proof",
      documentName: "Aadhar Card Verification Letter",
      created_at: "2024-11-10",
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<DocumentItem | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState("");

  /* =============================
        ADD DOCUMENT
  ============================== */
  const handleAdd = () => {
    if (!selectedCategory || !documentName.trim()) return;

    const newEntry: DocumentItem = {
      id: documents.length + 1,
      category: selectedCategory,
      documentName,
      created_at: new Date().toISOString().slice(0, 10),
    };

    setDocuments([...documents, newEntry]);
    setDocumentName("");
    setSelectedCategory("");
  };

  /* =============================
        VIEW / EDIT DRAWER
  ============================== */
  const handleView = (item: DocumentItem) => {
    setSelected(item);
    setEditMode(false);
    setEditName(item.documentName);
    setDrawerOpen(true);
  };

  /* =============================
        SAVE EDIT CHANGES
  ============================== */
  const handleSaveEdit = () => {
    if (!selected) return;

    const updatedList = documents.map((doc) =>
      doc.id === selected.id ? { ...doc, documentName: editName } : doc
    );

    setDocuments(updatedList);
    setEditMode(false);
  };

  /* =============================
         DELETE DOCUMENT
  ============================== */
  const handleDelete = (id: number) => {
    if (!confirm("Delete this document?")) return;
    setDocuments(documents.filter((d) => d.id !== id));
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">

      <h1 className="flex items-center gap-2 mb-6 text-3xl font-bold text-purple-700">
        <FiTag /> Document Management
      </h1>

      {/* ADD DOCUMENT FORM */}
      <div className="flex flex-col gap-4 mb-6 md:flex-row">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 border rounded-xl md:w-1/3"
        >
          <option value="">Select Category</option>
          {categoryList.map((c, index) => (
            <option key={index} value={c}>
              {c}
            </option>
          ))}
        </select>

        <input
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
          className="flex-1 px-4 py-3 border rounded-xl"
          placeholder="Enter document name…"
        />

        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 text-white bg-purple-600 rounded-xl hover:bg-purple-700"
        >
          <FiPlus /> Add
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded-2xl">
        <table className="min-w-full">
          <thead className="text-white bg-purple-600">
            <tr>
              <th className="px-6 py-4 text-left">Document</th>
              <th className="px-6 py-4 text-left">Category</th>
              <th className="px-6 py-4 text-left">Created</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="border-b hover:bg-purple-50">
                <td className="px-6 py-4 font-semibold">{doc.documentName}</td>
                <td className="px-6 py-4">{doc.category}</td>
                <td className="px-6 py-4">
                  {new Date(doc.created_at).toLocaleDateString()}
                </td>
                <td className="flex justify-end gap-3 px-6 py-4">
                  <button onClick={() => handleView(doc)}>
                    <FiEye />
                  </button>
                  <button
                    className="text-purple-600"
                    onClick={() => {
                      handleView(doc);
                      setEditMode(true);
                    }}
                  >
                    <FiEdit />
                  </button>
                  <button
                    className="text-red-600"
                    onClick={() => handleDelete(doc.id)}
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DRAWER PANEL */}
      {selected && (
        <div className={`fixed inset-0 z-50`}>
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setDrawerOpen(false)}
          ></div>

          {/* PANEL */}
          <div className="absolute right-0 top-0 h-full w-[400px] bg-white shadow-xl rounded-l-2xl">
            <div className="flex justify-between p-6 bg-purple-600">
              <h2 className="text-xl font-bold text-white">
                {selected.documentName}
              </h2>
              <button onClick={() => setDrawerOpen(false)} className="text-white">
                <FiX size={22} />
              </button>
            </div>

            <div className="p-6">
              {!editMode ? (
                <button
                  className="w-full py-3 mb-3 font-semibold text-white bg-purple-600 rounded-xl"
                  onClick={() => setEditMode(true)}
                >
                  <FiEdit className="inline-block mr-2" />
                  Edit Document
                </button>
              ) : (
                <>
                  {/* EDIT NAME */}
                  <label className="text-sm font-medium">Document Name</label>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-3 mb-4 border rounded-xl"
                  />

                  <button
                    onClick={handleSaveEdit}
                    className="w-full py-3 mb-3 text-white bg-purple-700 rounded-xl"
                  >
                    <FiSave className="inline-block mr-2" />
                    Save Changes
                  </button>

                  <button
                    onClick={() => setEditMode(false)}
                    className="w-full py-3 border rounded-xl"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
