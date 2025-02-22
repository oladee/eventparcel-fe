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
        <div className="w-[680px] h-screen bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4">
            {/* Header */}
            <div className="flex justify-between gap-1">
                <div>
                    <p className="font-general font-bold text-2xl text-[#111827]">
                        {mode === "create" ? "Create Package" : `Update Package for ${packageData?.title}`}
                    </p>
                    <p className="font-general font-medium text-lg text-[#718096]">
                        How do you want to sell to this group?
                    </p>
                </div>
                <div onClick={() => setOpenModalPackage(false)} className="cursor-pointer">
                    <Image src="/images/cancel.png" alt="cancel" width={12} height={12} />
                </div>
            </div>

            <div className="w-full border border-gray-100"></div>

            {/* Image Upload Section */}
            <div className="flex items-center gap-5">
                <Image src="/images/cloth.png" alt="packagesImg" width={136} height={136} className="rounded-[10px] border border-gray-300" />
                <div className="h-[136px] w-[136px] border-[3px] border-dashed rounded-[10px] flex flex-col items-center justify-center gap-2 cursor-pointer">
                    <Image src="/images/Group.png" alt="add-img" width={32} height={32} />
                    <p className="font-general text-sm font-medium text-[#718096]">Add Image</p>
                </div>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-4">
                <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Add package title"
                    className="w-full p-3 rounded-xl border border-gray-300 text-sm bg-[#FAFAFA]"
                />
                {touched.title && errors.title && <p className="text-xs text-red-500">{errors.title}</p>}

                <textarea
                    id="description"
                    value={formData.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Add package description"
                    className="w-full h-[120px] p-3 rounded-xl border border-gray-300 text-sm bg-[#FAFAFA]"
                />
                {touched.description && errors.description && <p className="text-xs text-red-500">{errors.description}</p>}

                <div className="flex gap-3">
                    <div className="flex items-center w-1/2 p-3 border border-gray-300 rounded-xl bg-[#FAFAFA]">
                        <span className="pr-3 border-r border-gray-300 text-sm text-[#111827]">₦</span>
                        <input
                            type="text"
                            id="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Add package amount"
                            className="flex-1 pl-3 text-sm bg-transparent focus:outline-none"
                        />
                    </div>
                    {touched.amount && errors.amount && <p className="text-xs text-red-500">{errors.amount}</p>}

                    <input
                        type="text"
                        id="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="Quantity (optional)"
                        className="w-1/2 p-3 border rounded-xl border-gray-300 text-sm bg-[#FAFAFA]"
                    />
                </div>
            </div>

            {/* Delivery Options */}
            <div className="flex flex-col gap-2">
                <p className="font-general font-semibold text-base text-[#111827]">How would you like to handle delivery?</p>
                <p className="font-general font-medium text-sm text-[#718096]">
                    With Event Parcel platform, you can manage and track delivery easily.
                </p>
                <div className="flex gap-10 mt-3">
                    <div className="flex items-center gap-2 cursor-pointer">
                        <Image src="/images/check.png" alt="check" width={20} height={20} />
                        <span className="font-general font-medium text-base text-[#111827]"> Home Delivery </span>
                    </div>
                    <div className="flex items-center gap-2 cursor-pointer">
                        <Image src="/images/unchecked.png" alt="check" width={20} height={20} />
                        <span className="font-general font-medium text-base text-[#111827]">Pickup</span>
                    </div>
                </div>
            </div>

            <div className="w-full border border-gray-100"></div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-1">
                <button onClick={() => setOpenModalPackage(false)} className="px-6 py-2 text-base font-general font-bold text-[#111827] border border-[#111827] rounded-[10px] hover:bg-gray-100">
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={!isFormValid}
                    className={`px-6 py-2 text-sm font-general font-bold text-white rounded-[10px] ${
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
