"use client";

import { useState } from "react";
import Image from "next/image";
// import CreatePackageModal from "@/components/CreatePackageModal";

const NewGroup = () => {
    const [availableGroup, setAvailableGroup] = useState(true);
    const [openModal, setOpenModal] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        subject: "",
        message: "",
    });

    const handleChange = (e: { target: { id: any; value: any } }) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        // Submit the form data to FabForm or an API
    };

    return (
        <section className="border border-gray-700 bg-[#EEEFF2] dark:bg-gray-900 mt-10">
            <div className="py-8 lg:py-16 mx-auto max-w-screen-lg">
                <div className="h-20 mb-12">
                    <h3 className="mb-1 text-[32px] tracking-tight font-general font-bold text-center text-[#111827] dark:text-white">
                        Event Groups & Packages
                    </h3>
                    <p className="flex gap-1 justify-center items-center mb-8 lg:mb-16 font-general text-lg font-medium text-center text-[#718096] dark:text-gray-400 sm:text-xl">
                        Create groups and packages for different types of guests  
                        <Image
                         src="/images/information.png" 
                         width={20}
                         height={20}
                         alt="information"
                        />    
                    </p>
                </div>

                {/* {openModal && (
                    <CreatePackageModal />
                )} */}

                {availableGroup ? (
                    <div className="ml-44 flex">
                        <div className="w-[320px] h-[316px] space-y-8 bg-[#FFFFFF] pt-4 p-8 rounded-3xl">
                            <div className="flex items-center justify-between">
                                <span className="w-[76px] h-[22px] flex justify-center items-center px-10 py-2 rounded-[50px] font-general font-medium text-sm text-[#2B9EA0] border border-[#2B9EA0] bg-[#ebf3f3]">General</span>
                                <div className="flex justify-center items-center gap-2">
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
                                    General Aso Ebi
                                </span>
                                <span className="font-general font-medium text-sm text-[#718096]">
                                    This is the general aso ebi for everyone who is not a family member
                                </span>
                            </div>
                            <div className="flex flex-col gap-3">
                                <p className="font-general font-semibold text-base text-[#111827]">Packages</p>
                                <button onClick={() => setOpenModal(!openModal)} className="font-manrope font-extrabold text-xs py-2 flex justify-center items-center rounded-2xl border-[2px] border-[#751423] text-[#751423]">Create Package</button>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex flex-row justify-between items-center gap-1">
                                    <Image 
                                        src="/images/trash.png"
                                        alt="delete"
                                        width={16}
                                        height={16}
                                     />
                                    <span className="font-general pt-1 font-medium text-sm text-[#DE4222]">Delete</span>
                                </div>
                                <div className="flex flex-row justify-between items-center gap-1">
                                <Image 
                                    src="/images/copy.png"
                                    alt="delete"
                                    width={16}
                                    height={16}
                                />
                                <span className="font-general pt-1 font-medium text-sm text-[#718096">Copy</span>
                                </div>
                            </div>
                        </div>
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
                ) : (
                    <form 
                    className="w-[320px] h-[484px] ml-20 pl-4 space-y-8 bg-[#FFFFFF] px-5 py-6 rounded-3xl" 
                    action="https://fabform.io/f/{form-id}" 
                    method="post" 
                    onSubmit={handleSubmit}
                >
                    <div className="">
                        <span className="block mb-2 font-general text-xl text-[#111827] font-semibold dark:text-gray-300">
                            New Group
                        </span>
                        <span className="font-general font-medium text-sm text-[#718096]">Create a group for specific guests</span>
                    
                    <div className="flex mt-5 flex-col gap-5">
                        <input
                            type="text"
                            id="event"
                            onChange={handleChange}
                            className="h-14 shadow-sm bg-gray-50 border rounded-xl border-gray-300 text-gray-900  text-sm focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder="Group name"
                            required
                            />
                        <input 
                            type="text" 
                            className="h-[120px] shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder="Group description"
                            required  
                            />
                    </div>
                    <div className="flex flex-col gap-3 mt-4">
                        <span className="font-general text-base font-semibold text-[#111827]">Select group privacy</span>
                        <div className="flex gap-14 mb-3">
                            <div className="flex items-center gap-2">
                                <Image
                                    src="/images/check.png" 
                                    alt="check"
                                    width={20}
                                    height={20}
                                />
                                <span className="font-general font-medium text-base text-[#111827]"> General </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Image
                                    src="/images/unchecked.png" 
                                    alt="check"
                                    width={20}
                                    height={20}
                                />
                                <span  className="font-general font-medium text-base text-[#111827]">Private</span>
                            </div>
                        </div>
                        <button className="w-[150px] h-12 rounded-xl p-2 text-sm text-[#FFFFFF] font-general bg-[#751423] flex justify-center items-center">Create Group</button>
                    </div>
                    </div>
                </form>
                )}               
            </div>
        </section>
    );
};

export default NewGroup;
