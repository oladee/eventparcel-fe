"use client"; 

import { useState } from "react";
import Image from "next/image";

const AboutYourself = () => {
    const [formData, setFormData] = useState({
        email: "",
        subject: "",
        message: "",
    });

    const handleChange = (e: { target: { id: any; value: any; }; }) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        // Submit the form data to FabForm or an API
    };

    return (
        <section className="bg-[#EEEFF2] dark:bg-gray-900 mt-10">
            <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
                <div className="h-20 mb-12">
                    <h3 className="mb-1 text-[32px] tracking-tight font-general font-bold text-center text-[#111827] dark:text-white">
                        Tell us about your event
                    </h3>
                    <p className="mb-8 lg:mb-16 font-general text-lg font-medium text-center text-[#718096] dark:text-gray-400 sm:text-xl">
                        We'll help you get started based on your responses         
                    </p>
                </div>

                <form className="space-y-8 bg-[#FFFFFF] p-8 rounded-3xl" action="https://fabform.io/f/{form-id}" method="post" onSubmit={handleSubmit}>
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block mb-2 font-general text-base text-[#111827] font-semibold dark:text-gray-300">
                            Event Name
                        </label>
                        <input
                            type="event"
                            id="event"
                            // value={formData.event}
                            onChange={handleChange}
                            className="h-14 shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder="Enter event name"
                            required
                        />
                    </div>


                    <div className="sm:col-span-2">
                        <label htmlFor="email" className="block mb-2 font-general text-base text-[#111827] font-semibold dark:text-gray-300">
                            Event Cover Image
                        </label>
                        <div className="border-[2px] border-dashed border-[#718096] h-[170px] rounded-xl flex flex-col justify-center items-center">
                            <Image 
                                src="/images/photo.png"
                                 alt="" 
                                width={48}
                                height={48}
                            />
                            <span className="font-general font-medium text-sm text-[#718096]">Drop your image here, or <span className="text-[#751423]">Click to browser</span></span>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block mb-2 font-general text-base text-[#111827] font-semibold dark:text-gray-300">
                            Descriptions
                        </label>
                        <input
                            type="text"
                            id="event"
                            onChange={handleChange}
                            className="h-[140px] shadow-sm bg-[#FAFAFA] border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white p-4"
                            placeholder="Write description"
                            required
                        />
                    </div>
                </form>
            </div>
        </section>
    );
};

export default AboutYourself;
