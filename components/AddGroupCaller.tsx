"use client"

import Image from "next/image";
import { useState } from "react";

const AddGroup = () => {
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
                <textarea
                    name="" 
                    id=""
                    placeholder="Group description"
                    className="h-[120px] shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                >
                </textarea>
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
    );
};

export default AddGroup;