"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import {
  FaTag,
  FaBox,
  FaDollarSign,
  FaImages,
  FaFileUpload,
  FaPlus,
  FaTrash,
  FaTimes,
  FaCheck,
} from "react-icons/fa";

// --- Interfaces ---
interface Category {
  id: number;
  name: string;
  is_custom: boolean;
  variant_type: string;
}

interface SubCategory {
  id: number;
  category_id: number;
  name: string;
  is_custom: boolean;
  attributes: any;
}

interface SubSubCategory {
  id: number;
  subcategory_id: number;
  name: string;
  attributes: any;
}

interface Variant {
  id?: number;
  size: string;
  color: string;
  dimension: string;
  customAttributes: Record<string, any>;
  MRP: number;
  salesPrice: number;
  stock: number;
  sku: string;
  images: File[];
}

interface ProductData {
  brandName: string;
  manufacturer: string;
  itemType: string;
  barCode: string;
  productName: string;
  description: string;
  shortDescription: string;
  status: string;
  categoryId: number | null;
  subCategoryId: number | null;
  subSubCategoryId: number | null;
  variants: Variant[];
}

// --- Category -> Business & Legal Documents mapping ---
export const categoryLegalDocs: Record<number, string[]> = {
  1: [
    "FSSAI License (Central/State)",
    "Shop & Establishment Certificate",
    "Trademark Certificate / Application",
    "Distributor Authorization Letter (if distributor)",
    "Udyam / MSME Certificate (optional)",
  ],
  2: [
    "BIS / CRS Certification",
    "WPC Approval (if Bluetooth/WiFi enabled)",
    "Importer License (if imported)",
    "Authorized Dealership Certificate",
    "MSME Certificate (optional)",
  ],
  3: ["Trademark Certificate (recommended)", "MSME Certificate (optional)"],
  4: ["MSME Certificate", "Factory License (if manufacturer)"],
  5: ["MSME Certificate"],
  6: [
    "Importer License (for imported equipment)",
    "Authorized Dealership Certificate",
  ],
  7: [
    "FSSAI License (for food serving)",
    "Liquor License",
    "Shop & Establishment Certificate",
    "Fire NOC",
    "Municipal Trade License",
  ],
  8: ["Trademark Certificate", "Business License"],
};

const initialProductData: ProductData = {
  brandName: "",
  manufacturer: "",
  itemType: "",
  barCode: "",
  productName: "",
  description: "",
  shortDescription: "",
  status: "draft",
  categoryId: null,
  subCategoryId: null,
  subSubCategoryId: null,
  variants: [
    {
      size: "",
      color: "",
      dimension: "",
      customAttributes: {},
      MRP: 0,
      salesPrice: 0,
      stock: 0,
      sku: "",
      images: [],
    },
  ],
};

const FormInput = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder = "",
  className = "",
}: any) => (
  <div className="flex flex-col space-y-1">
    <label htmlFor={id} className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {id === "description" || id === "shortDescription" ? (
      <textarea
        id={id}
        rows={id === "description" ? 4 : 2}
        name={id}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className={`p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#852BAF] focus:border-[#852BAF] ${className}`}
      />
    ) : (
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className={`p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#852BAF] focus:border-[#852BAF] ${className}`}
      />
    )}
  </div>
);

const SectionHeader = ({ icon: Icon, title, description }: any) => (
  <div className="flex items-center space-x-3 mb-4 border-b pb-2">
    <Icon className="text-2xl" style={{ color: "#852BAF" }} />
    <div>
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  </div>
);

export default function ProductListingWithDocs() {
  const [product, setProduct] = useState<ProductData>(initialProductData);
  const [isSubmitting, setSubmitting] = useState(false);
  const [docFiles, setDocFiles] = useState<Record<string, File | null>>({});

  // Category data states
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "FOOD – PACKAGED PRODUCTS", is_custom: false, variant_type: "" },
    { id: 2, name: "ELECTRONIC PRODUCTS", is_custom: false, variant_type: "" },
    { id: 3, name: "CLOTHING & APPAREL", is_custom: false, variant_type: "size_color" },
    { id: 4, name: "UTENSILS", is_custom: false, variant_type: "" },
    { id: 5, name: "KITCHENWARE (Non-food Tools & Accessories)", is_custom: false, variant_type: "" },
    { id: 6, name: "GYM EQUIPMENT", is_custom: false, variant_type: "" },
    { id: 7, name: "PUB / RESTO-BAR VENDORS", is_custom: false, variant_type: "" },
    { id: 8, name: "Fashion", is_custom: false, variant_type: "size_color" },
  ]);
  
  const [subCategories, setSubCategories] = useState<SubCategory[]>([
    { id: 21, category_id: 8, name: "Men", is_custom: false, attributes: null },
    { id: 22, category_id: 8, name: "Women", is_custom: false, attributes: null },
    { id: 23, category_id: 8, name: "Kids", is_custom: false, attributes: null },
    // Additional dummy subcategories for other categories
    { id: 24, category_id: 1, name: "Snacks", is_custom: false, attributes: null },
    { id: 25, category_id: 1, name: "Beverages", is_custom: false, attributes: null },
    { id: 26, category_id: 2, name: "Mobile Phones", is_custom: false, attributes: null },
    { id: 27, category_id: 2, name: "Laptops", is_custom: false, attributes: null },
    { id: 28, category_id: 2, name: "Home Appliances", is_custom: false, attributes: null },
  ]);
  
  const [subSubCategories, setSubSubCategories] = useState<SubSubCategory[]>([
    { 
      id: 1, 
      subcategory_id: 21, 
      name: "T-Shirts", 
      attributes: {
        variation_types: ["size", "color"],
        attributes: {
          fabric: ["Cotton", "Polyester", "Dry-Fit"],
          fit: ["Slim", "Regular", "Oversized"],
          pattern: ["Solid", "Printed", "Striped"]
        },
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black", "Blue", "White", "Red", "Green", "Yellow"]
      }
    },
    { 
      id: 2, 
      subcategory_id: 21, 
      name: "Jeans", 
      attributes: {
        variation_types: ["size"],
        attributes: {
          fit: ["Slim", "Regular", "Relaxed"],
          wash: ["Light", "Dark", "Stone"]
        },
        sizes: ["28", "30", "32", "34", "36", "38"]
      }
    },
    { 
      id: 3, 
      subcategory_id: 21, 
      name: "Shirts", 
      attributes: {
        variation_types: ["size", "color"],
        attributes: {
          fabric: ["Cotton", "Linen", "Polyester"],
          collar: ["Regular", "Spread", "Button-down"],
          sleeve: ["Full", "Half"]
        },
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["White", "Blue", "Black", "Grey", "Pink"]
      }
    },
    { 
      id: 4, 
      subcategory_id: 22, 
      name: "Dresses", 
      attributes: {
        variation_types: ["size", "color"],
        attributes: {
          style: ["A-line", "Bodycon", "Maxi"],
          neckline: ["Round", "V-neck", "Off-shoulder"],
          sleeve_length: ["Sleeveless", "Short", "Long"]
        },
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Red", "Black", "White", "Blue", "Pink", "Purple"]
      }
    },
    // Additional dummy sub-subcategories
    { 
      id: 5, 
      subcategory_id: 24, 
      name: "Chips", 
      attributes: {
        variation_types: ["size"],
        attributes: {
          flavor: ["Classic Salted", "Cheese", "Sour Cream"],
          type: ["Potato", "Corn", "Tortilla"]
        },
        sizes: ["50g", "100g", "200g", "500g"]
      }
    },
    { 
      id: 6, 
      subcategory_id: 26, 
      name: "Smartphones", 
      attributes: {
        variation_types: ["color", "storage"],
        attributes: {
          ram: ["4GB", "6GB", "8GB", "12GB"],
          processor: ["Snapdragon", "MediaTek", "Exynos"]
        },
        sizes: [],
        colors: ["Black", "White", "Blue", "Red"]
      }
    },
  ]);

  // States for "Other" input management
  const [showOtherCategory, setShowOtherCategory] = useState(false);
  const [showOtherSubCategory, setShowOtherSubCategory] = useState(false);
  const [showOtherSubSubCategory, setShowOtherSubSubCategory] = useState(false);
  
  const [otherCategoryName, setOtherCategoryName] = useState("");
  const [otherSubCategoryName, setOtherSubCategoryName] = useState("");
  const [otherSubSubCategoryName, setOtherSubSubCategoryName] = useState("");

  // Handle form field changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === "categoryId") {
      if (value === "other") {
        setShowOtherCategory(true);
        setProduct({
          ...product,
          categoryId: null,
          subCategoryId: null,
          subSubCategoryId: null,
        });
      } else {
        setShowOtherCategory(false);
        setProduct({
          ...product,
          categoryId: value ? parseInt(value) : null,
          subCategoryId: null,
          subSubCategoryId: null,
        });
      }
    } else if (name === "subCategoryId") {
      if (value === "other") {
        setShowOtherSubCategory(true);
        setProduct({
          ...product,
          subCategoryId: null,
          subSubCategoryId: null,
        });
      } else {
        setShowOtherSubCategory(false);
        setProduct({
          ...product,
          subCategoryId: value ? parseInt(value) : null,
          subSubCategoryId: null,
        });
      }
    } else if (name === "subSubCategoryId") {
      if (value === "other") {
        setShowOtherSubSubCategory(true);
        setProduct({
          ...product,
          subSubCategoryId: null,
        });
      } else {
        setShowOtherSubSubCategory(false);
        setProduct({
          ...product,
          subSubCategoryId: value ? parseInt(value) : null,
        });
      }
    } else {
      setProduct({
        ...product,
        [name]: value,
      });
    }
  };

  // Handle variant changes
  const handleVariantChange = (index: number, field: string, value: any) => {
    const updatedVariants = [...product.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value,
    };
    setProduct({ ...product, variants: updatedVariants });
  };

  // Handle attribute changes for variants
  const handleAttributeChange = (variantIndex: number, attributeName: string, value: string) => {
    const updatedVariants = [...product.variants];
    updatedVariants[variantIndex].customAttributes = {
      ...updatedVariants[variantIndex].customAttributes,
      [attributeName]: value,
    };
    setProduct({ ...product, variants: updatedVariants });
  };

  // Add new variant
  const addVariant = () => {
    setProduct({
      ...product,
      variants: [
        ...product.variants,
        {
          size: "",
          color: "",
          dimension: "",
          customAttributes: {},
          MRP: 0,
          salesPrice: 0,
          stock: 0,
          sku: "",
          images: [],
        },
      ],
    });
  };

  // Remove variant
  const removeVariant = (index: number) => {
    const updatedVariants = product.variants.filter((_, i) => i !== index);
    setProduct({ ...product, variants: updatedVariants });
  };

  // Handle variant image upload
  const handleVariantImageUpload = (variantIndex: number, e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const updatedVariants = [...product.variants];
      updatedVariants[variantIndex].images = files;
      setProduct({ ...product, variants: updatedVariants });
    }
  };

  // Slugify function for document keys
  const slugify = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  // Handle document file upload
  const handleDocFile = (docName: string, file?: File | null) => {
    const key = slugify(docName);
    setDocFiles((p) => ({ ...p, [key]: file ?? null }));
  };

  const onDocInputChange = (e: ChangeEvent<HTMLInputElement>, docName: string) => {
    if (e.target.files && e.target.files[0]) {
      handleDocFile(docName, e.target.files[0]);
    } else {
      handleDocFile(docName, null);
    }
  };

  // Add custom category from "Other" input
  const addCustomCategory = () => {
    if (otherCategoryName.trim()) {
      const newCategory = {
        id: categories.length + 1,
        name: otherCategoryName,
        is_custom: true,
        variant_type: "size_color",
      };
      setCategories([...categories, newCategory]);
      setProduct({ ...product, categoryId: newCategory.id });
      setOtherCategoryName("");
      setShowOtherCategory(false);
    }
  };

  // Cancel custom category
  const cancelCustomCategory = () => {
    setShowOtherCategory(false);
    setOtherCategoryName("");
    setProduct({ ...product, categoryId: null });
  };

  // Add custom subcategory from "Other" input
  const addCustomSubCategory = () => {
    if (otherSubCategoryName.trim() && product.categoryId) {
      const newSubCategory = {
        id: subCategories.length + 1,
        category_id: product.categoryId,
        name: otherSubCategoryName,
        is_custom: true,
        attributes: null,
      };
      setSubCategories([...subCategories, newSubCategory]);
      setProduct({ ...product, subCategoryId: newSubCategory.id });
      setOtherSubCategoryName("");
      setShowOtherSubCategory(false);
    }
  };

  // Cancel custom subcategory
  const cancelCustomSubCategory = () => {
    setShowOtherSubCategory(false);
    setOtherSubCategoryName("");
    setProduct({ ...product, subCategoryId: null });
  };

  // Add custom sub-subcategory from "Other" input
  const addCustomSubSubCategory = () => {
    if (otherSubSubCategoryName.trim() && product.subCategoryId) {
      const newSubSubCategory = {
        id: subSubCategories.length + 1,
        subcategory_id: product.subCategoryId,
        name: otherSubSubCategoryName,
        attributes: {
          variation_types: ["size", "color"],
          attributes: {},
          sizes: [],
          colors: []
        },
      };
      setSubSubCategories([...subSubCategories, newSubSubCategory]);
      setProduct({ ...product, subSubCategoryId: newSubSubCategory.id });
      setOtherSubSubCategoryName("");
      setShowOtherSubSubCategory(false);
    }
  };

  // Cancel custom sub-subcategory
  const cancelCustomSubSubCategory = () => {
    setShowOtherSubSubCategory(false);
    setOtherSubSubCategoryName("");
    setProduct({ ...product, subSubCategoryId: null });
  };

  // Get current sub-subcategory attributes
  const getCurrentAttributes = () => {
    if (!product.subSubCategoryId) return null;
    const subSub = subSubCategories.find(ss => ss.id === product.subSubCategoryId);
    return subSub?.attributes || null;
  };

  // Generate SKU for variant
  const generateSKU = (variantIndex: number) => {
    const variant = product.variants[variantIndex];
    const brandPrefix = product.brandName.substring(0, 3).toUpperCase();
    const sizeCode = variant.size || "NA";
    const colorCode = variant.color.substring(0, 3).toUpperCase() || "CLR";
    return `${brandPrefix}-${sizeCode}-${colorCode}-${variantIndex + 1}`;
  };

  // Form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authentication required.");
      setSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();

      // Append product data
      formData.append("brandName", product.brandName);
      formData.append("manufacturer", product.manufacturer);
      formData.append("itemType", product.itemType);
      formData.append("barCode", product.barCode);
      formData.append("productName", product.productName);
      formData.append("description", product.description);
      formData.append("shortDescription", product.shortDescription);
      formData.append("status", product.status);
      formData.append("categoryId", String(product.categoryId || ""));
      formData.append("subCategoryId", String(product.subCategoryId || ""));
      formData.append("subSubCategoryId", String(product.subSubCategoryId || ""));

      // Append variants
      product.variants.forEach((variant, index) => {
        formData.append(`variants[${index}][size]`, variant.size);
        formData.append(`variants[${index}][color]`, variant.color);
        formData.append(`variants[${index}][dimension]`, variant.dimension);
        formData.append(`variants[${index}][MRP]`, String(variant.MRP));
        formData.append(`variants[${index}][salesPrice]`, String(variant.salesPrice));
        formData.append(`variants[${index}][stock]`, String(variant.stock));
        formData.append(`variants[${index}][sku]`, variant.sku || generateSKU(index));
        formData.append(`variants[${index}][customAttributes]`, JSON.stringify(variant.customAttributes));
        
        // Append variant images
        variant.images.forEach((file, fileIndex) => {
          formData.append(`variants[${index}][images][${fileIndex}]`, file);
        });
      });

      // Append legal documents
      Object.entries(docFiles).forEach(([key, file]) => {
        if (file) formData.append(`legalDocs[${key}]`, file);
      });

      // Submit to API
      const res = await fetch("/api/products/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Upload failed");

      alert(`Product submitted successfully! Product ID: ${json.productId}`);
      setProduct(initialProductData);
      setDocFiles({});
      setShowOtherCategory(false);
      setShowOtherSubCategory(false);
      setShowOtherSubSubCategory(false);
    } catch (err: any) {
      alert("Error: " + (err.message || "Unknown"));
    }

    setSubmitting(false);
  };

  // Render document uploads based on category
  const renderDocUploads = () => {
    if (!product.categoryId) return null;
    const docs = categoryLegalDocs[product.categoryId] ?? [];
    if (!docs.length) return null;

    return (
      <section>
        <SectionHeader
          icon={FaFileUpload}
          title="Required Business & Legal Documents"
          description="Upload the mandatory legal documents for the selected category"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {docs.map((doc) => {
            const key = slugify(doc);
            const selectedFile = docFiles[key] ?? null;

            return (
              <div key={key} className="p-4 border rounded-lg bg-white shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {doc}
                </label>

                <div className="flex items-center space-x-3">
                  <input
                    id={`doc-${key}`}
                    type="file"
                    accept=".pdf, image/*, .doc,.docx"
                    onChange={(e) => onDocInputChange(e, doc)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#852BAF] file:text-white"
                  />

                  {selectedFile ? (
                    <div className="text-xs text-gray-600">{selectedFile.name}</div>
                  ) : (
                    <div className="text-xs text-gray-400">No file chosen</div>
                  )}
                </div>

                <p className="mt-2 text-xs text-gray-400">Accepted: PDF, JPG, PNG, DOCX</p>
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  // Render variant builder
  const renderVariantBuilder = () => {
    const attributes = getCurrentAttributes();
    if (!attributes) return null;

    return (
      <section>
        <SectionHeader
          icon={FaBox}
          title="Product Variants"
          description="Configure different variants of your product"
        />

        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Available Variation Types:</h3>
          <div className="flex flex-wrap gap-2">
            {attributes.variation_types?.map((type: string) => (
              <span key={type} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {type}
              </span>
            ))}
          </div>
        </div>

        {product.variants.map((variant, index) => (
          <div key={index} className="p-6 border rounded-xl bg-gray-50 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Variant #{index + 1}</h3>
              {product.variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
              {/* Size */}
              {attributes.variation_types?.includes("size") && attributes.sizes?.length > 0 ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                  <select
                    value={variant.size}
                    onChange={(e) => handleVariantChange(index, "size", e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">Select Size</option>
                    {attributes.sizes.map((size: string) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              ) : attributes.variation_types?.includes("size") ? (
                <FormInput
                  label="Size"
                  value={variant.size}
                  onChange={(e) => handleVariantChange(index, "size", e.target.value)}
                  placeholder="Enter size"
                  className="w-full"
                />
              ) : null}

              {/* Color */}
              {attributes.variation_types?.includes("color") && attributes.colors?.length > 0 ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <select
                    value={variant.color}
                    onChange={(e) => handleVariantChange(index, "color", e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">Select Color</option>
                    {attributes.colors.map((color: string) => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>
              ) : attributes.variation_types?.includes("color") ? (
                <FormInput
                  label="Color"
                  value={variant.color}
                  onChange={(e) => handleVariantChange(index, "color", e.target.value)}
                  placeholder="Enter color"
                  className="w-full"
                />
              ) : null}

              {/* Dimension */}
              <FormInput
                label="Dimension"
                value={variant.dimension}
                onChange={(e) => handleVariantChange(index, "dimension", e.target.value)}
                placeholder="e.g., 12x10x5 cm"
                className="w-full"
              />

              {/* MRP */}
              <FormInput
                label="MRP"
                type="number"
                value={variant.MRP}
                onChange={(e) => handleVariantChange(index, "MRP", e.target.value)}
                placeholder="MRP"
                className="w-full"
              />

              {/* Sales Price */}
              <FormInput
                label="Sales Price"
                type="number"
                value={variant.salesPrice}
                onChange={(e) => handleVariantChange(index, "salesPrice", e.target.value)}
                placeholder="Sales Price"
                className="w-full"
              />

              {/* Stock */}
              <FormInput
                label="Stock"
                type="number"
                value={variant.stock}
                onChange={(e) => handleVariantChange(index, "stock", e.target.value)}
                placeholder="Stock"
                className="w-full"
              />
            </div>

            {/* Custom Attributes */}
            {attributes.attributes && Object.keys(attributes.attributes).length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Product Attributes</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {Object.entries(attributes.attributes).map(([key, values]: [string, any]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                        {key}
                      </label>
                      <select
                        value={variant.customAttributes[key] || ""}
                        onChange={(e) => handleAttributeChange(index, key, e.target.value)}
                        className="w-full p-2 border rounded-lg"
                      >
                        <option value="">Select {key}</option>
                        {values.map((value: string) => (
                          <option key={value} value={value}>{value}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Variant Images */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Variant Images
              </label>
              <div className="flex items-center p-3 border border-dashed border-gray-400 rounded-lg bg-white">
                <span className="flex-1 text-sm text-gray-600">
                  {variant.images.length === 0
                    ? "No images chosen"
                    : `${variant.images.length} image(s) selected`}
                </span>
                <label className="cursor-pointer bg-[#852BAF] text-white px-3 py-1 text-xs rounded-full hover:bg-[#7a1c94]">
                  Choose Files
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleVariantImageUpload(index, e)}
                  />
                </label>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addVariant}
          className="flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#852BAF] hover:bg-purple-50"
        >
          <FaPlus className="mr-2 text-[#852BAF]" />
          Add Another Variant
        </button>
      </section>
    );
  };

  return (
    <div className="p-6" style={{ backgroundColor: "#FFFAFB" }}>
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">New Product Listing</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Category Selection Section */}
          <section>
            <SectionHeader
              icon={FaTag}
              title="Category Selection"
              description="Select or add categories for your product"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                {!showOtherCategory ? (
                  <select
                    name="categoryId"
                    value={product.categoryId || ""}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#852BAF]"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name} {cat.is_custom && "(Custom)"}
                      </option>
                    ))}
                    <option value="other">Other Category</option>
                  </select>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={otherCategoryName}
                        onChange={(e) => setOtherCategoryName(e.target.value)}
                        placeholder="Enter new category name"
                        className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#852BAF]"
                      />
                      <button
                        type="button"
                        onClick={addCustomCategory}
                        disabled={!otherCategoryName.trim()}
                        className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Add Category"
                      >
                        <FaCheck />
                      </button>
                      <button
                        type="button"
                        onClick={cancelCustomCategory}
                        className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        title="Cancel"
                      >
                        <FaTimes />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">Press Enter or click ✓ to add</p>
                  </div>
                )}
              </div>

              {/* Sub Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sub Category
                </label>
                {product.categoryId && !showOtherSubCategory ? (
                  <select
                    name="subCategoryId"
                    value={product.subCategoryId || ""}
                    onChange={handleChange}
                    disabled={!product.categoryId}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#852BAF] disabled:opacity-50"
                  >
                    <option value="">Select Sub Category</option>
                    {subCategories
                      .filter((sub) => sub.category_id === product.categoryId)
                      .map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name} {sub.is_custom && "(Custom)"}
                        </option>
                      ))}
                    <option value="other">Other Sub Category</option>
                  </select>
                ) : showOtherSubCategory ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={otherSubCategoryName}
                        onChange={(e) => setOtherSubCategoryName(e.target.value)}
                        placeholder="Enter new sub-category name"
                        className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#852BAF]"
                      />
                      <button
                        type="button"
                        onClick={addCustomSubCategory}
                        disabled={!otherSubCategoryName.trim()}
                        className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Add Sub Category"
                      >
                        <FaCheck />
                      </button>
                      <button
                        type="button"
                        onClick={cancelCustomSubCategory}
                        className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        title="Cancel"
                      >
                        <FaTimes />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">Press Enter or click ✓ to add</p>
                  </div>
                ) : (
                  <select
                    name="subCategoryId"
                    value=""
                    onChange={handleChange}
                    disabled
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 opacity-50"
                  >
                    <option value="">Select Category First</option>
                  </select>
                )}
              </div>

              {/* Sub Sub Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type / Sub-type
                </label>
                {product.subCategoryId && !showOtherSubSubCategory ? (
                  <select
                    name="subSubCategoryId"
                    value={product.subSubCategoryId || ""}
                    onChange={handleChange}
                    disabled={!product.subCategoryId}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#852BAF] disabled:opacity-50"
                  >
                    <option value="">Select Type</option>
                    {subSubCategories
                      .filter((ss) => ss.subcategory_id === product.subCategoryId)
                      .map((ss) => (
                        <option key={ss.id} value={ss.id}>
                          {ss.name}
                        </option>
                      ))}
                    <option value="other">Other Type</option>
                  </select>
                ) : showOtherSubSubCategory ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={otherSubSubCategoryName}
                        onChange={(e) => setOtherSubSubCategoryName(e.target.value)}
                        placeholder="Enter new type name"
                        className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#852BAF]"
                      />
                      <button
                        type="button"
                        onClick={addCustomSubSubCategory}
                        disabled={!otherSubSubCategoryName.trim()}
                        className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Add Type"
                      >
                        <FaCheck />
                      </button>
                      <button
                        type="button"
                        onClick={cancelCustomSubSubCategory}
                        className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        title="Cancel"
                      >
                        <FaTimes />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">Press Enter or click ✓ to add</p>
                  </div>
                ) : (
                  <select
                    name="subSubCategoryId"
                    value=""
                    onChange={handleChange}
                    disabled
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 opacity-50"
                  >
                    <option value="">Select Sub Category First</option>
                  </select>
                )}
              </div>
            </div>

            {/* Selected Categories Display */}
            {(product.categoryId || product.subCategoryId || product.subSubCategoryId) && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
                <h4 className="font-medium text-gray-700 mb-2">Selected Categories:</h4>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">
                    {categories.find(c => c.id === product.categoryId)?.name || "Not selected"}
                  </span>
                  {product.subCategoryId && (
                    <>
                      <span className="mx-2">›</span>
                      <span>
                        {subCategories.find(s => s.id === product.subCategoryId)?.name}
                      </span>
                    </>
                  )}
                  {product.subSubCategoryId && (
                    <>
                      <span className="mx-2">›</span>
                      <span>
                        {subSubCategories.find(ss => ss.id === product.subSubCategoryId)?.name}
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* Product Basic Information */}
          <section>
            <SectionHeader
              icon={FaTag}
              title="Product Identification"
              description="Basic product information for store & search"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <FormInput
                id="brandName"
                label="Brand Name"
                required
                value={product.brandName}
                placeholder="Nike, Samsung, Puma"
                onChange={handleChange}
              />

              <FormInput
                id="manufacturer"
                label="Manufacturer"
                required
                value={product.manufacturer}
                placeholder="Manufacturer name"
                onChange={handleChange}
              />

              <FormInput
                id="itemType"
                label="Item Type"
                value={product.itemType}
                placeholder="Electronics, Grocery, Clothing"
                onChange={handleChange}
              />

              <FormInput
                id="barCode"
                label="Barcode"
                required
                value={product.barCode}
                placeholder="EAN / SKU / Code"
                onChange={handleChange}
              />

              <FormInput
                id="productName"
                label="Product Name"
                required
                value={product.productName}
                placeholder="Full product name"
                onChange={handleChange}
              />
            </div>
          </section>

          {/* Product Description */}
          <section>
            <SectionHeader
              icon={FaBox}
              title="Product Description"
              description="Tell customers more about your product"
            />

            <FormInput
              id="description"
              label="Detailed Description"
              required
              value={product.description}
              placeholder="Write detailed product info..."
              onChange={handleChange}
            />
            
            <div className="mt-4">
              <FormInput
                id="shortDescription"
                label="Short Description"
                required
                value={product.shortDescription}
                placeholder="Short one-line description"
                onChange={handleChange}
              />
            </div>
          </section>

          {/* Variant Builder (if category supports variants) */}
          {product.subSubCategoryId && renderVariantBuilder()}

          {/* Legal Documents */}
          {renderDocUploads()}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 text-lg font-bold text-white rounded-full shadow-md disabled:opacity-50"
            style={{
              background: "linear-gradient(to right, #852BAF, #FC3F78)",
            }}
          >
            {isSubmitting ? "Submitting..." : "Submit Product"}
          </button>
        </form>
      </div>
    </div>
  );
}