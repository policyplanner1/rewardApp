'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { FaBuilding, FaAddressBook, FaCreditCard, FaShippingFast, FaUniversity, FaPhoneAlt, FaFileContract, FaFileUpload, FaEnvelope } from 'react-icons/fa';

// 1. Define the structure for the form data (cleaned to include only requested docs + conditional fields)
interface VendorOnboardingData {
  // A. Business Information
  companyName: string;
  fullName: string; // As per PAN Card
  vendorType: 'Manufacturer' | 'Trader' | 'Service Provider' | '';
  gstin: string;
  panNumber: string;

  // Documents (common)
  gstinFile: File | null;          // GST certificate
  panFile: File | null;           // PAN card
  bankProofFile: File | null;     // Cancelled cheque / passbook image
  signatoryIdFile: File | null;   // Authorized signatory ID proof (Aadhaar/PAN)
  businessProfileFile: File | null; // Business profile (PDF/doc)
  vendorAgreementFile: File | null; // Optional: signed agreement (we'll also include checkbox)
  brandLogoFile: File | null;     // Brand logo (PNG/JPG)
  authorizationLetterFile: File | null; // Conditional: for Trader only

  // A boolean for agreement acceptance
  agreementAccepted: boolean;

  // Manufacturer-specific contact (conditional)
  companyEmail: string;
  companyPhone: string;

  // Address Details
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  city: string;
  state: string;
  pincode: string;

  // Billing Address
  billingAddressLine1: string;
  billingAddressLine2: string;
  billingCity: string;
  billingState: string;
  billingPincode: string;

  // Shipping Address
  shippingAddressLine1: string;
  shippingAddressLine2: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;

  // Bank Details (kept as text for simplicity)
  bankName: string;
  accountNumber: string;
  branch: string;
  ifscCode: string;

  // Contact Details
  primaryContactNumber: string;
  email: string;
  alternateContactNumber: string;

  // Payment Terms & Comments
  paymentTerms: string;
  comments: string;
}

// 2. Initial state for the form
const initialFormData: VendorOnboardingData = {
  companyName: '',
  fullName: '',
  vendorType: '',
  gstin: '',
  panNumber: '',

  gstinFile: null,
  panFile: null,
  bankProofFile: null,
  signatoryIdFile: null,
  businessProfileFile: null,
  vendorAgreementFile: null,
  brandLogoFile: null,
  authorizationLetterFile: null,

  agreementAccepted: false,

  companyEmail: '',
  companyPhone: '',

  addressLine1: '',
  addressLine2: '',
  addressLine3: '',
  city: '',
  state: '',
  pincode: '',

  billingAddressLine1: '',
  billingAddressLine2: '',
  billingCity: '',
  billingState: '',
  billingPincode: '',

  shippingAddressLine1: '',
  shippingAddressLine2: '',
  shippingCity: '',
  shippingState: '',
  shippingPincode: '',

  bankName: '',
  accountNumber: '',
  branch: '',
  ifscCode: '',

  primaryContactNumber: '',
  email: '',
  alternateContactNumber: '',

  paymentTerms: '',
  comments: '',
};

// --- Reusable Form Input Component ---
interface FormInputProps {
  id: keyof VendorOnboardingData;
  label: string;
  type?: 'text' | 'number' | 'email' | 'tel';
  value: string | number | boolean;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
}

const FormInput = ({ 
    id, 
    label, 
    type = 'text', 
    value, 
    onChange, 
    placeholder,
    required = false 
}: FormInputProps) => (
  <div className="flex flex-col space-y-1">
    <label htmlFor={id as string} className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={id as string}
      name={id as string}
      value={value as string}
      onChange={onChange}
      placeholder={placeholder || `Enter ${label.toLowerCase()}`}
      required={required}
      className="p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand-purple focus:border-brand-purple transition duration-150"
    />
  </div>
);

// --- Reusable File Upload Component ---
interface FileUploadInputProps {
  id: keyof VendorOnboardingData;
  label: string;
  file: File | null;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  accept?: string;
  description?: string;
}

const FileUploadInput = ({ 
    id, 
    label, 
    file, 
    onChange, 
    required = false, 
    accept = '.jpg, .jpeg, .png, .pdf',
    description = ''
}: FileUploadInputProps) => {
    
    const fileText = file ? file.name : 'No file selected';

    return (
        <div className="flex flex-col space-y-1 col-span-1">
            <label htmlFor={id as string} className="text-sm font-medium text-gray-700 flex items-center">
                <FaFileUpload className="mr-2 text-brand-purple" style={{ color: '#852BAF' }} />
                Upload {label} {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {description ? <p className="text-xs text-gray-500 mb-1">{description}</p> : null}
            <div className="flex items-center space-x-2 p-3 border border-dashed border-gray-400 rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-150">
                <span className={`flex-1 text-sm truncate ${file ? 'text-gray-900' : 'text-gray-500'}`}>
                    {fileText}
                </span>
                <label 
                    htmlFor={id as string} 
                    className="cursor-pointer bg-brand-purple text-white px-3 py-1 text-xs font-medium rounded-full hover:opacity-90 transition duration-150"
                    style={{ backgroundColor: '#852BAF' }}
                >
                    Choose File
                </label>
                <input
                    type="file"
                    id={id as string}
                    name={id as string}
                    onChange={onChange}
                    required={required}
                    accept={accept}
                    className="hidden"
                />
            </div>
            <p className="text-xs text-gray-400">Accepted formats: {accept}</p>
        </div>
    );
};

// --- Reusable Section Header ---
const SectionHeader = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="flex items-center space-x-3 mb-4 border-b pb-2">
    <Icon className="text-2xl" style={{ color: '#852BAF' }} />
    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
    <p className="text-sm text-gray-500 hidden md:block">{description}</p>
  </div>
);

// --- MAIN COMPONENT ---
export default function Onboarding() {
  const [formData, setFormData] = useState<VendorOnboardingData>(initialFormData);
  const [isSameAsAddress, setIsSameAsAddress] = useState(true);
  const [isSameAsBilling, setIsSameAsBilling] = useState(true);

  // Generic change handler (handles text/select/file/checkbox)
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement;
    
    if (type === 'file') {
        const fileInput = e.target as HTMLInputElement;
        const file = fileInput.files ? fileInput.files[0] : null;
        setFormData(prev => ({ 
            ...prev, 
            [name as keyof VendorOnboardingData]: file 
        }));
        return;
    }

    if (type === 'checkbox' && name === 'agreementAccepted') {
      setFormData(prev => ({ ...prev, agreementAccepted: checked }));
      return;
    }

    // Normal text/select/textarea
    setFormData(prev => ({ 
      ...prev, 
      [name as keyof VendorOnboardingData]: value 
    }));
  };

  const handleVendorTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as VendorOnboardingData['vendorType'];
    setFormData(prev => ({ 
      ...prev, 
      vendorType: value,
      // reset conditional fields when switching type
      authorizationLetterFile: value === 'Trader' ? prev.authorizationLetterFile : null,
      companyEmail: value === 'Manufacturer' ? prev.companyEmail : '',
      companyPhone: value === 'Manufacturer' ? prev.companyPhone : '',
    }));
  };

  const handleCheckboxChange = (type: 'billing' | 'shipping') => {
    if (type === 'billing') {
      const newState = !isSameAsAddress;
      setIsSameAsAddress(newState);
      if (newState) {
        setFormData(prev => ({
          ...prev,
          billingAddressLine1: prev.addressLine1,
          billingAddressLine2: prev.addressLine2,
          billingCity: prev.city,
          billingState: prev.state,
          billingPincode: prev.pincode,
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          billingAddressLine1: '',
          billingAddressLine2: '',
          billingCity: '',
          billingState: '',
          billingPincode: '',
        }));
      }
    } else if (type === 'shipping') {
      const newState = !isSameAsBilling;
      setIsSameAsBilling(newState);
      if (newState) {
        setFormData(prev => ({
          ...prev,
          shippingAddressLine1: prev.billingAddressLine1,
          shippingAddressLine2: prev.billingAddressLine2,
          shippingCity: prev.billingCity,
          shippingState: prev.billingState,
          shippingPincode: prev.billingPincode,
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          shippingAddressLine1: '',
          shippingAddressLine2: '',
          shippingCity: '',
          shippingState: '',
          shippingPincode: '',
        }));
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.companyName || !formData.fullName || !formData.vendorType || !formData.panNumber) {
      alert('Please fill all required business information fields.');
      return;
    }

    // Validate required files
    const requiredFilesMissing = !formData.gstinFile || !formData.panFile || !formData.bankProofFile || !formData.signatoryIdFile || !formData.businessProfileFile;
    if (requiredFilesMissing) {
      alert('Please upload all mandatory documents: GST Certificate, PAN Card, Bank Proof, Signatory ID Proof, and Business Profile.');
      return;
    }

    // Brand logo is required for Manufacturer and Trader, optional for Service Provider
    if ((formData.vendorType === 'Manufacturer' || formData.vendorType === 'Trader') && !formData.brandLogoFile) {
      alert('Manufacturers and Traders must upload a Brand Logo.');
      return;
    }

    // Vendor agreement - show warning if not accepted and no file uploaded
    if (!formData.agreementAccepted && !formData.vendorAgreementFile) {
      const confirmUpload = confirm('You have not checked "Agreement Accepted" and no signed agreement is uploaded. Do you still want to submit?');
      if (!confirmUpload) return;
    }

    // Trader must upload authorization letter
    if (formData.vendorType === 'Trader' && !formData.authorizationLetterFile) {
      alert('Traders must upload an Authorization/Dealership letter.');
      return;
    }

    // Manufacturer must provide company email & phone
    if (formData.vendorType === 'Manufacturer' && (!formData.companyEmail || !formData.companyPhone)) {
      alert('Manufacturers must provide Company Email and Company Phone.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not logged in!');
      return;
    }

    const form = new FormData();

    // Append text fields (only string/boolean types)
    const textFields: Array<keyof VendorOnboardingData> = [
      'companyName','fullName','vendorType','gstin','panNumber',
      'agreementAccepted','companyEmail','companyPhone',
      'addressLine1','addressLine2','addressLine3','city','state','pincode',
      'billingAddressLine1','billingAddressLine2','billingCity','billingState','billingPincode',
      'shippingAddressLine1','shippingAddressLine2','shippingCity','shippingState','shippingPincode',
      'bankName','accountNumber','branch','ifscCode',
      'primaryContactNumber','email','alternateContactNumber',
      'paymentTerms','comments'
    ];

    textFields.forEach((key) => {
      // @ts-ignore - safe cast for appending
      const val = formData[key];
      if (typeof val === 'boolean') {
        form.append(String(key), val ? 'true' : 'false');
      } else if (val !== undefined && val !== null) {
        form.append(String(key), String(val));
      }
    });

    // Append file fields
    const fileFields: Array<keyof VendorOnboardingData> = [
      'gstinFile','panFile','bankProofFile','signatoryIdFile','businessProfileFile',
      'vendorAgreementFile','brandLogoFile','authorizationLetterFile'
    ];

    fileFields.forEach((field) => {
      const file = formData[field];
      if (file instanceof File) {
        form.append(field as string, file);
      }
    });

    try {
      const response = await fetch('http://localhost:5000/api/vendor/onboard', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const data = await response.json();
      if (!data.success) {
        alert('Failed: ' + data.message);
        return;
      }

      alert('Vendor Onboarding Submitted Successfully!');
      // optionally reset or navigate
    } catch (err) {
      console.error('Submit Error:', err);
      alert('Error submitting form');
    }
  };

  return (
    <div className="p-6" style={{ backgroundColor: '#FFFAFB' }}>
      <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Onboarding Form</h1>
        <p className="text-gray-600 mb-6 border-b pb-4">Please fill in your complete KYC and business profile details.</p>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* A. Business Information */}
          <section className="space-y-4">
            <SectionHeader icon={FaBuilding} title="Business Information & Documents" description="Upload only the common mandatory documents." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

              <FormInput id="companyName" label="Company Name" value={formData.companyName} onChange={handleChange} required />
              <FormInput id="fullName" label="Full Name (as per PAN Card)" value={formData.fullName} onChange={handleChange} required />

              {/* Vendor Type Dropdown */}
              <div className="flex flex-col space-y-1">
                <label htmlFor="vendorType" className="text-sm font-medium text-gray-700">Vendor Type <span className="text-red-500">*</span></label>
                <select
                  id="vendorType"
                  name="vendorType"
                  value={formData.vendorType}
                  onChange={handleVendorTypeChange}
                  required
                  className="p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand-purple focus:border-brand-purple transition duration-150"
                >
                  <option value="">Select vendor type</option>
                  <option value="Manufacturer">Manufacturer</option>
                  <option value="Trader">Trader</option>
                  <option value="Service Provider">Service Provider</option>
                </select>
              </div>

              <FormInput id="gstin" label="GSTIN" value={formData.gstin} onChange={handleChange} />
              <FormInput id="panNumber" label="PAN Number" value={formData.panNumber} onChange={handleChange} required />

              {/* File uploads: only the common docs */}
              <FileUploadInput
                id="gstinFile"
                label="GST Certificate"
                file={formData.gstinFile}
                onChange={handleChange}
                required
                description="Upload your GST Registration Certificate (PDF/JPG/PNG)."
              />

              <FileUploadInput
                id="panFile"
                label="PAN Card"
                file={formData.panFile}
                onChange={handleChange}
                required
                description="Upload company PAN (PDF/JPG/PNG)."
              />

              {/* Bank proof - cancelled cheque or passbook image */}
              <FileUploadInput
                id="bankProofFile"
                label="Bank Cancelled Cheque"
                file={formData.bankProofFile}
                onChange={handleChange}
                required
                accept=".jpg, .jpeg, .png, .pdf"
                description="Upload a Cancelled Cheque with company name and account details."
              />

              {/* Signatory ID */}
              <FileUploadInput
                id="signatoryIdFile"
                label="Authorized Signatory ID Proof"
                file={formData.signatoryIdFile}
                onChange={handleChange}
                required
                accept=".jpg, .jpeg, .png, .pdf"
                description="Upload Aadhaar or PAN of authorized signatory."
              />

              {/* Business profile */}
              <FileUploadInput
                id="businessProfileFile"
                label="Business Profile"
                file={formData.businessProfileFile}
                onChange={handleChange}
                required
                accept=".pdf, .doc, .docx"
                description="Upload your Business Profile (PDF or DOC)."
              />

              {/* Brand logo - required for Manufacturer and Trader */}
              <FileUploadInput
                id="brandLogoFile"
                label="Brand Logo"
                file={formData.brandLogoFile}
                onChange={handleChange}
                required={formData.vendorType === 'Manufacturer' || formData.vendorType === 'Trader'}
                accept=".jpg, .jpeg, .png, .svg"
                description="Upload brand logo (PNG/JPG/SVG)."
              />

              {/* Vendor agreement - checkbox + optional upload */}
              <div className="col-span-1 md:col-span-2 lg:col-span-3">
                <div className="flex items-center space-x-3 mb-3">
                  <input
                    type="checkbox"
                    id="agreementAccepted"
                    name="agreementAccepted"
                    checked={formData.agreementAccepted}
                    onChange={handleChange}
                    className="h-4 w-4 text-brand-purple border-gray-300 rounded"
                    style={{ accentColor: '#852BAF' }}
                  />
                  <label htmlFor="agreementAccepted" className="text-sm text-gray-700 font-medium">
                    I accept the Vendor Agreement terms.
                  </label>
                </div>

                <FileUploadInput
                  id="vendorAgreementFile"
                  label="Upload Signed Agreement (optional)"
                  file={formData.vendorAgreementFile}
                  onChange={handleChange}
                  accept=".pdf, .jpg, .jpeg, .png"
                  description="If you have a signed agreement, upload it here (optional)."
                />
              </div>

              {/* Conditional: Manufacturer fields */}
              {formData.vendorType === 'Manufacturer' && (
                <>
                  <div className="flex flex-col space-y-1">
                    <label htmlFor="companyEmail" className="text-sm font-medium text-gray-700 flex items-center">
                      <FaEnvelope className="mr-2 text-brand-purple" style={{ color: '#852BAF' }} />
                      Company Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="companyEmail"
                      name="companyEmail"
                      value={formData.companyEmail}
                      onChange={handleChange}
                      placeholder="Enter official company email"
                      required
                      className="p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand-purple focus:border-brand-purple transition duration-150"
                    />
                  </div>

                  <FormInput 
                    id="companyPhone" 
                    label="Company Phone" 
                    value={formData.companyPhone} 
                    onChange={handleChange} 
                    type="tel" 
                    required 
                    placeholder="Enter official company phone"
                  />
                </>
              )}

              {/* Conditional: Authorization letter (Trader only) */}
              {formData.vendorType === 'Trader' && (
                <FileUploadInput
                  id="authorizationLetterFile"
                  label="Authorization / Dealership Letter"
                  file={formData.authorizationLetterFile}
                  onChange={handleChange}
                  required
                  accept=".pdf, .jpg, .jpeg, .png"
                  description="Traders must upload an authorization/dealership agreement."
                />
              )}
            </div>
          </section>

          {/* Address Sections */}
          <section className="space-y-4">
            <SectionHeader icon={FaAddressBook} title="Registered Address" description="The official registered address of your business." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <FormInput id="addressLine1" label="Address Line 1" value={formData.addressLine1} onChange={handleChange} required />
              <FormInput id="addressLine2" label="Address Line 2" value={formData.addressLine2} onChange={handleChange} />
              <FormInput id="addressLine3" label="Address Line 3" value={formData.addressLine3} onChange={handleChange} />
              
              <FormInput id="city" label="City" value={formData.city} onChange={handleChange} required />
              <FormInput id="state" label="State" value={formData.state} onChange={handleChange} required />
              <FormInput id="pincode" label="Pincode" value={formData.pincode} onChange={handleChange} required />
            </div>
          </section>

          {/* Billing Address */}
          <section className="space-y-4">
            <SectionHeader icon={FaCreditCard} title="Billing Address" description="Address for invoices and official correspondence." />
            
            <div className="flex items-center mb-4">
              <input 
                type="checkbox" 
                id="sameAsAddress" 
                checked={isSameAsAddress} 
                onChange={() => handleCheckboxChange('billing')}
                className="h-4 w-4 text-brand-purple border-gray-300 rounded focus:ring-brand-purple"
                style={{ accentColor: '#852BAF' }}
              />
              <label htmlFor="sameAsAddress" className="ml-2 text-sm text-gray-700 font-medium">
                Same as Registered Address
              </label>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ${isSameAsAddress ? 'opacity-50 pointer-events-none' : ''}`}>
              <FormInput id="billingAddressLine1" label="Billing Address Line 1" value={formData.billingAddressLine1} onChange={handleChange} required={!isSameAsAddress} />
              <FormInput id="billingAddressLine2" label="Billing Address Line 2" value={formData.billingAddressLine2} onChange={handleChange} />
              
              <FormInput id="billingCity" label="Billing City" value={formData.billingCity} onChange={handleChange} required={!isSameAsAddress} />
              <FormInput id="billingState" label="Billing State" value={formData.billingState} onChange={handleChange} required={!isSameAsAddress} />
              <FormInput id="billingPincode" label="Billing Pincode" value={formData.billingPincode} onChange={handleChange} required={!isSameAsAddress} />
            </div>
          </section>

          {/* Shipping Address */}
          <section className="space-y-4">
            <SectionHeader icon={FaShippingFast} title="Shipping Address" description="Where products will be picked up from." />
            
            <div className="flex items-center mb-4">
              <input 
                type="checkbox" 
                id="sameAsBilling" 
                checked={isSameAsBilling} 
                onChange={() => handleCheckboxChange('shipping')}
                className="h-4 w-4 text-brand-pink border-gray-300 rounded focus:ring-brand-pink"
                style={{ accentColor: '#FC3F78' }}
              />
              <label htmlFor="sameAsBilling" className="ml-2 text-sm text-gray-700 font-medium">
                Same as Billing Address
              </label>
            </div>
            
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ${isSameAsBilling ? 'opacity-50 pointer-events-none' : ''}`}>
              <FormInput id="shippingAddressLine1" label="Shipping Address Line 1" value={formData.shippingAddressLine1} onChange={handleChange} required={!isSameAsBilling} />
              <FormInput id="shippingAddressLine2" label="Shipping Address Line 2" value={formData.shippingAddressLine2} onChange={handleChange} />
              
              <FormInput id="shippingCity" label="Shipping City" value={formData.shippingCity} onChange={handleChange} required={!isSameAsBilling} />
              <FormInput id="shippingState" label="Shipping State" value={formData.shippingState} onChange={handleChange} required={!isSameAsBilling} />
              <FormInput id="shippingPincode" label="Shipping Pincode" value={formData.shippingPincode} onChange={handleChange} required={!isSameAsBilling} />
            </div>
          </section>

          {/* Bank Details */}
          <section className="space-y-4">
            <SectionHeader icon={FaUniversity} title="Bank Details & Proof" description="Account details for receiving payments and required proof." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              
              <FormInput id="bankName" label="Bank Name" value={formData.bankName} onChange={handleChange} required />
              <FormInput id="accountNumber" label="Account Number" value={formData.accountNumber} onChange={handleChange} type="text" required />
              <div className='hidden lg:block' />

              <FormInput id="branch" label="Branch" value={formData.branch} onChange={handleChange} required />
              <FormInput id="ifscCode" label="IFSC Code" value={formData.ifscCode} onChange={handleChange} required />

              {/* <FileUploadInput 
                  id="bankProofFile" 
                  label="Cancelled Cheque" 
                  file={formData.bankProofFile} 
                  onChange={handleChange} 
                  required
                  description="Upload a Cancelled Cheque with company name and account details."
              /> */}
            </div>
          </section>

          {/* Contact Details */}
          <section className="space-y-4">
            <SectionHeader icon={FaPhoneAlt} title="Contact Details" description="Primary and secondary contact information." />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <FormInput id="primaryContactNumber" label="Primary Contact Number" value={formData.primaryContactNumber} onChange={handleChange} type="tel" required />
              <FormInput id="email" label="Email" value={formData.email} onChange={handleChange} type="email" required />
              <FormInput id="alternateContactNumber" label="Alternate Contact Number" value={formData.alternateContactNumber} onChange={handleChange} type="tel" />
            </div>
          </section>

          {/* Payment Terms */}
          <section className="space-y-4">
            <SectionHeader icon={FaFileContract} title="Payment & Comments" description="Custom terms and vendor notes." />
            
            <FormInput id="paymentTerms" label="Payment Terms" value={formData.paymentTerms} onChange={handleChange} />

            <div className="flex flex-col space-y-1">
              <label htmlFor="comments" className="text-sm font-medium text-gray-700">
                Comments (Vendor notes)
              </label>
              <textarea
                id="comments"
                name="comments"
                rows={3}
                value={formData.comments}
                onChange={handleChange as (e: ChangeEvent<HTMLTextAreaElement>) => void}
                placeholder="Add any specific notes or requirements here..."
                className="p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand-purple focus:border-brand-purple transition duration-150"
              />
            </div>
          </section>

          {/* Submit Button */}
          <div className="pt-4 border-t">
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-3 text-lg font-semibold text-white rounded-full transition duration-300 hover:shadow-lg"
              style={{ background: 'linear-gradient(to right, #852BAF, #FC3F78)' }}
            >
              Submit Onboarding Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}