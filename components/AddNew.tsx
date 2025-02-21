"use client"

import Image from "next/image";

const CreateGroupCaller = () => {
    return (
        <div>
            <div className="w-[320px] h-[316px] rounded-3xl flex flex-col border-[3px] border-dashed justify-center items-center bg-[#FFFFFF66] ml-10">
                <Image
                    src="/images/plus.png"
                    alt="plus" 
                    width={52}
                    height={52}   
                />
                <span className="font-general font-semibold text-base text-[#751423]">Add New</span>
            </div>
        </div>
    )
};

export default CreateGroupCaller;