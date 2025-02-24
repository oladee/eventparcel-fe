"use strict";

import { Package } from "@/data/mockData";
import Image from "next/image";
import { useState } from "react";

interface CreatePackageModalProps {
    setOpenModalPackage: React.Dispatch<React.SetStateAction<boolean>>;
    mode: "create" | "update";
    packageData?: Package | null;
}

const PackageModal: React.FC<CreatePackageModalProps> = ({ setOpenModalPackage, mode, packageData }) => {
    const [formData, setFormData] = useState({
        title: packageData?.title || "",
        description: packageData?.description || "",
        amount: packageData?.amount || "",
        quantity: packageData?.quantity || "",
    });

    const [errors, setErrors] = useState({
        title: "",
        description: "",
        amount: "",
    });

    const [touched, setTouched] = useState({
        title: false,
        description: false,
        amount: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));

        // Clear errors when user types
        if (value.trim() !== "") {
            setErrors((prev) => ({ ...prev, [id]: "" }));
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setTouched((prev) => ({ ...prev, [id]: true }));
    
        if (mode === "create") {
            if (typeof value === "string" && value.trim() === "") {
                setErrors((prev) => ({
                    ...prev,
                    [id]: `${id.charAt(0).toUpperCase() + id.slice(1)} is required`,
                }));
            } else if (id === "price" && isNaN(Number(value))) {
                setErrors((prev) => ({
                    ...prev,
                    price: "Price must be a number",
                }));
            }
        }
    };
    

    const isFormValid =
    mode === "update" || // No validation in update mode
    (typeof formData.title === "string" && formData.title.trim() &&
     typeof formData.description === "string" && formData.description.trim() &&
     typeof formData.amount === "string" && formData.amount.trim() &&
     Object.values(errors).every((err) => err === ""));


    const handleSubmit = () => {
        if (!isFormValid) return;
        console.log("Form submitted:", formData);
    };

    return (
        <div className="w-[680px] max-h-[90vh] lg:max-h-[99vh] bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-2 lg:gap-5 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center">
            <div>
                <p className="font-bold text-lg text-[#111827]">
                    {mode === "create" ? "Create Package" : `Update Package for ${packageData?.title}`}
                </p>
                <p className="text-sm text-[#718096]">How do you want to sell to this group?</p>
            </div>
            <Image src="/images/cancel.png" alt="cancel" width={14} height={14} className="cursor-pointer" onClick={() => setOpenModalPackage(false)} />
        </div>
    
        <div className="border border-gray-100"></div>
    
        {/* Image Upload Section (Smaller Size) */}
        <div className="flex items-center gap-4">
            <Image src="/images/cloth.png" alt="packagesImg" width={100} height={100} className="rounded-[10px] border border-gray-300" />
            <div className="h-[100px] w-[100px] border-[2px] border-dashed rounded-[10px] flex flex-col items-center justify-center gap-1 cursor-pointer">
                <Image src="/images/Group.png" alt="add-img" width={24} height={24} />
                <p className="text-xs text-[#718096]">Add Image</p>
            </div>
        </div>
    
        {/* Form Fields */}
        <div className="flex flex-col gap-2">
            <input
                type="text"
                id="title"
                value={formData.title}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Add package title"
                className="w-full h-14 p-2 rounded-xl border border-gray-300 text-sm bg-[#FAFAFA]"
            />
            {touched.title && errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
    
            <textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Add package description"
                className="w-full h-[90px] lg:h-[120px] p-2 rounded-xl border border-gray-300 text-sm bg-[#FAFAFA]"
            />
            {touched.description && errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
    
            <div className="flex gap-2">
                <div className="flex items-center w-1/2 p-2 border rounded-xl border-gray-300 bg-[#FAFAFA]">
                    <span className="pr-2 border-r border-gray-300 text-sm text-[#111827]">₦</span>
                    <input
                        type="text"
                        id="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Amount"
                        className="flex-1 pl-2 text-sm bg-transparent focus:outline-none"
                    />
                </div>
                <input
                    type="text"
                    id="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="Quantity (optional)"
                    className="w-1/2 p-2 border rounded-xl border-gray-300 text-sm bg-[#FAFAFA]"
                />
            </div>
        </div>
    
        {/* Delivery Options (Condensed) */}
        <div className="flex flex-col gap-3">
            <div>
                <p className="font-general font-semibold text-base text-[#111827]">How would you like to handle delivery?</p>
                <p className="font-general font-medium text-sm text-[#718096]">
                    With Event Parcel platform, you can manage and track delivery easily.
                </p>
            </div>
            <p className="text-sm font-semibold text-[#111827]">Delivery Options</p>
            <div className="flex gap-6">
                <div className="flex items-center gap-1 cursor-pointer">
                    <Image src="/images/check.png" alt="check" width={16} height={16} />
                    <span className="text-sm">Home Delivery</span>
                </div>
                <div className="flex items-center gap-1 cursor-pointer">
                    <Image src="/images/unchecked.png" alt="check" width={16} height={16} />
                    <span className="text-sm">Pickup</span>
                </div>
            </div>
        </div>
    
        <div className="border border-gray-100"></div>
    
        {/* Buttons */} 
        <div className="flex justify-end gap-2">
            <button onClick={() => setOpenModalPackage(false)} className="w-[120px] px-4 py-2 rounded-xl text-sm font-bold text-[#111827] border border-[#111827] hover:bg-gray-100">
                Cancel
            </button>
            <button
                onClick={handleSubmit}
                disabled={!isFormValid}
                className={`px-4 py-2 text-sm font-bold rounded-[12px] text-[#FFFFFF] ${
                    isFormValid ? "bg-[#751423] hover:bg-[#5e101d]" : "bg-[#75142399] cursor-not-allowed"
                }`}
            >
                {mode === "create" ? "Create Package" : "Update Package"}
            </button>
        </div>
    </div>
    
    );
};

export default PackageModal;
