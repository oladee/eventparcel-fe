"use strict";

import { Package } from "@/app/interface/Group";
import axiosInstance from "@/lib/axiosInstance";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { boxOptions } from "@/data/boxOption";
import { BiChevronDown } from "react-icons/bi";
import { cn } from "@/utils/cn";


interface PackageFormData {
    groupId?: string | number;
    eventId?: string | null;
    groupCurrency?: string;
    packageTitle?: string;
    packageDescription?: string;
    packagePriceCurrency?: string;
    packagePrice?: string | number;
    packageSize?:string | null;
    packageQuantity?: string | number;
    packageDelivery?: string[];
    packageImgUrls?: (string | File)[]; 
    publicIdsToReplace?: string[];
}

type FormErrors = Partial<Record<keyof PackageFormData, string>>;
type BoxOption = (typeof boxOptions)[number];


interface CreatePackageModalProps {
    setOpenModalPackage: React.Dispatch<React.SetStateAction<boolean>>;
    mode: "create" | "update";
    packageData?: Package | null;
    groudId: string | number | undefined;
    groupCurrency: string | undefined;
}

const CreatePackageModal: React.FC<CreatePackageModalProps> = ({ groudId, groupCurrency, setOpenModalPackage, mode, packageData }) => {
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [, setError] = useState(false);
    const [openHomeDeliveryOption, setOpenHomeDeliveryOption] = useState(false);
    const router = useRouter();
    const [eventId, setEventId] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<BoxOption | null>(null);
    const [formData, setFormData] = useState<PackageFormData>({
        groupId: groudId,
        eventId: eventId,
        packageTitle: packageData?.packageTitle || "",
        packageDescription: packageData?.packageDescription || "",
        packagePriceCurrency: groupCurrency,
        packagePrice: packageData?.packagePrice || "",
        packageQuantity: packageData?.packageQuantity || "",
        packageSize: packageData?.packageSize || "",
        packageDelivery: typeof packageData?.packageDelivery === "string"
        ? (packageData.packageDelivery as string).split(",").map((item) => item.trim())
        : packageData?.packageDelivery ?? [],
        packageImgUrls: Array.isArray(packageData?.packageImgUrls)
        ? packageData.packageImgUrls
        : packageData?.packageImgUrls ? [packageData.packageImgUrls] : [],
        publicIdsToReplace: [],
    });

    console.log("pack",packageData)

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedEventId = localStorage.getItem("eventId");
            
            if (!storedEventId) {
                router.replace("/new-group");
                return;
            }
    
            setEventId(storedEventId);
        }
    }, [router]);
    
    useEffect(() => {
        if (eventId) {
            setFormData((prev) => ({
                ...prev,
                eventId: eventId,  
            }));
        }
    }, [eventId]);
    
    
    const validateField = (field: keyof PackageFormData, value: string) => {
        if (field === "packageTitle") {
            if (!value.trim()) return "Title is required.";
            if (value.length < 2 || value.length > 60) return "Title must be between 2 and 60 characters.";
        }
    
        if (field === "packageDescription") {
            if (value && value.length > 150) return "Description cannot exceed 150 characters.";
        }
    
        if (field === "packagePrice") {
            if (!value.trim()) return "Price is required.";
            if (isNaN(Number(value)) || Number(value) <= 0) return "Price must be a valid positive number.";
        }

        if (field === "packageSize") {
            if (!value.trim()) return "Package size is required.";
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
        const packageOptions = formData.packageDelivery || [];
    
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
            const updatedSelections = new Set(prev.packageDelivery || []);
    
            if (updatedSelections.has(option)) {
                // If the option is already selected, deselect it
                updatedSelections.delete(option);
            } else {
                // If it's a "PickUp", just add it without clearing home delivery options
                if (option === "pickUp") {
                    updatedSelections.add("pickUp");
                } else {
                    // If a home delivery option is selected, remove the other home delivery options
                    updatedSelections.delete("homeDelivery:platformDelivery");
                    updatedSelections.delete("homeDelivery:selfManaged");
    
                    updatedSelections.add(option);
                }
            }
    
            return { ...prev, packageDelivery: Array.from(updatedSelections) };
        });
    
        // Update UI state for toggling
        if (option === "pickUp") {
            setSelectedOptions({
                pickUp: !selectedOptions.pickUp, // Toggle "PickUp" on click
                homeDelivery: selectedOptions.homeDelivery
            });
            setHomeDeliverySelectedOptions({ platformDelivery: false, selfManaged: false });
        } else {
            setSelectedOptions({
                pickUp: selectedOptions.pickUp, // Keep "PickUp" as is
                homeDelivery: !selectedOptions.homeDelivery // Toggle "Home Delivery" on click
            });
            setHomeDeliverySelectedOptions({
                platformDelivery: option === "homeDelivery:platformDelivery",
                selfManaged: option === "homeDelivery:selfManaged",
            });
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

    const handleSelect = (option: any) => {
        setSelected(option);
        setFormData(prev => ({
            ...prev,
            packageSize: option.value ?? null
        }));
        setIsOpen(false);
    };
    
    
    const removeImage = (index: number) => {
        setFormData((prev) => {
            const updatedImages = [...(prev.packageImgUrls || [])];
            const removedImage = updatedImages[index];
            
            // If we're in update mode and the image is a string (existing URL),
            // add its public ID to the publicIdsToReplace array
            if (mode === "update" && typeof removedImage === 'string') {
                // Extract public ID from URL (assuming Cloudinary URL format)
                const publicIdMatch = removedImage.match(/upload\/(?:v\d+\/)?([^\.]+)/);
                if (publicIdMatch && publicIdMatch[1]) {
                    const publicId = publicIdMatch[1];
                    return {
                        ...prev,
                        packageImgUrls: updatedImages.filter((_, i) => i !== index),
                        publicIdsToReplace: [...(prev.publicIdsToReplace || []), publicId]
                    };
                }
            }
            
            return {
                ...prev,
                packageImgUrls: updatedImages.filter((_, i) => i !== index)
            };
        });
    };

    const isFormValid =
    mode === "update" ||
    (formData.packageTitle?.trim() &&
    formData.packageSize?.trim() &&
    formData.packagePrice?.toString().trim() &&
     Object.values(errors).every((err) => err === ""));

    const handleSubmit = async () => {
        if (!isFormValid) return;
    
        const formDataToSend = new FormData();
        
        // Mode-specific fields
        if (mode === "create") {
            formDataToSend.append("groupId", formData.groupId?.toString() || "");
            formDataToSend.append("eventId", formData.eventId?.toString() || "");
        }
    
        // Common fields
        formDataToSend.append("packageTitle", formData.packageTitle || "");
        if (formData.packageDescription) {
            formDataToSend.append("packageDescription", formData.packageDescription || "");
        }
        formDataToSend.append("packagePriceCurrency", formData.packagePriceCurrency || "");
        formDataToSend.append("packageSize", formData.packageSize || "");
        formDataToSend.append("packagePrice", formData.packagePrice?.toString() || "");
        if (formData.packageQuantity) {
            formDataToSend.append("packageQuantity", formData.packageQuantity?.toString() || "");
        }
    
        // Package delivery
        const packageDelivery = formData.packageDelivery?.join(",") || "";
        formDataToSend.append("packageDelivery", packageDelivery);
    
        // Image handling
        if (formData.packageImgUrls && formData.packageImgUrls.length > 0) {
            // Separate files and URLs
            const imageFiles: File[] = [];
            const imageUrls: string[] = [];
            
            formData.packageImgUrls.forEach((item) => {
                if (item instanceof File) {
                    imageFiles.push(item);
                } else if (typeof item === 'string') {
                    imageUrls.push(item);
                }
            });
    
            // For create mode: combine files and URLs into packageImgUrls
            if (mode === "create") {
                imageUrls.forEach(url => formDataToSend.append("packageImgUrls", url));
                imageFiles.forEach(file => formDataToSend.append("packageImgUrls", file));
            }
            
            // For update mode: handle separately
            if (mode === "update") {
                // Only send new image files
                imageFiles.forEach(file => formDataToSend.append("packageImgUrls", file));
              
                // Send public IDs of removed images
                if (formData.publicIdsToReplace?.length) {
                    formDataToSend.append(
                      "publicIdsToReplace", // Key
                      formData.publicIdsToReplace.join(",") // Comma-separated string
                    );
                  }
              }              
        }

    
        for (const [key, value] of formDataToSend.entries()) {
            console.log(`${key}:`, value instanceof File ? `File(${value.name})` : value);
        }
    
        try {
            setLoading(true);
            // let response;
            
            if (mode === "create") {
                 await axiosInstance.post("/add-package", formDataToSend, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                
                toast.success("Package created successfully", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                });
            } else if (mode === "update" && packageData?._id) {
                 await axiosInstance.put(`/update-package/${packageData._id}`, formDataToSend, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
    
                toast.success("Package updated successfully", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                });
            }
    
            window.location.reload();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred.";
                setError(errorMessage);
            
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
        } finally {
            setLoading(false);
        }
    };
    
    const price = Number(formData?.packagePrice) || 0;

    const whatHostReceives =
      groupCurrency === "NGN"
        ? price * 0.93 // deduct 7%
        : price * 0.915; // deduct 8.5%
    

    
    return (
        <>
            <ToastContainer aria-live="polite" />
            <div className="w-[94vw] lg:w-[680px] max-h-[80vh] lg:max-h-[97vh] bg-[#FFFFFF] rounded-2xl shadow-lg px-5  md:p-5 flex flex-col overflow-y-auto">                {/* Header */}
                <div className="sticky top-0 z-10 flex justify-between items-center py-4 bg-[#FFFFFF]">
                    <div className="flex flex-col items-start">
                        <div id="header" className="font-bold text-lg text-[#111827]">
                            {mode === "create" ? "Create Package" : "Update Package"}
                        </div>
                        <p id="desc" className="font-general font-medium text-lg text-[#718096]">How do you want to sell to this group</p>
                    </div>
                    <Image 
                        src="/images/cancel.png" 
                        alt="cancel" 
                        width={14} 
                        height={14} 
                        className="cursor-pointer absolute top-4 right-0" 
                        onClick={() => setOpenModalPackage(false)} 
                    />
                </div>
                <div className="border border-gray-100"></div>
                
        
                {/* Image Upload Section */}
                <div className="flex-grow">

                <div className="flex flex-wrap gap-2 py-2">
                    <div className="flex gap-1">

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
                                className="rounded-[10px] border w-[80px] h-[80px] md:w-[100px] md:h-[100px]"
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
                                    className="rounded-[10px] border w-[80px] h-[80px] md:w-[100px] md:h-[100px]"
                                />
                                <button 
                                    onClick={() => removeImage(index + 1)} 
                                    className="absolute top-0 right-0 bg-red-500 text-white h-5 w-5 flex justify-center items-center text-xs rounded-full p-1"
                                    >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Image Upload Button */}
                    {(formData?.packageImgUrls?.length ?? 0) < 4 && (
                        <label className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] flex items-center justify-center border border-dashed rounded-[10px] cursor-pointer">
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
                    )}
                    </div>

                </div>
        
                {/* Form Inputs */}
                <div className="flex flex-col gap-3">
                    <input 
                        type="text" 
                        id="packageTitle" 
                        value={formData.packageTitle} 
                        onChange={handleChange} 
                        placeholder="Add package title" 
                        className="w-full h-10 p-2 outline-primary rounded-xl bg-[#FAFAFA]" 
                        />
                    {errors.packageTitle && <p className="text-red-500 text-sm mt-1">{errors.packageTitle}</p>}

                    <textarea 
                        id="packageDescription" 
                        value={formData.packageDescription} 
                        onChange={handleChange} 
                        placeholder="Add package description" 
                        className="w-full h-[100px] p-2 rounded-xl outline-primary bg-[#FAFAFA]" 
                        />
                    {errors.packageDescription && <p className="text-red-500 text-sm mt-1">{errors.packageDescription}</p>}
                    <div className="flex flex-col items-start md:items-center gap-3">
                    {/* Price Input */}
                    <div className="w-full flex items-center rounded-[10px] px-4 py-2 bg-[#FAFAFA] flex-1 
                        focus-within:outline focus-within:outline-primary focus-within:outline-2">
                        <span className="font-general font-bold text-[#111827]">{groupCurrency === "NGN" ? "₦" : "$"}</span>

                        {/* Price Input */}
                        <input
                            type="number"
                            id="packagePrice"
                            value={formData.packagePrice}
                            onChange={handleChange}
                            placeholder="Enter amount"
                            className="w-full h-5 p-2 outline-none bg-transparent text-gray-900 placeholder-gray-400"
                        />
                    </div>

                    <div>
                        <p className="font-medium text-sm text-[#718096]">What you will receive: <span className="text-[#751423]">{groupCurrency === "NGN" ? "₦" : "$"}{whatHostReceives}</span></p>
                    </div>

                    <div className="w-full h-[60px] bg-[#FFF7F2] px-3 py-2 rounded-[12px] my-2">
                        <span className="font-general font-medium text-[13px] text-[#718096]">
                            <span className="font-semibold text-[#111827] h-[36px]">P.S</span>: {`${groupCurrency === "NGN" ? "7" : "8.5"}% fee will be deducted from the package price as service fee`}</span>
                    </div>

                    {/* Quantity Input */}
                    <div className="flex-1 w-full">
                        <input 
                            type="number" 
                            id="packageQuantity" 
                            value={formData.packageQuantity} 
                            onChange={handleChange} 
                            placeholder="Quantity (optional)" 
                            className="w-full h-10 p-2 rounded-[10px] outline-primary border-gray-300 bg-[#FAFAFA]" 
                            />
                    </div>
                </div>

                </div>
        
                {/* Delivery Options */}
                <div className="flex flex-col gap-3 mt-2">
                    {/* Delivery Options Section */}
                    <div className="flex flex-col gap-3">
                        <p id="deliveryHeader" className="font-semibold text-base text-[#111827]">How would you like to handle delivery?</p>
                        <p id="deliveryDesc" className="text-sm text-[#718096]">
                            With Event Parcel platform, you can manage and track delivery easily.
                        </p>

                        {/* Main Delivery Options */}
                        <div className="flex flex-col gap-1">
                            {/* Home Delivery - Expandable */}
                            <div 
                                className="flex flex-col border border-gray-100 rounded-[5px] items-start gap-1 cursor-pointer p-2"
                                onClick={() => setOpenHomeDeliveryOption(!openHomeDeliveryOption)}
                            >
                                <div className="flex items-center gap-2">
                                    <Image
                                        src={(homeDeliverySelectedOptions.platformDelivery || homeDeliverySelectedOptions.selfManaged) 
                                            ? "/images/check.png" 
                                            : "/images/unchecked.png"}
                                            alt="check"
                                        width={20}
                                        height={20}
                                        id="HomeDelivery"
                                    />
                                    <span className="font-general font-medium text-base text-[#111827]">Home Delivery</span>
                                </div>

                                {/* Sub-options */}
                                {openHomeDeliveryOption && (
                                    <div className="flex w-[90%] md:w-[95%] ml-6 flex-col rounded-[5px] border border-gray-100 ">
                                        <div
                                            className="flex flex-col items-start gap-1 cursor-pointer p-2"
                                            onClick={() => toggleDeliveryOption("homeDelivery:platformDelivery")}
                                            >
                                            <div className="flex items-center gap-2">
                                                <Image
                                                    src={homeDeliverySelectedOptions.platformDelivery ? "/images/check.png" : "/images/unchecked.png"}
                                                    alt="check"
                                                    width={20}
                                                    height={20}
                                                    id="platformDelivery"
                                                    />
                                                <span className="font-general font-medium text-base text-[#111827]">Platform Delivery</span>
                                            </div>
                                            <span id="platformDeliveryDesc" className="pl-6 font-general font-medium text-sm text-[#718096]">We handle delivery for you</span>
                                        </div>

                                        <div
                                            className="flex flex-col items-start gap-1 cursor-pointer p-2"
                                            onClick={() => toggleDeliveryOption("homeDelivery:selfManaged")}
                                            >
                                            <div className="flex items-center gap-2">
                                                <Image
                                                    src={homeDeliverySelectedOptions.selfManaged ? "/images/check.png" : "/images/unchecked.png"}
                                                    alt="check"
                                                    width={20}
                                                    height={20}
                                                    id="selfManaged"
                                                    />
                                                <span className="font-general font-medium text-base text-[#111827]">Self-Managed</span>
                                            </div>
                                            <span id="selfManagedDesc" className="pl-6 font-general font-medium text-sm text-[#718096]">You handle delivery yourself</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <div
                                className="flex border border-gray-100 items-center rounded-[5px] gap-1 cursor-pointer p-2"
                                onClick={() => toggleDeliveryOption("pickUp")}
                                >
                                <Image
                                    src={selectedOptions.pickUp ? "/images/check.png" : "/images/unchecked.png"}
                                    alt="check"
                                    width={20}
                                    height={20}
                                    id="pickUp"
                                    />
                                <span className="font-general font-medium text-base text-[#111827]">Pickup</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative w-full max-w-md flex flex-col gap-3">
                        <p className="font-semibold text-base text-[#111827]">Package Size</p>
                        <span className="text-sm text-[#718096]">To efficiently manage you deliveries, please select the box size your package would fit.</span>
                        <div
                            className="h-10 flex items-center justify-between px-4 py-3 rounded-[10px] cursor-pointer bg-[#FAFAFA]"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <span className="text-gray-400 text-sm">
                            {formData?.packageSize || "Select box size"}
                            </span>
                            <BiChevronDown className="w-4 h-4 text-gray-500" />
                        </div>

                        {isOpen && (
                            <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-[10px] shadow-lg">
                            {boxOptions.map((option) => (
                                <div
                                key={option.value}
                                onClick={() => handleSelect(option)}
                                className={cn(
                                    "flex items-start gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer"
                                )}
                                >
                                <div>
                                    <Image 
                                        src={option.icon}
                                        alt=""
                                        width={55}
                                        height={54}
                                        style={{width:"55px", height:"54px", objectFit:"cover"}}
                                    />
                                </div>
                                <div className="w-[200px]">
                                    <p className="font-semibold text-sm text-[#111827]">
                                    {option.label}
                                    </p>
                                    <p className="text-xs text-gray-500">{option.description}</p>
                                </div>
                                </div>
                            ))}
                            </div>
                        )}
                        {selected?.description && (
                            <div>
                                <span className="text-sm text-[#718096]">{selected?.description}</span>
                            </div>
                        )}
                          <div className="w-full h-[60px] bg-[#FFF7F2] px-3 py-2 rounded-[12px] mt-2">
                            <span className="font-general font-medium text-[13px] text-[#718096]">
                                <span className="font-semibold text-[#111827] h-[36px]">P.S</span>: Kindly select the best estimate as wrong selection may lead to additional cost for the host.</span>
                        </div>
                        </div>
                    {/* Buttons */}
                    <div className="mt-auto sticky bottom-0 bg-white pt-4 pb-3 -mx-5 px-5 border-t border-gray-100">
                        <div className="flex justify-center md:justify-end gap-2">
                            <button 
                                id="cancel"
                                onClick={() => setOpenModalPackage(false)} 
                                className="w-[147px] h-[48px] px-4 py-2 rounded-xl border"
                            >
                                Cancel
                            </button>
                            <button 
                                id="createPackage"
                                onClick={handleSubmit} 
                                disabled={loading}  
                                className={`w-[147px] h-[48px] px-4 py-2 text-white whitespace-nowrap rounded-xl ${
                                    loading 
                                    ? "bg-gray-400 cursor-not-allowed" 
                                    : isFormValid 
                                    ? "bg-[#751423]"
                                    : "bg-[#75142399]"
                                }`}
                            >
                                {loading 
                                    ? (mode === "create" ? "Creating..." : "Updating...") 
                                    : (mode === "create" ? "Create Package" : "Update Package")
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </>
    );
};

export default CreatePackageModal;
