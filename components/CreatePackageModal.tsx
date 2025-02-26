"use strict";

import { Package } from "@/app/interface/Group";
import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";
import { useState } from "react";

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
    // const [, setTouched] = useState<FormErrors>({});
    const [formData, setFormData] = useState<PackageFormData>({
        groupId: groudId,
        packageTitle: packageData?.packageTitle || "",
        packageDescription: packageData?.packageDescription || "",
        packagePrice: packageData?.packagePrice || "",
        packageQuantity: packageData?.packageQuantity || "",
        packageDelivery: [], 
        packageImgUrls: [],  
    });

    const [selectedOptions, setSelectedOptions] = useState<{ homeDelivery: boolean; pickUp: boolean }>({
        homeDelivery: false,
        pickUp: false,
    });

    const toggleDeliveryOption = (option: "homeDelivery" | "pickUp") => {
        setFormData((prev) => ({
            ...prev,
            packageDelivery: prev.packageDelivery?.includes(option)
                ? prev.packageDelivery.filter((item) => item !== option)
                : [...(prev.packageDelivery || []), option],
        }));
    
        setSelectedOptions((prev) => ({
            ...prev,
            [option]: !prev[option],
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        
        setFormData((prev) => ({
            ...prev,
            [id as keyof PackageFormData]: value, 
        }));

        if (value.trim() !== "") {
            setErrors((prev) => ({
                ...prev,
                [id as keyof PackageFormData]: "",
            }));
        }
    };

    // const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    //     const { id, value } = e.target;

    //     setTouched((prev) => ({
    //         ...prev,
    //         [id as keyof PackageFormData]: true,
    //     }));

    //     if (mode === "create" && !value.trim()) {
    //         setErrors((prev) => ({
    //             ...prev,
    //             [id as keyof PackageFormData]: `${id.charAt(0).toUpperCase() + id.slice(1)} is required`,
    //         }));
    //     }
    // };

    const validateField = (id: string, value: string) => {
        if (id === "groupName") {
          if (!value.trim()) return "Group name is required";
          if (value.length < 5) return "Group name must be at least 5 characters";
          if (value.length > 60) return "Group name must not exceed 60 characters";
        }
        if (id === "groupDescription") {
          if (value.length > 150) return "Description must not exceed 150 characters";
        }
        return "";
      };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
    
        const newFiles = Array.from(files);
        const totalFiles = (formData.packageImgUrls?.length || 0) + newFiles.length; 
    
        if (totalFiles > 4) {
            alert("You can only upload up to 4 images.");
            return;
        }
    
        setFormData((prev) => ({
            ...prev,
            packageImgUrls: [...(prev.packageImgUrls || []), ...newFiles],
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
     formData.packageDescription?.trim() &&
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
                formDataToSend.append("packageImgUrls", file);
            });
        }
    
        try {
            setLoading(true)
            let response;
            if (mode === "create") {
                response = await axiosInstance.post("/add-package", formDataToSend, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                window.location.reload()
            } else if (mode === "update" && packageData?._id) {
                // formDataToSend.append("packageId", packageData._id.toString());
                    console.log("here", packageData._id)
                response = await axiosInstance.put(`/update-package/${packageData._id}`, formDataToSend, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                window.location.reload()

            }
    
            console.log("Response from backend:", response?.data);
        } catch (error) {
            console.error("Error submitting form:", error);
        }
        finally {
            setLoading(true)}
    };
    
    
    
    
    return (
        <div className="w-[680px] max-h-[98vh] bg-white rounded-2xl shadow-lg p-5 flex flex-col gap-1.5 overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center">
                <p className="font-bold text-lg text-[#111827]">
                    {mode === "create" ? "Create Package" : "Update Package"}
                </p>
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
            <div className="flex flex-wrap gap-4">
                {formData.packageImgUrls?.map((img, index) => (
                    <div key={index} className="relative">
                        <Image 
                            src={img instanceof File ? URL.createObjectURL(img) : img} 
                            alt="package"
                            width={100}
                            height={100}
                            className="rounded-[10px] border w-[100px] h-[100px]"
                        />
                        <button 
                            onClick={() => removeImage(index)} 
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                        >
                            X
                        </button>
                    </div>
                ))}
    
                {/* Image Upload Button */}
                <label className="w-[100px] h-[100px] flex items-center justify-center border border-gray-300 rounded-[10px] cursor-pointer">
                    <input 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        className="hidden" 
                        onChange={handleImageUpload} 
                    />
                    <span className="text-3xl text-gray-400">+</span>
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
                    className="w-full h-14 p-2 rounded-xl border" 
                />
                <textarea 
                    id="packageDescription" 
                    value={formData.packageDescription} 
                    onChange={handleChange} 
                    placeholder="Add package description" 
                    className="w-full h-[120px] p-2 rounded-xl border" 
                />
                <div className="border border-gray-200 px-2 rounded-[10px] flex items-center">
                <span className="text-[20px]">₦</span>
                <input 
                    type="number" 
                    id="packagePrice" 
                    value={formData.packagePrice} 
                    onChange={handleChange} 
                    placeholder="Amount" 
                    className="w-full h-14 p-2" 
                    />
                </div>
                <input 
                    type="text" 
                    id="packageQuantity" 
                    value={formData.packageQuantity} 
                    onChange={handleChange} 
                    placeholder="Quantity (optional)" 
                    className="w-full h-14 p-2 rounded-xl border" 
                />
            </div>
    
            {/* Delivery Options */}
            <div className="flex flex-col gap-3">
                <p className="font-semibold text-base text-[#111827]">How would you like to handle delivery?</p>
                <p className="text-sm text-[#718096]">
                    With Event Parcel platform, you can manage and track delivery easily.
                </p>
                <p className="text-sm font-semibold text-[#111827]">Delivery Options</p>
                <div className="flex gap-6">
                    <div 
                        className="flex items-center gap-1 cursor-pointer"
                        onClick={() => toggleDeliveryOption("homeDelivery")}
                    >
                        <Image
                            src={selectedOptions.homeDelivery ? "/images/check.png" : "/images/unchecked.png"}
                            alt="check"
                            width={16}
                            height={16}
                        />
                        <span className="text-sm">Home Delivery</span>
                    </div>
                    <div 
                        className="flex items-center gap-1 cursor-pointer"
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
                {/* <button 
                    onClick={handleSubmit} 
                    className="px-4 py-2 text-white rounded-xl bg-[#751423]"
                >
                    {mode === "create" ? "Create Package" : "Update Package"}
                </button> */}
                <button
                className="px-4 py-2 text-white rounded-xl bg-[#751423]"
                onClick={handleSubmit}>
                        {loading ? "loading..." : "Create Package"}
                </button>
            </div>
        </div>
    );
    
}

export default CreatePackageModal;



























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

