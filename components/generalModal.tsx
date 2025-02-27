"use client"

// import { Group, Package } from "@/data/mockData"
import Image from "next/image"
import { useState } from "react";
import CreatePackageModal from "./CreatePackageModal";
import { Group, Package } from "@/app/interface/Group";
import axiosInstance from "@/lib/axiosInstance";
import axios from "axios";
import AddGroup from "./AddGroupCaller";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


type GeneralGroupProps = {
    group: Group;
    // setOpenModal: (open: boolean) => void;
}

const GeneralModal: React.FC<GeneralGroupProps>  = ({ group }) => {
    const [openModalPackage, setOpenModalPackage] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "update">("create");
    const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
    const [, setError] = useState(false);
    const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);



    const handleDelete = async () => {
        if (!group?._id) return;
    
        const confirmDelete = window.confirm("Are you sure you want to delete this group?");
        if (!confirmDelete) return;
    
        try {
            await axiosInstance.delete(`/delete-group/${group._id}`);
            
            toast.success(`Group deleted successfully `, {
                position: "top-right",
                autoClose: 3000, 
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            });

            setOpenModalPackage(false); 
            window.location.reload();
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
    };
};

    const handleDeletePackage = async () => {
        const packageId = selectedPackage?._id
        if (!packageId) return;
    
        const confirmDelete = window.confirm("Are you sure you want to delete this package?");
        if (!confirmDelete) return;
    
        try {
            await axiosInstance.delete(`/delete-package/${packageId}`);

            toast.success(`Package deleted successfully `, {
                position: "top-right",
                autoClose: 3000, 
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            });

            setOpenModalPackage(false); 
            window.location.reload();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred.";
                setError(errorMessage);
            
                // Show toast notification
                toast.error(errorMessage, {
                    position: "bottom-right",
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
            };
        };

        const handleAddGroupClick = () => {
            setIsAddGroupOpen(true);
        };
            
        
    return (
        <>
        <ToastContainer aria-live="polite" className="absolute "/>
        <div className="w-[320px]">
                <div className="w-[320px] h-auto space-y-6 bg-[#FFFFFF] pt-4 p-8 rounded-3xl">
                    <div className="flex items-center justify-between">
                        <span className="w-[76px] h-[22px] flex justify-center items-center px-10 py-2 rounded-[50px] font-general font-medium text-sm text-[#2B9EA0] border border-[#2B9EA0] bg-[#ebf3f3]">{group.groupPrivacy}</span>
                        <div className="flex justify-center items-center gap-2 cursor-pointer" onClick={() => {
                            handleAddGroupClick();
                            setSelectedGroup(group);
                            }}>
                            <Image 
                                src="/images/edit.png"
                                alt=""
                                width={16}
                                height={16}
                            />
                            <span className="font-general font-medium text-sm text-[#718096]">Edit</span>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-general font-semibold text-xl text-[#111827]">
                            {group.groupName}
                        </span>
                        <span className="font-general font-medium text-sm text-[#718096]">
                            {group.groupDescription}
                        </span>
                    </div>
                    <div className="flex flex-col gap-3">
                    {group.packages.length > 0 ? (
                        <div className="flex justify-between">
                            <p className="font-general font-semibold text-base text-[#111827]">Packages</p>
                            <div className="flex justify-center items-center gap-2 cursor-pointer"
                                  onClick={() => {
                                    setModalMode("create");
                                    setSelectedPackage(null);
                                    setOpenModalPackage(true)
                                }} 
                            >
                                <span className="font-general font-medium text-sm text-[#751423]">+</span>
                                <span className="font-general font-medium text-sm text-[#751423]">Add New</span>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p className="font-general mb-3 font-semibold text-base text-[#111827]">Packages</p>
                            <button 
                                onClick={() => {
                                    setModalMode("create");
                                    setSelectedPackage(null);
                                    setOpenModalPackage(true)
                                }} 
                                className="font-manrope font-extrabold text-xs py-3 px-20 flex justify-center items-center whitespace-nowrap rounded-[10px] border-[2px] border-[#751423] text-[#751423]"
                                >
                                Create Package
                            </button>
                        </div>
                    )}
    
                    {/* Scrollable Packages List */}
                    <div className="max-h-[165px] overflow-y-auto space-y-2 scrollbar-hide">
                        {group.packages.map((item, index) => (
                            <div key={index} className="flex justify-between items-center border border-gray-300 p-2 rounded-[12px]">
                                <div className="flex items-center gap-2">
                                    <Image 
                                        src={item.packageImgUrls && item.packageImgUrls.length > 0 ? item.packageImgUrls[0] : "/images/placeholder.png"} 
                                        alt="cloth"
                                        width={60}
                                        height={60}
                                        className="rounded-[5.29px] object-contain"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-general font-semibold leading-tight text-[#111827]">
                                            {item.packageTitle}
                                        </span>
                                        <p className="font-general font-medium text-xs text-[#718096]">₦{item.packagePrice}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center items-center gap-5">

                                <Image 
                                    src="/images/trash.png"
                                    alt=""
                                    width={12}
                                    height={12}
                                    onClick={() => {
                                        handleDeletePackage();
                                        setSelectedPackage(item); 
                                    }}
                                    className="cursor-pointer"
                                    />
                                <Image 
                                    src="/images/edit.png"
                                    alt="edit"
                                    width={12}  
                                    height={12} 
                                    className="cursor-pointer"
                                    onClick={() => {
                                        setModalMode("update");
                                        setSelectedPackage(item); 
                                        setOpenModalPackage(true);
                                    }}
                                    />
                                    </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-between">
                    <div className="flex items-center gap-1 cursor-pointer" onClick={handleDelete}>
                        <Image 
                            src="/images/trash.png"
                            alt="delete_package"
                            height={16}
                            width={16}
                            />
                        <span className="font-general font-medium text-sm text-[#DE4222]">Delete</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Image 
                              src="/images/copy.png"
                              alt="delete_package"
                              height={16}
                              width={16}
                        />
                        <span className="font-general font-medium text-sm text-[#718096]">Copy</span>
                    </div>
                </div>
                </div>
                {openModalPackage && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <CreatePackageModal
                            setOpenModalPackage={setOpenModalPackage}
                            mode={modalMode}
                            packageData={selectedPackage}
                            groudId={group._id}
                            />
                    </div>
                )}
                    {isAddGroupOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <AddGroup mode="availGroup" setIsAddGroupOpen={setIsAddGroupOpen} selectedGroup={selectedGroup} />
                        </div>
                    )}
            </div>
            </>
        );
};

export default GeneralModal;