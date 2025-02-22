"use strict";

import Image from "next/image";
import Success from "./auth/Success";

type CreatePackageProps = {
    setEditPackageModal: (open: boolean) => void;
}

const EditPackage: React.FC<CreatePackageProps> = ({ setEditPackageModal }) => {
    
    return (
        <div className="w-[680px] bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-6">
            {/* Header */}
            <div className="flex justify-between gap-1">
                <div>
                    <p className="font-general font-bold text-2xl text-[#111827]">Update Package</p>
                    <p className="font-general font-medium text-lg text-[#718096]">
                        How do you want to sell to this group?
                    </p>
                </div>
                <div onClick={() => setEditPackageModal(false)}>
                    <Image 
                        src="/images/cancel.png"
                        alt="cancel"
                        width={12}
                        height={12}
                    />
                </div>
            </div>
            <div className="w-full border border-gray-100"></div>

            {/* Image Upload Section */}
            <div className="flex items-center gap-5">
                <Image 
                    src="/images/cloth.png"
                    alt="packagesImg"
                    width={136}
                    height={136}
                    className="rounded-[10px] border border-gray-300"
                />
                <div className="h-[136px] w-[136px] border-[3px] border-dashed rounded-[10px] flex flex-col items-center justify-center gap-2 cursor-pointer">
                    <Image 
                        src="/images/Group.png"
                        alt="add-img"
                        width={32}
                        height={32}
                    />
                    <p className="font-general text-sm font-medium text-[#718096]">Add Image</p>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <input 
                    type="text" 
                    placeholder="Add package title"
                    className="w-full p-3 rounded-xl border border-gray-300 text-sm bg-[#FAFAFA]"
                />
                <textarea
                    name="" 
                    placeholder="Add package description"
                    id=""
                    className="w-full h-[120px] p-3 rounded-xl border border-gray-300 text-sm bg-[#FAFAFA]"
                    >
                </textarea>
                <div className="flex gap-3">
                <div className="flex items-center w-1/2 p-3 border border-gray-300 rounded-xl bg-[#FAFAFA]">
                    <span className="pr-3 border-r border-gray-300 text-sm text-[#111827]">₦</span>
                    <input 
                        type="text" 
                        placeholder="Add package price" 
                        className="flex-1 pl-3 text-sm bg-transparent focus:outline-none"
                    />
                </div>

                    <input 
                        type="text" 
                        placeholder="Quantity (optional)" 
                        className="w-1/2 p-3 border rounded-xl border-gray-300 text-sm bg-[#FAFAFA]"
                    />
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <p className="font-general font-semibold text-base text-[#111827]">
                    How would you like to handle delivery?
                </p>
                <p className="font-general font-medium text-sm text-[#718096]">
                    With Event Parcel platform, you can manage and track delivery easily.
                </p>
                <div className="flex gap-10 mt-3">
                    <div className="flex items-center gap-2 cursor-pointer">
                        <Image
                            src="/images/check.png" 
                            alt="check"
                            width={20}
                            height={20}
                        />
                        <span className="font-general font-medium text-base text-[#111827]"> Home Delivery </span>
                    </div>
                    <div className="flex items-center gap-2 cursor-pointer">
                        <Image
                            src="/images/unchecked.png" 
                            alt="check"
                            width={20}
                            height={20}
                        />
                        <span className="font-general font-medium text-base text-[#111827]">Pickup</span>
                    </div>
                </div>
            </div>
            <div className="w-full border border-gray-100"></div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
                <button className="px-6 py-2 text-base font-general font-bold text-[#111827] border border-[#111827] rounded-[10px] hover:bg-gray-100">
                    Cancel
                </button>
                <button className="px-6 py-2 text-sm font-general font-bold text-[#FFFFFF] bg-[#751423] rounded-[10px] hover:bg-[#5e101d]">
                    Create Package
                </button>
            </div>
        </div>
    );
};

export default EditPackage;
