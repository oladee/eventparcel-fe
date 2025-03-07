"use client";

import Image from "next/image";
import { useState } from "react";

const CreateGroupCaller: React.FC= () => {
    const [, setIsAddGroupOpen] = useState(false);

    return (
        <>
            {/* Mobile Version */}
            <div 
                className="
                    flex sm:hidden w-[310px] h-[100px] mt-5 rounded-2xl flex-col border-[2px] border-dashed 
                    justify-center items-center ml-[5px] bg-[#FFFFFF66] cursor-pointer
                "
                onClick={() => setIsAddGroupOpen(true)}
            >
                <Image
                    src="/images/plus.png"
                    alt="plus" 
                    width={32}  
                    height={32}   
                />
                <span className="font-general font-semibold text-sm text-[#751423]">
                    Add New
                </span>
            </div>

            {/* Large CreateGroupCaller for sm and above */}
            <div 
                className="
                    hidden sm:flex w-[320px] h-[316px] rounded-3xl flex-col border-[3px] border-dashed 
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

            {/* Modal - Common for both buttons */}
            {/* {isAddGroupOpen && (
                <div className=" inset-0 flex items-center justify-center px-4 absolute">
                    <div className="w-full max-w-lg rounded-3xl p-6 md:p-10 lg:p-14">
                        <AddGroup mode="availGroup" setIsAddGroupOpen={setIsAddGroupOpen} />
                    </div>
                </div>
            )} */}
        </>
    );
};

export default CreateGroupCaller;
