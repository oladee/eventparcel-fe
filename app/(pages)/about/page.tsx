"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin } from "lucide-react"; 
import { Calendar } from "lucide-react";
import { Clock } from "lucide-react";
import Success from "@/components/auth/Success";
import EventSuccess from "@/components/EventSuccess";

const About: React.FC  = () => {
    const [showSuccess, setShowSuccess] = useState(false)
    const [formData, setFormData] = useState({
        eventName: "",
        eventDate: "",
        eventTime: "",
        location: "",
        firstName: "",
        lastName: "",
        email: "",
        description: "",
    });

    const [errors, setErrors] = useState({
        eventName: "",
        eventDate: "",
        eventTime: "",
        location: "",
        firstName: "",
        lastName: "",
        email: "",
        description: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        setErrors({ ...errors, [e.target.id]: "" }); // Clear error when user types
    };

    const validateField = (id: string, value: string) => {
        if (!value.trim()) {
            return "This field is required.";
        }
        if (id === "email" && !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value)) {
            return "Enter a valid email address.";
        }
        return "";
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setErrors((prev) => ({ ...prev, [id]: validateField(id, value) }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let newErrors: typeof errors = {
            eventName: "",
            eventDate: "",
            eventTime: "",
            location: "",
            firstName: "",
            lastName: "",
            email: "",
            description: ""
        };
        Object.keys(formData).forEach((key) => {
            newErrors[key as keyof typeof formData] = validateField(key, formData[key as keyof typeof formData]);
        });

        setErrors(newErrors);

        if (Object.values(newErrors).some((error) => error !== "")) {
            return; // Stop form submission if errors exist
        }

        console.log("Form submitted:", formData);
    };

    
  const isFormValid =
  formData.firstName &&
  formData.lastName &&
  formData.email &&
  formData.description &&
  formData.location &&
  formData.eventName && 
  formData.eventTime
  Object.values(errors).every((err) => err === "");

    return (
            <><div>
            {showSuccess && (<EventSuccess />)}
        </div>
        <section className="bg-[#EEEFF2] dark:bg-gray-900 mt-10">

                <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
                    {/* Header */}
                    <div className="h-20 mb-12 text-center">
                        <h3 className="text-[32px] font-general font-bold text-[#111827] dark:text-white">
                            Tell us about your event
                        </h3>
                        <p className="text-lg font-general font-medium text-[#718096] dark:text-gray-400 sm:text-xl">
                            We'll help you get started based on your responses
                        </p>
                    </div>

                    {/* Form */}
                    <form
                        className="space-y-8 bg-white p-8 rounded-3xl shadow-md"
                        onSubmit={handleSubmit}
                    >
                        {/* Event Name */}
                        <div>
                            <label htmlFor="eventName" className="block mb-2 font-semibold text-[#111827]">
                                Event Name
                            </label>
                            <input
                                type="text"
                                id="eventName"
                                value={formData.eventName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="input-field w-full p-2 rounded-[5px] bg-slate-50"
                                placeholder="Enter event name"
                                required />
                            {errors.eventName && <p className="text-red-500 text-sm mt-1">{errors.eventName}</p>}
                        </div>

                        {/* Event Cover Image */}
                        <div>
                            <label className="block mb-2 font-semibold text-[#111827]">Event Cover Image</label>
                            <div className="border-2 border-dashed border-[#718096] h-[170px] rounded-xl flex flex-col justify-center items-center cursor-pointer">
                                <Image src="/images/photo.png" alt="Upload" width={48} height={48} />
                                <span className="text-sm text-[#718096]">
                                    Drop your image here, or <span className="text-[#751423]">Click to browse</span>
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block mb-2 font-semibold text-[#111827]">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Write description"
                                className="input-field h-[140px] w-full resize-none p-4 rounded-[5px] bg-slate-50"
                                required />
                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                        </div>

                        {/* Date & Time */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="eventDate" className="block mb-2 font-semibold text-[#111827]">
                                    Date
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                                    <input
                                        type="text"
                                        id="eventDate"
                                        value={formData.eventDate}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className="w-full p-2 pl-12 input-field rounded-[5px] bg-slate-50"
                                        placeholder="Select date"
                                        required />
                                    {errors.eventDate && <p className="text-red-500 text-sm mt-1">{errors.eventDate}</p>}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="eventTime" className="block mb-2 font-semibold text-[#111827]">
                                    Time
                                </label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                                    <input
                                        type="text"
                                        id="eventTime"
                                        value={formData.eventTime}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className="w-full p-2 pl-12 input-field rounded-[5px] bg-slate-50"
                                        placeholder="Select time"
                                        required />
                                    {errors.eventTime && <p className="text-red-500 text-sm mt-1">{errors.eventTime}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Event Location (With Icon) */}
                        <div>
                            <label htmlFor="location" className="block mb-2 font-semibold text-[#111827]">
                                Event Location
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                                <input
                                    type="text"
                                    id="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="input-field pl-12 w-full p-2 rounded-[5px] bg-slate-50"
                                    placeholder="Enter location of the event"
                                    required />
                                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                            </div>
                        </div>

                        {/* Personal Details */}
                        <div>
                            <label className="block font-semibold text-[#111827]">Your Details</label>
                            <p className="text-sm text-[#718096]">We will not share your personal details publicly</p>
                        </div>

                        {/* Name Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block mb-2 font-semibold text-[#111827]">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="input-field w-full p-2 rounded-[5px] bg-slate-50"
                                    placeholder="First name"
                                    required />
                                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block mb-2 font-semibold text-[#111827]">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="input-field w-full p-2 rounded-[5px] bg-slate-50"
                                    placeholder="Last name"
                                    required />
                                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                            </div>
                        </div>

                        {/* Email Address */}
                        <div>
                            <label htmlFor="email" className="block mb-2 font-semibold text-[#111827]">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="input-field w-full p-2 rounded-[5px] bg-slate-50"
                                placeholder="Enter your email"
                                required />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                    </form>
                </div>
                <div className="bg-[#FFFF] h-32 flex gap-6 py-10 justify-end pr-56">
                    <button className='w-[150px] h-[56px] border border-[#111827] rounded-[10px] font-manrope font-extrabold text-base text-[#111827]'>Save for later</button>
                    <button
                    disabled={!isFormValid}
                    className={`w-[150px] h-[56px] border border-[#111827] rounded-[10px] font-manrope font-extrabold text-base 
                        ${isFormValid ? "bg-[#751423] text-[#FFFF] hover:bg-[#5c101c]" : "bg-[#e3abb4] text-gray-200 cursor-not-allowed"}`}
                    onClick={() => isFormValid && setShowSuccess(!showSuccess)}
                >
                    Continue
                </button>
                </div>
            </section>
            </>
    );
};

export default About;
