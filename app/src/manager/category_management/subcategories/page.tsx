'use client';

import React, { useMemo, useState } from 'react';
import {
  FiEdit,
  FiTrash2,
  FiEye,
  FiPlus,
  FiCalendar,
  FiTag,
  FiX,
  FiSave,
} from 'react-icons/fi';

type Status = 'active' | 'inactive';

interface Category {
  id: number;
  category_name: string;
}

interface Subcategory {
  id: number;
  category_id: number;
  subcategory_name: string;
  status: Status;
  created_at: string;
}

const BRAND = {
  purple: '#852BAF',
};

const DUMMY_CATEGORIES: Category[] = [
  { id: 1, category_name: 'Electronics' },
  { id: 2, category_name: 'Apparel' },
  { id: 3, category_name: 'Home Goods' },
];

const DUMMY_SUBCATEGORIES: Subcategory[] = [
  {
    id: 101,
    category_id: 1,
    subcategory_name: 'Smartphones',
    status: 'active',
    created_at: '2023-10-01',
  },
  {
    id: 102,
    category_id: 1,
    subcategory_name: 'Laptops',
    status: 'active',
    created_at: '2023-10-15',
  },
  {
    id: 201,
    category_id: 2,
    subcategory_name: 'Menswear',
    status: 'inactive',
    created_at: '2023-09-01',
  },
  {
    id: 301,
    category_id: 3,
    subcategory_name: 'Kitchenware',
    status: 'active',
    created_at: '2023-11-20',
  },
];

// STATUS BADGE
const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
  const isActive = status === 'active';
  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
        isActive ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full mr-2 ${
          isActive ? 'bg-green-500' : 'bg-rose-500'
        }`}
      ></span>
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
};

// ICON PLACEHOLDER
const IconPlaceholder: React.FC<{ name: string; size?: 'sm' | 'lg' }> = ({
  name,
  size = 'sm',
}) => {
  const classes = size === 'lg' ? 'w-14 h-14 text-2xl' : 'w-10 h-10 text-lg';
  return (
    <div
      className={`${classes} rounded-2xl bg-purple-50 border flex items-center justify-center font-bold`}
      style={{ color: BRAND.purple }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
};

export default function SubcategoryManagement() {
  const [subcategories, setSubcategories] =
    useState<Subcategory[]>(DUMMY_SUBCATEGORIES);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | ''>('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<Subcategory | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const filteredSubcategories = useMemo(() => {
    if (selectedCategoryId === '') return subcategories;
    return subcategories.filter((s) => s.category_id === selectedCategoryId);
  }, [subcategories, selectedCategoryId]);

  const getCategoryName = (category_id: number) =>
    DUMMY_CATEGORIES.find((c) => c.id === category_id)?.category_name ||
    'Unknown';

  // ADD SUBCATEGORY
  const handleAdd = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newSubcategoryName.trim() || selectedCategoryId === '') return;

    setIsAdding(true);

    const id = subcategories.length
      ? Math.max(...subcategories.map((c) => c.id)) + 1
      : 1;

    const newSub: Subcategory = {
      id,
      category_id: selectedCategoryId as number,
      subcategory_name: newSubcategoryName.trim(),
      status: 'active',
      created_at: new Date().toISOString().split('T')[0],
    };

    setTimeout(() => {
      setSubcategories((prev) => [newSub, ...prev]);
      setNewSubcategoryName('');
      setIsAdding(false);
    }, 300);
  };

  // VIEW
  const handleView = (sub: Subcategory) => {
    setSelected(sub);
    setEditName(sub.subcategory_name);
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
    setSubcategories((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' }
          : s
      )
    );

    if (selected?.id === id) {
      setSelected((prev) =>
        prev
          ? {
              ...prev,
              status: prev.status === 'active' ? 'inactive' : 'active',
            }
          : prev
      );
    }
  };

  // DELETE
  const handleDelete = (id: number) => {
    if (!confirm('Delete subcategory?')) return;
    setSubcategories((prev) => prev.filter((s) => s.id !== id));
    if (selected?.id === id) closeDrawer();
  };

  // SAVE EDIT
  const handleSaveEdit = () => {
    if (!selected) return;
    if (!editName.trim()) {
      alert('Subcategory name required');
      return;
    }

    setSubcategories((prev) =>
      prev.map((s) =>
        s.id === selected.id
          ? {
              ...s,
              subcategory_name: editName.trim(),
              status: selected.status,
            }
          : s
      )
    );

    setSelected((prev) =>
      prev
        ? {
            ...prev,
            subcategory_name: editName.trim(),
          }
        : prev
    );
    setIsEditing(false);
  };

  const isCategorySelected = selectedCategoryId !== '';
  const selectedCategoryName =
    DUMMY_CATEGORIES.find((c) => c.id === selectedCategoryId)?.category_name ||
    'All Categories';

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* HEADER */}
      <h1 className="flex items-center gap-2 mb-6 text-3xl font-bold text-purple-700">
        <FiTag /> Subcategory Management
      </h1>

      {/* ADD BLOCK */}
      <form onSubmit={handleAdd} className="flex flex-col gap-3 mb-6 md:flex-row">
        {/* Category Select */}
        <select
          value={selectedCategoryId}
          onChange={(e) =>
            setSelectedCategoryId(
              e.target.value === '' ? '' : Number(e.target.value)
            )
          }
          className="w-full px-4 py-3 border rounded-xl md:w-1/3"
        >
          <option value="">Select Category...</option>
          {DUMMY_CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.category_name}
            </option>
          ))}
        </select>

        {/* Subcategory Name */}
        <input
          value={newSubcategoryName}
          onChange={(e) => setNewSubcategoryName(e.target.value)}
          className="flex-1 px-4 py-3 border rounded-xl"
          placeholder={
            isCategorySelected
              ? 'Enter subcategory name...'
              : 'Select a category first...'
          }
          disabled={!isCategorySelected}
        />

        <button
          type="submit"
          disabled={!isCategorySelected || !newSubcategoryName.trim() || isAdding}
          className="flex items-center justify-center gap-2 px-6 py-3 text-white bg-purple-600 rounded-xl disabled:opacity-60"
        >
          <FiPlus /> {isAdding ? 'Adding...' : 'Add'}
        </button>
      </form>

      {/* FILTER INFO */}
      <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
        <span>
          Showing subcategories for:{' '}
          <span className="font-semibold text-purple-700">
            {selectedCategoryName}
          </span>
        </span>
        <span>Total: {filteredSubcategories.length}</span>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded-2xl">
        <table className="min-w-full">
          <thead className="text-white bg-purple-600">
            <tr>
              <th className="px-6 py-4 text-left">Subcategory</th>
              <th className="px-6 py-4 text-left">Category</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Created</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredSubcategories.map((sub) => (
              <tr key={sub.id} className="border-b hover:bg-purple-50">
                <td className="flex items-center gap-4 px-6 py-4">
                  <IconPlaceholder name={sub.subcategory_name} />
                  <div>
                    <div className="font-semibold">
                      {sub.subcategory_name}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  {getCategoryName(sub.category_id)}
                </td>

                <td className="px-6 py-4">
                  <button onClick={() => toggleStatus(sub.id)}>
                    <StatusBadge status={sub.status} />
                  </button>
                </td>

                <td className="px-6 py-4">{sub.created_at}</td>

                <td className="flex justify-end gap-2 px-6 py-4 text-right">
                  <button className="p-2" onClick={() => handleView(sub)}>
                    <FiEye />
                  </button>
                  <button
                    className="p-2 text-purple-600"
                    onClick={() => {
                      handleView(sub);
                      setIsEditing(true);
                    }}
                  >
                    <FiEdit />
                  </button>
                  <button
                    className="p-2 text-rose-600"
                    onClick={() => handleDelete(sub.id)}
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}

            {filteredSubcategories.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="py-10 text-sm text-center text-gray-500"
                >
                  No subcategories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* DRAWER */}
      <div
        className={`fixed inset-0 z-50 transition ${
          drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/40"
          onClick={closeDrawer}
        ></div>

        {/* Drawer */}
        <div
          className={`absolute right-0 top-0 h-full w-[420px] bg-white shadow-xl transition-transform ${
            drawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* HEADER */}
          <div className="flex justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              {selected && (
                <IconPlaceholder name={selected.subcategory_name} size="lg" />
              )}
              <div>
                <h2 className="text-xl font-bold">
                  {selected?.subcategory_name || 'Details'}
                </h2>
                {selected && (
                  <p className="flex items-center gap-2 text-sm text-gray-500">
                    <FiCalendar /> {selected.created_at}
                  </p>
                )}
                {selected && (
                  <p className="mt-1 text-xs text-gray-500">
                    Category:{' '}
                    <span className="font-semibold">
                      {getCategoryName(selected.category_id)}
                    </span>
                  </p>
                )}
              </div>
            </div>
            <button onClick={closeDrawer}>
              <FiX />
            </button>
          </div>

          {/* BODY */}
          <div className="p-6">
            {!selected ? (
              <p className="text-gray-500">Select a subcategory to view.</p>
            ) : !isEditing ? (
              <>
                {/* VIEW MODE */}
                <div className="mb-6">
                  <h4 className="mb-1 font-semibold">Status</h4>
                  <StatusBadge status={selected.status} />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
                  <div>
                    <p className="text-xs font-semibold text-gray-500">
                      Subcategory ID
                    </p>
                    <p className="px-3 py-2 mt-1 bg-gray-100 rounded-lg">
                      #{selected.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500">
                      Category
                    </p>
                    <p className="px-3 py-2 mt-1 bg-gray-100 rounded-lg">
                      {getCategoryName(selected.category_id)}
                    </p>
                  </div>
                </div>

                <button
                  className="flex items-center justify-center w-full gap-2 py-3 mb-3 text-white bg-purple-600 rounded-xl"
                  onClick={() => setIsEditing(true)}
                >
                  <FiEdit /> Edit Subcategory
                </button>

                <button
                  onClick={() => handleDelete(selected.id)}
                  className="w-full py-3 text-red-600 border border-red-200 rounded-xl hover:bg-red-50"
                >
                  Delete
                </button>
              </>
            ) : (
              <>
                {/* EDIT MODE */}
                <div className="mb-6">
                  <label className="text-sm font-medium">Subcategory Name</label>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-3 mt-1 border rounded-xl"
                  />
                </div>

                <div className="mb-6">
                  <label className="text-sm font-medium">Status</label>
                  <div className="flex gap-3 mt-2">
                    {(['active', 'inactive'] as Status[]).map((status) => (
                      <button
                        key={status}
                        onClick={() =>
                          setSelected((prev) =>
                            prev ? { ...prev, status } : prev
                          )
                        }
                        className={`flex-1 px-4 py-3 rounded-xl border ${
                          selected?.status === status
                            ? 'bg-purple-100 border-purple-600 text-purple-700'
                            : 'border-gray-300'
                        }`}
                      >
                        {status === 'active' ? 'Active' : 'Inactive'}
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
