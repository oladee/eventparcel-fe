// components/shared/EmptyStateWithAction.tsx

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Calendar } from "@/components/icons/Icons";

// interface EmptyStateWithActionProps {
//   title: string;
//   description: string;
//   icon: string;
//   actionLabel: string;
//   actionHref: string;
// }

// const EmptyStateWithAction: React.FC<EmptyStateWithActionProps> = ({}) => {
const EmptyStateWithAction: React.FC = ({}) => {
  const [user, setUser] = useState({
    firstName: ""
  });

  // Use a ref to store the current user state
  const userRef = useRef(user);
  const loadUserData = () => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      const parsedUser = JSON.parse(loggedInUser);
      setUser({
        firstName: parsedUser.firstName || ""
      });
      userRef.current = {
        firstName: parsedUser.firstName || ""
      };
    }
  };

  useEffect(() => {
    // Load user data on component mount
    loadUserData();

    // Poll localStorage for changes in the same tab
    const interval = setInterval(() => {
      const loggedInUser = localStorage.getItem("loggedInUser");
      if (loggedInUser) {
        const parsedUser = JSON.parse(loggedInUser);
        if (parsedUser.firstName !== userRef.current.firstName || "") {
          setUser({
            firstName: parsedUser.firstName || ""
          });
          userRef.current = {
            firstName: parsedUser.firstName || ""
          };
        }
      }
    }, 1000); // Check every second

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);
  return (
    <>
      {/* User Name Ui Section */}
      <div className="md:hidden mb-11">
        <h1 className="text-xl font-bold">Hi, {user.firstName}!</h1>
        <p className="text-sm text-gray-500">
          Let&apos;s check your store today
        </p>
      </div>

      {/* No Event Ui section */}
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-[#EEEFF2] p-6 rounded-full">
          <Calendar width={56} height={56} />
        </div>
        {/* <h2 className="mt-6 text-2xl font-bold text-gray-900">{title}</h2> */}
        <h2 className="mt-6 text-2xl font-bold text-gray-900">No Events</h2>
        {/* <p className="mt-2 text-gray-500 max-w-xs">{description}</p> */}
        <p className="mt-2 text-gray-500 max-w-xs">
          You are yet to create an event, click the button below to create event
        </p>
        <Link href="/dashboard/event-creation">
          <div className="mt-6 px-6 py-2 rounded-xl bg-[#7B1E2F] text-white font-semibold hover:bg-[#6A1929] transition">
            Create Event
          </div>
          {/* <a className="mt-6 px-6 py-2 rounded-xl bg-[#7B1E2F] text-white font-semibold hover:bg-[#6A1929] transition">
          {actionLabel}
        </a> */}
        </Link>
      </div>
    </>
  );
};

export default EmptyStateWithAction;
