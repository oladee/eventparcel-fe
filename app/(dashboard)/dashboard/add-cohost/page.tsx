"use client";
import React, { useState, useEffect, FormEvent } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import { BiLoaderCircle } from "react-icons/bi";
import ReusuableSuccess from "@/components/modals/ReusuableSuccess";
import RightBar from "@/components/Rightbar";
import { useRouter } from "next/navigation";
import Container from "@/components/dashboard/Container";


interface EventDetailsProps {
  eventData: Array<{
    _id: string;
    eventImgUrl: string;
    eventName: string;
    eventDescription: string;
    date: string;
    time: string;
    eventLocation: string;
  }>;
}


const Page = () => {
  const [isRightBarOpen, setIsRightBarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState<EventDetailsProps["eventData"]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>(""); // Store selected event ID
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
        console.log(error);
  

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedInUserEmail = localStorage.getItem("loggedInUserEmail");
      if (!loggedInUserEmail) {
        router.replace("/");
        return;
      }

      const fetchEventData = async () => {
        try {
          const response = await axiosInstance.post("/view-events", {
            email: loggedInUserEmail,
          });
          if (response.data.success) {
            setEventData(response.data.data);
            localStorage.setItem(
              "eventData",
              JSON.stringify(response.data.data)
            );
          } else {
            setError("Failed to fetch event data.");
          }
        } catch (error: any) {
          console.error("Error fetching event:", error);
          setError(error.response?.data?.message);
        } finally {
          setLoading(false);
        }
      };

      fetchEventData();

      window.addEventListener("refreshEvents", fetchEventData);

      return () => {
        window.removeEventListener("refreshEvents", fetchEventData);
      };
    }
  }, [router]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    event: "", // Add validation for event selection
  });

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const allFilled = Object.values(formData).every(
      (value) => value.trim() !== ""
    );
    const noErrors = Object.values(errors).every((error) => error === "");
    const eventSelected = selectedEventId.trim() !== ""; // Ensure an event is selected
    setIsFormValid(allFilled && noErrors && eventSelected);
  }, [formData, errors, selectedEventId]);

  const validateField = (field: string, value: string): string => {
    if (field === "firstName" || field === "lastName") {
      if (!/^[A-Za-z\s]+$/.test(value))
        return `${
          field === "firstName" ? "First" : "Last"
        } name must only contain letters and spaces`;
      if (value.length < 2 || value.length > 50)
        return `${
          field === "firstName" ? "First" : "Last"
        } name must be between 2 and 50 characters`;
    }
    if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return "Invalid email address";
    }
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: validateField(id, value) }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setErrors((prev) => ({ ...prev, [id]: validateField(id, value) }));
  };

  const handleEventChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedEventId(value);
    setErrors((prev) => ({
      ...prev,
      event: value ? "" : "Please select an event",
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      setLoading(true);
      const response = await axiosInstance.post(
        "/add-cohost/",
        {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          eventId: selectedEventId, // Send eventId to the backend
        },
        {
          withCredentials: true,
        }
      );
      console.log("Response:", response.data);
      localStorage.setItem("eventId", selectedEventId);
      setShowModal(true);
    } catch (error: any) {
      console.error("Error:", error);
      if (error.isAxiosError && !error.response) {
        toast.error("Network error. Please check your internet connection.");
      } else if (error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        Object.keys(serverErrors).forEach((key) => {
          setErrors((prev) => ({ ...prev, [key]: serverErrors[key] }));
        });
        toast.error("Please fix the errors in the form.");
      } else {
        toast.error(
          error.response?.data?.message || "An unexpected error occurred."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <ToastContainer />
      <section className="!overflow-hidden relative">
        <div className="py-20 lg:py-24 px-3 sm:px-4 mx-auto max-w-screen-md">
          <div className="mb-4 md:mb-12 md:text-center p-3 sm:p-0 space-y-3">
            <h1
              id="payment_deliveryHeader"
              className="text-2xl sm:text-3xl font-bold text-[#111827]"
            >
              Invite a Co-host
            </h1>
            <p id="addCoHostDes" className="gap-3 text-[#718096]">
              <span className="mr-2">
                A co-host will be able to manage your event and guest invite
              </span>
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-8 bg-white p-8 rounded-3xl shadow-md"
          >
            <div>
              <div className="mb-5">
                <h2
                  id="paymentDetailsHeader"
                  className="text-xl font-semibold text-[#111827] mb-2"
                >
                  Co-host Details
                </h2>
                <p id="coHostDes" className="text-[#718096] mb-4">
                  Enter the name and email address of your co-host
                </p>
              </div>
              <label
                htmlFor="accountNumber"
                className="block mb-2 font-semibold text-[#111827]"
                aria-required="true"
              >
                Co-host Name
              </label>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <input
                    type="text"
                    id="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="px-3 py-2 input-field outline-primary w-full rounded-[5px] bg-slate-50"
                    required
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    id="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="px-3 py-2 input-field outline-primary w-full rounded-[5px] bg-slate-50"
                    required
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col mt-3">
                <label
                  htmlFor="accountName"
                  className="block mb-2 font-semibold text-[#111827]"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="px-3 py-2 input-field outline-primary w-full rounded-[5px] bg-slate-50"
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <div className="flex flex-col mt-3">
                <label
                  id="eventSelection"
                  htmlFor="eventSelection"
                  className="block mb-2 font-semibold text-[#111827]"
                >
                  Event to Co-host
                </label>
                <select
                  id="eventSelection"
                  value={selectedEventId}
                  onChange={handleEventChange}
                  className="px-3 py-2 input-field outline-primary rounded-[8px] bg-slate-50"
                >
                  <option value="" className="text-[#A0AEC0]">Select event</option>
                  {eventData.map((event) => (
                    <option key={event._id} value={event._id}>
                      {event.eventName}
                    </option>
                  ))}
                </select>
                {errors.event && (
                  <p className="text-red-500 text-sm mt-1">{errors.event}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={!isFormValid}
                className={`bg-primary mt-5 text-white py-3 px-8 rounded-[12px] hover:bg-red-800 transition flex items-center justify-center font-extrabold font-manrope ${
                  !isFormValid ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <BiLoaderCircle className="animate-spin mr-2" size={22} />
                ) : (
                  "Add Co-Host"
                )}
              </button>
            </div>
          </form>

          <RightBar isOpen={isRightBarOpen} setIsOpen={setIsRightBarOpen} />
        </div>
      </section>
      {showModal && (
        <ReusuableSuccess
          title="Co-host Invited"
          subtitle="An invite has been sent to David via email to join you as a co-host for your event"
          route="/dashboard/co-host"
          buttonText="Ok, thank you"
        />
      )}
    </Container>
  );
};

export default Page;