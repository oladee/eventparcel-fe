"use client"

import { Group } from "@/data/mockData"
import Image from "next/image"
import { useState } from "react"
import CreatePackageModal from "./CreatePackageModal"
import { Package } from "@/data/mockData";



type PrivateGroupProps = {
    group: Group
    // setOpenModal: (open: boolean) => void;
}

const PrivateGroup: React.FC<PrivateGroupProps>  = ({ group }) => {
    const [openModalPackage, setOpenModalPackage] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "update">("create");
    const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
    
    return (
        <div className="w-[320px]">
            <div className="w-[320px] h-auto space-y-6 bg-[#FFFFFF] pt-4 p-8 rounded-3xl">
                <div className="flex items-center justify-between">
                    <span className="w-[76px] h-[22px] flex justify-center items-center px-10 py-2 rounded-[50px] font-general font-medium text-sm text-[#DE4222] border border-[#DE4222] bg-[#eadfdd]">{group.type}</span>
                    <div className="flex justify-center items-center gap-2 cursor-pointer">
                        <Image 
                            src="/images/edit.png"
                            alt="edit"
                            width={16}
                            height={16}
                        />
                        <span className="font-general font-medium text-sm text-[#718096]">Edit</span>
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="font-general font-semibold text-xl text-[#111827]">
                        {group.title}
                    </span>
                    <span className="font-general font-medium text-sm text-[#718096]">
                        {group.description}
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
                        {/* button to create */}
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
                                    src={item.image}
                                    alt="cloth"
                                    width={60}
                                    height={60}
                                    className="rounded-[5.29px]"
                                />
                                <div className="flex flex-col">
                                    <span className="text-sm font-general font-semibold leading-tight text-[#111827]">
                                        {item.title}
                                    </span>
                                    <p className="font-general font-medium text-xs text-[#718096]">₦{item.amount}</p>
                                </div>
                            </div>
                            {/* button that update */}
                            <Image 
                                src="/images/edit.png"
                                alt="edit"
                                width={12}  
                                height={12} 
                                className="cursor-pointer"
                                onClick={() => {
                                    setModalMode("update");
                                    setSelectedPackage(item); // Pass package data
                                    setOpenModalPackage(true);
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-between">
                <div className="flex items-center gap-1">
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
                    />
                </div>
            )}
        </div>
    );
};

export default PrivateGroup;