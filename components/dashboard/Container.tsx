"use client";

import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next-nprogress-bar";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";


function Container({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  useEffect(() => {
    // Parse URL search parameters for the authToken
    const searchParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = searchParams.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("authToken", tokenFromUrl);

      // Optionally, remove the token from the URL after saving it
      const cleanUrl = window.location.pathname;
      router.replace(cleanUrl);
    }

    // Check for authToken in localStorage
    const authToken = localStorage.getItem("authToken");
    console.log("Auth Token:", authToken); // Debugging line
    
    if (!authToken) {
      // router.replace("/");
      console.log("No auth token found. Redirecting to login.");
      return;
    }

    setIsAuthenticated(true);

    // Consume the profile endpoint to fetch the user details
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.post("/profile-details", {
          token: authToken,
        });
        // Save the user profile in localStorage
        localStorage.setItem("loggedInUser", JSON.stringify(response.data));
        localStorage.setItem("loggedInUserEmail", response.data.email)
        localStorage.setItem("loggedInUserId", response.data.hostId._id || response.data.hostId)
        console.log("loggedInUserId", response.data.hostId._id)
        console.log("User profile fetched successfully:", response.data);
      } catch (error: any) {
        console.error("Error fetching user profile:", error);
        toast.error(
          error.response?.data?.message || "Failed to fetch user profile."
        );
      }
    };

    fetchUserProfile();
  }, [router]);

  if (!isAuthenticated) return null;

  return (
    <main className="absolute top-0 left-0 right-0 md:pl-64 !pt-16 h-screen overflow-y-auto custom-scrollbar bg-gray-100">
      <div className="!p-4 md:!p-6">{children}</div>
    </main>
  );
}

export default Container;














// "use client";

// import { useRouter } from "next-nprogress-bar";
// import { useEffect } from "react";

// function Container({ children }: { children: React.ReactNode }) {
//   const router = useRouter();
 
//   useEffect(() => {
//     const authToken = localStorage.getItem('authToken');
//     if (!authToken) {
//       router.push('/');
//     }
//   }, [router]);

//   return (
//     <main className="absolute top-0 left-0 right-0  md:pl-64 !pt-16 h-screen overflow-y-auto custom-scrollbar bg-gray-100">
//       <div className="!p-4 md:!p-6">{children}</div>
//     </main>
//   );
// }

// export default Container;
