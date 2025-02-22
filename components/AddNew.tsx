"use client"

import Image from "next/image";
import AddGroup from "./AddGroupCaller";
import { useState } from "react";

const CreateGroupCaller: React.FC = () => {
        const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
    return (
        <div className="w-[320px] h-[316px] rounded-3xl flex flex-col border-[3px] border-dashed justify-center items-center bg-[#FFFFFF66] ml-10 cursor-pointer">
            <div onClick={() => setIsAddGroupOpen(!isAddGroupOpen)}>
                <Image
                    src="/images/plus.png"
                    alt="plus" 
                    width={52}
                    height={52}   
                    />
                <span className="font-general font-semibold text-base text-[#751423]">Add New</span>
            </div>
            {isAddGroupOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <AddGroup mode="availGroup" setIsAddGroupOpen={setIsAddGroupOpen} />
                </div>
            )}
        </div>
    )
};

export default CreateGroupCaller;