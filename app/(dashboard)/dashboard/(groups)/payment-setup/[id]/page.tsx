"use client";

import dynamic from "next/dynamic";
import React, { useState, useEffect, Suspense } from "react";
import ReusuableSuccess from "@/components/modals/ReusuableSuccess";
import { toast, ToastContainer } from "react-toastify";
import { BiLoaderCircle } from "react-icons/bi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FormEvent } from "react";
import { PiCalendarMinus } from "react-icons/pi";
import { AiOutlineClockCircle } from "react-icons/ai";
import { useRouter, useParams } from "next/navigation";
import NairaPayoutForm from "@/components/NairaPayoutForm";
import DollarPayoutForm from "@/components/DollarPayoutForm";
import axiosInstance from "@/lib/axiosInstance";
import Container from "@/components/dashboard/Container";
import { trackEvent } from "@/lib/mixpanel";
import { ChevronLeft } from "lucide-react";

const LocationPickerModal = dynamic(
    () => import("@/components/aboutEvent/LocationPickerModal"),
    { ssr: false }
);

interface Bank {
    name: string;
    code: string;
    url: string;
}

interface USBank {
    _id: {
        $oid: string;
    };
    bankId: string;
    name: string;
    country: string;
    currency: string;
    routingNumber: string[];
}

const validTimeZones = [
    "UTC",
    "GMT",
    "WAT",
    "CAT",
    "EAT",
    "PST",
    "CST",
    "EST",
    "MST",
    "AKST",
    "HST",
    "IST",
    "CET",
    "EET",
    "BST",
    "AST",
    "NST",
    "JST",
    "KST",
    "AEST",
    "ACST",
    "AWST",
];

const PaymentSetupContent = () => {
    const params = useParams();
    const eventId = params.id as string;

    const router = useRouter();

    // Groups fetched from API
    const [groups, setGroups] = useState<any[]>([]);
    const [isLoadingGroups, setIsLoadingGroups] = useState(true);

    const [showMapPickerModal, setShowMapPickerModal] = useState(false);
    const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
    const [selectedUSBank, setSelectedUSBank] = useState<USBank | null>(null);
    const [showModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [isSaveLoading, setIsSaveLoading] = useState(false);
    const [eventDate, setEventDate] = useState<string | null>(null);
    const [eventTime, setEventTime] = useState<string | null>(null);
    const [showModalCancel, setShowModalCancel] = useState(false);

    const [formData, setFormData] = useState({
        event: eventId,
        nairaAccount: {
            accountNumber: "",
            accountName: "",
            bankName: "",
            bankCode: "",
        },
        dollarAccount: {
            usAccountNumber: "",
            routingNumber: "",
            usBankName: "",
            usAccountName: "",
        },
        isDraft: false,
        paymentDate: new Date(),
        paymentTime: new Date(),
        paymentTimeZone: "WAT",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isFormValid, setIsFormValid] = useState(false);

    // ── Fetch groups from the backend using the eventId slug ──
    useEffect(() => {
        if (!eventId) return;

        const fetchGroups = async () => {
            setIsLoadingGroups(true);
            try {
                const response = await axiosInstance.get(`/view-groups/${eventId}`);
                setGroups(response.data.data);
            } catch (error: any) {
                console.error("Failed to fetch groups:", error);
                toast.error(
                    error.response?.data?.message || "Failed to load groups. Please try again."
                );
            } finally {
                setIsLoadingGroups(false);
            }
        };

        fetchGroups();
    }, [eventId]);

    // ── Read event date/time from localStorage (set during event creation) ──
    useEffect(() => {
        const storedEventDetails = localStorage.getItem("eventDetails");

        if (storedEventDetails) {
            try {
                const parsedDetail = JSON.parse(storedEventDetails);
                setEventDate(parsedDetail?.data.date);
                setEventTime(parsedDetail?.data.time);
            } catch (error) {
                console.error("Failed to parse event details:", error);
            }
        }
    }, []);

    // ── Derived values from fetched groups ──
    const firstEventId = eventId;
    const firstGroup = groups.length > 0 ? groups[0] : null;

    const hasNGN = groups.some(
        (group: { groupCurrency: string }) => group.groupCurrency === "NGN"
    );
    const hasUSD = groups.some(
        (group: { groupCurrency: string }) => group.groupCurrency === "USD"
    );

    const isAllSelfManaged = (groupList: any[]) => {
        if (groupList.length === 0) return false;
        return groupList.every((group) =>
            group.packages.every((pkg: any) =>
                pkg.packageDelivery.every((delivery: string) =>
                    delivery.includes("selfManaged")
                )
            )
        );
    };

    const allSelfManaged = isAllSelfManaged(groups);

    // ── Form validation ──
    useEffect(() => {
        const isAllFieldsFilled = Object.values(formData).every((value) => {
            if (typeof value === "string") return value.trim() !== "";
            if (value instanceof Date) return !isNaN(value.getTime());
            return true;
        });
        const isAllFieldsValid = Object.values(errors).every((error) => error === "");
        setIsFormValid(isAllFieldsFilled && isAllFieldsValid);
    }, [formData, errors]);

    const handleDateChange = (date: Date | null, field: string) => {
        if (date) {
            setFormData((prev) => ({ ...prev, [field]: date }));
        }
    };

    const validateField = (id: string, value: any) => {
        const fieldName = id.split(".").pop();

        switch (fieldName) {
            case "accountNumber":
                if (!/^\d+$/.test(value)) return "Account number must be a number";
                if (value.length !== 10) return "Account number must be 10 digits";
                return "";
            case "accountName":
                if (!/^[A-Za-z\s]+$/.test(value))
                    return "Account name must only contain letters and spaces";
                if (value.length < 3 || value.length > 50)
                    return "Account name must be between 3 and 50 characters";
                return "";
            case "paymentDate":
            case "deliveryDate":
                const selectedDate = new Date(value);
                const currentDate = new Date();
                selectedDate.setHours(0, 0, 0, 0);
                currentDate.setHours(0, 0, 0, 0);
                if (selectedDate < currentDate) return "Date cannot be in the past";
                return "";
            case "contactName":
                if (!/^[A-Za-z\s]+$/.test(value))
                    return "Contact name must only contain letters and spaces";
                if (value.length < 3 || value.length > 50)
                    return "Contact name must be between 3 and 50 characters";
                return "";
            default:
                return "";
        }
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { id, value } = e.target;

        if (id.includes(".")) {
            const [parentKey, childKey] = id.split(".");
            setFormData((prev) => ({
                ...prev,
                [parentKey]: {
                    ...(prev[parentKey as keyof typeof formData] as object),
                    [childKey]: value,
                },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [id]: value }));
        }

        setErrors((prev) => ({
            ...prev,
            [id]: validateField(id, value),
        }));
    };

    const handleBlur = (
        e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { id, value } = e.target;
        setErrors((prev) => ({ ...prev, [id]: validateField(id, value) }));
    };

    // Helper: format Date → "HH:MM AM/PM"
    const formatTime12Hour = (date: Date): string => {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        const paddedHours = hours < 10 ? `0${hours}` : `${hours}`;
        const paddedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
        return `${paddedHours}:${paddedMinutes} ${ampm}`;
    };

    // Helper: check if any field in an account object is filled
    const isFilled = (obj: { [key: string]: string }) =>
        Object.values(obj).some(
            (val) => val && typeof val === "string" && val.trim() !== ""
        );

    const checkEventDateTime = () => {
        if (!eventDate || !formData?.paymentDate) return true;

        const parseDate = (dateInput: Date | string): Date | null => {
            if (dateInput instanceof Date && !isNaN(dateInput.getTime())) {
                return dateInput;
            }
            if (typeof dateInput === "string") {
                const isoDate = new Date(dateInput);
                if (!isNaN(isoDate.getTime())) return isoDate;

                const parts = dateInput.split(/[-/]/);
                if (parts.length === 3) {
                    const formats = [
                        `${parts[0]}-${parts[1]}-${parts[2]}`,
                        `${parts[2]}-${parts[0]}-${parts[1]}`,
                        `${parts[2]}-${parts[1]}-${parts[0]}`,
                    ];
                    for (const format of formats) {
                        const testDate = new Date(format);
                        if (!isNaN(testDate.getTime())) return testDate;
                    }
                }
            }
            return null;
        };

        const parsedEventDate = parseDate(eventDate);
        const parsedPaymentDate = parseDate(formData.paymentDate);

        if (!parsedEventDate || !parsedPaymentDate) {
            console.error("Invalid date format detected");
            return true;
        }

        const eventDay = new Date(parsedEventDate.setHours(0, 0, 0, 0));
        const paymentDay = new Date(parsedPaymentDate.setHours(0, 0, 0, 0));

        console.log("Event Date:", eventDay);
        console.log("Payment Date:", paymentDay);

        if (paymentDay > eventDay) {
            toast.error("Payment date cannot be after the event date!");
            return false;
        }

        if (
            paymentDay.getTime() === eventDay.getTime() &&
            formData.paymentTime &&
            eventTime
        ) {
            const parseTime = (timeInput: Date | string): string => {
                if (timeInput instanceof Date) {
                    return timeInput.toTimeString().split(" ")[0].slice(0, 5);
                }
                if (typeof timeInput === "string") {
                    if (/^\d{1,2}:\d{2}$/.test(timeInput)) {
                        const [hours, minutes] = timeInput.split(":");
                        return `${hours.padStart(2, "0")}:${minutes.padEnd(2, "0")}`;
                    }
                    if (/^\d{1,2}:\d{2}\s?[AP]M$/i.test(timeInput)) {
                        const [time, period] = timeInput.split(/(?=[AP]M)/i);
                        let hours = time.split(":")[0];
                        const minutes = time.split(":")[1];
                        hours =
                            period.toLowerCase() === "pm"
                                ? `${(parseInt(hours) % 12) + 12}`
                                : hours.padStart(2, "0");
                        return `${hours}:${minutes}`;
                    }
                }
                return "00:00";
            };

            const paymentTimeStr = parseTime(formData.paymentTime);
            const eventTimeStr = parseTime(eventTime);

            const paymentDateTime = new Date(paymentDay);
            const [paymentHours, paymentMinutes] = paymentTimeStr.split(":").map(Number);
            paymentDateTime.setHours(paymentHours, paymentMinutes);

            const eventDateTime = new Date(eventDay);
            const [eventHours, eventMinutes] = eventTimeStr.split(":").map(Number);
            eventDateTime.setHours(eventHours, eventMinutes);

            console.log("Payment DateTime:", paymentDateTime);
            console.log("Event DateTime:", eventDateTime);

            if (paymentDateTime > eventDateTime) {
                toast.error("Payment time cannot be after the event time!");
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!isFormValid) {
            toast.error("Please fill out all required fields");
            return;
        }

        if (!checkEventDateTime()) {
            setLoading(false);
            return;
        }

        setLoading(true);

        try {
            const { nairaAccount, dollarAccount, ...rest } = formData;

            const formattedData = {
                ...rest,
                ...(isFilled(nairaAccount) ? { nairaAccount } : {}),
                ...(isFilled(dollarAccount) ? { dollarAccount } : {}),
                paymentTime: formatTime12Hour(formData.paymentTime),
            };

            if (allSelfManaged) {
                await axiosInstance.post("/add-payment", formattedData);
                toast.success("Payment details successfully submitted!");

                trackEvent("Add Payment Information", {
                    source: "Dashboard Add Payment Page",
                    timestamp: new Date().toISOString(),
                    page_name: "dashboard add payment page",
                    event_id: firstEventId,
                    event_name: firstGroup?.event?.eventName,
                    naira_bank_name: formData.nairaAccount.bankName,
                    dollar_bank_name: formData.dollarAccount.usBankName,
                    status: "Successful",
                });

                router.push("/dashboard/events");
            } else {
                const parsedEventDetails = {
                    event_id: firstEventId,
                    event_name: firstGroup?.event?.eventName,
                };

                localStorage.setItem(
                    "parsedEventDetails",
                    JSON.stringify(parsedEventDetails)
                );

                trackEvent("Add Payment Information", {
                    source: "Dashboard Add Payment Page",
                    timestamp: new Date().toISOString(),
                    page_name: "dashboard add payment page",
                    event_id: firstEventId,
                    event_name: firstGroup?.event?.eventName,
                    naira_bank_name: formData.nairaAccount.bankName,
                    dollar_bank_name: formData.dollarAccount.usBankName,
                    status: "Successful",
                });

                const queryString = new URLSearchParams({
                    data: JSON.stringify(formattedData),
                }).toString();

                router.push(`/dashboard/pickup-details?${queryString}`);
            }
        } catch (error: any) {
            trackEvent("Add Payment Information Failed", {
                source: "Add Payment Page",
                timestamp: new Date().toISOString(),
                page_name: "Add Payment Page",
                event_id: firstEventId,
                event_name: firstGroup?.event?.eventName,
                naira_bank_name: formData.nairaAccount.bankName,
                dollar_bank_name: formData.dollarAccount.usBankName,
                status: "Failed",
            });

            console.error("Error submitting payment details:", error);

            if (error.response?.data?.message) {
                toast.error(`Error: ${error.response.data.message}`);
            } else {
                toast.error("Failed to submit payment details. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => setShowModalCancel(true);

    const handleSaveForLater = async () => {
        setIsSaveLoading(true);

        try {
            const { nairaAccount, dollarAccount, ...rest } = formData;

            const fullFormData = {
                ...rest,
                ...(isFilled(nairaAccount) ? { nairaAccount } : {}),
                ...(isFilled(dollarAccount) ? { dollarAccount } : {}),
                paymentTime: formatTime12Hour(formData.paymentTime),
                isDraft: true,
            };

            await axiosInstance.post(`/payment-save-for-later`, fullFormData);
            toast.success("Saved! Continue from your dashboard.");
            router.push("/dashboard");
        } catch (error: any) {
            console.error("Error saving for later:", error);
            toast.error(error.response?.data?.message || "Failed to save event");
        } finally {
            setIsSaveLoading(false);
        }
    };

    const callSaveForLater = () => {
        setShowModalCancel(false);
        handleSaveForLater();
    };

    const handleDiscard = () => {
        router.push("/dashboard/events");
    };

    const today = new Date();

    if (isLoadingGroups) {
        return (
            <div className="flex flex-col justify-center items-center bg-white w-full h-screen">
                <div className="w-12 h-12 border-4 border-[#751423] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xl font-semibold text-[#751423] mt-4">
                    Loading payment setup...
                </p>
            </div>
        );
    }

    return (
        <Container>
            <ToastContainer />
            {showMapPickerModal && (
                <LocationPickerModal
                    onLocationSelect={() => {
                        setErrors((prev) => ({ ...prev, location: "" }));
                        setShowMapPickerModal(false);
                    }}
                    onCancel={() => setShowMapPickerModal(false)}
                />
            )}
            <section className="!overflow-hidden relative">
                <div
                    className="fixed top-16 w-[90%] md:w-[80%] h-auto py-3 bg-gray-100"
                    id="back-button"
                >
                    <button
                        className="w-[20%] md:w-[5%] cursor-pointer flex flex-row items-center"
                        onClick={() => window.history.back()}
                    >
                        <ChevronLeft className="w-6 h-6" />
                        <span className="font-medium text-base text-[#111827] ml-1">
                            Back
                        </span>
                    </button>
                </div>
                <div className="mt-4 pb-20 lg:py-24 px-3 sm:px-4 mx-auto max-w-screen-md h-[98vh] overflow-y-auto no-scrollbar">
                    <div className="md:mb-12 text-center p-3 sm:p-0 space-y-3 lg:flex lg:justify-center lg:flex-col">
                        <h2
                            id="payment_deliveryHeader"
                            className="flex justify-start text-xl sm:text-2xl font-bold text-[#111827]"
                        >
                            Payment Setup
                        </h2>
                        <div
                            id="payment_deliveryDesc"
                            className="flex justify-center items-center gap-3"
                        >
                            <div className="flex flex-col lg:flex-row w-full">
                                <span className="flex justify-start w-[313px] lg:w-[288px] whitespace-nowrap h-6 font-general font-medium text-sm text-[#718096]">
                                    Let&apos;s setup your payout process and payment
                                </span>
                                <span className="flex justify-start w-[313px] h-11 font-general font-medium text-sm text-[#718096]">
                                    deadline
                                </span>
                            </div>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-8 bg-white p-8 rounded-3xl shadow-md"
                    >
                        <div>
                            <div className="mb-5">
                                <h1
                                    id="paymentDetailsHeader"
                                    className="text-xl font-semibold text-[#111827] mb-2"
                                >
                                    Account Details
                                </h1>
                                <span
                                    id="paymentDetailsDesc"
                                    className="text-sm text-[#718096] font-medium"
                                >
                                    Add your payout bank details
                                </span>
                            </div>

                            <div className="rounded-[10px]">
                                {hasNGN && (
                                    <div className="border border-[#CBD5E0] mb-7 p-4 rounded-[10px]">
                                        <NairaPayoutForm
                                            formData={formData}
                                            errors={errors}
                                            handleChange={handleChange}
                                            handleBlur={handleBlur}
                                            selectedBank={selectedBank}
                                            setSelectedBank={setSelectedBank}
                                            setFormData={setFormData}
                                            setErrors={setErrors}
                                        />
                                    </div>
                                )}

                                {hasUSD && (
                                    <div className="border border-[#CBD5E0] p-4 rounded-[10px]">
                                        <DollarPayoutForm
                                            formData={formData}
                                            errors={errors}
                                            handleChange={handleChange}
                                            handleBlur={handleBlur}
                                            selectedUSBank={selectedUSBank}
                                            setSelectedUSBank={setSelectedUSBank}
                                            setFormData={setFormData}
                                            setErrors={setErrors}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-8">
                            <div className="mb-5">
                                <h2
                                    id="payment_deadlineHeader"
                                    className="text-xl font-semibold text-[#111827] mb-2"
                                >
                                    Payment Deadline
                                </h2>
                                <span
                                    id="payment_deadlineDesc"
                                    className="text-sm text-[#718096] font-medium"
                                >
                                    Select the payment deadline date and time
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col">
                                    <label
                                        htmlFor="paymentDate"
                                        className="block mb-2 font-semibold text-[#111827]"
                                    >
                                        Date
                                    </label>
                                    <div className="relative">
                                        <PiCalendarMinus className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 text-[#111827]" />
                                        <div className="w-full bg-slate-50">
                                            <DatePicker
                                                selected={formData.paymentDate}
                                                minDate={today}
                                                id="paymentDate"
                                                onChange={(date) =>
                                                    handleDateChange(date, "paymentDate")
                                                }
                                                dateFormat="yyyy-MM-dd"
                                                className="pl-10 px-3 py-2 z-20 input-field outline-primary w-full rounded-[5px] bg-slate-50"
                                                popperClassName="custom-datepicker"
                                            />
                                        </div>
                                    </div>
                                    {errors.paymentDate && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.paymentDate}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col">
                                    <label
                                        htmlFor="paymentTime"
                                        className="block mb-2 font-semibold text-[#111827]"
                                    >
                                        Time
                                    </label>
                                    <div className="flex space-x-3">
                                        <div className="relative">
                                            <AiOutlineClockCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#111827] z-10" />
                                            <DatePicker
                                                selected={formData.paymentTime}
                                                id="paymentTime"
                                                onChange={(date) =>
                                                    handleDateChange(date, "paymentTime")
                                                }
                                                showTimeSelect
                                                showTimeSelectOnly
                                                timeIntervals={15}
                                                timeCaption="Time"
                                                dateFormat="hh:mm aa"
                                                placeholderText="Select Payment Time"
                                                className="pl-10 px-3 py-2 input-field outline-primary w-full rounded-[5px] bg-slate-50"
                                                popperClassName="custom-datepicker"
                                            />
                                        </div>
                                        <select
                                            id="paymentTimeZone"
                                            value={formData.paymentTimeZone}
                                            onChange={handleChange}
                                            className="px-3 py-2 input-field outline-primary rounded-[5px] bg-slate-50"
                                        >
                                            {validTimeZones.map((zone) => (
                                                <option key={zone} value={zone}>
                                                    {zone}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#FFFF] py-4 flex justify-center fixed z-10 left-0 bottom-0 w-full">
                            <div className="max-w-3xl flex gap-4 items-center justify-center sm:justify-end w-full px-4">
                                <button
                                    id="save"
                                    type="button"
                                    className="p-3 border border-[#111827] rounded-[12px] font-manrope font-extrabold text-base text-[#111827] w-[142.24px]"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!isFormValid}
                                    className={`bg-primary w-[142.24px] text-white py-3 px-8 rounded-[12px] hover:bg-red-800 transition flex items-center justify-center font-extrabold font-manrope ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                >
                                    {loading ? (
                                        <BiLoaderCircle className="animate-spin mr-2" size={22} />
                                    ) : (
                                        "Continue"
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </section>

            {showModal && (
                <ReusuableSuccess
                    title="You've successfully uploaded your details"
                    subtitle="Congratulations you have successfully created your Payment details"
                    route="/event-creation"
                    buttonText="continue"
                />
            )}

            {showModalCancel && (
                <div className="fixed inset-0 px-6 bg-black bg-opacity-40 flex items-center justify-center z-[999]">
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative bg-white rounded-[8px] p-8 shadow-lg max-w-md w-full"
                    >
                        <button
                            onClick={() => setShowModalCancel(false)}
                            className="absolute top-3 right-4 text-xl text-black-100 hover:text-gray-800"
                        >
                            ✕
                        </button>
                        <h2 className="text-xl font-bold hidden md:block">
                            What would you like to do?
                        </h2>
                        <p className="mb-6 text-gray-600 hidden md:block">
                            You can save your progress and come back later, or discard this
                            event creation.
                        </p>
                        <div className="flex flex-col md:flex-row gap-4 justify-end">
                            <button
                                onClick={callSaveForLater}
                                disabled={isSaveLoading}
                                className="w-full md:p-3 md:border border-[#111827] md:rounded-[12px] font-medium text-left md:text-center text-[#000] whitespace-nowrap"
                            >
                                {isSaveLoading ? "saving..." : "Save for later"}
                            </button>
                            <button
                                onClick={handleDiscard}
                                className="w-full md:bg-primary text-red-500 md:text-white md:p-3 md:rounded-[12px] hover:text-red-800 transition flex items-center md:justify-center font-medium whitespace-nowrap"
                            >
                                Discard event creation
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Container>
    );
};

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PaymentSetupContent />
        </Suspense>
    );
}
