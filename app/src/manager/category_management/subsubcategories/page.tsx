'use client';

import React, { useMemo, useState } from 'react';
import {
  FiEdit,
  FiTrash2,
  FiEye,
  FiPlus,
  FiCheckCircle,
  FiXCircle,
  FiCalendar,
  FiChevronRight,
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
}

interface SubSubcategory {
  id: number;
  subcategory_id: number;
  subsubcategory_name: string;
  status: Status;
  created_at: string;
}

const BRAND = {
  purple: '#852BAF',
};

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
  {
    id: 1001,
    subcategory_id: 101,
    subsubcategory_name: 'Smartphones',
    status: 'active',
    created_at: '2023-12-01',
  },
  {
    id: 1002,
    subcategory_id: 101,
    subsubcategory_name: 'Chargers',
    status: 'active',
    created_at: '2023-12-05',
  },
  {
    id: 2001,
    subcategory_id: 102,
    subsubcategory_name: 'Laptops',
    status: 'inactive',
    created_at: '2023-11-01',
  },
  {
    id: 3001,
    subcategory_id: 201,
    subsubcategory_name: 'Shirts',
    status: 'active',
    created_at: '2023-10-10',
  },
];

// STATUS BADGE
const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
  const isActive = status === 'active';
  const Icon = isActive ? FiCheckCircle : FiXCircle;
  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
        isActive ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'
      }`}
    >
      <Icon className="w-4 h-4 mr-2" />
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

export default function SubSubcategoryManagement() {
  const [subsubcategories, setSubSubcategories] =
    useState<SubSubcategory[]>(DUMMY_SUBSUBCATEGORIES);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | ''>('');
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<
    number | ''
  >('');
  const [newSubSubcategoryName, setNewSubSubcategoryName] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<SubSubcategory | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Filter subcategories based on selected category
  const filteredSubcategories = useMemo(() => {
    if (selectedCategoryId === '') return [];
    return DUMMY_SUBCATEGORIES.filter(
      (s) => s.category_id === selectedCategoryId
    );
  }, [selectedCategoryId]);

  // Filter sub-subcategories based on selected subcategory
  const filteredSubSubcategories = useMemo(() => {
    if (selectedSubcategoryId === '') return [];
    return subsubcategories.filter(
      (s) => s.subcategory_id === selectedSubcategoryId
    );
  }, [subsubcategories, selectedSubcategoryId]);

  const getCategoryName = (category_id: number) =>
    DUMMY_CATEGORIES.find((c) => c.id === category_id)?.category_name ||
    'Unknown';

  const getSubcategoryName = (subcategory_id: number) =>
    DUMMY_SUBCATEGORIES.find((s) => s.id === subcategory_id)?.subcategory_name ||
    'Unknown';

  const handleCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const id = e.target.value === '' ? '' : Number(e.target.value);
    setSelectedCategoryId(id);
    setSelectedSubcategoryId('');
  };

  const handleSubcategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const id = e.target.value === '' ? '' : Number(e.target.value);
    setSelectedSubcategoryId(id);
  };

  // ADD
  const handleAdd = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newSubSubcategoryName.trim() || selectedSubcategoryId === '') return;

    setIsAdding(true);

    const id = subsubcategories.length
      ? Math.max(...subsubcategories.map((c) => c.id)) + 1
      : 1;

    const newSubSub: SubSubcategory = {
      id,
      subcategory_id: selectedSubcategoryId as number,
      subsubcategory_name: newSubSubcategoryName.trim(),
      status: 'active',
      created_at: new Date().toISOString().split('T')[0],
    };

    setTimeout(() => {
      setSubSubcategories((prev) => [newSubSub, ...prev]);
      setNewSubSubcategoryName('');
      setIsAdding(false);
    }, 300);
  };

  // VIEW
  const handleView = (subsub: SubSubcategory) => {
    setSelected(subsub);
    setEditName(subsub.subsubcategory_name);
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
    setSubSubcategories((prev) =>
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
    if (!confirm('Delete Type / Sub-type?')) return;
    setSubSubcategories((prev) => prev.filter((s) => s.id !== id));
    if (selected?.id === id) closeDrawer();
  };

  // SAVE EDIT
  const handleSaveEdit = () => {
    if (!selected) return;
    if (!editName.trim()) {
      alert('Name is required');
      return;
    }

    setSubSubcategories((prev) =>
      prev.map((s) =>
        s.id === selected.id
          ? {
              ...s,
              subsubcategory_name: editName.trim(),
              status: selected.status,
            }
          : s
      )
    );

    setSelected((prev) =>
      prev
        ? {
            ...prev,
            subsubcategory_name: editName.trim(),
          }
        : prev
    );
    setIsEditing(false);
  };

  const isSubcategorySelected = selectedSubcategoryId !== '';
  const selectedCategoryName =
    DUMMY_CATEGORIES.find((c) => c.id === selectedCategoryId)?.category_name ||
    '...';
  const selectedSubcategoryName =
    DUMMY_SUBCATEGORIES.find((c) => c.id === selectedSubcategoryId)
      ?.subcategory_name || '...';

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* HEADER */}
      <h1 className="flex items-center gap-2 mb-2 text-3xl font-bold text-purple-700">
        <FiTag /> Sub-Subcategory Management
      </h1>
      <p className="mb-6 text-sm text-gray-600">
        Manage Types / Sub-types under specific Subcategories.
      </p>

      {/* ADD AREA */}
      <form
        onSubmit={handleAdd}
        className="flex flex-col gap-3 mb-6 md:flex-row"
      >
        {/* Category Select */}
        <select
          value={selectedCategoryId}
          onChange={handleCategoryChange}
          className="w-full px-4 py-3 border rounded-xl md:w-1/3"
        >
          <option value="">Select Category...</option>
          {DUMMY_CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.category_name}
            </option>
          ))}
        </select>

        {/* Subcategory Select */}
        <select
          value={selectedSubcategoryId}
          onChange={handleSubcategoryChange}
          disabled={selectedCategoryId === ''}
          className="w-full px-4 py-3 border rounded-xl md:w-1/3 disabled:bg-gray-100 disabled:text-gray-400"
        >
          <option value="">Select Subcategory...</option>
          {filteredSubcategories.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.subcategory_name}
            </option>
          ))}
        </select>

        {/* Name */}
        <input
          value={newSubSubcategoryName}
          onChange={(e) => setNewSubSubcategoryName(e.target.value)}
          className="flex-1 px-4 py-3 border rounded-xl"
          placeholder={
            isSubcategorySelected
              ? 'Enter Type / Sub-type name...'
              : 'Select category & subcategory first...'
          }
          disabled={!isSubcategorySelected}
        />

        <button
          type="submit"
          disabled={
            !isSubcategorySelected || !newSubSubcategoryName.trim() || isAdding
          }
          className="flex items-center justify-center gap-2 px-6 py-3 text-white bg-purple-600 rounded-xl disabled:opacity-60"
        >
          <FiPlus /> {isAdding ? 'Adding...' : 'Add'}
        </button>
      </form>

      {/* PATH INFO */}
      <div className="flex items-center mb-3 text-sm text-gray-600">
        <span>Path:</span>
        <span className="ml-2 text-purple-700">{selectedCategoryName}</span>
        <FiChevronRight className="mx-2 text-gray-400" />
        <span className="text-purple-700">{selectedSubcategoryName}</span>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded-2xl">
        <table className="min-w-full">
          <thead className="text-white bg-purple-600">
            <tr>
              <th className="px-6 py-4 text-left">Type / Sub-type</th>
              <th className="px-6 py-4 text-left">Subcategory</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Created</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isSubcategorySelected &&
              filteredSubSubcategories.map((subsub) => (
                <tr key={subsub.id} className="border-b hover:bg-purple-50">
                  <td className="flex items-center gap-4 px-6 py-4">
                    <IconPlaceholder name={subsub.subsubcategory_name} />
                    <div>
                      <div className="font-semibold">
                        {subsub.subsubcategory_name}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {getSubcategoryName(subsub.subcategory_id)}
                  </td>

                  <td className="px-6 py-4">
                    <button onClick={() => toggleStatus(subsub.id)}>
                      <StatusBadge status={subsub.status} />
                    </button>
                  </td>

                  <td className="px-6 py-4">{subsub.created_at}</td>

                  <td className="flex justify-end gap-2 px-6 py-4 text-right">
                    <button
                      className="p-2"
                      onClick={() => handleView(subsub)}
                    >
                      <FiEye />
                    </button>
                    <button
                      className="p-2 text-purple-600"
                      onClick={() => {
                        handleView(subsub);
                        setIsEditing(true);
                      }}
                    >
                      <FiEdit />
                    </button>
                    <button
                      className="p-2 text-rose-600"
                      onClick={() => handleDelete(subsub.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}

            {isSubcategorySelected && filteredSubSubcategories.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="py-10 text-sm text-center text-gray-500"
                >
                  No Types / Sub-types found.
                </td>
              </tr>
            )}

            {!isSubcategorySelected && (
              <tr>
                <td
                  colSpan={5}
                  className="py-10 text-sm text-center text-gray-500"
                >
                  Select a Category & Subcategory to view Types / Sub-types.
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
                <IconPlaceholder
                  name={selected.subsubcategory_name}
                  size="lg"
                />
              )}
              <div>
                <h2 className="text-xl font-bold">
                  {selected?.subsubcategory_name || 'Details'}
                </h2>
                {selected && (
                  <p className="flex items-center gap-2 text-sm text-gray-500">
                    <FiCalendar /> {selected.created_at}
                  </p>
                )}
                {selected && (
                  <p className="mt-1 text-xs text-gray-500">
                    {getCategoryName(
                      DUMMY_SUBCATEGORIES.find(
                        (s) => s.id === selected.subcategory_id
                      )?.category_id || 0
                    )}{' '}
                    <FiChevronRight className="inline mx-1 text-gray-400" />
                    {getSubcategoryName(selected.subcategory_id)}
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
              <p className="text-gray-500">
                Select a Type / Sub-type to view.
              </p>
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
                      ID
                    </p>
                    <p className="px-3 py-2 mt-1 bg-gray-100 rounded-lg">
                      #{selected.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500">
                      Subcategory
                    </p>
                    <p className="px-3 py-2 mt-1 bg-gray-100 rounded-lg">
                      {getSubcategoryName(selected.subcategory_id)}
                    </p>
                  </div>
                </div>

                <button
                  className="flex items-center justify-center w-full gap-2 py-3 mb-3 text-white bg-purple-600 rounded-xl"
                  onClick={() => setIsEditing(true)}
                >
                  <FiEdit /> Edit Type / Sub-type
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
                  <label className="text-sm font-medium">
                    Type / Sub-type Name
                  </label>
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
