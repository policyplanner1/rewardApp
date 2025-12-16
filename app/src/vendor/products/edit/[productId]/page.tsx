"use client";

import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaSpinner,
  FaArrowLeft,
  FaTrash,
  FaPlus,
  FaImages,
  FaFileUpload,
  FaTag,
  FaBox,
  FaDollarSign,
  FaEdit,
} from "react-icons/fa";

const API_BASE = "http://localhost:5000"; 

type Variant = {
  size?: string;
  color?: string;
  dimension?: string;
  customAttributes?: Record<string, any>;
  MRP?: string | number;
  salesPrice?: string | number;
  stock?: string | number;
  expiryDate?: string;
  manufacturingYear?: string;
  materialType?: string;
  images?: (string | File)[];
};

type ProductForm = {
  productId?: number | string;
  productName?: string;
  brandName?: string;
  manufacturer?: string;
  barCode?: string;
  model?: string;
  gstIn?: string;
  description?: string;
  shortDescription?: string;
  categoryId?: number | null;
  subCategoryId?: number | null;
  subSubCategoryId?: number | null;
  productImages?: (string | File)[];
  variants?: Variant[];
  requiredDocs?: Array<{
    document_id: number;
    document_name: string;
    url?: string;
  }>;
};

function resolveImageUrl(p?: string) {
  if (!p) return "";
  try {
    const u = new URL(p);
    return u.toString();
  } catch {
    return `${API_BASE}/${p.replace(/^\/+/, "")}`;
  }
}

/* SectionHeader helper — shows icon, title and subtitle like Add page */
function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: any;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center pb-2 mb-4 space-x-3 border-b">
      <Icon className="text-2xl" style={{ color: "#852BAF" }} />
      <div>
        <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
}

export default function EditProductPage({
  params,
}: {
  params: { productId: string };
}) {
  const { productId } = params;
  const router = useRouter();

  const [form, setForm] = useState<ProductForm>({
    productImages: [],
    variants: [{ images: [] }],
    requiredDocs: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setError("Missing productId in route.");
      setLoading(false);
      return;
    }
    fetchProduct(productId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const fetchProduct = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE}/api/product/${encodeURIComponent(id)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Failed to fetch product: ${res.status} ${txt}`);
      }
      const json = await res.json();
      const raw = json.data ?? json.product ?? json;

      const mapped: ProductForm = {
        productId: raw.productId ?? raw.product_id ?? raw.id,
        productName: raw.productName ?? raw.product_name ?? raw.title ?? "",
        brandName: raw.brandName ?? raw.brand_name ?? raw.brand ?? "",
        manufacturer: raw.manufacturer ?? "",
        barCode: raw.barCode ?? raw.bar_code ?? "",
        model: raw.model ?? "",
        gstIn: raw.gstIn ?? raw.gst_in ?? "",
        description: raw.description ?? "",
        shortDescription: raw.shortDescription ?? raw.short_description ?? "",
        categoryId: raw.category_id ?? raw.categoryId ?? null,
        subCategoryId: raw.subcategory_id ?? raw.subCategoryId ?? null,
        subSubCategoryId:
          raw.sub_subcategory_id ?? raw.subSubCategoryId ?? null,
        productImages: Array.isArray(raw.productImages)
          ? raw.productImages
          : raw.images ?? [],
        variants: Array.isArray(raw.variants)
          ? raw.variants.map((v: any) => ({
              size: v.size ?? "",
              color: v.color ?? "",
              dimension: v.dimension ?? "",
              customAttributes: v.customAttributes ?? v.attributes ?? {},
              MRP: v.MRP ?? v.mrp ?? "",
              salesPrice: v.salesPrice ?? v.sales_price ?? v.price ?? "",
              stock: v.stock ?? v.qty ?? "",
              expiryDate: v.expiryDate ?? "",
              manufacturingYear: v.manufacturingYear ?? "",
              materialType: v.materialType ?? "",
              images: Array.isArray(v.images) ? v.images : v.imageUrls ?? [],
            }))
          : [{ images: [] }],
        requiredDocs: raw.requiredDocs ?? [],
      };

      setForm(mapped);
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  // Generic field handler
  const handleField = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name as keyof ProductForm]: value }));
  };

  // Main images handlers
  const handleMainImages = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const arr = Array.from(files);
    setForm((s) => ({
      ...s,
      productImages: [...(s.productImages ?? []), ...arr],
    }));
  };

  const removeMainImage = (index: number) => {
    setForm((s) => {
      const imgs = Array.from(s.productImages ?? []);
      imgs.splice(index, 1);
      return { ...s, productImages: imgs };
    });
  };

  // Variants
  const addVariant = () => {
    setForm((s) => ({
      ...s,
      variants: [...(s.variants ?? []), { images: [] }],
    }));
  };

  const removeVariant = (i: number) => {
    setForm((s) => {
      const variants = Array.from(s.variants ?? []);
      if (variants.length <= 1) return s; // keep at least one variant
      variants.splice(i, 1);
      return { ...s, variants };
    });
  };

  const handleVariantField = (i: number, key: keyof Variant, value: any) => {
    setForm((s) => {
      const variants = Array.from(s.variants ?? []);
      variants[i] = { ...(variants[i] ?? {}), [key]: value };
      return { ...s, variants };
    });
  };

  const handleVariantImages = (i: number, e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const arr = Array.from(files);
    setForm((s) => {
      const variants = Array.from(s.variants ?? []);
      variants[i] = {
        ...(variants[i] ?? {}),
        images: [...(variants[i]?.images ?? []), ...arr],
      };
      return { ...s, variants };
    });
  };

  const removeVariantImage = (vi: number, idx: number) => {
    setForm((s) => {
      const variants = Array.from(s.variants ?? []);
      const imgs = Array.from(variants[vi].images ?? []);
      imgs.splice(idx, 1);
      variants[vi] = { ...(variants[vi] ?? {}), images: imgs };
      return { ...s, variants };
    });
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const fd = new FormData();

      fd.append("productName", String(form.productName ?? ""));
      fd.append("brandName", String(form.brandName ?? ""));
      fd.append("manufacturer", String(form.manufacturer ?? ""));
      fd.append("barCode", String(form.barCode ?? ""));
      fd.append("model", String(form.model ?? ""));
      fd.append("gstIn", String(form.gstIn ?? ""));
      fd.append("description", String(form.description ?? ""));
      fd.append("shortDescription", String(form.shortDescription ?? ""));
      if (form.categoryId != null)
        fd.append("categoryId", String(form.categoryId));
      if (form.subCategoryId != null)
        fd.append("subCategoryId", String(form.subCategoryId));
      if (form.subSubCategoryId != null)
        fd.append("subSubCategoryId", String(form.subSubCategoryId));

      (form.productImages ?? []).forEach((img) => {
        if (img instanceof File)
          fd.append("productImages", img, (img as File).name);
        else fd.append("existingProductImages[]", String(img));
      });

      const variantsMeta: any[] = [];
      (form.variants ?? []).forEach((v) => {
        const meta = { ...v };
        meta.images = []; // replaced by file uploads / existing urls fields
        variantsMeta.push(meta);
      });
      fd.append("variants", JSON.stringify(variantsMeta));

      (form.variants ?? []).forEach((v, vi) => {
        (v.images ?? []).forEach((img) => {
          if (img instanceof File)
            fd.append(`variantFiles_${vi}`, img, (img as File).name);
          else fd.append(`existingVariantImages[${vi}][]`, String(img));
        });
      });

      const res = await fetch(
        `${API_BASE}/api/product/${encodeURIComponent(
          String(form.productId ?? productId)
        )}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
          body: fd,
        }
      );

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Save failed: ${res.status} ${txt}`);
      }

      router.push(`/manager/products/review/${form.productId ?? productId}`);
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <FaSpinner className="animate-spin text-4xl text-[#852BAF]" />
        <span className="ml-4 text-gray-600">Loading product...</span>
      </div>
    );
  }

  return (
    <div className="p-6" style={{ backgroundColor: "#FFFAFB" }}>
      <div className="p-6 mx-auto bg-white border border-gray-100 shadow-xl rounded-2xl max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="mb-1 text-2xl font-bold text-gray-900">
              Edit Product
            </h1>
            <div className="text-sm text-gray-600">
              Editing product ID: {form.productId ?? productId}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg bg-white hover:bg-gray-50"
            >
              <FaArrowLeft /> Back
            </button>

            <Link
              href={`/manager/products/review/${form.productId ?? productId}`}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg bg-white hover:bg-gray-50"
            >
              <FaEdit /> Review
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 border rounded bg-red-50 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* === Category Selection === */}
          <div>
            <SectionHeader
              icon={FaTag}
              title="Category Selection"
              subtitle="Category, sub-category and type"
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Category
                </label>
                <input
                  name="categoryId"
                  value={String(form.categoryId ?? "")}
                  onChange={handleField}
                  className="w-full p-3 border rounded-lg"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Sub Category
                </label>
                <input
                  name="subCategoryId"
                  value={String(form.subCategoryId ?? "")}
                  onChange={handleField}
                  className="w-full p-3 border rounded-lg"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Sub Sub Category
                </label>
                <input
                  name="subSubCategoryId"
                  value={String(form.subSubCategoryId ?? "")}
                  onChange={handleField}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* === Product Identification === */}
          <div>
            <SectionHeader
              icon={FaTag}
              title="Product Identification"
              subtitle="Basic product information"
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Product Name
                </label>
                <input
                  name="productName"
                  value={form.productName ?? ""}
                  onChange={handleField}
                  className="w-full p-3 border rounded-lg"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Brand Name
                </label>
                <input
                  name="brandName"
                  value={form.brandName ?? ""}
                  onChange={handleField}
                  className="w-full p-3 border rounded-lg"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Manufacturer
                </label>
                <input
                  name="manufacturer"
                  value={form.manufacturer ?? ""}
                  onChange={handleField}
                  className="w-full p-3 border rounded-lg"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Barcode
                </label>
                <input
                  name="barCode"
                  value={form.barCode ?? ""}
                  onChange={handleField}
                  className="w-full p-3 border rounded-lg"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  GST
                </label>
                <input
                  name="gstIn"
                  value={form.gstIn ?? ""}
                  onChange={handleField}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* === Additional Fields (Variants) === */}
          <div>
            <SectionHeader
              icon={FaBox}
              title="Additional Fields"
              subtitle="Variants, prices, stock, attributes"
            />

            <div className="space-y-4">
              {(form.variants ?? []).map((v, idx) => (
                <div key={idx} className="p-4 border rounded-lg bg-gray-50">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Size
                      </label>
                      <input
                        value={v.size ?? ""}
                        onChange={(e) =>
                          handleVariantField(idx, "size", e.target.value)
                        }
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Color
                      </label>
                      <input
                        value={v.color ?? ""}
                        onChange={(e) =>
                          handleVariantField(idx, "color", e.target.value)
                        }
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Material Type
                      </label>
                      <input
                        value={v.materialType ?? ""}
                        onChange={(e) =>
                          handleVariantField(
                            idx,
                            "materialType",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Dimension
                      </label>
                      <input
                        value={v.dimension ?? ""}
                        onChange={(e) =>
                          handleVariantField(idx, "dimension", e.target.value)
                        }
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        MRP
                      </label>
                      <input
                        value={String(v.MRP ?? "")}
                        onChange={(e) =>
                          handleVariantField(idx, "MRP", e.target.value)
                        }
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Sales Price
                      </label>
                      <input
                        value={String(v.salesPrice ?? "")}
                        onChange={(e) =>
                          handleVariantField(idx, "salesPrice", e.target.value)
                        }
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Stock
                      </label>
                      <input
                        value={String(v.stock ?? "")}
                        onChange={(e) =>
                          handleVariantField(idx, "stock", e.target.value)
                        }
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Expiry Date
                      </label>
                      <input
                        value={v.expiryDate ?? ""}
                        onChange={(e) =>
                          handleVariantField(idx, "expiryDate", e.target.value)
                        }
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Manufacturing Year
                      </label>
                      <input
                        value={v.manufacturingYear ?? ""}
                        onChange={(e) =>
                          handleVariantField(
                            idx,
                            "manufacturingYear",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Variant images */}
                  <div className="mt-3">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Variant Images
                    </label>
                    <div className="flex gap-2 flex-wrap mb-2">
                      {(v.images ?? []).map((img, j) => {
                        const url =
                          typeof img === "string"
                            ? resolveImageUrl(img)
                            : URL.createObjectURL(img as File);
                        return (
                          <div
                            key={j}
                            className="relative w-20 h-20 border rounded overflow-hidden"
                          >
                            <img
                              src={url}
                              alt={`v-${idx}-img-${j}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeVariantImage(idx, j)}
                              className="absolute top-1 right-1 p-1 text-xs bg-white rounded shadow"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleVariantImages(idx, e)}
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => removeVariant(idx)}
                      className="px-3 py-1 text-sm border rounded-lg bg-white"
                    >
                      <FaTrash /> Remove Variant
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3">
              <button
                type="button"
                onClick={addVariant}
                className="px-3 py-1 text-sm border rounded-lg bg-white"
              >
                <FaPlus /> Add Variant
              </button>
            </div>
          </div>

          {/* === Product Description === */}
          <div>
            <SectionHeader
              icon={FaDollarSign}
              title="Product Description"
              subtitle="Detailed and short descriptions"
            />

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Short Description
              </label>
              <input
                name="shortDescription"
                value={form.shortDescription ?? ""}
                onChange={handleField}
                className="w-full p-3 border rounded-lg"
              />
            </div>

            <div className="mt-3">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Detailed Description
              </label>
              <textarea
                name="description"
                value={form.description ?? ""}
                onChange={handleField}
                rows={6}
                className="w-full p-3 border rounded-lg"
              />
            </div>
          </div>

          {/* === Main Product Images === */}
          <div>
            <SectionHeader
              icon={FaImages}
              title="Main Product Images"
              subtitle="Upload primary images for the product listing"
            />

            <div className="flex gap-2 flex-wrap mb-3">
              {(form.productImages ?? []).map((img, i) => {
                const url =
                  typeof img === "string"
                    ? resolveImageUrl(img)
                    : URL.createObjectURL(img as File);
                return (
                  <div
                    key={i}
                    className="relative w-20 h-20 border rounded overflow-hidden"
                  >
                    <img
                      src={url}
                      alt={`main-${i}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeMainImage(i)}
                      className="absolute top-1 right-1 p-1 text-xs bg-white rounded shadow"
                    >
                      <FaTrash />
                    </button>
                  </div>
                );
              })}
            </div>

            <div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleMainImages}
              />
            </div>
          </div>

          {/* === Documents === */}
          {form.requiredDocs && form.requiredDocs.length > 0 && (
            <div>
              <SectionHeader
                icon={FaFileUpload}
                title="Documents"
                subtitle="Uploaded / required documents"
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {form.requiredDocs.map((doc) => (
                  <div
                    key={doc.document_id}
                    className="p-4 bg-white border rounded-lg shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-800">
                          {doc.document_name}
                        </div>
                        <div className="text-xs text-gray-500">Existing</div>
                      </div>
                      {doc.url ? (
                        <a
                          href={resolveImageUrl(doc.url)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-blue-600 underline"
                        >
                          View
                        </a>
                      ) : (
                        <div className="text-xs text-gray-500">
                          Not uploaded
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4 flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-[#852BAF] text-white hover:opacity-90 disabled:opacity-60"
            >
              {saving ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Product"
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                router.push(
                  `/manager/products/review/${form.productId ?? productId}`
                )
              }
              className="px-4 py-2 text-sm font-medium border rounded-lg bg-white"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
