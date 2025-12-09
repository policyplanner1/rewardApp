'use client';

import React, { useState, useMemo } from 'react';
import { FiEdit, FiTrash2, FiEye, FiCheckCircle, FiXCircle, FiPlus, FiChevronRight } from 'react-icons/fi'; 

// --- Types and Dummy Data ---

interface Category { id: number; category_name: string; }
interface Subcategory { id: number; category_id: number; subcategory_name: string; }
interface SubSubcategory {
  id: number;
  subcategory_id: number; // Foreign key linking to Subcategory
  subsubcategory_name: string; // The "Type / Sub-type"
  status: 'active' | 'inactive';
  created_at: string;
}

const DUMMY_CATEGORIES: Category[] = [
  { id: 1, category_name: 'Electronics' },
  { id: 2, category_name: 'Apparel' },
];

const DUMMY_SUBCATEGORIES: Subcategory[] = [
  { id: 101, category_id: 1, subcategory_name: 'Phones & Accessories' },
  { id: 102, category_id: 1, subcategory_name: 'Computing' },
  { id: 201, category_id: 2, subcategory_name: 'Menswear' },
];

const DUMMY_SUBSUBCATEGORIES: SubSubcategory[] = [
  { id: 1001, subcategory_id: 101, subsubcategory_name: 'Smartphones', status: 'active', created_at: '2023-12-01' },
  { id: 1002, subcategory_id: 101, subsubcategory_name: 'Chargers', status: 'active', created_at: '2023-12-05' },
  { id: 2001, subcategory_id: 102, subsubcategory_name: 'Laptops', status: 'inactive', created_at: '2023-11-01' },
  { id: 3001, subcategory_id: 201, subsubcategory_name: 'Shirts', status: 'active', created_at: '2023-10-10' },
];
// ----------------------------

// Status Badge Component (Reusable)
const StatusBadge: React.FC<{ status: 'active' | 'inactive' }> = ({ status }) => {
  const isActive = status === 'active';
  const colorClass = isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  const Icon = isActive ? FiCheckCircle : FiXCircle;
  return (
    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${colorClass}`}>
      <Icon className="w-4 h-4 mr-1" />
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
};

export default function SubSubcategoriesPage() {
  const [subsubcategories, setSubSubcategories] = useState(DUMMY_SUBSUBCATEGORIES);
  const [newSubSubcategoryName, setNewSubSubcategoryName] = useState('');
  
  // States for sequential selection
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | ''>(''); 
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | ''>(''); 

  // --- Filtering Logic ---

  // 1. Filter Subcategories based on selected Category
  const filteredSubcategories = useMemo(() => {
    if (selectedCategoryId === '') return [];
    return DUMMY_SUBCATEGORIES.filter(sub => sub.category_id === selectedCategoryId);
  }, [selectedCategoryId]);

  // 2. Filter Sub-Subcategories based on selected Subcategory
  const filteredSubSubcategories = useMemo(() => {
    if (selectedSubcategoryId === '') return [];
    return subsubcategories.filter(subsub => subsub.subcategory_id === selectedSubcategoryId);
  }, [subsubcategories, selectedSubcategoryId]);

  // --- Handlers ---

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value === '' ? '' : Number(e.target.value);
    setSelectedCategoryId(id);
    // Reset the downstream selection when the upstream selection changes
    setSelectedSubcategoryId(''); 
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value === '' ? '' : Number(e.target.value);
    setSelectedSubcategoryId(id);
  };


  const handleAddSubSubcategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubSubcategoryName.trim() || selectedSubcategoryId === '') return;

    const newSubSubcategory: SubSubcategory = {
      id: subsubcategories.length > 0 ? Math.max(...subsubcategories.map(c => c.id)) + 1 : 1,
      subcategory_id: selectedSubcategoryId as number,
      subsubcategory_name: newSubSubcategoryName.trim(),
      status: 'active', 
      created_at: new Date().toISOString().split('T')[0],
    };
    setSubSubcategories(prev => [newSubSubcategory, ...prev]);
    setNewSubSubcategoryName('');
  };
  
  const handleToggleStatus = (id: number) => {
    setSubSubcategories(prev =>
      prev.map(sub => 
        sub.id === id 
          ? { ...sub, status: sub.status === 'active' ? 'inactive' : 'active' } 
          : sub
      )
    );
  };

  // Simplified Action Handlers
  const handleEdit = (id: number) => alert(`Editing sub-subcategory ID: ${id}`);
  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this sub-subcategory?")) {
      setSubSubcategories(prev => prev.filter(sub => sub.id !== id));
    }
  };
  
  // -----------------------

  const isSubcategorySelected = selectedSubcategoryId !== '';
  const selectedCategoryName = DUMMY_CATEGORIES.find(c => c.id === selectedCategoryId)?.category_name;
  const selectedSubcategoryName = DUMMY_SUBCATEGORIES.find(c => c.id === selectedSubcategoryId)?.subcategory_name;

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-[#852BAF]">🏷️ Sub-Subcategory Management</h1>
      <p className="mb-6 text-gray-600">Create and manage Types/Sub-types under specific Subcategories.</p>

      <div className="overflow-hidden bg-white rounded-lg shadow-xl">
        
        {/* --- ⚙️ Input Area (Upper Part) --- */}
        <div className="p-6 border-b border-gray-200" style={{ backgroundColor: '#F3E8FF' }}> 
          <h2 className="text-xl font-semibold text-[#852BAF] mb-4">Add New Sub-Subcategory</h2>
          
          {/* Sequential Dropdowns */}
          <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-3">
            
            {/* 1. Category Dropdown */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">1. Select Category:</label>
              <select
                value={selectedCategoryId}
                onChange={handleCategoryChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#852BAF] focus:border-[#852BAF] transition-all"
              >
                <option value="">-- Select Category --</option>
                {DUMMY_CATEGORIES.map(category => (
                  <option key={category.id} value={category.id}>{category.category_name}</option>
                ))}
              </select>
            </div>

            {/* 2. Subcategory Dropdown (Depends on Category selection) */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">2. Select Subcategory:</label>
              <select
                value={selectedSubcategoryId}
                onChange={handleSubcategoryChange}
                disabled={selectedCategoryId === ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-md transition-all 
                  disabled:bg-gray-100 disabled:text-gray-400 focus:ring-2 focus:ring-[#852BAF] focus:border-[#852BAF]"
              >
                <option value="">-- Select Subcategory --</option>
                {filteredSubcategories.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.subcategory_name}</option>
                ))}
              </select>
            </div>
            
            {/* 3. Sub-Subcategory Name Input (Depends on Subcategory selection) */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">3. Enter Type / Sub-type Name:</label>
              <input
                type="text"
                value={newSubSubcategoryName}
                onChange={(e) => setNewSubSubcategoryName(e.target.value)}
                placeholder={isSubcategorySelected ? "e.g., Apple iPhone" : "Select subcategory first..."}
                required
                disabled={!isSubcategorySelected}
                className="w-full px-4 py-2 border border-gray-300 rounded-md transition-all 
                  disabled:bg-gray-100 disabled:text-gray-400 focus:ring-2 focus:ring-[#FC3F78] focus:border-[#FC3F78]"
              />
            </div>
          </div>
          
          {/* Add Button */}
          <button
            type="submit"
            onClick={handleAddSubSubcategory}
            disabled={!isSubcategorySelected || !newSubSubcategoryName.trim()}
            className={`w-full flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white shadow-md transition-all duration-300 
              ${isSubcategorySelected && newSubSubcategoryName.trim() ? 'bg-[#FC3F78] hover:bg-[#FF7CA3]' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            <FiPlus className="w-5 h-5 mr-2" />
            Add Type / Sub-type
          </button>
        </div>

        {/* --- 📋 Sub-Subcategories Table (Filtered) --- */}
        <div className="overflow-x-auto">
          <h3 className="p-4 text-lg font-semibold text-[#FC3F78] bg-gray-50 border-t border-gray-200 flex items-center">
            Sub-Subcategories for: 
            <span className="ml-2 text-[#852BAF]">{selectedCategoryName || '...'}</span>
            {selectedCategoryName && <FiChevronRight className="mx-2 text-gray-400" />}
            <span className="text-[#852BAF]">{selectedSubcategoryName || '...'}</span>
          </h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead style={{ backgroundColor: '#D887FD' }}>
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                  Type / Sub-type Name
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
              {filteredSubSubcategories.map((subsub) => (
                <tr key={subsub.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                    {subsub.subsubcategory_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={subsub.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {subsub.created_at}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => handleEdit(subsub.id)} className="text-[#852BAF] hover:text-[#D887FD] p-2 rounded-full hover:bg-purple-50" title="Edit"><FiEdit className="w-5 h-5" /></button>
                      <button onClick={() => handleToggleStatus(subsub.id)} className={`p-2 rounded-full ${subsub.status === 'active' ? 'text-green-600 hover:bg-green-50' : 'text-[#FC3F78] hover:bg-pink-50'}`} title={subsub.status === 'active' ? 'Deactivate' : 'Activate'}>
                        {subsub.status === 'active' ? (<FiXCircle className="w-5 h-5" />) : (<FiCheckCircle className="w-5 h-5" />)}
                      </button>
                      <button onClick={() => handleDelete(subsub.id)} className="text-[#FC3F78] hover:text-red-700 p-2 rounded-full hover:bg-pink-50" title="Delete"><FiTrash2 className="w-5 h-5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Table Messaging */}
          {!isSubcategorySelected && (
            <p className="py-10 text-center text-gray-500">Please select a Category and Subcategory to view the Types/Sub-types.</p>
          )}

          {isSubcategorySelected && filteredSubSubcategories.length === 0 && (
            <p className="py-10 text-center text-gray-500">No Types/Sub-types found for **{selectedSubcategoryName}**.</p>
          )}

        </div>
      </div>
    </div>
  );
}