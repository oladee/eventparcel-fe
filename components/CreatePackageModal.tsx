"use strict";

import { Package } from "@/app/interface/Group";
import axiosInstance from "@/lib/axiosInstance";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface PackageFormData {
    groupId?: string | number;
    packageTitle?: string;
    packageDescription?: string;
    packagePrice?: string | number;
    packageQuantity?: string | number;
    packageDelivery?: string[];
    packageImgUrls?: (string | File)[]; 
}

type FormErrors = Partial<Record<keyof PackageFormData, string>>;

interface CreatePackageModalProps {
    setOpenModalPackage: React.Dispatch<React.SetStateAction<boolean>>;
    mode: "create" | "update";
    packageData?: Package | null;
    groudId: string | number;
}

const CreatePackageModal: React.FC<CreatePackageModalProps> = ({ groudId, setOpenModalPackage, mode, packageData }) => {
    
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [, setError] = useState(false);
    const [openHomeDeliveryOption, setOpenHomeDeliveryOption] = useState(false);
    const [formData, setFormData] = useState<PackageFormData>({
        groupId: groudId,
        packageTitle: packageData?.packageTitle || "",
        packageDescription: packageData?.packageDescription || "",
        packagePrice: packageData?.packagePrice || "",
        packageQuantity: packageData?.packageQuantity || "",
        packageDelivery: typeof packageData?.packageDelivery === "string"
        ? (packageData.packageDelivery as string).split(",").map((item) => item.trim())
        : packageData?.packageDelivery ?? [],
        packageImgUrls: Array.isArray(packageData?.packageImgUrls)
        ? packageData.packageImgUrls
        : packageData?.packageImgUrls ? [packageData.packageImgUrls] : []
    });

    const validateField = (field: keyof PackageFormData, value: string) => {
        if (field === "packageTitle") {
            if (!value.trim()) return "Title is required.";
            if (value.length < 5 || value.length > 60) return "Title must be between 5 and 60 characters.";
        }
    
        if (field === "packageDescription") {
            if (value && value.length > 150) return "Description cannot exceed 150 characters.";
        }
    
        if (field === "packagePrice") {
            if (!value.trim()) return "Price is required.";
            if (isNaN(Number(value)) || Number(value) <= 0) return "Price must be a valid positive number.";
        }

        return ""; 
    };
    
    const [selectedOptions, setSelectedOptions] = useState<{ homeDelivery: boolean; pickUp: boolean }>({
        homeDelivery: false, 
        pickUp: false, 
    });
    const [homeDeliverySelectedOptions, setHomeDeliverySelectedOptions] = useState<{
        platformDelivery: boolean;
        selfManaged: boolean;
    }>({
        platformDelivery: false,
        selfManaged: false,
    });
    

    useEffect(() => {
        const packageOptions = formData.packageDelivery || []; // No need to split
    
        setHomeDeliverySelectedOptions({
            platformDelivery: packageOptions.includes("homeDelivery:platformDelivery"),
            selfManaged: packageOptions.includes("homeDelivery:selfManaged"),
        });
    
        setSelectedOptions({
            homeDelivery: packageOptions.includes("homeDelivery:platformDelivery") || packageOptions.includes("homeDelivery:selfManaged"),
            pickUp: packageOptions.includes("pickUp"),
        });
    }, [formData.packageDelivery]);

    const toggleDeliveryOption = (option: "pickUp" | "homeDelivery:platformDelivery" | "homeDelivery:selfManaged") => {
        setFormData((prev) => {
            const currentSelections = new Set(prev.packageDelivery || []); // Ensure it's an array
    
            if (currentSelections.has(option)) {
                currentSelections.delete(option); // Remove if already selected
            } else {
                currentSelections.add(option); // Add if not selected
            }
    
            return {
                ...prev,
                packageDelivery: Array.from(currentSelections), // Keep it as an array
            };
        });
    
        if (option === "pickUp") {
            setSelectedOptions((prev) => ({ ...prev, pickUp: !prev.pickUp }));
        } else {
            setHomeDeliverySelectedOptions((prev) => ({
                ...prev,
                platformDelivery: option === "homeDelivery:platformDelivery" ? !prev.platformDelivery : prev.platformDelivery,
                selfManaged: option === "homeDelivery:selfManaged" ? !prev.selfManaged : prev.selfManaged,
            }));
    
            setSelectedOptions((prev) => ({
                ...prev,
                homeDelivery: option === "homeDelivery:platformDelivery"
                    ? !homeDeliverySelectedOptions.platformDelivery || homeDeliverySelectedOptions.selfManaged
                    : option === "homeDelivery:selfManaged"
                    ? !homeDeliverySelectedOptions.selfManaged || homeDeliverySelectedOptions.platformDelivery
                    : prev.homeDelivery,
            }));
        }
    };
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        
        setFormData((prev) => ({
            ...prev,
            [id as keyof PackageFormData]: value,
        }));
    
        setErrors((prev) => ({
            ...prev,
            [id as keyof PackageFormData]: validateField(id as keyof PackageFormData, value),
        }));
    };
    

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
    
        const newFiles = Array.from(files);
        const existingImages = formData.packageImgUrls || [];
    
        const totalFiles = existingImages.length + newFiles.length;
        
        if (totalFiles > 4) {
            alert("You can only upload up to 4 images.");
            return;
        }
    
        setFormData((prev) => ({
            ...prev,
            packageImgUrls: [...existingImages, ...newFiles],
        }));
    };
    
    
    const removeImage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            packageImgUrls: prev.packageImgUrls?.filter((_, i) => i !== index) || [],
        }));
    };

    const isFormValid =
    mode === "update" ||
    (formData.packageTitle?.trim() &&
    //  formData.packageDescription?.trim() &&
     formData.packagePrice?.toString().trim() &&
     Object.values(errors).every((err) => err === ""));

     const handleSubmit = async () => {
        
        if (!isFormValid) return;
    
        const formDataToSend = new FormData();
        if(mode === "create") {
            formDataToSend.append("groupId", formData.groupId?.toString() || "");
        }
        formDataToSend.append("packageTitle", formData.packageTitle || "");
        formDataToSend.append("packageDescription", formData.packageDescription || "");
        formDataToSend.append("packagePrice", formData.packagePrice?.toString() || "");
        formDataToSend.append("packageQuantity", formData.packageQuantity?.toString() || "");
    
        const packageDelivery = formData.packageDelivery?.join(",") || "";
        formDataToSend.append("packageDelivery", packageDelivery);
    
        if (formData.packageImgUrls && formData.packageImgUrls.length > 0) {
            formData.packageImgUrls.forEach((file) => {
                if (mode === "create") {
                    formDataToSend.append("packageImgUrls", file);
                } else {
                    formDataToSend.append("packageImgUrls[]", file);
                }
            });
        }
        for (const pair of formDataToSend.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }
        try {
            setLoading(true)
            let response;
            if (mode === "create") {
                response = await axiosInstance.post("/add-package", formDataToSend, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                
            toast.success(`Package created successfully `, {
                position: "top-right",
                autoClose: 3000, 
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            });


                window.location.reload()
            } else if (mode === "update" && packageData?._id) {
                // formDataToSend.append("packageId", packageData._id.toString());
                    console.log("here", packageData._id)
                    response = await axiosInstance.put(`/update-package/${packageData._id}`, formDataToSend, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                toast.success(`Package updated successfully `, {
                    position: "top-right",
                    autoClose: 3000, 
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                });
                window.location.reload()
            }
    
            console.log("Response from backend:", response?.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred.";
                setError(errorMessage);
            
                // Show toast notification
                toast.error(errorMessage, {
                    position: "top-right",
                    autoClose: 5000, 
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                });
            } else {
                console.error("Unexpected Error:", error); 
            }
        }
        finally {
            setLoading(false)}
    };
    
    
    
    
    return (
        <>
            <ToastContainer aria-live="polite" />
            <div className="w-[680px] max-h-[80vh] lg:max-h-[98vh] bg-[#FFFFFF] rounded-2xl shadow-lg p-5 flex flex-col  overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div className="flex flex-col items-start">
                        <div className="font-bold text-lg text-[#111827]">
                            {mode === "create" ? "Create Package" : "Update Package"}
                        </div>
                        <p className="font-general font-medium text-lg text-[#718096]">How do you want to sell to this group</p>
                    </div>
                    <Image 
                        src="/images/cancel.png" 
                        alt="cancel" 
                        width={14} 
                        height={14} 
                        className="cursor-pointer" 
                        onClick={() => setOpenModalPackage(false)} 
                    />
                </div>
                
                <div className="border border-gray-100"></div>
        
                {/* Image Upload Section */}
                <div className="flex flex-wrap gap-2 py-2">
                    {(formData.packageImgUrls?.length ?? 0) > 0 && (
                        <div className="relative">
                            <Image 
                                src={
                                    formData.packageImgUrls?.[0]
                                        ? formData.packageImgUrls[0] instanceof File 
                                            ? URL.createObjectURL(formData.packageImgUrls[0]) 
                                            : formData.packageImgUrls[0]
                                        : "/placeholder.png" 
                                }
                                alt="Main package image"
                                width={100}
                                height={100}
                                className="rounded-[10px] border w-[90px] h-[90px]"
                            />
                            <button 
                                onClick={() => removeImage(0)} 
                                className="absolute top-0 right-0 bg-red-500 text-white h-5 w-5 flex justify-center items-center text-xs rounded-full p-1"
                            >
                                X
                            </button>
                        </div>
                    )}

                    {/* Display the remaining images (excluding the first one) */}
                    <div className="flex gap-2 ">
                        {formData.packageImgUrls?.slice(1)?.map((img, index) => (
                            <div key={index + 1} className="relative">
                                <Image 
                                    src={img instanceof File ? URL.createObjectURL(img) : img} 
                                    alt="package"
                                    width={100}
                                    height={100}
                                    className="rounded-[10px] border w-[90px] h-[90px]"
                                />
                                <button 
                                    onClick={() => removeImage(index + 1)} 
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Image Upload Button */}
                    <label className="w-[90px] h-[90px] flex items-center justify-center border border-dashed rounded-[10px] cursor-pointer">
                        <input 
                            type="file" 
                            accept="image/*" 
                            multiple 
                            className="hidden" 
                            onChange={handleImageUpload} 
                            />
                            <div className="flex flex-col justify-center items-center">
                                <Image
                                    src={"/images/Group.png"}
                                    alt=""
                                    height={22}
                                    width={22}
                                />
                                <span className="font-general font-medium text-sm text-[#718096]">Add Image</span>
                            </div>
                    </label>
                </div>
        
                {/* Form Inputs */}
                <div className="flex flex-col gap-3">
                    <input 
                        type="text" 
                        id="packageTitle" 
                        value={formData.packageTitle} 
                        onChange={handleChange} 
                        placeholder="Add package title" 
                        className="w-full h-10 p-2 rounded-xl border bg-[#FAFAFA]" 
                    />
                    {errors.packageTitle && <p className="text-red-500 text-sm mt-1">{errors.packageTitle}</p>}

                    <textarea 
                        id="packageDescription" 
                        value={formData.packageDescription} 
                        onChange={handleChange} 
                        placeholder="Add package description" 
                        className="w-full h-[100px] p-2 rounded-xl border bg-[#FAFAFA]" 
                    />
                    {errors.packageDescription && <p className="text-red-500 text-sm mt-1">{errors.packageDescription}</p>}
                    <div className="flex items-center gap-3">
                    {/* Price Input */}
                    <div className="flex items-center border border-gray-300 rounded-[10px] px-4 py-2 bg-[#FAFAFA] focus-within:border-blue-500 transition flex-1">
                        <span className="text-lg text-gray-600 font-medium">₦</span>
                        <input
                            type="number"
                            id="packagePrice"
                            value={formData.packagePrice}
                            onChange={handleChange}
                            placeholder="Enter amount"
                            className="w-full h-6 p-2 outline-none bg-transparent text-gray-900 placeholder-gray-400"
                        />
                    </div>

                    {/* Quantity Input */}
                    <div className="flex-1">
                        <input 
                            type="number" 
                            id="packageQuantity" 
                            value={formData.packageQuantity} 
                            onChange={handleChange} 
                            placeholder="Quantity (optional)" 
                            className="w-full h-11 p-2 rounded-xl border border-gray-300 bg-[#FAFAFA]" 
                        />
                    </div>
                </div>

                </div>
        
                {/* Delivery Options */}
                <div className="flex flex-col gap-3 mt-2">
                    <p className="font-semibold text-base text-[#111827]">How would you like to handle delivery?</p>
                    <p className="text-sm text-[#718096]">
                        With Event Parcel platform, you can manage and track delivery easily.
                    </p>
                    <p className="text-sm font-semibold text-[#111827]">Delivery Options</p>
                    {/* Delivery Options Section */}
                    <div className="flex flex-col gap-3">
                        <p className="font-semibold text-base text-[#111827]">How would you like to handle delivery?</p>
                        <p className="text-sm text-[#718096]">
                            With Event Parcel platform, you can manage and track delivery easily.
                        </p>

                        {/* Main Delivery Options */}
                        <div className="flex flex-col gap-1">
                            {/* Home Delivery - Expandable */}
                            <div 
                                className="flex flex-col border border-gray-100 items-start gap-1 cursor-pointer p-2"
                                onClick={() => setOpenHomeDeliveryOption(!openHomeDeliveryOption)}
                            >
                                <div className="flex items-center gap-2">
                                    <Image
                                        src={(homeDeliverySelectedOptions.platformDelivery || homeDeliverySelectedOptions.selfManaged) 
                                            ? "/images/check.png" 
                                            : "/images/unchecked.png"}
                                            alt="check"
                                        width={16}
                                        height={16}
                                    />
                                    <span className="text-sm">Home Delivery</span>
                                </div>

                                {/* Sub-options */}
                                {openHomeDeliveryOption && (
                                    <div className="flex flex-col gap-0.5 border border-gray-100 ">
                                        <div
                                            className="flex items-center gap-1 cursor-pointer p-2"
                                            onClick={() => toggleDeliveryOption("homeDelivery:platformDelivery")}
                                            >
                                            <Image
                                                src={homeDeliverySelectedOptions.platformDelivery ? "/images/check.png" : "/images/unchecked.png"}
                                                alt="check"
                                                width={16}
                                                height={16}
                                            />
                                            <span className="text-sm">Platform Delivery - We handle delivery for you</span>
                                        </div>

                                        <div
                                            className="flex items-center gap-1 cursor-pointer p-2"
                                            onClick={() => toggleDeliveryOption("homeDelivery:selfManaged")}
                                        >
                                            <Image
                                                src={homeDeliverySelectedOptions.selfManaged ? "/images/check.png" : "/images/unchecked.png"}
                                                alt="check"
                                                width={16}
                                                height={16}
                                                />
                                            <span className="text-sm">Self-Managed - You handle delivery yourself</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <div
                                className="flex border border-gray-100 items-center gap-1 cursor-pointer p-2"
                                onClick={() => toggleDeliveryOption("pickUp")}
                                >
                                <Image
                                    src={selectedOptions.pickUp ? "/images/check.png" : "/images/unchecked.png"}
                                    alt="check"
                                    width={16}
                                    height={16}
                                    />
                                <span className="text-sm">Pickup</span>
                            </div>
                        </div>
                            
                        </div>
                    <div className="border border-gray-100"></div>
                    {/* Buttons */}
                    <div className="flex justify-end gap-2">
                        <button 
                            onClick={() => setOpenModalPackage(false)} 
                            className="px-4 py-2 rounded-xl border"
                            >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSubmit} 
                            disabled={loading}  
                            className={`px-4 py-2 text-white rounded-xl ${
                                loading 
                                ? "bg-gray-400 cursor-not-allowed" 
                                : isFormValid 
                                ? "bg-[#751423]"
                                : "bg-[#75142399]"
                            }`}
                            >
                            {loading 
                                ? "Creating Package..." 
                                : mode === "create" 
                                ? "Create Package" 
                                : "Update Package"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreatePackageModal;



















{/* <div 
    className="flex border border-gray-100 items-center gap-1 cursor-pointer p-2"
    onClick={() => toggleDeliveryOption("pickUp")}
    >
    <Image
    src={selectedOptions.pickUp ? "/images/check.png" : "/images/unchecked.png"}
    alt="check"
    width={16}
    height={16}
    />
    <span className="text-sm">Pickup</span>
    </div> */}

{/* <div className="flex flex-col gap-6">
    <div 
    className="flex flex-col border border-gray-100 items-start gap-1 cursor-pointer p-2"
    // onClick={() => toggleDeliveryOption("homeDelivery")}
    >
    <div className="flex items-center gap-2"
            onClick={() => setOpenHomeDeliveryOption(!openHomeDeliveryOption)}
            >
            <Image
            src={selectedOptions.homeDelivery ? "/images/check.png" : "/images/unchecked.png"}
            alt="check"
            width={16}
            height={16}
            />
        <span className="text-sm">Home Delivery</span>
        </div>
        {openHomeDeliveryOption && (
            <div className="flex flex-col gap-2 pl-5">
                <div
                    className="flex border border-gray-100 items-center gap-1 cursor-pointer p-2"    
                >
                     <Image
                    src={selectedOptions.homeDelivery ? "/images/check.png" : "/images/unchecked.png"}
                    alt="check"
                    width={16}
                    height={16}
                    />
                    <span className="text-sm">Platform Delivery</span>
                    <span className="text-sm">We handle delivery for you</span>
                </div>
                <div
                    className="flex border border-gray-100 items-center gap-1 cursor-pointer p-2"    
                >
                     <Image
                        src={selectedOptions.homeDelivery ? "/images/check.png" : "/images/unchecked.png"}
                        alt="check"
                        width={16}
                        height={16}
                    />
                    <span className="text-sm">Self-Managed</span>
                    <span className="text-sm">You handle delivery yourself.</span>
                </div>
            </div>
        )}
    </div> */}
    // <div 




















// "use strict";

// import { Package } from "@/app/interface/Group";
// import axiosInstance from "@/lib/axiosInstance";
// import Image from "next/image";
// import { useState } from "react";

// interface PackageFormData {
//     groupId?: string | number;
//     packageTitle?: string;
//     packageDescription?: string;
//     packagePrice?: string | number;
//     packageQuantity?: string | number;
//     packageDelivery?: string[];
//     packageImgUrls?: (string | File)[]; 
// }

// type FormErrors = Partial<Record<keyof PackageFormData, string>>;

// interface CreatePackageModalProps {
//     setOpenModalPackage: React.Dispatch<React.SetStateAction<boolean>>;
//     mode: "create" | "update";
//     packageData?: Package | null;
//     groudId: string | number;
// }

// const CreatePackageModal: React.FC<CreatePackageModalProps> = ({ groudId, setOpenModalPackage, mode, packageData }) => {
//     const [errors, setErrors] = useState<FormErrors>({});
//     const [touched, setTouched] = useState<FormErrors>({});
//     const [formData, setFormData] = useState<PackageFormData>({
//         groupId: groudId,
//         packageTitle: packageData?.packageTitle || "",
//         packageDescription: packageData?.packageDescription || "",
//         packagePrice: packageData?.packagePrice || "",
//         packageQuantity: packageData?.packageQuantity || "",
//         packageDelivery: [], 
//         packageImgUrls: [],  
//     });

//     const [selectedOptions, setSelectedOptions] = useState<{ homeDelivery: boolean; pickUp: boolean }>({
//         homeDelivery: false,
//         pickUp: false,
//     });

//     const toggleDeliveryOption = (option: "homeDelivery" | "pickUp") => {
//         setFormData((prev) => ({
//             ...prev,
//             packageDelivery: prev.packageDelivery?.includes(option)
//                 ? prev.packageDelivery.filter((item) => item !== option)
//                 : [...(prev.packageDelivery || []), option],
//         }));
    
//         setSelectedOptions((prev) => ({
//             ...prev,
//             [option]: !prev[option],
//         }));
//     };

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const { id, value } = e.target;
        
//         setFormData((prev) => ({
//             ...prev,
//             [id as keyof PackageFormData]: value, 
//         }));

//         if (value.trim() !== "") {
//             setErrors((prev) => ({
//                 ...prev,
//                 [id as keyof PackageFormData]: "",
//             }));
//         }
//     };

//     const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const { id, value } = e.target;

//         setTouched((prev) => ({
//             ...prev,
//             [id as keyof PackageFormData]: true,
//         }));

//         if (mode === "create" && !value.trim()) {
//             setErrors((prev) => ({
//                 ...prev,
//                 [id as keyof PackageFormData]: `${id.charAt(0).toUpperCase() + id.slice(1)} is required`,
//             }));
//         }
//     };

//     const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const files = e.target.files;
//         if (!files) return;
    
//         const newFiles = Array.from(files);
//         const totalFiles = (formData.packageImgUrls?.length || 0) + newFiles.length; // ✅ Safe check
    
//         if (totalFiles > 4) {
//             alert("You can only upload up to 4 images.");
//             return;
//         }
    
//         setFormData((prev) => ({
//             ...prev,
//             packageImgUrls: [...(prev.packageImgUrls || []), ...newFiles], // ✅ Always an array
//         }));
//     };
    
//     const removeImage = (index: number) => {
//         setFormData((prev) => ({
//             ...prev,
//             packageImgUrls: prev.packageImgUrls?.filter((_, i) => i !== index) || [],
//         }));
//     };

//     const isFormValid =
//     mode === "update" ||
//     (formData.packageTitle?.trim() &&
//      formData.packageDescription?.trim() &&
//      formData.packagePrice?.toString().trim() &&
//      Object.values(errors).every((err) => err === ""));

//      const handleSubmit = async () => {
//         if (!isFormValid) return;
    
//         const formDataToSend = new FormData();
//         formDataToSend.append("groupId", formData.groupId?.toString() || "");
//         formDataToSend.append("packageTitle", formData.packageTitle || "");
//         formDataToSend.append("packageDescription", formData.packageDescription || "");
//         formDataToSend.append("packagePrice", formData.packagePrice?.toString() || "");
//         formDataToSend.append("packageQuantity", formData.packageQuantity?.toString() || "");
    
//         const packageDelivery = formData.packageDelivery?.join(",") || "";
//         formDataToSend.append("packageDelivery", packageDelivery);
    
//         if (formData.packageImgUrls && formData.packageImgUrls.length > 0) {
//             formData.packageImgUrls.forEach((file) => {
//                 formDataToSend.append("packageImgUrls", file); 
//             });
//         }
    
//         for (const pair of formDataToSend.entries()) {
//             console.log(pair[0], pair[1]);
//         }
    
//         try {
//             const response = await axiosInstance.post("/add-package", formDataToSend, {
//                 headers: { "Content-Type": "multipart/form-data" },
//             });
//             console.log("Response from backend:", response.data);
//         } catch (error) {
//             console.error("Error submitting form:", error);
//         }
//     };
    
    
//     return (
//         <div className="w-[680px] max-h-[90vh] bg-white rounded-2xl shadow-lg p-5 flex flex-col gap-3 overflow-y-auto">
//             {/* Header */}
//             <div className="flex justify-between items-center">
//                 <p className="font-bold text-lg text-[#111827]">
//                     {mode === "create" ? "Create Package" : "Update Package"}
//                 </p>
//                 <Image 
//                     src="/images/cancel.png" 
//                     alt="cancel" 
//                     width={14} 
//                     height={14} 
//                     className="cursor-pointer" 
//                     onClick={() => setOpenModalPackage(false)} 
//                 />
//             </div>
            
//             <div className="border border-gray-100"></div>
    
//             {/* Image Upload Section */}
//             <div className="flex flex-wrap gap-4">
//                 {formData.packageImgUrls?.map((img, index) => (
//                     <div key={index} className="relative">
//                         <Image 
//                             src={img instanceof File ? URL.createObjectURL(img) : img} 
//                             alt="package"
//                             width={100}
//                             height={100}
//                             className="rounded-[10px] border w-[100px] h-[100px]"
//                         />
//                         <button 
//                             onClick={() => removeImage(index)} 
//                             className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
//                         >
//                             X
//                         </button>
//                     </div>
//                 ))}
    
//                 {/* Image Upload Button */}
//                 <label className="w-[100px] h-[100px] flex items-center justify-center border border-gray-300 rounded-[10px] cursor-pointer">
//                     <input 
//                         type="file" 
//                         accept="image/*" 
//                         multiple 
//                         className="hidden" 
//                         onChange={handleImageUpload} 
//                     />
//                     <span className="text-3xl text-gray-400">+</span>
//                 </label>
//             </div>
    
//             {/* Form Inputs */}
//             <div className="flex flex-col gap-3">
//                 <input 
//                     type="text" 
//                     id="packageTitle" 
//                     value={formData.packageTitle} 
//                     onChange={handleChange} 
//                     placeholder="Add package title" 
//                     className="w-full h-14 p-2 rounded-xl border" 
//                 />
//                 <textarea 
//                     id="packageDescription" 
//                     value={formData.packageDescription} 
//                     onChange={handleChange} 
//                     placeholder="Add package description" 
//                     className="w-full h-[120px] p-2 rounded-xl border" 
//                 />
//                 <input 
//                     type="number" 
//                     id="packagePrice" 
//                     value={formData.packagePrice} 
//                     onChange={handleChange} 
//                     placeholder="Amount" 
//                     className="w-full h-14 p-2 rounded-xl border" 
//                 />
//                 <input 
//                     type="text" 
//                     id="packageQuantity" 
//                     value={formData.packageQuantity} 
//                     onChange={handleChange} 
//                     placeholder="Quantity (optional)" 
//                     className="w-full h-14 p-2 rounded-xl border" 
//                 />
//             </div>
    
//             {/* Delivery Options */}
//             <div className="flex flex-col gap-3">
//                 <p className="font-semibold text-base text-[#111827]">How would you like to handle delivery?</p>
//                 <p className="text-sm text-[#718096]">
//                     With Event Parcel platform, you can manage and track delivery easily.
//                 </p>
//                 <p className="text-sm font-semibold text-[#111827]">Delivery Options</p>
//                 <div className="flex gap-6">
//                     <div 
//                         className="flex items-center gap-1 cursor-pointer"
//                         onClick={() => toggleDeliveryOption("homeDelivery")}
//                     >
//                         <Image
//                             src={selectedOptions.homeDelivery ? "/images/check.png" : "/images/unchecked.png"}
//                             alt="check"
//                             width={16}
//                             height={16}
//                         />
//                         <span className="text-sm">Home Delivery</span>
//                     </div>
//                     <div 
//                         className="flex items-center gap-1 cursor-pointer"
//                         onClick={() => toggleDeliveryOption("pickUp")}
//                     >
//                         <Image
//                             src={selectedOptions.pickUp ? "/images/check.png" : "/images/unchecked.png"}
//                             alt="check"
//                             width={16}
//                             height={16}
//                         />
//                         <span className="text-sm">Pickup</span>
//                     </div>
//                 </div>
//             </div>
    
//             <div className="border border-gray-100"></div>
    
//             {/* Buttons */}
//             <div className="flex justify-end gap-2">
//                 <button 
//                     onClick={() => setOpenModalPackage(false)} 
//                     className="px-4 py-2 rounded-xl border"
//                 >
//                     Cancel
//                 </button>
//                 <button 
//                     onClick={handleSubmit} 
//                     className="px-4 py-2 text-white rounded-xl bg-[#751423]"
//                 >
//                     {mode === "create" ? "Create Package" : "Update Package"}
//                 </button>
//             </div>
//         </div>
//     );
    
// }

// export default CreatePackageModal;

