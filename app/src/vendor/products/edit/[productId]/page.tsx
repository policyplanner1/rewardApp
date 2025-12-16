"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FaTag,
  FaBox,
  FaImages,
  FaFileUpload,
  FaPlus,
  FaTrash,
  FaSpinner,
} from "react-icons/fa";

const API_BASE = "http://localhost:5000";

/* =====================
   Interfaces (MATCH ADD PAGE)
===================== */
interface Category {
  category_id: number;
  category_name: string;
}

interface SubCategory {
  subcategory_id: number;
  category_id: number;
  subcategory_name: string;
}

interface SubSubCategory {
  sub_subcategory_id: number;
  subcategory_id: number;
  name: string;
  attributes?: any;
}

interface RequiredDocument {
  document_id: number;
  document_name: string;
  status: number;
}

interface Variant {
  size: string;
  color: string;
  dimension: string;
  weight: string;
  customAttributes: Record<string, any>;
  MRP: string | number;
  salesPrice: string | number;
  stock: string | number;
  expiryDate: string;
  manufacturingYear: string;
  materialType: string;
  images: File[];
  existingImages: string[];
}

interface ProductData {
  productName: string;
  brandName: string;
  manufacturer: string;
  barCode: string;
  gstIn: string;
  description: string;
  shortDescription: string;
  categoryId: number | null;
  subCategoryId: number | null;
  subSubCategoryId: number | null;
  variants: Variant[];
  productImages: File[];
  existingImages: string[];
}

const emptyVariant: Variant = {
  size: "",
  color: "",
  dimension: "",
  weight: "",
  customAttributes: {},
  MRP: "",
  salesPrice: "",
  stock: "",
  expiryDate: "",
  manufacturingYear: "",
  materialType: "",
  images: [],
  existingImages: [],
};

const initialState: ProductData = {
  productName: "",
  brandName: "",
  manufacturer: "",
  barCode: "",
  gstIn: "",
  description: "",
  shortDescription: "",
  categoryId: null,
  subCategoryId: null,
  subSubCategoryId: null,
  variants: [emptyVariant],
  productImages: [],
  existingImages: [],
};

/* =====================
   UI HELPERS
===================== */
const SectionHeader = ({ icon: Icon, title, description }: any) => (
  <div className="flex items-center pb-2 mb-4 space-x-3 border-b">
    <Icon className="text-2xl text-[#852BAF]" />
    <div>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  </div>
);

const Input = ({ label, ...props }: any) => (
  <div className="flex flex-col space-y-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input {...props} className="p-3 border rounded-lg bg-gray-50" />
  </div>
);

/* =====================
   PAGE
===================== */
export default function EditProductPage() {
  const { productId } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<ProductData>(initialState);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [subSubCategories, setSubSubCategories] = useState<SubSubCategory[]>([]);
  const [requiredDocs, setRequiredDocs] = useState<RequiredDocument[]>([]);
  const [docFiles, setDocFiles] = useState<Record<number, File | null>>({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* =====================
     INITIAL LOAD
  ===================== */
  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, []);

  /* =====================
     FETCH MASTER DATA
  ===================== */
  const fetchCategories = async () => {
    const res = await fetch(`${API_BASE}/api/category`);
    const json = await res.json();
    if (json.success) setCategories(json.data);
  };

  const fetchSubCategories = async (categoryId: number) => {
    const res = await fetch(`${API_BASE}/api/subcategory/${categoryId}`);
    const json = await res.json();
    if (json.success) setSubCategories(json.data);
  };

  const fetchSubSubCategories = async (subcategoryId: number) => {
    const res = await fetch(`${API_BASE}/api/subsubcategory/${subcategoryId}`);
    const json = await res.json();
    if (json.success) setSubSubCategories(json.data);
  };

  const fetchRequiredDocuments = async (categoryId: number) => {
    const res = await fetch(
      `${API_BASE}/api/product/category/required_docs/${categoryId}`,
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    const json = await res.json();
    if (json.success) setRequiredDocs(json.data || []);
  };

  /* =====================
     FETCH PRODUCT
  ===================== */
  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/product/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      const p = json.data;

      if (p.category_id) {
        await fetchSubCategories(p.category_id);
        await fetchRequiredDocuments(p.category_id);
      }
      if (p.subcategory_id) await fetchSubSubCategories(p.subcategory_id);

      setProduct({
        productName: p.product_name || "",
        brandName: p.brand_name || "",
        manufacturer: p.manufacturer || "",
        barCode: p.barcode || "",
        gstIn: p.gst_in || "",
        description: p.description || "",
        shortDescription: p.short_description || "",
        categoryId: p.category_id || null,
        subCategoryId: p.subcategory_id || null,
        subSubCategoryId: p.sub_subcategory_id || null,
        existingImages: p.images || [],
        productImages: [],
        variants:
          p.variants && p.variants.length > 0
            ? p.variants.map((v: any) => ({
                size: v.size || "",
                color: v.color || "",
                dimension: v.dimension || "",
                weight: v.weight || "",
                MRP: v.mrp || "",
                salesPrice: v.sales_price || "",
                stock: v.stock || "",
                expiryDate: v.expiry_date || "",
                manufacturingYear: v.manufacturing_year || "",
                materialType: v.material_type || "",
                customAttributes: v.custom_attributes || {},
                existingImages: v.images || [],
                images: [],
              }))
            : [emptyVariant],
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* =====================
     HANDLERS
  ===================== */
  const handleFieldChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "categoryId") {
      setProduct((p) => ({ ...p, categoryId: Number(value), subCategoryId: null, subSubCategoryId: null }));
      fetchSubCategories(Number(value));
      fetchRequiredDocuments(Number(value));
    } else if (name === "subCategoryId") {
      setProduct((p) => ({ ...p, subCategoryId: Number(value), subSubCategoryId: null }));
      fetchSubSubCategories(Number(value));
    } else {
      setProduct((p) => ({ ...p, [name]: value }));
    }
  };

  const handleVariantChange = (i: number, field: string, value: any) => {
    const updated = [...product.variants];
    updated[i] = { ...updated[i], [field]: value };
    setProduct((p) => ({ ...p, variants: updated }));
  };

  const handleVariantImages = (i: number, files: FileList | null) => {
    if (!files) return;
    const updated = [...product.variants];
    updated[i].images = Array.from(files);
    setProduct((p) => ({ ...p, variants: updated }));
  };

  const addVariant = () => {
    setProduct((p) => ({ ...p, variants: [...p.variants, emptyVariant] }));
  };

  const removeVariant = (i: number) => {
    if (product.variants.length === 1) return;
    setProduct((p) => ({ ...p, variants: p.variants.filter((_, idx) => idx !== i) }));
  };

  const handleDocChange = (docId: number, file: File | null) => {
    setDocFiles((prev) => ({ ...prev, [docId]: file }));
  };

  /* =====================
     SUBMIT
  ===================== */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("productName", product.productName);
      formData.append("brandName", product.brandName);
      formData.append("manufacturer", product.manufacturer);
      formData.append("barCode", product.barCode);
      formData.append("gstIn", product.gstIn);
      formData.append("description", product.description);
      formData.append("shortDescription", product.shortDescription);
      formData.append("category_id", String(product.categoryId));

      if (product.subCategoryId)
        formData.append("subcategory_id", String(product.subCategoryId));
      if (product.subSubCategoryId)
        formData.append("sub_subcategory_id", String(product.subSubCategoryId));

      product.productImages.forEach((f) => formData.append("images", f));

      Object.entries(docFiles).forEach(([id, file]) => {
        if (file) formData.append(id, file);
      });

      formData.append(
        "variants",
        JSON.stringify(
          product.variants.map((v) => ({
            size: v.size,
            color: v.color,
            dimension: v.dimension,
            weight: v.weight,
            mrp: v.MRP,
            salesPrice: v.salesPrice,
            stock: v.stock,
            expiryDate: v.expiryDate,
            manufacturingYear: v.manufacturingYear,
            materialType: v.materialType,
            customAttributes: v.customAttributes,
          }))
        )
      );

      product.variants.forEach((v, i) =>
        v.images.forEach((img, idx) => formData.append(`variant_${i}_${idx}`, img))
      );

      const res = await fetch(`${API_BASE}/api/product/update/${productId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      router.push("/manager/products");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-3xl text-[#852BAF]" />
      </div>
    );
  }

  /* =====================
     RENDER
  ===================== */
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* CATEGORY */}
        <section>
          <SectionHeader icon={FaTag} title="Category" description="Same as add product" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select name="categoryId" value={product.categoryId || ""} onChange={handleFieldChange} className="p-3 border rounded">
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
              ))}
            </select>
            <select name="subCategoryId" value={product.subCategoryId || ""} onChange={handleFieldChange} disabled={!product.categoryId} className="p-3 border rounded">
              <option value="">Select Sub Category</option>
              {subCategories.map((s) => (
                <option key={s.subcategory_id} value={s.subcategory_id}>{s.subcategory_name}</option>
              ))}
            </select>
            <select name="subSubCategoryId" value={product.subSubCategoryId || ""} onChange={handleFieldChange} disabled={!product.subCategoryId} className="p-3 border rounded">
              <option value="">Select Type</option>
              {subSubCategories.map((ss) => (
                <option key={ss.sub_subcategory_id} value={ss.sub_subcategory_id}>{ss.name}</option>
              ))}
            </select>
          </div>
        </section>

        {/* BASIC INFO */}
        <section>
          <SectionHeader icon={FaTag} title="Product Info" description="Identification details" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Product Name" name="productName" value={product.productName} onChange={handleFieldChange} />
            <Input label="Brand" name="brandName" value={product.brandName} onChange={handleFieldChange} />
            <Input label="Manufacturer" name="manufacturer" value={product.manufacturer} onChange={handleFieldChange} />
            <Input label="Barcode" name="barCode" value={product.barCode} onChange={handleFieldChange} />
            <Input label="GST" name="gstIn" value={product.gstIn} onChange={handleFieldChange} />
          </div>
        </section>

        {/* VARIANTS */}
        <section>
          <SectionHeader icon={FaBox} title="Variants" description="At least one variant always present" />
          {product.variants.map((v, i) => (
            <div key={i} className="p-4 border rounded mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input label="Size" value={v.size} onChange={(e:any)=>handleVariantChange(i,"size",e.target.value)} />
                <Input label="Color" value={v.color} onChange={(e:any)=>handleVariantChange(i,"color",e.target.value)} />
                <Input label="Dimension" value={v.dimension} onChange={(e:any)=>handleVariantChange(i,"dimension",e.target.value)} />
                <Input label="Weight" value={v.weight} onChange={(e:any)=>handleVariantChange(i,"weight",e.target.value)} />
                <Input label="MRP" value={v.MRP} onChange={(e:any)=>handleVariantChange(i,"MRP",e.target.value)} />
                <Input label="Sales Price" value={v.salesPrice} onChange={(e:any)=>handleVariantChange(i,"salesPrice",e.target.value)} />
                <Input label="Stock" value={v.stock} onChange={(e:any)=>handleVariantChange(i,"stock",e.target.value)} />
                <Input label="Expiry Date" type="date" value={v.expiryDate} onChange={(e:any)=>handleVariantChange(i,"expiryDate",e.target.value)} />
                <Input label="Manufacturing Year" type="date" value={v.manufacturingYear} onChange={(e:any)=>handleVariantChange(i,"manufacturingYear",e.target.value)} />
                <Input label="Material Type" value={v.materialType} onChange={(e:any)=>handleVariantChange(i,"materialType",e.target.value)} />
              </div>

              {v.existingImages.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {v.existingImages.map((img, idx) => (
                    <img key={idx} src={img} className="w-16 h-16 object-cover border" />
                  ))}
                </div>
              )}

              <input type="file" multiple className="mt-3" onChange={(e)=>handleVariantImages(i,e.target.files)} />

              {product.variants.length > 1 && (
                <button type="button" onClick={()=>removeVariant(i)} className="mt-2 text-sm text-red-600 flex items-center">
                  <FaTrash className="mr-1" /> Remove Variant
                </button>
              )}
            </div>
          ))}

          <button type="button" onClick={addVariant} className="text-[#852BAF] flex items-center">
            <FaPlus className="mr-1" /> Add Variant
          </button>
        </section>

        {/* DESCRIPTION */}
        <section>
          <SectionHeader icon={FaTag} title="Description" description="Same as add product" />
          <textarea name="description" value={product.description} onChange={handleFieldChange} className="w-full p-3 border rounded" rows={4} />
          <textarea name="shortDescription" value={product.shortDescription} onChange={handleFieldChange} className="w-full p-3 border rounded mt-3" rows={2} />
        </section>

        {/* PRODUCT IMAGES */}
        <section>
          <SectionHeader icon={FaImages} title="Product Images" description="Existing + new" />
          <div className="flex gap-2">
            {product.existingImages.map((img, i) => (
              <img key={i} src={img} className="w-20 h-20 object-cover border" />
            ))}
          </div>
          <input type="file" multiple className="mt-3" onChange={(e)=>setProduct(p=>({...p,productImages:Array.from(e.target.files||[])}))} />
        </section>

        {/* DOCUMENTS */}
        {requiredDocs.length > 0 && (
          <section>
            <SectionHeader icon={FaFileUpload} title="Required Documents" description="Upload if needed" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requiredDocs.map((doc) => (
                <div key={doc.document_id} className="border p-3 rounded">
                  <label className="text-sm font-medium">{doc.document_name}</label>
                  <input type="file" className="mt-2" onChange={(e)=>handleDocChange(doc.document_id,e.target.files?.[0]||null)} />
                </div>
              ))}
            </div>
          </section>
        )}

        <button disabled={saving} className="w-full py-3 rounded-full text-white font-bold" style={{background:"linear-gradient(to right,#852BAF,#FC3F78)"}}>
          {saving ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
}
