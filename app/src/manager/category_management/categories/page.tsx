'use client';

import React, { useState, useEffect } from 'react';
import { 
  FiEdit, FiTrash2, FiEye, FiPlus, FiCheckCircle, FiXCircle, 
  FiCalendar, FiTag, FiX, FiSave 
} from 'react-icons/fi';

type Status = 'active' | 'inactive';

interface Category {
  id: number;
  category_name: string;
  status: Status;
  created_at: string;
  icon?: string;
}

const BRAND = {
  purple: '#852BAF',
  pink: '#FC3F78',
  lightPurple: '#D887FD',
  gradient: 'linear-gradient(135deg, #852BAF 0%, #FC3F78 100%)',
  gradientHover: 'linear-gradient(135deg, #70249A 0%, #E0356B 100%)'
};

const DUMMY_CATEGORIES: Category[] = [
  { id: 1, category_name: 'Electronics', status: 'active', created_at: '2025-10-01' },
  { id: 2, category_name: 'Apparel', status: 'inactive', created_at: '2025-09-15'  },
  { id: 3, category_name: 'Home Goods', status: 'active', created_at: '2025-11-05' },
  { id: 4, category_name: 'Books & Media', status: 'active', created_at: '2025-12-01'}
];

// STATUS BADGE
const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
  const isActive = status === 'active';
  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
      isActive ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'
    }`}>
      <span className={`h-2 w-2 rounded-full mr-2 ${isActive ? 'bg-green-500' : 'bg-rose-500'}`}></span>
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
};

// ICON PLACEHOLDER
const IconPlaceholder: React.FC<{ name: string; size?: 'sm' | 'lg' }> = ({ name, size = 'sm' }) => {
  const classes = size === 'lg' ? 'w-14 h-14 text-2xl' : 'w-10 h-10 text-lg';
  return (
    <div className={`${classes} rounded-2xl bg-purple-50 border flex items-center justify-center font-bold`} style={{ color: BRAND.purple }}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
};

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>(DUMMY_CATEGORIES);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<Category | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // ADD CATEGORY
  const handleAdd = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newCategoryName.trim()) return;

    setIsAdding(true);

    const id = categories.length ? Math.max(...categories.map(c => c.id)) + 1 : 1;

    const newCat: Category = {
      id,
      category_name: newCategoryName.trim(),
      status: 'active',
      created_at: new Date().toISOString().split('T')[0],
    };

    setTimeout(() => {
      setCategories([newCat, ...categories]);
      setNewCategoryName('');
      setIsAdding(false);
    }, 300);
  };

  // VIEW DETAILS
  const handleView = (cat: Category) => {
    setSelected(cat);
    setEditName(cat.category_name);
    setIsEditing(false);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => {
      setSelected(null);
      setIsEditing(false);
    }, 300);
  };

  // TOGGLE STATUS
  const toggleStatus = (id: number) => {
    setCategories(prev =>
      prev.map(c =>
        c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c
      )
    );

    if (selected?.id === id) {
      setSelected(prev => prev ? { ...prev, status: prev.status === 'active' ? 'inactive' : 'active' } : prev);
    }
  };

  // DELETE
  const handleDelete = (id: number) => {
    if (!confirm('Delete category?')) return;
    setCategories(prev => prev.filter(c => c.id !== id));
    if (selected?.id === id) closeDrawer();
  };

  const handleSaveEdit = () => {
    if (!selected) return;
    if (!editName.trim()) return alert('Category name required');

    setCategories(prev => prev.map(c =>
      c.id === selected.id ? { ...c, category_name: editName } : c
    ));

    setSelected(prev => prev ? { ...prev, category_name: editName } : prev);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">

      {/* HEADER */}
      <h1 className="flex items-center gap-2 mb-6 text-3xl font-bold text-purple-700">
        <FiTag /> Category Management
      </h1>

      {/* ADD CATEGORY */}
      <form onSubmit={handleAdd} className="flex gap-3 mb-6">
        <input
          value={newCategoryName}
          onChange={e => setNewCategoryName(e.target.value)}
          className="flex-1 px-4 py-3 border rounded-xl"
          placeholder="Enter category name..."
        />
        <button
          type="submit"
          className="px-6 py-3 text-white bg-purple-600 rounded-xl"
        >
          <FiPlus /> Add
        </button>
      </form>

      {/* TABLE */}
      <div className="bg-white shadow rounded-2xl">
        <table className="min-w-full">
          <thead className="text-white bg-purple-600">
            <tr>
              <th className="px-6 py-4 text-left">Category</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Created</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map(cat => (
              <tr key={cat.id} className="border-b hover:bg-purple-50">
                <td className="flex items-center gap-4 px-6 py-4">
                  <IconPlaceholder name={cat.category_name} />
                  <div>
                    <div className="font-semibold">{cat.category_name}</div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <button onClick={() => toggleStatus(cat.id)}>
                    <StatusBadge status={cat.status} />
                  </button>
                </td>

                <td className="px-6 py-4">{cat.created_at}</td>

                <td className="flex justify-end gap-2 px-6 py-4 text-right">
                  <button className="p-2" onClick={() => handleView(cat)}>
                    <FiEye />
                  </button>
                  <button className="p-2 text-purple-600" onClick={() => { handleView(cat); setIsEditing(true); }}>
                    <FiEdit />
                  </button>
                  <button className="p-2 text-rose-600" onClick={() => handleDelete(cat.id)}>
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DRAWER */}
      <div className={`fixed inset-0 z-50 transition ${drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" onClick={closeDrawer}></div>

        {/* Drawer */}
        <div className={`absolute right-0 top-0 h-full w-[420px] bg-white shadow-xl transition-transform ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          
          {/* HEADER */}
          <div className="flex justify-between p-6 border-b">
            <div>
              <h2 className="text-xl font-bold">{selected?.category_name}</h2>
              <p className="flex items-center gap-2 text-sm text-gray-500">
                <FiCalendar /> {selected?.created_at}
              </p>
            </div>
            <button onClick={closeDrawer}>
              <FiX />
            </button>
          </div>

          {/* BODY */}
          <div className="p-6">

            {!isEditing ? (
              <>
                {/* VIEW MODE */}
                <div className="mb-6">
                  <h4 className="mb-1 font-semibold">Status</h4>
                  <StatusBadge status={selected?.status!} />
                </div>

                <div className="mb-6">
                 
                </div>

                <button
                  className="flex items-center justify-center w-full gap-2 py-3 mb-3 text-white bg-purple-600 rounded-xl"
                  onClick={() => setIsEditing(true)}
                >
                  <FiEdit /> Edit Category
                </button>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <label className="text-sm font-medium">Category Name</label>
                  <input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full px-4 py-3 border rounded-xl"
                  />
                </div>

                <div className="mb-6">
                  <label className="text-sm font-medium">Status</label>
                  <div className="flex gap-3 mt-2">
                    {(['active', 'inactive'] as Status[]).map(status => (
                      <button
                        key={status}
                        onClick={() => setSelected(prev => prev ? { ...prev, status } : prev)}
                        className={`flex-1 px-4 py-3 rounded-xl border ${
                          selected?.status === status
                            ? 'bg-purple-100 border-purple-600 text-purple-700'
                            : 'border-gray-300'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* BUTTONS */}
                <button
                  onClick={handleSaveEdit}
                  className="flex items-center justify-center w-full gap-2 py-3 mb-3 text-white bg-purple-700 rounded-xl"
                >
                  <FiSave /> Save Changes
                </button>

                <button
                  onClick={() => setIsEditing(false)}
                  className="w-full py-3 border rounded-xl"
                >
                  Cancel
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
