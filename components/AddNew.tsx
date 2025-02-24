"use client";

import Image from "next/image";
import AddGroup from "./AddGroupCaller";
import { useState } from "react";

const CreateGroupCaller: React.FC = () => {
    const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);

    return (
        <>
            {/* Large CreateGroupCaller for lg and above */}
            <div 
                className="
                    hidden lg:flex w-[320px] h-[316px] rounded-3xl flex-col border-[3px] border-dashed 
                    justify-center items-center bg-[#FFFFFF66] ml-10 cursor-pointer
                "
                onClick={() => setIsAddGroupOpen(true)}
            >
                <Image
                    src="/images/plus.png"
                    alt="plus" 
                    width={42}  
                    height={42}   
                />
                <span className="font-general font-semibold text-base text-[#751423]">
                    Add New
                </span>
            </div>

            {/* Small Button for sm and md screens */}
            <button 
                className="lg:hidden w-[80px] rounded-[5px] px-2 whitespace-nowrap py-2 bg-[#751423] text-white text-sm font-semibold hover:bg-[#5e101d] transition"
                onClick={() => setIsAddGroupOpen(true)}
            >
                Add New
            </button>

            {/* Modal - Common for both buttons */}
            {isAddGroupOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4">
                    <div className="w-full max-w-lg rounded-3xl p-6 md:p-10 lg:p-14">
                        <AddGroup mode="availGroup" setIsAddGroupOpen={setIsAddGroupOpen} />
                    </div>
                </div>
            )}
        </>
    );
};

export default CreateGroupCaller;
