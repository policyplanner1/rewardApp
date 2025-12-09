'use client';

import React, { useState, useMemo } from 'react';
import { FiEdit, FiTrash2, FiEye, FiCheckCircle, FiXCircle, FiPlus } from 'react-icons/fi'; 

// --- Types and Dummy Data ---
interface Category {
  id: number;
  category_name: string;
}

interface Subcategory {
  id: number;
  category_id: number; // Foreign key linking to Category
  subcategory_name: string;
  status: 'active' | 'inactive';
  created_at: string;
}

const DUMMY_CATEGORIES: Category[] = [
  { id: 1, category_name: 'Electronics' },
  { id: 2, category_name: 'Apparel' },
  { id: 3, category_name: 'Home Goods' },
];

const DUMMY_SUBCATEGORIES: Subcategory[] = [
  { id: 101, category_id: 1, subcategory_name: 'Smartphones', status: 'active', created_at: '2023-10-01' },
  { id: 102, category_id: 1, subcategory_name: 'Laptops', status: 'active', created_at: '2023-10-15' },
  { id: 201, category_id: 2, subcategory_name: 'Menswear', status: 'inactive', created_at: '2023-09-01' },
  { id: 301, category_id: 3, subcategory_name: 'Kitchenware', status: 'active', created_at: '2023-11-20' },
];
// ----------------------------

// Utility to render status badge and icon
const StatusBadge: React.FC<{ status: 'active' | 'inactive' }> = ({ status }) => {
  const isActive = status === 'active';
  const colorClass = isActive
    ? 'bg-green-100 text-green-800'
    : 'bg-red-100 text-red-800';
  const Icon = isActive ? FiCheckCircle : FiXCircle;

  return (
    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${colorClass}`}>
      <Icon className="w-4 h-4 mr-1" />
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
};

export default function SubcategoriesPage() {
  const [subcategories, setSubcategories] = useState(DUMMY_SUBCATEGORIES);
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  // State to hold the ID of the currently selected parent category
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | ''>(''); 

  // --- Filtering Logic ---
  const filteredSubcategories = useMemo(() => {
    if (selectedCategoryId === '') {
      return []; // Show no subcategories if no category is selected
    }
    return subcategories.filter(sub => sub.category_id === selectedCategoryId);
  }, [subcategories, selectedCategoryId]);

  // --- CRUD Handlers ---

  const handleAddSubcategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubcategoryName.trim() || selectedCategoryId === '') return;

    const newSubcategory: Subcategory = {
      id: subcategories.length > 0 ? Math.max(...subcategories.map(c => c.id)) + 1 : 1,
      category_id: selectedCategoryId as number, // Cast is safe due to check above
      subcategory_name: newSubcategoryName.trim(),
      status: 'active', 
      created_at: new Date().toISOString().split('T')[0],
    };
    setSubcategories(prev => [newSubcategory, ...prev]);
    setNewSubcategoryName('');
  };
  
  const handleEdit = (id: number) => alert(`Editing subcategory ${subcategories.find(c => c.id === id)?.subcategory_name}`);
  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this subcategory?")) {
      setSubcategories(prev => prev.filter(sub => sub.id !== id));
    }
  };
  const handleView = (id: number) => alert(`Viewing details for subcategory ${id}`);
  
  const handleToggleStatus = (id: number) => {
    setSubcategories(prev =>
      prev.map(sub => 
        sub.id === id 
          ? { ...sub, status: sub.status === 'active' ? 'inactive' : 'active' } 
          : sub
      )
    );
  };
  
  // -----------------------

  const isCategorySelected = selectedCategoryId !== '';
  const selectedCategoryName = DUMMY_CATEGORIES.find(c => c.id === selectedCategoryId)?.category_name;

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-[#FC3F78]">🏷️ Subcategory Management</h1>

      <div className="overflow-hidden bg-white rounded-lg shadow-xl">
        
        {/* --- ⚙️ Input Area (Upper Part) --- */}
        <div className="p-6 border-b border-gray-200" style={{ backgroundColor: '#FFEDF2' }}> 
          <h2 className="text-xl font-semibold text-[#FC3F78] mb-4">Add New Subcategory</h2>
          
          <div className="flex flex-col mb-4 space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            
            {/* 1. Category Dropdown (Conditional Requirement) */}
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Select Parent Category: <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#852BAF] focus:border-[#852BAF] transition-all"
              >
                <option value="">-- Select a Category --</option>
                {DUMMY_CATEGORIES.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.category_name}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Subcategory Name Input (Conditional on selection) */}
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Subcategory Name:
              </label>
              <input
                type="text"
                value={newSubcategoryName}
                onChange={(e) => setNewSubcategoryName(e.target.value)}
                placeholder={isCategorySelected ? "Enter new subcategory name..." : "Select a category first..."}
                required
                disabled={!isCategorySelected}
                className="w-full px-4 py-2 border border-gray-300 rounded-md transition-all 
                  disabled:bg-gray-100 disabled:text-gray-400 
                  focus:ring-2 focus:ring-[#FC3F78] focus:border-[#FC3F78]"
              />
            </div>
          </div>
          
          {/* 3. Add Button (Conditional on selection) */}
          <button
            type="submit"
            onClick={handleAddSubcategory}
            disabled={!isCategorySelected || !newSubcategoryName.trim()}
            className={`w-full flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white shadow-md transition-all duration-300 
              ${isCategorySelected ? 'bg-[#FC3F78] hover:bg-[#FF7CA3]' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            <FiPlus className="w-5 h-5 mr-2" />
            Add Subcategory
          </button>

          {!isCategorySelected && (
              <p className="mt-2 text-sm text-red-500">
                  Please select a parent category to enable adding subcategories.
              </p>
          )}

        </div>

        {/* --- 📋 Subcategories Table (Underneath, Filtered) --- */}
        <div className="overflow-x-auto">
          <h3 className="p-4 text-lg font-semibold text-[#852BAF] bg-gray-50 border-t border-gray-200">
            Subcategories for: **{selectedCategoryName || 'No Category Selected'}**
          </h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead style={{ backgroundColor: '#D887FD' }}>
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                  Subcategory Name
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                  Created At
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-white uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubcategories.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                    {sub.subcategory_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={sub.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {sub.created_at}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                    <div className="flex justify-end space-x-2">
                      {/* Action Buttons using react-icons */}
                      <button onClick={() => handleView(sub.id)} className="p-2 text-gray-500 rounded-full hover:text-gray-700 hover:bg-gray-200" title="View"><FiEye className="w-5 h-5" /></button>
                      <button onClick={() => handleEdit(sub.id)} className="text-[#852BAF] hover:text-[#D887FD] p-2 rounded-full hover:bg-purple-50" title="Edit"><FiEdit className="w-5 h-5" /></button>
                      <button onClick={() => handleToggleStatus(sub.id)} className={`p-2 rounded-full ${sub.status === 'active' ? 'text-green-600 hover:bg-green-50' : 'text-[#FC3F78] hover:bg-pink-50'}`} title={sub.status === 'active' ? 'Deactivate' : 'Activate'}>
                        {sub.status === 'active' ? (<FiXCircle className="w-5 h-5" />) : (<FiCheckCircle className="w-5 h-5" />)}
                      </button>
                      <button onClick={() => handleDelete(sub.id)} className="text-[#FC3F78] hover:text-red-700 p-2 rounded-full hover:bg-pink-50" title="Delete"><FiTrash2 className="w-5 h-5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {isCategorySelected && filteredSubcategories.length === 0 && (
            <p className="py-10 text-center text-gray-500">No subcategories found for **{selectedCategoryName}**.</p>
          )}

          {!isCategorySelected && (
            <p className="py-10 text-center text-gray-500">Please select a category from the dropdown above to view its subcategories.</p>
          )}

        </div>
      </div>
    </div>
  );
}