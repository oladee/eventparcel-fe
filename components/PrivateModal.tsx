"use client"

import { Group } from "@/data/mockData"
import Image from "next/image"



type PrivateGroupProps = {
    group: Group
    setOpenModal: (open: boolean) => void;
}

const PrivateGroup: React.FC<PrivateGroupProps>  = ({ group, setOpenModal }) => {
    

    return (
        <div className="w-[320px]">
            <div className="w-[320px] h-auto space-y-8 bg-[#FFFFFF] pt-4 p-8 rounded-3xl">
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
                    <p className="font-general font-semibold text-base text-[#111827]">Packages</p>
                    <button onClick={() => setOpenModal(true)} className="font-manrope font-extrabold text-xs py-2 flex justify-center items-center rounded-2xl border-[2px] border-[#751423] text-[#751423]">Create Package</button>
                </div>
                <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 border border-gray-300 p-2 rounded-[12px]">
                    <div>
                        <Image 
                            src="/images/cloth.png"
                            alt="cloth"
                            width={60}
                            height={60}
                            className="rounded-[5.29px]"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-general font-semibold leading-tight text-[#111827]">
                            6 Yards of Aso Oke and Gele for women
                        </span>

                        <p className="font-general font-medium text-xs text-[#718096]">₦560,000</p>
                    </div>
                    <div>
                        <Image 
                            src="/images/edit.png"
                            alt="edit"
                            width={20}  
                            height={20} 
                        />
                    </div>
                </div>
                    <div className="flex items-center gap-3 border border-gray-300 p-2 rounded-[12px]">
                        <div>
                            <Image 
                                src="/images/cloth.png"
                                alt="cloth"
                                width={60}
                                height={60}
                                className="rounded-[5.29px]"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-general font-semibold leading-tight text-[#111827]">
                                6 Yards of Aso Oke and Gele for women
                            </span>

                            <p className="font-general font-medium text-xs text-[#718096]">₦560,000</p>
                        </div>
                        <div>
                            <Image 
                                src="/images/edit.png"
                                alt="edit"
                                width={20}  
                                height={20} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivateGroup;